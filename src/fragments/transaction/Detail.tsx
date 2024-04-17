import Alert from '@/components/Alert'
import { Animation } from '@/components/Animation'
import Empty from '@/components/Empty'
import Image from '@/components/Image'
import { NotificationType } from '@/components/notification'
import { dispatchNotification } from '@/store/notify-store'
import { onSocket, socketAtom } from '@/store/socket'
import { formattedAmount, hideEmail } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/compat'
import ExpireTime from './ExpireTime'
import History from './History'
import Status from './Status'

interface Props {
  data: Transaction
  type: string
}

type Filter = {
  icon: any
  label: any
  class: string
  value: any
}

const types = ['WITHDRAW']
function Detail(props: Props) {
  const { data, type } = props
  const [transaction, setTransaction] = useState<Transaction | null>(data)
  const { socket } = useStore(socketAtom)
  const filteredDetails: Array<Filter> = []

  useEffect(() => {
    onSocket(type, (newTransaction: any) => {
      const { content, message } = newTransaction
      if (content?.id === transaction?.id) {
        setTransaction(content)
        dispatchNotification(
          NotificationType.SUCCESS,
          'Please checking your account balance.',
          undefined,
          true,
          message
        )
      }
    })
  }, [socket])

  if (!transaction)
    return (
      <>
        <Empty des='Transaction not found' />
      </>
    )

  const details = [
    {
      icon: '/assets/icons/tracking-code.svg',
      label: 'Transaction Code',
      class: 'text-green-600 text-xl',
      value: transaction.code
    },
    {
      icon: '/assets/icons/token.svg',
      label: 'Symbol',
      class: 'text-yellow-600 text-xl',
      value: transaction.methodPayment?.toUpperCase()
    },
    {
      icon: '/assets/icons/address.svg',
      label: 'Transaction Type',
      class: 'text-yellow-600 text-xl',
      value: transaction.type?.toUpperCase()
    },
    {
      icon: transaction.token?.img,
      label: transaction.token?.name,
      class: 'text-yellow-800 text-xl',
      value: ['WITHDRAW', 'DEPOSIT'].includes(transaction.type)
        ? formattedAmount(transaction.ethereumAmount ?? 0)
        : formattedAmount(transaction.coinAmount ?? 0)
    },
    {
      icon: '/assets/icons/info.svg',
      label: 'Created By',
      class: 'text-red-800 text-xl',
      value: hideEmail(transaction?.createdBy ?? '')
    }
  ]

  if (['WITHDRAW'].includes(transaction.type))
    details.push({
      icon: '/assets/icons/address.svg',
      label: 'Receiving address',
      value: transaction.userAddress,
      class: 'text-yellow-800 text-sm break-word'
    })
  details?.forEach((detail) => {
    if (detail.value !== undefined && detail.value !== null && detail.value !== '') {
      filteredDetails.push(detail as Filter)
    }
  })

  return (
    <Animation animationName='fadeIn' duration={0.2}>
      <div className='text-neutral-800 flex-wrap text-sm flex justify-center'>
        {/* <Payment content={paymentContent} qrCode={transaction?.qrCode} /> */}

        <div className='px-[calc(3rem*.5)] w-full max-w-full mt-12 min-[992px]:w-2/4 min-[1200px]:w-2/3 min-[1400px]:w-3/4'>
          <div className='flex-wrap flex mt-[calc(-1*3rem)] mx-[calc('>
            {filteredDetails?.map((item, index) => (
              <div
                className={`md:px-[calc(3rem*.5)] w-full max-w-full mt-4 md:mt-12 min-[576px]:w-2/4 min-[1200px]:w-1/3${index > 2 ? '' : ' min-[1200px]:w-1/3'}`}>
                <div className='bg-stone-50 flex h-full rounded-lg gap-4 p-2 md:p-5'>
                  <div className='text-slate-600 w-[10%]'>
                    <Image src={item.icon} ariaLabel={`${item.label}_image`} alt={`${item.label}_image`} />
                  </div>
                  <div className='w-[80%]'>
                    <h5 className='text-slate-600 mb-1.5'>{item.label}</h5>
                    <h4 className={`text-lg font-medium overflow-hidden break-al ${item.class}`}>{item.value}</h4>
                  </div>
                </div>
              </div>
            ))}
            <Status status={transaction.ex} />
            {transaction.expired && <ExpireTime transactionID={transaction.id} seconds={transaction.expired} />}
            <div className='py-5 md:p-5'>
              <Alert
                label={`Note: You should always check that you have received the buyer's payment in your bank account or wallet before unlocking the cryptocurrency. We recommend that you log in to your account to check if the payment has been recorded. Don't rely solely on SMS or email notifications.`}
                status='warning'
              />
            </div>
            <div className='py-5 md:p-5'>
              <Alert
                label='We will transfer coin to your account after receiving the correct amount with the above content. Note that the price of TUSDUSDT fluctuates continuously, we will finalize the amount of TUSDUSDT as soon as we receive your payment.'
                status='info'
              />
            </div>

            {/* <Processing histories={transaction.histories} createdAt={transaction?.createdAt} /> */}
          </div>
        </div>
      </div>
      <History histories={transaction.histories} />
    </Animation>
  )
}

export default Detail

import Alert from '@/components/Alert'
import { Animation } from '@/components/Animation'
import { ButtonLoad } from '@/components/ButtonLoad'
import { CollapseAni } from '@/components/Collapse'
import { FormInputEnum, FormProvider } from '@/components/Form'
import Image from '@/components/Image'
import { SelectBox } from '@/components/SelectBox'
import { NotificationType } from '@/components/notification'
import { auth as authAtom } from '@/store/auth-store'
import { dispatchNotification } from '@/store/notify-store'
import { formattedAmount, getCookie } from '@/utils'
import { useStore } from '@nanostores/preact'
import debounce from 'debounce'
import { useRef, useState } from 'preact/compat'
import { onInput, resetInputs } from '../buy-screen/BuyForm'
import CoinSample from '../buy-screen/CoinSample'
import Card from '../home/chart/Card'
import { sellFormAtom, setData, setDataStepOne } from './store'

const contentTextStepEnd = {
  title: 'SELL FORM'
}

const fetchAPI = async (url: string, body: any, messageError: string) => {
  try {
    const res = (await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    })) as any
    if (res.status == 401) {
      throw Error('Missing data')
    }
    return res.json()
  } catch (error) {
    console.log(error)
    dispatchNotification(NotificationType.ERROR, messageError)
  }
}

const icon = (active?: boolean) => (
  <svg
    class={`w-6 h-6  ${active ? 'text-green-600' : 'text-gray-600'}`}
    aria-hidden='true'
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    viewBox='0 0 24 24'>
    <path
      fill-rule='evenodd'
      d='M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm13.7-1.3a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l4-4Z'
      clip-rule='evenodd'
    />
  </svg>
)

const perseInputs = (
  { amountId, priceId, coins, coinUsdt }: { amountId: string; priceId: string; coins?: any[]; coinUsdt?: any },
  formRef: any,
  wallet: any
): Input[] => {
  const { binance, amount, price } = useStore(sellFormAtom)
  if (!coins) return []
  const [loading, setLoading] = useState(false)
  const item = coins.find((c) => c.binance === binance)

  const coinRevert = coins?.filter((coin) => coin.binance !== 'tusdusdt')

  const handleInputChange = async (value: number, target: string) => {
    const otherInputId = target === 'amount' ? priceId : amountId
    const inputId = target === 'amount' ? amountId : priceId

    const otherInput = document.getElementById(otherInputId) as any

    if (value) {
      setLoading(true)
      const body = {
        [target]: value,
        transactionType: 'SELL',
        binance,
        walletId: wallet?.id
      }

      const data = await fetchAPI(`/api/price-buy`, body, `The ${target} you entered is not valid`)
      const setErrors = formRef.current?.setErrors
      setLoading(false)

      if (!data?.result) {
        setErrors({ [target]: `The ${target} you entered is not valid` })
        otherInput.value = ''
      } else {
        otherInput.value = data.result
        if (!!data?.messageError) return setErrors({ [target]: data.messageError })
        setData({ [target]: value })
        ;(document.getElementById(inputId) as any).value = value
        setErrors({})
      }
    }
  }

  console.log(wallet)

  const inputs: Input[] = [
    {
      name: 'amount',
      type: FormInputEnum.INPUT,
      id: amountId,
      disabled: loading,
      defaultValue: amount?.toString(),
      required: { value: true, message: 'Enter an amount usdt' },
      placeholder: !!wallet?.amount ? `${formattedAmount(10)} - ${formattedAmount(wallet?.amount)}` : '0.00',
      label: 'Spend',
      className: 'form-input coin-amount relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => handleInputChange(+e.target.value, 'amount'), 1000),
      componentEnd() {
        return (
          <div class='question-icon'>
            <SelectBox
              items={coins}
              defaultValue={binance}
              labelComponent={() => (
                <div className='items-center flex-wrap flex min-h-[1.75rem] gap-4 m-0 w-full'>
                  <div className='bg-neutral-100 items-center cursor-pointer py-1 px-2 flex rounded-lg gap-1 m-0'>
                    <Image src={item?.images} ariaLabel='coin' className='w-4 h-4 max-w-full rounded-full m-0' />
                    <div className='text-gray-800 m-0'>{item?.tokenName}</div>
                  </div>
                </div>
              )}
              placeholder='Select Coin'
              renderItems={() => (
                <>
                  <div className='items-center flex-wrap flex min-h-[1.75rem] gap-4 m-0 w-full p-2.5'>
                    {coinRevert.map((c: any, idx) => (
                      <div
                        onClick={() => {
                          const { setErrors } = formRef.current
                          setDataStepOne(coinRevert[idx].binance)
                          setErrors({})
                          resetInputs('input-amount-buy-payment', 'input-price-buy-payment')
                        }}
                        className='bg-neutral-100 items-center cursor-pointer py-1 px-2 flex rounded-lg gap-1 m-0'>
                        <Image src={c?.images} ariaLabel='coin' className='w-4 h-4 max-w-full rounded-full m-0' />
                        <div className='text-gray-800 m-0'>{c?.tokenName}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            />
            {!!wallet?.amount && (
              <div
                className='text-gray-500 text-[12px] m-0 bg-neutral-100 py-1 px-2 flex rounded-lg  hover:bg-neutral-50'
                onClick={() => !!wallet?.amount && handleInputChange(+wallet?.amount, 'amount')}>
                MAX: {formattedAmount(wallet?.amount)}
              </div>
            )}
          </div>
        )
      }
      // validation(value) {
      //   if (+value < item?.min) {
      //     return { message: `${item.name} deposit amount must be greater than ${item.min}` }
      //   }
      // }
    },
    {
      name: 'price',
      type: FormInputEnum.INPUT,
      id: priceId,
      disabled: loading,
      defaultValue: price?.toString(),
      required: { value: true, message: 'Enter an amount coin' },
      placeholder: '0.00',
      label: 'Receive',
      className: 'form-input coin-amount relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => handleInputChange(+e.target.value, 'price'), 1000),
      componentEnd() {
        return (
          <div class='question-icon'>
            <div className='items-center flex-wrap flex min-h-[1.75rem] gap-4 m-0 w-full p-2.5'>
              <div className='bg-neutral-100 items-center cursor-pointer py-1 px-2 flex rounded-lg gap-1 m-0'>
                <Image src={coinUsdt?.images} ariaLabel='coin' className='w-4 h-4 max-w-full rounded-full m-0' />
                <div className='text-gray-800 m-0'>{coinUsdt?.tokenName}</div>
              </div>
            </div>
          </div>
        )
      }
      // validation(value) {
      //   if (+value < coinUsdt?.min) {
      //     return { message: `${coinUsdt.name} deposit amount must be greater than ${coinUsdt.min}` }
      //   }
      // }
    }
  ]

  return inputs
}

const disabledStyle = 'filter: brightness(0.9); pointer-events: none;'

const StepEnd = ({
  addressWalletOwner,
  ownerUsersId,
  coins,
  coinUsdt
}: {
  ownerUsersId?: string
  addressWalletOwner?: string
  coins?: any[]
  coinUsdt?: any
}) => {
  const formRef = useRef(null)

  const { addressWalletUser, amount = 0, networkId, binance } = useStore(sellFormAtom)
  const { auth } = useStore(authAtom)

  const [loading, setLoading] = useState(false)

  const isDisabled = !auth?.id
  const style = isDisabled ? disabledStyle : undefined

  const wallet = auth?.wallets.find((w) => w.binance === binance)
  const paymentMethods = [
    {
      title: 'Crypto at sellfastusdt',
      disabled: false,
      defaultValue: false,
      name: binance,
      inputs: [
        ...perseInputs(
          { amountId: 'input-amount-buy-payment', priceId: 'input-price-buy-payment', coins, coinUsdt },
          formRef,
          wallet
        )
      ]
    }
  ]
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const {
      current: { formValues }
    } = formRef as any
    const values = formValues()

    if (!!values) {
      setLoading(true)

      let body = {
        ...formValues,
        type: 'SELL',
        ownerUsersId,
        userId: auth?.id,
        ethereumAmount: +values.amount,
        addressWalletPain: addressWalletOwner,
        addressWalletReceived: addressWalletUser,
        binance: binance,
        coinAmount: +values.price,
        networkId: networkId
      }

      if (!getCookie('token')) return location.replace('/login')
      const data = await fetchAPI(
        `/api/transaction?type=sell`,
        body,
        'There was a problem with the transaction, please try again'
      )
      if (data?.transaction?.id) {
        location.replace('/transaction/sell?transactionID=' + data?.transaction?.id)
      }
      setLoading(false)
    }
  }

  return (
    <li className='relative inline-block w-full'>
      <div
        className='bg-stone-50 left-0 absolute top-0 w-12 h-12 rounded-full p-1.5 flex items-center justify-center'
        id='div-7'>
        {icon(!isDisabled)}
      </div>
      <div className='bg-stone-50 ml-0 lg:ml-16 rounded-lg md:p-8 p-3' id='div-8' style={style}>
        <div className='items-center justify-between flex mb-[calc(7.4px_+_0.5vw)] text-xl font-semibold'>
          <h4>{contentTextStepEnd.title}</h4>
        </div>

        <div className='text-slate-600'>
          <form className='items-center flex-wrap flex gap-[1.88rem]'>
            {paymentMethods.map((p, idx) => {
              return (
                <div
                  className='flex w-full '
                  style={p.disabled ? disabledStyle : ''}
                  onClick={() =>
                    setData({
                      payment: p.name
                    })
                  }>
                  <CollapseAni
                    btnText={p.title}
                    defaultOpen={!p.disabled}
                    key={idx}
                    RenderHeader={
                      <div className='flex items-center gap-4'>
                        {p.title}{' '}
                        {p.disabled && <Alert label='The balance in your account is insufficient' status='danger' />}
                      </div>
                    }
                    className={{ root: 'bg-white w-full rounded-md overflow-hidden' }}>
                    {!!p.inputs && (
                      <FormProvider
                        inputs={p.inputs as any}
                        ref={formRef}
                        className='space-y-4 md:space-y-6 flex flex-wrap p-5 gap-2'
                      />
                    )}
                  </CollapseAni>
                </div>
              )
            })}
            <ButtonLoad
              className='mt-5 w-full text-white bg-[#32ae31] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              onClick={handleSubmit}
              type='submit'
              loading={loading}
              isDisable={isDisabled}
              label={`SELL ${amount} ${binance?.toUpperCase()}`}
            />
            {!auth?.id && <Alert label='You must log in to be able to use our services' status='danger' />}
          </form>
        </div>
      </div>
    </li>
  )
}

interface StepProps {
  balance?: BalancerWallet | null
  networks?: Network[] | null
}

function SellForm(props: StepProps) {
  const { balance } = props
  const { auth } = useStore(authAtom)
  const coins =
    auth?.wallets.map((c: any) => ({
      value: c.Token.tokenName,
      name: c.Token.tokenName,
      slug: c.Token.binance,
      binance: c.Token.binance,
      images: c.Token.images,
      amount: c.amount,
      fee: c.Token.fee,
      id: c.Token.id
    })) ?? []

  return (
    <>
      <div className='md:px-[calc(3rem*.5)] px-2 w-full max-w-full md:mt-12 mt-2 min-[992px] md:w-[55%]'>
        <Animation animationName='fadeIn' duration={0.3}>
          <ul className='flex-wrap flex list-disc gap-[2.88rem]'>
            <StepEnd
              ownerUsersId={balance?.ownerUsersId}
              addressWalletOwner={balance?.addressWallet}
              coins={balance?.coins}
              coinUsdt={balance?.coinUsdt}
            />
          </ul>
        </Animation>
      </div>
      <div class='w-full md:w-[40%] px-2'>
        <Card className='md:w-full' coins={coins.filter((c) => !!c.amount)} />
        <CoinSample className='w-full' />
      </div>
    </>
  )
}

export default SellForm

import { onInput } from '@/fragments/buy-screen/BuyForm'
import CoinSample from '@/fragments/buy-screen/CoinSample'
import { buyFormAtom } from '@/fragments/buy-screen/store'
import { auth as authAtom, logout } from '@/store/auth-store'
import { dispatchNotification } from '@/store/notify-store'
import { useStore } from '@nanostores/preact'
import debounce from 'debounce'
import { forwardRef, useEffect, useRef, useState } from 'preact/compat'
import { ButtonLoad } from '../ButtonLoad'
import { CollapseAni } from '../Collapse'
import { FormInputEnum, FormProvider } from '../Form'
import { SelectBox } from '../SelectBox'
import { Image } from '../image/Image'
import { NotificationType } from '../notification'

const iconEnd = (
  <span class='question-icon'>
    <svg
      class='w-6 h-6 text-gray-800 '
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'>
      <path
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='2'
        d='M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7H7.3'
      />
    </svg>
  </span>
)

const fetchAddress = async (networkId: string) => {
  try {
    const res = (await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ networkId })
    })) as any

    if (res.status === 401) {
      logout()
      throw Error('Missing data')
    }

    return await res.json()
  } catch (error) {
    console.error(error)
    dispatchNotification(NotificationType.ERROR, 'An error occurred, please try again')
  }
}

export const fetchNetworks = async (tokenId: string) => {
  try {
    const res = (await fetch('/api/network?tokenId=' + tokenId)) as any

    if (res.status === 401) {
      logout()
      throw Error('Missing data')
    }

    return await res.json()
  } catch (error) {
    console.error(error)
    dispatchNotification(NotificationType.ERROR, 'An error occurred, please try again')
  }
}

const perseInputs = ({ amountId }: { amountId: string }, coin: any, setAmount: any): Input[] => {
  const { amount } = useStore(buyFormAtom)
  const handleInputChange = async (e: any) => {
    const value = +e.target.value?.replace(/,/g, '')
    if (+value < coin?.min) {
      setAmount(0)
    } else {
      setAmount(value)
    }
  }

  const inputs: Input[] = [
    {
      name: 'amount',
      type: FormInputEnum.INPUT,
      id: amountId,
      defaultValue: amount,
      required: { value: true, message: 'Enter an amount' },
      placeholder: `${coin.min} - ${coin.max}`,
      label: '',
      className: 'form-input relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => handleInputChange(e), 300),
      validation(value) {
        if (value < coin.min) return { message: `${coin.name} deposit amount must be greater than ${coin.min}` }
      },
      componentEnd() {
        return iconEnd
      }
    }
  ]

  return inputs
}

function Steps() {
  const formRef = useRef(null)
  const { auth } = useStore(authAtom)
  const coins =
    auth?.wallets.map((c: any) => ({
      value: c.Token.tokenName,
      name: c.Token.tokenName,
      slug: c.Token.binance,
      binance: c.Token.binance,
      images: c.Token.images,
      min: c.Token.min,
      max: c.Token.max,
      id: c.Token.id
    })) ?? []

  const queryParams = new URLSearchParams(location.search)
  const binance = queryParams.get('binance') ?? ''
  const defaultCoin = coins.find((c: any) => c.binance === binance) ?? {}
  const [coin, setCoin] = useState<any>(defaultCoin)
  const [network, setNetwork] = useState<any>({})
  const [networks, setNetworks] = useState<any>([])
  const [amount, setAmount] = useState<any>()
  const [ownerAddress, setOwnerAddress] = useState()
  const [loading, setLoading] = useState(false)

  const submitAddress = async () => {
    if (!!network?.id) {
      setLoading(true)
      const data = await fetchAddress(network?.id)
      setOwnerAddress(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    const submitNetwork = async () => {
      if (coin) {
        const networks = await fetchNetworks(coin.id)
        setNetworks(networks)
      }
    }
    submitNetwork()
  }, [coin])

  const steps = [
    {
      title: 'Select Coin',
      content: (
        <>
          <SelectBox
            items={coins}
            defaultValue={coin?.value ?? ''}
            placeholder='Select Coin'
            onChange={(val: any) => setCoin(val)}
            className='lg:px-[20px] py-[8px] lg:mb-[8px]'
          />
          <div className='items-center flex-wrap flex min-h-[1.75rem] gap-4 m-0 mt-2'>
            {coins.map((c: any) => (
              <div
                onClick={() => setCoin(c)}
                className='bg-neutral-100 items-center cursor-pointer py-1 px-2 flex rounded-lg gap-1 m-0'>
                <Image src={c.images} ariaLabel='coin' className='w-4 h-4 max-w-full rounded-full m-0' />
                <div className='text-gray-800 m-0'>{c.name}</div>
              </div>
            ))}
          </div>
        </>
      ),
      open: true
    },
    {
      title: 'DEPOSIT',
      disabled: !coin.binance,
      content: (
        <FormProvider
          inputs={perseInputs({ amountId: 'input-amount-buy' }, coin, setAmount)}
          ref={formRef}
          className='mb-2 flex flex-wrap deposit'
        />
      )
    },
    {
      title: 'SELECT NETWORK',
      disabled: !amount,
      content: (
        <SelectBox
          items={networks}
          defaultValue={network.value}
          onChange={(val: any) => setNetwork(val)}
          className='lg:px-[20px] py-[8px] lg:mb-[8px]'
        />
      )
    },
    {
      title: 'DEPOSIT ADDRESS',
      disabled: !network.id || !amount,
      content: !ownerAddress ? (
        <AddressDepositNotFound submitAddress={submitAddress} loading={loading} />
      ) : (
        <AddressDeposit ref={formRef} isSubmit={true} ownerAddress={ownerAddress} coin={coin} network={network} />
      )
    }
  ]

  return (
    <div
      style={{ gridColumn: 'a', gridRow: 'a' }}
      className='w-full min-h-[18.75rem] flex-col lg:flex-row m-0 flex justify-between'
      id='div-4'>
      <div
        style={{ gridColumn: 'a', gridRow: 'a' }}
        className='relative w-[100%] lg:w-[45%] min-h-[18.75rem] m-0'
        id='div-5'>
        <div className='flex-col relative flex m-0'>
          {steps.map((step, index) => (
            <div className='flex-grow pb-10 relative flex min-h-[4.00rem] gap-6 m-0' key={index}>
              <div
                className={`z-2 text-zinc-950 items-center font-medium justify-center flex w-6 h-6 rounded-full m-0 ${step.disabled ? 'bg-gray-400' : 'bg-yellow-300'}`}>
                {index + 1}
              </div>
              <div className='text-slate-500 flex-col flex-grow font-medium flex w-auto gap-4 m-0'>
                <CollapseAni
                  btnText={step.title}
                  className={{ header: `pt-0 pb-5 px-0 ${step.disabled ? 'pointer-events-none select-none' : ''}` }}
                  isOpen={step.disabled}>
                  <div className='text-slate-500 text-sm m-0'>{step.content}</div>
                </CollapseAni>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CoinSample className='w-[100%] lg:w-[45%]' />
    </div>
  )
}

export const AddressDepositNotFound = ({ submitAddress, loading }: any) => {
  return (
    <div className='w-full rounded-xl border-2 border-solid border-gray-200 text-sm text-slate-500 p-5'>
      <div className='m-0 font-medium text-gray-800'>Your deposit address does not exist</div>
      <div className='mx-0 mb-6 mt-2'>
        You need a deposit address to send money to. This address will be used to receive money from the sender. You too
        This address needs to be provided to the depositor. You also need to provide this address to the sender.
      </div>
      <ButtonLoad
        label='Get wallet address'
        loading={loading}
        onClick={submitAddress}
        className='m-0 inline-flex h-9 min-h-[2.25rem] min-w-[8.13rem] cursor-pointer items-center justify-center overflow-hidden text-ellipsis break-all rounded-lg bg-yellow-300 px-4 text-center font-medium text-zinc-950'></ButtonLoad>
    </div>
  )
}

export const AddressDeposit = forwardRef(({ ownerAddress, network, coin, isSubmit }: any, ref: any) => {
  const [loading, setLoading] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ownerAddress?.address?.addressWallet)
      dispatchNotification(NotificationType.SUCCESS, 'Wallet address copied')
    } catch (err) {
      dispatchNotification(NotificationType.ERROR, 'An error has occurred')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const {
      current: { formValues }
    } = ref as any
    const values = formValues()
    if (values && network) {
      const { amount } = values

      const body = {
        type: 'DEPOSIT',
        amount: +amount?.replace(/,/g, ''),
        symbolId: coin.id,
        userId: authAtom.get().auth?.id,
        status: 'NEW',
        netWorkId: network.id,
        addressOwnerId: ownerAddress?.address.id,
        ownerId: ownerAddress?.address.userId
      }

      try {
        const res = (await fetch('/api/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })) as any

        if (res.status === 401) {
          logout()
          throw Error('Missing data')
        }

        const data = await res.json()

        if (data.balance.id) {
          return location.replace('/crypto/' + data.balance.id)
        }
      } catch (error) {
        console.error(error)
        dispatchNotification(NotificationType.ERROR, 'An error occurred, please try again')
      } finally {
        setLoading(false)
      }
    } else {
      dispatchNotification(NotificationType.ERROR, 'An error occurred, please try again')
    }
  }

  return (
    <div className='text-slate-500 text-sm p-5'>
      <div className='border-2 border-gray-200 border-solid rounded-xl'>
        <div className='text-gray-800 bg-neutral-100 text-xs flex rounded-lg p-3'>
          <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='rgb(0, 0, 0)' className='w-4 h-4'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z'
              fill='rgb(32, 38, 48)'
            />
          </svg>
          Please transfer to the address below, thank you
        </div>
        <div className='inline-flex py-3'>
          <div className='items-center flex'>
            <div className='items-center px-3 flex'>
              <div className='items-center flex'>
                <div className='rounded'>
                  <div className='rounded'>
                    <img src={ownerAddress?.qrSrc} class='' />
                  </div>
                </div>
              </div>
              <div className='text-gray-800 items-center flex-grow flex gap-4'>
                <div className='flex-grow'>
                  <div className='text-slate-500'>Địa chỉ</div>
                  <div className='font-medium break-all'>{ownerAddress?.address?.addressWallet}</div>
                </div>
                <svg
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='rgb(0, 0, 0)'
                  className='text-gray-400 cursor-pointer w-5 h-5'
                  onClick={copyToClipboard}>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z'
                    fill='rgb(146, 154, 165)'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='text-gray-800 flex-col flex gap-3'>
        <div className='items-center justify-between flex'>
          <div className='text-slate-500 items-center pr-1 flex'>
            Minimum unlock
            <div className='flex text-gray-400'>
              <div className='items-center flex'>
                <svg
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='rgb(0, 0, 0)'
                  className='cursor-pointer w-4 h-4'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z'
                    fill='rgb(146, 154, 165)'
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className='font-medium pl-1 text-end'>After 1 network confirmation</div>
        </div>
        {isSubmit && (
          <ButtonLoad
            label='Submit'
            loading={loading}
            isDisable={loading}
            onClick={handleSubmit}
            className='text-zinc-950 bg-yellow-300 items-center cursor-pointer text-sm font-medium justify-center px-4 text-center text-ellipsis break-all inline-flex w-32 h-9 min-w-[7.50rem] min-h-[2.25rem] mt-6 mx-0 mb-0 overflow-hidden rounded-lg'></ButtonLoad>
        )}

        <div className='text-slate-500'>
          After transferring money, you need to press the Complete button above and we will send a transaction
          confirmation email.
        </div>
      </div>
    </div>
  )
})

export default Steps

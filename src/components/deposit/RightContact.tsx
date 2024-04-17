import { onInput } from '@/fragments/buy-screen/BuyForm'
import CoinSample from '@/fragments/buy-screen/CoinSample'
import { buyFormAtom } from '@/fragments/buy-screen/store'
import Card from '@/fragments/home/chart/Card'
import { auth as authAtom, logout } from '@/store/auth-store'
import { dispatchNotification } from '@/store/notify-store'
import { useStore } from '@nanostores/preact'
import debounce from 'debounce'
import { useEffect, useRef, useState } from 'preact/compat'
import Alert from '../Alert'
import { ButtonLoad } from '../ButtonLoad'
import { CollapseAni } from '../Collapse'
import { FormInputEnum, FormProvider } from '../Form'
import { SelectBox } from '../SelectBox'
import { Image } from '../image/Image'
import { NotificationType } from '../notification'
import { fetchNetworks } from './Steps'

const perseInputs = ({ amountId, coin }: { amountId: string; coin: any }, setAmount: any): Input[] => {
  const { amount } = useStore(buyFormAtom)
  if (!coin) return []
  const inputs: Input[] = [
    {
      name: 'amount',
      type: FormInputEnum.INPUT,
      id: amountId,
      defaultValue: amount,
      required: { value: true, message: `Enter an amount ${coin.name}` },
      placeholder: coin.amount > 0 ? `${coin.min} - ${coin.amount}` : '0',
      label: '',
      className: 'form-input relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => {
        const value = +e.target.value?.replace(/,/g, '')
        if (+value > coin?.amount || +value <= 0) {
          setAmount(0)
        } else {
          setAmount(value)
        }
      }, 300),
      validation(val) {
        const value = +val?.replace(/,/g, '')
        if (value > coin?.amount) {
          return { message: `Your coin ${coin.name} asset is insufficient` }
        }
        if (value < coin?.min) {
          return { message: `Your coin amount ${coin.name} must be greater than ${coin.min}` }
        }
      },
      componentEnd() {
        return (
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
      }
    }
  ]

  return inputs
}

const disabledStyle = 'filter: brightness(0.9); pointer-events: none;'

function Steps({ balance }: any) {
  const formRef = useRef<any>(null)
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
      id: c.Token.id,
      min: c.Token.min,
      max: c.Token.max
    })) ?? []

  const queryParams = new URLSearchParams(location.search)
  const binance = queryParams.get('binance')
  const defaultCoin = coins.find((c: any) => c.binance === binance) ?? {}
  const [coin, setCoin] = useState<any>(defaultCoin)
  const [network, setNetwork] = useState<any>({})
  const [networks, setNetworks] = useState<Network[] | []>([])
  const [amount, setAmount] = useState<any>()
  const [userAddress, setUserAddress] = useState()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const {
      current: { formValues }
    } = formRef as any
    const values = formValues()

    if (!!values && network) {
      setLoading(true)
      const body = {
        type: 'WITHDRAW',
        amount: amount,
        symbolId: coin.id,
        userId: authAtom.get().auth?.id,
        status: 'NEW',
        netWorkId: network.id,
        ownerId: balance?.ownerUsersId,
        userAddress
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
        if (data.balance?.id) {
          return location.replace('/crypto/' + data.balance?.id)
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

  const addressInput = [
    {
      name: 'address',
      type: FormInputEnum.INPUT,
      id: 'address-input',
      defaultValue: useStore(buyFormAtom).amount,
      required: { value: true, message: 'Enter an address wallet' },
      pattern: { value: network?.value, message: 'Address wallet is invalid' },
      placeholder: 'Enter address wallet',
      label: 'Address wallet',
      className: 'form-input relative',
      width: '100%',
      onChange: debounce((e) => setUserAddress(e.target.value), 300),
      componentEnd() {
        return (
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
      }
    }
  ]

  const submitNetworks = async () => {
    const networks = await fetchNetworks(coin?.id)
    setNetworks(networks)
    setCoin(coin)
    ;(document.getElementById('input-amount-buy') as any).value = ''
    setAmount(undefined)
  }

  useEffect(() => {
    if (!!coin?.id) {
      submitNetworks()
    }
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
            onChange={(val) => setCoin(val)}
            className='lg:px-[20px] py-[8px] lg:mb-[8px]'
          />
          <div className='items-center flex-wrap flex min-h-[1.75rem] gap-2 md:gap-4 m-0'>
            {coins.map((c: any) => (
              <div
                onClick={() => {
                  setCoin(c)
                }}
                className='bg-neutral-100 items-center cursor-pointer py-1 mt-2 px-2 flex rounded-lg gap-1 m-0'>
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
      title: 'WITHDRAW',
      disabled: !coin.binance,
      content: (
        <FormProvider
          inputs={perseInputs({ amountId: 'input-amount-buy', coin }, setAmount)}
          ref={formRef}
          className='mb-2 flex flex-wrap deposit'
        />
      )
    },
    {
      title: 'SELECT NETWORK',
      disabled: !amount,
      content: (
        <>
          <SelectBox
            items={networks}
            defaultValue={network?.value ?? ''}
            onChange={(val: any) => {
              const { setErrors } = formRef.current
              setNetwork(val)
              setErrors({})
            }}
            className='lg:px-[20px] py-[8px] lg:mb-[8px]'
          />
          <FormProvider inputs={addressInput as any} ref={formRef} className='mb-2 flex flex-wrap gap-2 deposit'>
            <ButtonLoad
              label='Submit'
              loading={loading}
              onClick={handleSubmit}
              className='m-0 inline-flex h-9 min-h-[2.25rem] min-w-[8.13rem] cursor-pointer items-center justify-center overflow-hidden text-ellipsis break-all rounded-lg bg-yellow-300 px-4 text-center font-medium text-zinc-950'
            />
          </FormProvider>
        </>
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
                className={`z-2 text-zinc-950 items-center font-medium justify-center flex w-6 h-6 rounded-full m-0 ${step.disabled ? 'bg-gray-400' : 'bg-yellow-300 '}`}>
                {index + 1}
              </div>
              <div
                className='text-slate-500 flex-col flex-grow font-medium flex w-auto gap-4 m-0'
                style={step.disabled ? disabledStyle : ''}>
                <CollapseAni
                  btnText={step.title}
                  className={{ header: `pt-0 pb-5 px-0 ${step.disabled ? 'pointer-events-none select-none' : ''}` }}
                  isOpen={step.disabled}>
                  <div className='text-slate-500 text-sm m-0'>{step.content}</div>
                </CollapseAni>
              </div>
            </div>
          ))}
          <div class='text-sm text-gray-400 flex justify-end'>
            {coin.fee && (
              <Alert
                label={`Transfer network fees ${coin.fee} ${coin.binance.toUpperCase().replace('USDT', '')}`}
                status='warning'
              />
            )}
          </div>
        </div>
      </div>
      <div className='w-[100%] lg:w-[45%] flex flex-col'>
        <Card coins={coins.filter((c) => !!c.amount)} className='md:w-full' />
        <CoinSample className='w-full' />
      </div>
    </div>
  )
}

export default Steps

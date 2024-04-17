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
import { buyFormAtom, handleSubmit, setData, setDataStepOne } from './store'

const contentTextStepEnd = {
  title: 'BUY FORM'
}

export const onInput = (e: any) => {
  let { value } = e.target

  let cleanValue = value.replace(/[^\d.]/g, '')

  if (!cleanValue) {
    e.target.value = ''
    return
  }

  let [beforeDecimal, afterDecimal] = cleanValue.split('.')

  beforeDecimal = beforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  let formattedValue = afterDecimal !== undefined ? beforeDecimal + '.' + afterDecimal : beforeDecimal

  e.target.value = formattedValue
}

export const fetchAPI = async (url: string, body: any, messageError: string) => {
  try {
    const res = (await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    })) as any

    if (res.status === 401) {
      throw Error('Missing data')
    }

    return res ? res.json() : null
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
  { amountId, priceId, coins, coinUsdt }: { amountId: string; priceId: string; coins?: any[]; coinUsdt: any },
  formRef: any,
  wallet: any
): Input[] => {
  const [loading, setLoading] = useState(false)
  const { binance, amount, price } = useStore(buyFormAtom)
  if (!coins) return []

  const items = coins?.map((c: any) => ({
    value: c.binance,
    name: c.tokenName,
    slug: c.binance,
    binance: c.binance,
    id: c.id,
    min: c.min
  }))

  const item = coins.find((c) => c.binance === binance)

  const handleInputChange = async (num: string, target: string) => {
    const otherInputId = target === 'amount' ? priceId : amountId
    const otherInput = document.getElementById(otherInputId) as any
    const value = +num.toString().replace(/,/g, '')
    if (!!value) {
      setLoading(true)
      const body = { [target]: value, transactionType: 'BUY', binance, walletId: wallet?.id }

      const data = await fetchAPI(`/api/price-buy`, body, `The ${target} you entered is not valid`)
      const { setErrors } = formRef.current
      setLoading(false)
      if (!data?.result) {
        setErrors({ [target]: `The ${target} you entered is not valid` })
        otherInput.value = ''
      } else {
        otherInput.value = formattedAmount(data.result, 10)
        if (!!data?.messageError) return setErrors({ [target]: data.messageError })
        setData({ [target]: value })
        ;(document.getElementById(target === 'amount' ? amountId : priceId) as any).value = formattedAmount(value, 10)
        setErrors({})
      }
    }
  }

  const inputs: Input[] = [
    {
      name: 'amount',
      type: FormInputEnum.INPUT,
      id: amountId,
      disabled: loading,
      defaultValue: amount,
      required: { value: true, message: 'Enter an amount usdt' },
      placeholder: !!wallet?.amount ? `${formattedAmount(coinUsdt.min)} - ${formattedAmount(wallet.amount)}` : '0.00',
      label: 'Spend',
      className: 'form-input coin-amount relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => handleInputChange(e.target.value, 'amount'), 1000),
      componentEnd() {
        return (
          <div class='question-icon' onClick={() => !!wallet?.amount && handleInputChange(wallet.amount, 'amount')}>
            <div className='items-center flex-wrap flex min-h-[1.75rem] gap-4 m-0 w-full'>
              <div className='bg-neutral-100 py-1 px-2 rounded-lg gap-1 m-0'>
                <div className='items-center flex rounded-lg gap-1 m-0'>
                  <Image src={coinUsdt?.images} ariaLabel='coin' className='w-4 h-4 max-w-full rounded-full m-0' />
                  <div className='text-gray-800 m-0'>{coinUsdt?.tokenName}</div>
                </div>
                {!!wallet?.amount && (
                  <div className='text-gray-500 text-[12px] m-0'>MAX: {formattedAmount(wallet.amount)}</div>
                )}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      name: 'price',
      type: FormInputEnum.INPUT,
      id: priceId,
      disabled: loading,
      defaultValue: price,
      required: { value: true, message: 'Enter an amount coin' },
      placeholder: `${formattedAmount(item.min)}`,
      label: 'Receive',
      className: 'form-input coin-amount relative',
      width: '100%',
      onInput,
      onChange: debounce((e) => handleInputChange(e.target.value, 'price'), 1000),
      componentEnd() {
        return (
          <div class='question-icon'>
            <SelectBox
              items={items}
              defaultValue={binance}
              className='p-5'
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
                    {coins.map((c: any, idx) => (
                      <div
                        onClick={() => {
                          const { setErrors } = formRef.current
                          setErrors({})
                          setDataStepOne(coins[idx].binance)
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
          </div>
        )
      }
    }
  ]

  return inputs
}

const disabledStyle = 'filter: brightness(0.9); pointer-events: none;'
export const resetInputs = (priceId: string, amountId: string) => {
  ;(document.getElementById(priceId) as any).value = ''
  ;(document.getElementById(amountId) as any).value = ''
}

const StepEnd = ({ ownerUsersId, coins, coinUsdt }: { ownerUsersId?: string; coinUsdt?: any; coins?: any[] }) => {
  const formRef = useRef(null)

  const { amount = 0, binance, loading } = useStore(buyFormAtom)
  const logged = !getCookie('token')
  const { auth } = useStore(authAtom)
  const isDisabled = !auth?.id || !binance
  const style = isDisabled ? disabledStyle : undefined

  const wallet = auth?.wallets.find((w) => w.binance === 'tusdusdt')
  const coinBuy = coins?.find((w) => w.binance === binance)

  const paymentMethods = [
    {
      title: `Buy ${coinBuy.tokenName}`,
      disabled: wallet?.amount <= 0,
      defaultValue: false,
      name: binance,
      genNetwork: true,
      inputs: [
        ...perseInputs(
          { amountId: 'input-amount-buy-payment', priceId: 'input-price-buy-payment', coins, coinUsdt },
          formRef,
          wallet
        )
      ]
    }
  ]

  const submit = async (event: any) => {
    event.preventDefault()
    if (!formRef.current) return
    const {
      current: { formValues }
    } = formRef as any
    const values = formValues()
    if (!!values) {
      const body = {
        type: 'BUY',
        ownerUsersId,
        userId: auth?.id,
        ethereumAmount: +values?.amount.replace(/,/g, ''),
        coinAmount: +values?.price.replace(/,/g, ''),
        binance
      }

      handleSubmit(body)
    }
  }

  return (
    <li className='relative inline-block w-full'>
      <div
        className='bg-stone-50 left-0 absolute hidden top-0 w-12 h-12 rounded-full p-1.5 lg:flex items-center justify-center'
        id='div-7'>
        {icon(!isDisabled)}
      </div>
      <div className='bg-stone-50 ml-0 lg:ml-16 rounded-lg md:p-8 p-2' id='div-8' style={style}>
        <div className='items-center justify-between flex mb-[calc(7.4px_+_0.5vw)] text-xl font-semibold'>
          <h4>{contentTextStepEnd.title}</h4>
        </div>
        <div className='text-slate-600'>
          <form className='items-center flex-wrap flex gap-[1.88rem]'>
            {paymentMethods.map((p, idx) => {
              return (
                <div className='flex w-full '>
                  <CollapseAni
                    btnText={p.title}
                    defaultOpen={!p.disabled}
                    key={idx}
                    onClick={() => setData({ payment: p.name })}
                    headerIcon={!!p.inputs}
                    RenderHeader={
                      <div className='flex items-center gap-4 md:flex-row flex-col'>
                        {p.title}{' '}
                        {p.disabled && (
                          <Alert
                            label={`The balance ${wallet.Token.tokenName} in your account is insufficient`}
                            status='danger'
                            endComponent={
                              <a href='/crypto/deposit?binance=tusdusdt'>
                                <button
                                  type='button'
                                  class='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
                                  Deposit
                                </button>
                              </a>
                            }
                          />
                        )}
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
              className='w-full text-white bg-[#32ae31] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              onClick={submit}
              type='submit'
              loading={loading}
              isDisable={isDisabled}
              label={`BUY ${amount} ${binance.toUpperCase()}`}
            />
            {logged && <Alert label='You must log in to be able to use our services' status='danger' />}
          </form>
        </div>
      </div>
    </li>
  )
}

interface StepProps {
  balance?: BalancerWallet | null
}

function BuyForm(props: StepProps) {
  const { balance } = props

  return (
    <div className='md:px-[calc(3rem*.5)] px-2 w-full max-w-full md:mt-12 mt-2 min-[992px] md:w-[55%]'>
      <div>
        <Animation animationName='fadeIn' duration={0.3}>
          <ul className='flex-wrap flex list-disc gap-[2.88rem]'>
            <StepEnd ownerUsersId={balance?.ownerUsersId} coins={balance?.coins} coinUsdt={balance?.coinUsdt} />
          </ul>
        </Animation>
      </div>
    </div>
  )
}

export default BuyForm

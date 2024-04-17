import { emitSocket, offSocket, onSocket } from '@/store/socket'
import { formattedAmount } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/compat'
import { coinAtom } from '../store'

const symbolIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgb(112, 122, 138)' className='inline w-3.5 h-3.5'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.173 3.007L12.768 3l2.41 5.11 5.326.831.496 1.495-3.89 4.013.895 5.636-1.298.915-4.735-2.648L7.236 21l-1.296-.923.946-5.632L3 10.436l.496-1.495 5.322-.83 2.355-5.104z'
      fill='rgb(112, 122, 138)'
    />
  </svg>
)

const usdtIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgb(112, 122, 138)' className='w-2.5 h-2.5'>
    <path
      opacity='0.5'
      d='M16 12.85v1.65L12.75 18 9.5 14.5v-1.65H16z'
      fill='rgb(132, 142, 156)'
      className='opacity-50'
    />
    <path d='M9.5 9.745v-1.65l3.25-3.5 3.25 3.5v1.65H9.5z' fill='url("#sorting-up-color-s24_svg__paint0_linear")' />
    <defs fill='rgb(112, 122, 138)'>
      <linearGradient x1={16} y1='4.594' x2='9.5' y2='4.594' gradientUnits='userSpaceOnUse' fill='rgb(112, 122, 138)'>
        <stop stopColor='#EFB80B' fill='rgb(112, 122, 138)' />
        <stop offset={1} stopColor='#FBDA3C' fill='rgb(112, 122, 138)' />
      </linearGradient>
    </defs>
  </svg>
)

const amountIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgb(112, 122, 138)' className='w-2.5 h-2.5'>
    <path
      d='M9 10.368v-1.4L11.968 6l2.968 2.968v1.4H9zM14.936 13v1.4l-2.968 2.968L9 14.4V13h5.936z'
      fill='rgb(193, 198, 205)'
    />
  </svg>
)

const contentText = {
  price: 'PRICE (USDT)',
  amount: 'AMOUNT (USDT)'
}

function TradeLeft() {
  const { symbol } = useStore(coinAtom)

  return (
    <div className='flex-col pb-1.5 flex bg-zinc-50 w-full md:w-[25%]'>
      <div className='px-4'>
        <div>
          <div className='relative flex'>
            <div className='flex-wrap font-medium'>
              <div className='text-slate-500 items-center cursor-pointer justify-center px-1 inline-block rounded-sm'>
                <div>{symbolIcon}</div>
              </div>
              <div className='text-slate-500 items-center cursor-pointer text-xs justify-center px-1 inline-block rounded-sm'>
                {symbol}
              </div>
            </div>
          </div>
          <div className='text-slate-500 flex'>
            <div style={{ flexGrow: 5 }} className='justify-start flex'>
              <div className='cursor-pointer flex'>
                <div className='text-xs text-ellipsis'>{contentText.price}</div>
                {usdtIcon}
              </div>
            </div>
            <div style={{ flexGrow: 3 }} className='justify-end flex'>
              <div className='cursor-pointer flex'>
                <div className='text-xs text-ellipsis'>{formattedAmount(+contentText.amount)}</div>
                {amountIcon}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TradData symbol={symbol} />
    </div>
  )
}

const TradData = (props: { symbol: string }) => {
  const { symbol } = props
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const handleEmitSocket = () => {
      emitSocket('orderBookData', {
        symbol
      })
    }
    handleEmitSocket()
    const intervalId = setInterval(handleEmitSocket, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [symbol])

  useEffect(() => {
    const eventKey = `card_order_book_${symbol.toLowerCase()}`
    const handleEvent = (val: Record<string, number | string>) => {
      if (symbol === val.symbol) {
        setData(val)
      }
    }
    onSocket(eventKey, handleEvent, () => setData(null))
    return () => {
      offSocket(eventKey)
    }
  }, [symbol])

  return (
    <div className='flex-col flex-grow relative flex text-xs text-slate-500'>
      <div className='items-center bottom-[-10.63rem] flex'>
        <div className='flex-col flex-grow flex overflow-y-auto md:h-full h-[200px]' style='max-height: 350px;'>
          {data.asks?.map((item: any, index: number) => {
            return (
              <div className='px-1 py-[1px] flex' key={index}>
                <div
                  style={{ flexGrow: 1 }}
                  className='text-neutral-800 items-center cursor-pointer justify-start flex'>
                  <div className='text-slate-500 items-center pr-1 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='rgb(112, 122, 138)'
                      className='w-3 h-3'>
                      <path
                        d='M21.4 10.8c-.3-1.1-.3-1.1-.7-2.1l-6-.1L12.8 3h-2.2l-2 5.6-5.9.1c-.3 1.1-.3 1.1-.7 2.1l4.8 3.6L5 20.1l1.8 1.3 4.9-3.4 4.9 3.4c.9-.7.9-.6 1.8-1.3l-1.8-5.7 4.8-3.6z'
                        fill='rgb(112, 122, 138)'
                      />
                    </svg>
                  </div>
                  <div className='text-slate-500 items-center flex-grow flex'>
                    <span className='text-yellow-600 bg-orange-100 px-1 rounded-sm'>{item[0]}</span>
                  </div>
                </div>

                <div style={{ flexGrow: 3 }} className='items-center cursor-pointer justify-end flex text-rose-500'>
                  <div>{item[1]}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TradeLeft

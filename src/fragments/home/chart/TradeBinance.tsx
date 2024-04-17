import { offSocket, onSocket } from '@/store/socket'
import { currencyFormat } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/compat'
import { coinAtom, setSymbol } from '../store'

let initialData = {
  volume: 0,
  change: 0,
  high: 0,
  low: 0,
  marker: 0,
  symbol: '',
  name: ''
}

const textContent = [
  {
    type: 'change',
    label: 'Price Fluctuation in 24h'
  },
  {
    type: 'high',
    label: 'Highest Price in 24h'
  },
  {
    type: 'low',
    label: 'Lowest Price in 24h'
  },
  {
    type: 'volume',
    label: 'Volume 24h (in token)'
  },
  {
    type: 'marker',
    label: 'Volume 24h (in USDT)'
  }
]

function TradeBinance() {
  const { symbol } = useStore(coinAtom)

  const [data, setData] = useState<any>(initialData)

  initialData = { ...initialData, symbol: symbol.toUpperCase(), name: symbol.toUpperCase() }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const binance = queryParams.get('binance')
    setSymbol(binance ?? 'btcusdt')
  }, [])

  useEffect(() => {
    const eventKey = `card_row_${symbol.toLowerCase()}`
    const handleEvent = (val: any) => {
      setData(val)
    }
    onSocket(eventKey, handleEvent, () => setData(null))
    return () => {
      offSocket(eventKey)
    }
  }, [symbol])

  return (
    <div style={{ gridColumn: 'subHeader', gridRow: 'subHeader' }} className='text-neutral-800 text-sm py-3 bg-zinc-50'>
      <div className='items-center flex-wrap justify-between px-4 relative flex'>
        <div className='flex-grow flex flex-col md:flex-row'>
          <div className='flex md:w-2/5 w-full'>
            <div className='items-center justify-between flex' style='width: 30%;'>
              <div className='items-center flex-grow flex'>
                <div className='border-r-gray-100 border-r-2 flex-col justify-around pr-6 flex border-solid'>
                  <div className='flex'>
                    <div className='items-center flex-wrap flex gap-5'>
                      <h1 className='text-xl font-medium'>{data.binance?.toUpperCase()}</h1>
                      <div className='text-xs flex text-slate-500'>
                        <a href='https://www.binance.com/vi/price/bitcoin' className='underline'>
                          {data.tokenName} Price
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex-col flex w-full'>
                <div className='text-emerald-600 items-center flex text-xl'>{data.volume}</div>
                <div className='text-xs'>{currencyFormat(data.volume)}</div>
              </div>
            </div>
          </div>
          <div className='items-center flex-grow justify-between relative flex flex-wrap w-full md:w-[70%]'>
            {textContent.map((text, index) => {
              return (
                <div key={index} className='pr-7 mb-4 w-1/2 md:w-auto'>
                  <div className='text-xs'>
                    <div className='text-slate-500 text-ellipsis'>{text.label}</div>
                    <div>
                      {index === 0 ? (
                        <div className='text-rose-600'>
                          <span className='flex'>{data.change}%</span>
                        </div>
                      ) : (
                        <div>{currencyFormat(data[text.type])}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradeBinance

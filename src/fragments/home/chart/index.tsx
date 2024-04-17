import Loading from '@/components/Loading'
import { emitSocket, offSocket, onSocket, socketAtom } from '@/store/socket'
import { getCookie } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect } from 'preact/hooks'
import { coinAtom } from '../store'
import TableCorrect from '../table/TableCorrect'
import CandlestickSeries, { timeOptionsToMilliseconds } from './CandlestickSeries'
import Card from './Card'
import TimeStamp from './Timestamp'
import TradeLeft from './TradeLeft'
import { chartAtom, setData, setLoading } from './chart-store'

const times = [
  { label: 'Open', id: 'open' },
  { label: 'High', id: 'high' },
  { label: 'Low', id: 'low' },
  { label: 'Close', id: 'close' },
  { label: 'Volume', id: 'volume' }
]

function Chart({ coins }: { coins: Array<any> }) {
  const { loading, time } = useStore(chartAtom)
  const { socket } = useStore(socketAtom)
  const { symbol } = useStore(coinAtom)

  useEffect(() => {
    const eventKey = `coin_${symbol.toUpperCase()}`
    onSocket(eventKey, (val: any) => {
      if (symbol === val.symbol.toLowerCase()) {
        setLoading(false)
        setData(val.data)
      }
    })
    return () => offSocket(eventKey)
  }, [symbol, time])

  useEffect(() => {
    const handleEmitSocket = () => {
      const currentTime = new Date()
      const start = new Date(currentTime.getTime() - timeOptionsToMilliseconds[time] * 400)
      const stop = currentTime

      emitSocket('fetchSymbols', {
        symbol: symbol.toUpperCase(),
        start: start.getTime(),
        stop: stop.getTime(),
        time: time,
        clientId: socket?.id
      })
    }
    if (!!socket?.id) {
      handleEmitSocket()
      const intervalId = setInterval(handleEmitSocket, timeOptionsToMilliseconds[time])
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [symbol, time, socket?.id])

  if (loading)
    return (
      <div class='flex flex-wrap justify-center items-center gap-4 max-w-sm p-6 bg-white border border-gray-200 md:grid-rows-1 grid-rows-[1fr_2fr_1fr] rounded-lg shadow h-auto w-full min-w-full'>
        <Loading className='h-[300px]' />
      </div>
    )

  return (
    <div class='flex flex-wrap justify-center items-center md:flex-row flex-col-reverse gap-4 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow h-auto w-full min-w-full flex-wrap'>
      <Card coins={coins} className='' />
      <div class='flex flex-col justify-center items-end w-full md:w-[70%]'>
        <div class='md:items-center justify-between w-full md:flex-row flex-col items-start'>
          <TimeStamp />
          <div class='z-2 flex gap-5'>
            <div class='text-slate-500 cursor-crosshair flex-wrap text-xs flex bg-zinc-50/[0.5]'>
              {times.map((item) => (
                <>
                  <span class='pr-1.5'>{item.label}: </span>
                  <span class='text-rose-500 pr-1.5' id={item.id}>
                    0
                  </span>
                </>
              ))}
            </div>
          </div>
        </div>
        <CandlestickSeries />
      </div>
      {!!getCookie('token') && (
        <>
          <TradeLeft />
          <TableCorrect />
        </>
      )}
    </div>
  )
}

Chart.propTypes = {}

export default Chart

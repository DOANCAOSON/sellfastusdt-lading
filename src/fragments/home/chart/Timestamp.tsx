import { useStore } from '@nanostores/preact'
import { chartAtom, setLoading, setTime } from './chart-store'

const timeOptions = [
  { t: '1 second', s: '1s' },
  { t: '15 minutes', s: '15m' },
  { t: '1 hour', s: '1h' },
  { t: '4 hours', s: '4h' },
  { t: '1 day', s: '1d' },
  { t: '1 week', s: '1w' }
]

const TimeStamp = () => {
  const { time } = useStore(chartAtom)

  const handleClick = (time: string) => {
    setTime(time)
    setLoading(true)
    const newUrl = new URL(location.href)
    newUrl.searchParams.set('time', time)
    history.pushState({}, '', newUrl)
  }

  return (
    <div className='items-center justify-between flex ' id='ChartComponent'>
      <div className='min-w-[4.38rem] m-0 min-[767px]:min-w-[0.00rem] bg-zinc-50'>
        <div className='flex h-6 m-0'>
          <div className='flex-wrap justify-between flex overflow-hidden m-0 text-xs'>
            <div className='text-slate-500 items-center cursor-pointer justify-center flex my-0 mr-2 ml-0 rounded-sm p-1'>
              Time
            </div>
            {timeOptions.map((t) => (
              <div
                key={t}
                className={`items-center cursor-pointer justify-center flex my-0 mr-2 ml-0 rounded-sm p-1 ${
                  time === t.s ? 'text-yellow-600' : 'text-slate-500'
                }`}
                onClick={() => handleClick(t.s)}>
                {t.t}
              </div>
            ))}
          </div>
          <div className='flex-grow inline-block h-6 my-0 mr-2 ml-0 text-slate-500'>
            <div className='items-center cursor-pointer justify-center flex w-full h-full rounded-sm m-0 p-1'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeStamp

import Image from '@/components/Image'
import dayjs from 'dayjs'
import { useEffect, useState } from 'preact/compat'

interface Props {
  transactionID?: string
  seconds: number
}

const ExpireTime = (props: Props) => {
  const { transactionID, seconds } = props
  const [time, setTime] = useState({ minutes: 30, seconds: 0 })
  const countDownTime = dayjs().add(seconds, 'second')

  useEffect(() => {
    if (seconds) {
      const interval = setInterval(() => {
        const now = dayjs()
        const duration = dayjs.duration(countDownTime.diff(now))
        const minutes = duration.minutes()
        const seconds = duration.seconds()
        if (duration.asSeconds() < 0) {
          clearInterval(interval)
          return
        }
        setTime({ minutes, seconds })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [seconds])

  useEffect(() => {
    if (time.minutes === 0 && time.seconds === 0) {
      fetch(`/api/transaction`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify({ id: transactionID, status: 'CANCELLED' })
      })
        .then((response) => response.json())
        .then(() => setTimeout(() => location.reload(), 1000))
        .catch(console.error)
    }
  }, [time])

  const formatSeconds = (seconds: number) => {
    return seconds < 10 ? `0${seconds}` : seconds
  }

  return (
    <div className='md:px-[calc(3rem*.5)] w-full mt-5 md:mt-12 min-[1200px]:w-1/3'>
      <div className='bg-stone-50 flex h-full rounded-lg gap-4 p-5'>
        <div className='text-slate-600 w-[10%]'>
          <Image src='/assets/icons/time.svg' ariaLabel='time_image' alt='time_image' />
        </div>
        <div className='w-[80%]'>
          <h5 className='text-slate-600 mb-1.5'>Expire time</h5>
          <h4 className='text-lg font-medium overflow-hidden break-al'>
            <span className='text-red-600 text-xl'>{time.minutes}:</span>
            <span className='text-red-600 text-xl'>{formatSeconds(time.seconds)}</span>
          </h4>
        </div>
      </div>
    </div>
  )
}

export default ExpireTime

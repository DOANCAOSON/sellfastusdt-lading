import { Animation } from '@/components/Animation'
import Image from '@/components/Image'
import { formattedAmount } from '@/utils'
import { setSymbol } from '../store'
import { setLoading } from './chart-store'

const Card = ({ coins, className }: { coins: Array<any>; className: string }) => {
  if (!coins) return <></>
  const fetchCoin = (binance: string) => {
    setSymbol(binance)
    setLoading(true)
    document.getElementById('ChartComponent')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div class={`w-full md:w-[25%] ${className}`}>
      <Animation className='flex flex-col items-start bg-white' width='100%' animationName='fadeIn' duration={0.2}>
        <h5 class='mb-1 text-xl font-medium text-gray-900'>Markets Overview</h5>
        <div class='flex flex-col items-center h-full w-full'>
          <ul class='my-4 space-y-3 w-full'>
            {coins.map((c) => (
              <li>
                <div
                  onClick={() => fetchCoin(c.binance)}
                  class='flex items-center p-3 cursor-pointer text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow'>
                  <Image src={c.images} ariaLabel='' className='h-5' />
                  <span class='flex-1 ms-3 whitespace-nowrap'>
                    {c.binance?.replace('usdt', '').replace('tusd', 'usdt')?.toUpperCase()}
                  </span>
                  <span class='inline-flex items-center justify-center px-2 py-0.5 ms-3 text-medium font-medium text-gray-500 bg-gray-100 rounded'>
                    {formattedAmount(c.amount ?? 0)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Animation>
    </div>
  )
}

export default Card

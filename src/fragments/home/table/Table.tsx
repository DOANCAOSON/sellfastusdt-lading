import Image from '@/components/Image'

import { onSocket, socketAtom } from '@/store/socket'
import { currencyFormat } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/compat'
import { setLoading } from '../chart/chart-store'
import { setSymbol } from '../store'

const headers = ['#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Volume(24h)']

interface TableProps {
  balance: BalancerWallet
}

const Table = (props: TableProps) => {
  const { balance } = props

  const coinRows: CoinRow[] = balance?.coins?.map((c: any) => ({
    avgPrice: { key: 'avg', value: 0 },
    '1hTicker': { key: '1hTicker', value: 0 },
    '4hTicker': { key: '4hTicker', value: 0 },
    kline: { key: 'kline', value: 0 },
    'MARKET-CAP': { key: 'MARKET-CAP', value: 0 },
    'volume(24h)': { key: 'volume(24h)', value: 0 },
    symbol: c.binance,
    infor: {
      first: c.tokenName,
      last: c.binance.toUpperCase(),
      img: c.images.split(',')[0]
    }
  }))

  return (
    <div class='overflow-x-auto shadow-md sm:rounded-lg md:mt-[5rem] mt-[2rem]'>
      <table class='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400'>
          <tr>
            {headers.map((header) => (
              <th scope='col' class='md:px-6 md:py-3 px-3 py-2'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{coinRows?.map((item, index) => <Row {...item} key={item.symbol} index={++index} />)}</tbody>
      </table>
    </div>
  )
}

const Row = (props: CoinRow & { key: string; index: number }) => {
  const [coin, setCoin] = useState(props)
  const { socket } = useStore(socketAtom)
  const handleSetSymbol = () => {
    setSymbol(coin.symbol)
    setLoading(true)
    document.getElementById('ChartComponent')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    onSocket(
      props.symbol,
      (val: Record<string, number | string>) => {
        setCoin((d) => {
          if (val.key === '1dTicker' && !!val.volume) {
            return {
              ...d,
              kline: { key: val.key, value: +val.value },
              'volume(24h)': { key: 'volume(24h)', value: +val.volume },
              'MARKET-CAP': { key: 'volume(24h)', value: +val.marker }
            }
          } else {
            return {
              ...d,
              [val.key]: { key: val.key, value: val.value }
            }
          }
        })
      },
      () => {}
    )
  }, [socket])

  return (
    <tr className='bg-white border-b hover:bg-gray-50' onClick={handleSetSymbol}>
      <td className='px-5 py-3'>{coin.index}</td>
      <th scope='row' className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'>
        <div className='w-full flex cursor-pointer'>
          <Image className='w-10 h-10 rounded-full' src={coin.infor.img} alt={coin.infor.first} ariaLabel='avatar' />
          <div className='ps-3'>
            <div className='text-base font-semibold'>{coin.infor.first}</div>
            <div className='font-normal text-gray-500'>{coin.infor.last}</div>
          </div>
        </div>
      </th>
      <td className='px-5 py-3'>
        <div className='w-full flex cursor-pointer'>{currencyFormat(coin.avgPrice.value)}</div>
      </td>
      <td className='px-5 py-3'>
        <div className='w-full flex cursor-pointer'>{currencyFormat(coin['1hTicker'].value)}</div>
      </td>
      <td className='px-5 py-3'>
        <div className='flex items-center cursor-pointer'>
          <div className='h-2.5 w-2.5 rounded-full bg-green-500 me-2'></div> {currencyFormat(coin['4hTicker'].value)}
        </div>
      </td>
      <td className='px-5 py-3'>
        <a href={`/trade/${props.symbol}`} className='font-medium text-blue-600 hover:underline'>
          {currencyFormat(coin.kline.value)}
        </a>
      </td>
      <td className='px-5 py-3'>
        <a href={`/trade/${props.symbol}`} className='font-medium text-blue-600 hover:underline'>
          {currencyFormat(coin['MARKET-CAP'].value)}
        </a>
      </td>
      <td className='px-5 py-3'>
        <a href={`/trade/${props.symbol}`} className='font-medium text-blue-600 hover:underline'>
          {currencyFormat(coin['volume(24h)'].value)}
        </a>
      </td>
    </tr>
  )
}
export default Table

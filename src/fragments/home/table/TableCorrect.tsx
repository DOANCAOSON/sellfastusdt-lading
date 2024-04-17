import { Animation } from '@/components/Animation'
import Image from '@/components/Image'
import { auth as authAtom } from '@/store/auth-store'
import { formattedAmount } from '@/utils'
import { useStore } from '@nanostores/preact'

interface Props {}
function TableCorrect(props: Props) {
  const { auth } = useStore(authAtom)

  if (!auth) return <></>
  const { wallets } = auth
  const coins = wallets
    .map((w) => ({
      name: w.Token?.tokenName,
      price: w.Token?.price,
      amount: w.amount,
      images: w.Token?.images,
      binance: w.Token?.binance
    }))
    .sort((a, b) => b.amount - a.amount)

  const coinActive = wallets.find((w) => w.binance === 'tusdusdt')
  return (
    <div class='w-full md:w-[70%]'>
      <Animation
        animationName='fadeIn'
        duration={0.2}
        className='relative overflow-x-auto shadow-md sm:rounded-lg '
        width='100%'>
        <table className='md:w-full w-[100px] text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                Image
              </th>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                Coin
              </th>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                Balance
              </th>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                USDT
              </th>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                Wallet
              </th>
              <th scope='col' className='md:px-6 md:py-3 px-3 py-2 text-center'>
                Market
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr className='bg-white border-b  hover:bg-gray-50 '>
                <td className='p-4 flex justify-center'>
                  <Image src={coin.images} className='w-10 max-w-full max-h-full' ariaLabel='' alt={coin.name} />
                </td>
                <td className='font-semibold text-gray-900 text-center'>{coin.name}</td>
                <td className='text-center'>{formattedAmount(coin.amount)}</td>
                <td className='font-semibold text-gray-900 text-center'>{formattedAmount(coin.amount)}</td>
                <td className='text-center'>
                  {coinActive !== coin.binance && (
                    <>
                      <a
                        href={`/crypto/deposit?binance=${coin.binance}`}
                        className='font-medium text-red-600 m-2 hover:underline'>
                        DEPOSIT
                      </a>
                      {coin.amount > 0 && (
                        <a
                          href={`/crypto/withdraw?binance=${coin.binance}`}
                          className='font-medium text-red-600 m-2 hover:underline'>
                          WITHDRAW
                        </a>
                      )}
                    </>
                  )}
                </td>
                <td className='text-center'>
                  {coinActive.binance !== coin.binance && (
                    <>
                      <a
                        href={`/crypto/buy?binance=${coin.binance}`}
                        className='font-medium text-red-600 m-2 hover:underline'>
                        BUY
                      </a>
                      <a
                        href={`/crypto/sell?binance=${coin.binance}`}
                        className='font-medium text-red-600 m-2 hover:underline'>
                        SELL
                      </a>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Animation>
    </div>
  )
}

TableCorrect.propTypes = {}

export default TableCorrect

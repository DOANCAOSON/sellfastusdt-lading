import { Animation } from '@/components/Animation'
import Image from '@/components/Image'
import { offSocket, onSocket } from '@/store/socket'
import { formattedAmount } from '@/utils'
import { useEffect, useState } from 'preact/compat'

interface Props {
  balance: BalancerWallet
}
function Banner({ balance }: Props) {
  const [data, setData] = useState({
    priceBuy: 0,
    priceSell: 0,
    images: balance?.images,
    tokenName: balance.tokenName
  })
  const queryParams = new URLSearchParams(location.search)
  const binance = queryParams.get('binance') ?? balance.binance ?? 'btcusdt'

  const contentSections = [
    {
      title: `BITCOIN MARKETPLACE`,
      subtitle: `TRADING MADE EASY: BUY AND SELL BITCOIN SAFELY AND SWIFTLY`,
      items: [
        {
          action: '/crypto/buy',
          label: `YOU WANT TO BUY: 1 BITCOIN`,
          price: formattedAmount(+data?.priceBuy?.toFixed(4)),
          buttonLabel: 'BUY NOW'
        },
        {
          action: '/crypto/sell',
          label: `YOU WANT TO SELL: 1 BITCOIN`,
          price: formattedAmount(+data?.priceSell?.toFixed(4)),
          buttonLabel: 'SELL NOW'
        }
      ]
    }
  ]

  useEffect(() => {
    const eventKey = `price_coin_${binance}`
    onSocket(eventKey, (val: any) => {
      if (!!val) {
        setData(val.coin)
      }
    })
    return () => offSocket(eventKey)
  }, [binance])

  return (
    <div
      class='w-full flex justify-center items-center'
      style={{
        backgroundImage: `url(/assets/images/bghome1.jpg)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
      }}>
      <div class='flex items-center justify-center px-4 my-10 lg:p-0 lg:w-3/4 lg:h-96 lg:flex-row flex-col-reverse'>
        <Animation duration={0.2} animationName='fadeIn' className='lg:flex-1 mb-5 sm:mb-8 lg:mb-0'>
          {contentSections.map((section) => (
            <div>
              <div>
                <h1 class='text-center text-text text-3xl sm:text-4xl lg:text-5xl font-black'>{section.title}</h1>
              </div>
              <div class='mb-10'>
                <h2 class='text-center text-text font-extralight text-sm sm:text-base lg:text-lg'>
                  {section.subtitle}
                </h2>
              </div>
              <div class='flex justify-around'>
                {section.items.map((item) => (
                  <div class='space-y-4'>
                    <div class='mb-2 text-center'>
                      <p>
                        <span class='text-text text-lg sm:text-xl lg:text-2xl'>{item.label}</span>
                      </p>
                    </div>
                    <div class='mb-2 w-full text-center'>
                      <p>
                        <span
                          class={`${item.action === '/crypto/buy' ? 'text-bgcontainer' : 'text-red-500'} text-sm lg:text-[2rem]`}>
                          {item.price} USDT
                        </span>
                      </p>
                    </div>
                    <div class='flex justify-center'>
                      <a href={item.action}>
                        <button
                          class={` text-white bg-gradient-to-r  hover:bg-gradient-to-br focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
                          ${item.action === '/crypto/buy' ? 'from-green-400 via-green-500 to-green-600 focus:ring-green-300 shadow-green-500/50 ' : 'from-red-400 via-red-500 to-red-600 focus:ring-red-300 shadow-red-500/50 '} text-sm lg:text-lg`}>
                          {item.buttonLabel}
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Animation>
        <div class='lg:flex-1 flex justify-center'>
          <div class='w-[150px] sm:w-[200px] lg:w-[300px]'>
            <Image src={data?.images} alt={data?.tokenName} ariaLabel={data?.tokenName} />
          </div>
        </div>
      </div>
    </div>
  )
}

Banner.propTypes = {}

export default Banner

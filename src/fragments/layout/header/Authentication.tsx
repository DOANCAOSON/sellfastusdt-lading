import { Animation } from '@/components/Animation'
import Image from '@/components/Image'
import Modal from '@/components/Modal'
import { SelectBox } from '@/components/SelectBox'
import { auth as authAtom, logout } from '@/store/auth-store'
import { onSocket } from '@/store/socket'
import { formattedAmount, getCookie, hideEmail } from '@/utils'
import { useStore } from '@nanostores/preact'
import { useEffect, useState } from 'preact/compat'
import Notification from './Notification'

const Estimated = ({ coins }: { coins: Array<any> }) => {
  const { auth } = useStore(authAtom)
  if (!auth) return <></>
  const [coin, setCoin] = useState({ amount: 0, price: 0, binance: 'tusdusdt' })

  useEffect(() => {
    !!coins.length && setCoin(coins[0])
  }, [coins])

  return (
    <div class='w-full flex-wrap gap-2.5 p-2 bg-white border border-gray-200 rounded-lg sm:p-3 flex items-start justify-between'>
      <div class=''>
        <div class='flex text-gray-700 items-center'>
          <span class='text-3xl font-extrabold tracking-tight'>{formattedAmount(+coin?.amount)}</span>
          <span class='ms-1 text-xl font-normal text-gray-500 flex gap-2'>
            /
            <SelectBox
              items={coins}
              onChange={(val) => {
                const wallet = coins?.find((c) => c.value === val.value)
                setCoin(wallet)
              }}
              defaultValue={coins[0].value}
              className='btn-select'
            />
          </span>
        </div>
        {/* <span>≈ {formattedAmount(coin?.price * coin.amount)} USDT</span> */}
      </div>
      <div class='flex'>
        <a
          href={`/crypto/deposit?binance=${coin.binance}`}
          class='inline-flex items-center px-4 py-2 text-sm text-gray-600 font-medium text-center bg-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 '>
          Deposit
        </a>
        <a
          href={`/crypto/withdraw?binance=${coin.binance}`}
          class='py-2 px-4 ms-2 text-sm font-medium text-gray-600 focus:outline-none bg-gray-200 rounded-lg border border-gray-100 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 '>
          Withdraw
        </a>
      </div>
    </div>
  )
}

const Markets = ({ coins }: { coins: Array<any> }) => {
  return (
    <div class='w-full p-3 bg-white border border-gray-200 rounded-lg shadow sm:p-3 '>
      <div class='flex items-center justify-between mb-4'>
        <h5 class='text-base leading-none text-gray-700 '>Holding</h5>
      </div>
      <div class='flow-root'>
        <ul role='list' className='divide-y divide-gray-200 '>
          {coins?.map((w, index) => {
            return (
              <li key={index} className='py-1 sm:py-2'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <Image
                      className='w-8 h-8 rounded-full'
                      src={w.images}
                      alt={w.tokenName + ' image'}
                      ariaLabel={w.tokenName + ' image'}
                    />
                  </div>
                  <div className='flex-1 min-w-0 ms-4'>
                    <p className='text-sm font-medium text-gray-900 truncate '>{w.name}</p>
                  </div>
                  <div className='flex justify-center  w-[30%]'>
                    <div className='inline-flex items-center text-base font-semibold text-gray-900 '>
                      {formattedAmount(+w.amount)}
                    </div>
                  </div>
                  <div className='flex justify-end w-[40%]'>
                    <div className='inline-flex break-all text-sm font-normal text-gray-900 justify-end px-2 py-0.5  bg-gray-100 rounded flex-col items-baseline'>
                      <p>
                        {formattedAmount(+w.amount)} {w.name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const UserModal = () => {
  const { auth } = useStore(authAtom)
  if (!auth) return <></>
  const { wallets } = auth

  const coins = wallets
    .map((wallet) => ({
      images: wallet.Token?.images,
      price: wallet.Token?.price,
      name: wallet.Token?.binance?.replace('usdt', '').replace('tusd', 'usdt')?.toUpperCase(),
      binance: wallet.Token?.binance,
      value: wallet.Token?.slug,
      amount: wallet.amount
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <form className=''>
      <label htmlFor='email-address-icon' className='block mb-2 text-sm font-medium text-gray-900 '>
        Estimated Balance
      </label>
      <Estimated coins={coins} />
      <div className='relative'></div>
      <label htmlFor='amount-icon' className='block mb-2 text-sm font-medium text-gray-900 '>
        Markets
      </label>
      <Markets coins={coins} />
    </form>
  )
}

export const Authentication = ({ data }: { data: Notification }) => {
  const { auth } = useStore(authAtom)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenNotify, setIsOpenNotify] = useState(false)

  const [notifications, setNotifications] = useState<Array<any>>(data.dataSource)

  useEffect(() => {
    onSocket('notify', (newNotify: any) => {
      const { content } = newNotify
      setNotifications((prev) => [content, ...prev])
    })
  }, [])

  useEffect(() => {
    if (!getCookie('token')) {
      location.replace('/login')
    }
  }, [])

  const handleGetNotifies = () => {
    setIsOpenNotify(!isOpenNotify)
  }

  const handleDeleteNotify = () => {
    if (!!auth?.id) {
      fetch('/api/notification?userId=' + auth?.id, { method: 'DELETE' })
        .then((res) => res.json())
        .then(() => setNotifications([]))
        .catch(console.log)
    }
  }

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('#default-modal') && !target.closest('#toggle_menu_user')) {
        setIsOpenNotify(false)
      }
    })
  }, [])

  const notifyCount = notifications?.filter((d) => !d.isRead).length
  return (
    <>
      <span
        data-modal-target='default-modal'
        onClick={() => !isOpenModal && setIsOpenModal(true)}
        id='toggle_menu_user'
        data-modal-toggle='default-modal'
        className='text-text cursor-pointer flex items-center text-[12px] sm:text-[13px] lg:text-[16px] font-medium'>
        <img
          class='w-10 h-10 rounded'
          src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
          alt='Default avatar'
        />
      </span>
      <span class='relative w-10 h-10 flex items-center'>
        <svg
          class='w-8 h-8 text-white cursor-pointer'
          aria-hidden='true'
          id='toggle_menu_user'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          onClick={handleGetNotifies}
          viewBox='0 0 24 24'>
          <path
            stroke='currentColor'
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M12 5.4V3m0 2.4a5.3 5.3 0 0 1 5.1 5.3v1.8c0 2.4 1.9 3 1.9 4.2 0 .6 0 1.3-.5 1.3h-13c-.5 0-.5-.7-.5-1.3 0-1.2 1.9-1.8 1.9-4.2v-1.8A5.3 5.3 0 0 1 12 5.4ZM8.7 18c.1.9.3 1.5 1 2.1a3.5 3.5 0 0 0 4.6 0c.7-.6 1.3-1.2 1.4-2.1h-7Z'
          />
        </svg>
        {!!notifyCount && (
          <span class=' text-white absolute w-5 h-5 flex items-center justify-center text-[13px] font-bold rounded-[50%] right-0 top-[10%] bg-red-500'>
            {notifyCount}
          </span>
        )}
        <Notification
          setIsOpenNotify={setIsOpenNotify}
          notifications={notifications}
          isOpenNotify={isOpenNotify}
          handleDeleteNotify={handleDeleteNotify}
        />
      </span>
      {isOpenModal && (
        <Modal title={`👋 ${hideEmail(auth?.email ?? '')}`} setIsOpenModal={setIsOpenModal}>
          <Animation animationName='fadeIn' duration={0.2}>
            <div className='p-4 md:p-5 space-y-4'>
              <UserModal />
            </div>
            <div className='flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b '>
              <button
                data-modal-hide='default-modal'
                type='button'
                onClick={logout}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                Logout
              </button>
            </div>
          </Animation>
        </Modal>
      )}
    </>
  )
}

export default Authentication

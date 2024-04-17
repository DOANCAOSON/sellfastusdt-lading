import { useEffect } from 'preact/compat'
import type { JSX } from 'preact/jsx-runtime'

const depositItems: SidebarNavItemProps[] = [
  {
    name: 'Crypto Deposit',
    href: '/crypto/deposit',
    description: 'Get your BTC, ETH, or any other cryptocurrency deposit address and deposit.',
    icon: (
      <svg
        size={48}
        viewBox='0 0 96 96'
        xmlns='http://www.w3.org/2000/svg'
        className='bn-svg'
        style={{ height: 48, width: 100 }}>
        <path
          opacity='0.15'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M84 44H12v40h72V44zM48 61.998l-8-8 8-8 8 8-8 8z'
          fill='#929AA5'
        />
        <path opacity='0.5' d='M30 8h36L48 26 30 8z' fill='#929AA5' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M48 33.999c11.045 0 20 8.954 20 20s-8.955 20-20 20c-11.046 0-20-8.954-20-20s8.954-20 20-20zm0 28l-8-8 8-8 8 8-8 8z'
          fill='#F0B90B'
        />
      </svg>
    )
  }
]

const withdrawItems: SidebarNavItemProps[] = [
  {
    name: 'Withdraw Deposit',
    href: '/crypto/withdraw',
    description: 'Retrieve your BTC, ETH, or any other cryptocurrency withdrawal address and withdraw funds.',
    icon: (
      <svg
        size={48}
        viewBox='0 0 96 96'
        xmlns='http://www.w3.org/2000/svg'
        className='bn-svg'
        style={{ height: 48, width: 100 }}>
        <path
          opacity='0.15'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M88 76H8V20h80v56zm-64-8h48a7.997 7.997 0 018-8V36a7.997 7.997 0 01-8-8H24a7.997 7.997 0 01-8 8v24a7.997 7.997 0 018 8z'
          fill='#929AA5'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M58.001 48c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm-35 0l4-4 4 4-4 4-4-4zm46-4l-4 4 4 4 4-4-4-4z'
          fill='#F0B90B'
        />
      </svg>
    )
  }
]

interface SidebarNavItemProps {
  name: string
  href: string
  description: string
  icon: JSX.Element
}

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const SidebarNavItem: preact.FunctionalComponent<SidebarNavItemProps> = ({ href, icon, name, description }) => {
  return (
    <li>
      <a href={href} className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group'>
        {icon}
        <div className='ms-3'>
          <p className='text-xl text-gray-900'>{name}</p>
          <p className='text-xs text-gray-900'>{description}</p>
        </div>
      </a>
    </li>
  )
}

const Sidebar: preact.FunctionalComponent<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!document.getElementById('drawer-navigation')?.contains(event.target as Node)) {
        handleClose()
      }
    }
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isOpen])

  return (
    <div
      id='drawer-navigation'
      className={`border border-gray-200 fixed top-0 right-0 z-40 w-full md:w-[30rem] h-screen p-4 overflow-y-auto transition-transform bg-white ${
        isOpen ? 'transform-none' : 'translate-x-full'
      }`}
      tabIndex={-1}
      aria-labelledby='drawer-navigation-label'>
      <h5 id='drawer-navigation-label' className='text-base font-semibold text-gray-500 uppercase'>
        Deposit
      </h5>
      <button
        type='button'
        data-drawer-hide='drawer-navigation'
        aria-controls='drawer-navigation'
        onClick={() => setIsOpen(false)}
        className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center '>
        <svg
          aria-hidden='true'
          className='w-5 h-5'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
        <span className='sr-only'>Close menu</span>
      </button>
      <div className='py-4 overflow-y-auto'>
        <ul className='space-y-2 font-medium'>
          {depositItems.map((item, index) => (
            <SidebarNavItem key={index} {...item} />
          ))}
        </ul>
      </div>
      <h5 id='drawer-navigation-label' className='text-base font-semibold text-gray-500 uppercase'>
        Withdraw
      </h5>
      <div className='py-4 overflow-y-auto'>
        <ul className='space-y-2 font-medium'>
          {withdrawItems.map((item, index) => (
            <SidebarNavItem key={index} {...item} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

import { useState } from 'preact/compat'

interface MenuNavMobileProps {
  menuItems: { href: string; text: string }[]
}
const MenuNavMobile = (props: MenuNavMobileProps) => {
  const { menuItems } = props

  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className={`block lg:hidden`}>
        <div className='w-[20px] sm:w-[32px] ' onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <img src='/assets/images/bar.png' alt='iconbar' />
        </div>
      </div>
      <div className={`fixed top-0 left-0 bottom-0 right-0 ${isSidebarOpen ? '' : 'hidden'}`}>
        <div
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className='absolute top-0 left-0 bottom-0 right-0 z-20 bg-bgrba'
        />
        <div className='absolute z-30 bg-white h-screen w-3/4 px-[20px] py-[60px] sm:px-[40px] sm:py-[80px]'>
          {menuItems.map((item, index) => (
            <div className='mb-[30px]' key={index}>
              <a
                href={item.href}
                className='font-bold text-[12px] sm:text-[16px] hover:text-bgcontainer transition duration-200 ease-in-out'>
                {item.text}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MenuNavMobile

import { useEffect } from 'preact/compat'

interface Props {
  title: string
  setIsOpenModal: (val: boolean) => void
  children: any
}
function Modal(props: Props) {
  const { title, setIsOpenModal, children } = props

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement

      if (!target.closest('#default-modal') && !target.closest('#toggle_menu_user')) {
        setIsOpenModal(false)
      }
    })
  }, [])

  return (
    <div
      tabIndex={-1}
      aria-hidden='true'
      style={{ background: '#05050582' }}
      className=' overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-full'>
      <div
        id='default-modal'
        className='relative p-4 w-full max-w-2xl max-h-full -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4'>
        <div className='relative bg-white rounded-lg shadow '>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t '>
            <h3 className='text-xl font-semibold text-gray-900 '>{title}</h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center '
              data-modal-hide='default-modal'
              onClick={() => setIsOpenModal(false)}>
              <svg
                className='w-3 h-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

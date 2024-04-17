import type { JSX } from 'preact/jsx-runtime'

interface AlertProps {
  status: 'info' | 'danger' | 'success' | 'warning'
  label: string
  endComponent?: JSX.Element
}
const Alert = ({ status, label, endComponent }: AlertProps) => {
  let alertClasses = ''

  switch (status) {
    case 'info':
      alertClasses = 'text-blue-800 bg-blue-50 '
      break
    case 'danger':
      alertClasses = 'text-red-800 bg-red-50'
      break
    case 'success':
      alertClasses = 'text-green-800 bg-green-50 '
      break
    case 'warning':
      alertClasses = 'text-yellow-800 bg-yellow-50 '
      break
    default:
      alertClasses = 'text-gray-800 bg-gray-50 '
  }

  return (
    <div className={`flex items-center p-4 text-sm rounded-lg ${alertClasses} md:flex-row flex-col gap-2`} role='alert'>
      <div className='flex md:items-center items-start'>
        <svg
          className='flex-shrink-0 inline w-4 h-4 me-3'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'>
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
        </svg>
        <span className='sr-only'>Info</span>
        <div>{label}</div>
      </div>
      {!!endComponent && <div>{endComponent}</div>}
    </div>
  )
}

export default Alert

import Empty from '@/components/Empty'
import Image from '@/components/Image'
import { auth as authAtom } from '@/store/auth-store'
import { formattedDate } from '@/utils'
import { useStore } from '@nanostores/preact'

interface Props {
  setIsOpenNotify: (bol: boolean) => void
  notifications: Array<any>
  isOpenNotify: boolean
  handleDeleteNotify: any
}

const NotificationItem = (props: any) => {
  const { id, url, content, isRead, createdAt, text, image, handleUpdateNotify } = props

  return (
    <div class='flex items-center mt-2' href={url} onClick={() => handleUpdateNotify(id)}>
      <div class='relative inline-block shrink-0'>
        <Image ariaLabel='' className='w-12 h-12 rounded-full' src={image} alt='Jese Leos image' />
        {!isRead && (
          <span class='absolute bottom-0 right-0 inline-flex items-center justify-center w-3 h-3 bg-red-600 rounded-full'>
            <span class='sr-only'>Message icon</span>
          </span>
        )}
      </div>
      <div class='ms-3 text-sm font-normal'>
        <div class={`text-sm font-semibold ${isRead ? 'text-gray-500' : 'text-gray-900'}`}>{text}</div>
        <div class={`text-sm font-normal ${isRead ? 'text-gray-400' : 'text-gray-800'}`}>{content}</div>
        <span class='text-xs font-medium text-blue-600 '>{formattedDate(createdAt)}</span>
      </div>
    </div>
  )
}

function Notification(props: Props) {
  const { setIsOpenNotify, notifications, isOpenNotify, handleDeleteNotify } = props
  const { auth } = useStore(authAtom)

  const handleUpdateNotify = (id: string) => {
    if (auth?.id)
      fetch('/api/notification?id=' + id, { method: 'PATCH' })
        .then((res) => res.json())
        .then((data) => location.replace(data.url))
        .catch(console.log)
  }

  return (
    <div
      id='toast-notification'
      style={{ display: isOpenNotify ? 'block' : 'none' }}
      class=' h-[500px] overflow-auto p-4 cursor-pointer text-gray-900 bg-white right-[-300%] w-[320px] rounded-lg shadow absolute sm:w-[550px] sm:right-full top-full'
      role='alert'>
      <div class='flex items-center mb-3'>
        <span class='mb-1 text-sm font-semibold text-gray-900 '>New notification</span>
        <button
          type='button'
          class='ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8  '
          data-dismiss-target='#toast-notification'
          onClick={() => setIsOpenNotify(false)}
          aria-label='Close'>
          <span class='sr-only'>Close</span>
          <svg class='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
            />
          </svg>
        </button>
      </div>
      {!!notifications?.length ? (
        <>
          {notifications.map((d) => (
            <NotificationItem {...d} handleUpdateNotify={handleUpdateNotify} />
          ))}
          <span class='mb-1 text-sm font-semibold text-blue-700 ' onClick={handleDeleteNotify}>
            Clean All
          </span>
        </>
      ) : (
        <Empty des='There are no messages at all' />
      )}
    </div>
  )
}

Notification.propTypes = {}

export default Notification

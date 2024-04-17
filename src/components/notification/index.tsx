import { notificationAtom } from '@/store/notify-store'
import { useStore } from '@nanostores/preact'
import { useEffect } from 'preact/compat'
export enum NotificationType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success'
}

export const Notification = () => {
  const notification = useStore(notificationAtom)

  useEffect(() => {
    if (notification?.isClose) {
      closeNotify()
    }
  }, [notification?.isClose])
  if (!notification) return <></>

  const { type, key, description, label } = notification

  const closeNotify = () => {
    const popup = document.getElementById('Notification')
    popup?.classList.remove('appear')
    popup?.classList.add('exit')
  }

  return (
    <div className='notification-container appear' id='Notification' key={key}>
      <div className={`notification notification-${type}`}>
        <div className='content'>
          {label && <h4 className='title'>{label}</h4>}
          {description && <span className='description'>{description}</span>}
        </div>
        <span className='close-icon' onClick={closeNotify}>
          &times;
        </span>
        <div className='notification-line'></div>
      </div>
    </div>
  )
}

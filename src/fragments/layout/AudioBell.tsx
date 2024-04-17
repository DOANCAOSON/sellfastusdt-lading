import { notificationAtom } from '@/store/notify-store'
import { useStore } from '@nanostores/preact'
import { useEffect, useRef } from 'preact/compat'

interface Props {}

function notifyMe(options: any) {
  if (!window.Notification) {
    console.error('Browser does not support notifications.')
  } else {
    if (Notification.permission === 'granted') {
      var notify = new Notification(options.title, options)
    } else {
      Notification.requestPermission()
        .then(function (p) {
          if (p === 'granted') {
            var notify = new Notification(options.title, options)
          } else {
            console.error('User blocked notifications.')
          }
        })
        .catch(function (err) {
          console.error(err)
        })
    }
  }
}

const spawnNotification = ({ body, icon, url, title }: any) => {
  let options = {
    body,
    icon,
    title
  }
  notifyMe(options)
}

function AudioBell(props: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const notification = useStore(notificationAtom)
  const userInteracted = useRef(false)

  useEffect(() => {
    const handleUserInteraction = () => {
      userInteracted.current = true
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }

    window.addEventListener('click', handleUserInteraction)
    window.addEventListener('touchstart', handleUserInteraction)

    return () => {
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  useEffect(() => {
    if (!notification?.isClose && notification?.sound && notification?.body && userInteracted.current) {
      audioRef.current?.play().catch((error) => console.error('Error playing audio:', error))
      spawnNotification(notification.body)
    }
  }, [notification, userInteracted.current])

  return (
    <audio ref={audioRef} preload='auto'>
      <source src='/assets/audio/got-it-done.mp3' type='audio/mp3' />
    </audio>
  )
}

export default AudioBell

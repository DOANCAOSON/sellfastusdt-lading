import { atom } from 'nanostores'
import type { NotificationType } from '../components/notification'

export type DispatchNotification = (type: NotificationType, label?: React.ReactNode, description?: string) => void

interface Notification {
  type: NotificationType
  label?: React.ReactNode
  description?: string
  key?: number
  isClose?: boolean
  sound?: boolean
  body?: any
}

interface Notifies {
  data: Array<any>
}

let timeoutId: ReturnType<typeof setTimeout>
export const notificationAtom = atom<Notification | null>(null)
export const notifiesAtom = atom<Notifies>({ data: [] })
export const pushNotify = (data: Array<any>) => {
  const notifiesData = notifiesAtom.get()?.data ?? []
  notifiesAtom.set({ data: [...data, ...notifiesData] })
}
export const dispatchNotification = (
  type: NotificationType,
  label: string,
  description?: string,
  sound?: boolean,
  body?: any
) => {
  clearTimeout(timeoutId)
  const notify = {
    type,
    label,
    description,
    key: Date.now(),
    isClose: false,
    sound,
    body
  }
  notificationAtom.set({ ...notify })
  timeoutId = setTimeout(() => {
    notify.isClose = true
    notificationAtom.set({ ...notify })
  }, 5000)
}

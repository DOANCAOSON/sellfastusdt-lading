import { persistentAtom } from '@nanostores/persistent'
import { removeCookie } from '../utils'

export interface IAuth {
  createdAt?: string
  id: string
  email: string
  wallets: Array<any>
}

interface IStore {
  isLoading?: boolean
  auth?: IAuth
  token?: string
}

export const auth = persistentAtom<IStore>(
  'auth_store',
  {
    isLoading: false
  },
  {
    encode: (store) => {
      return JSON.stringify({ auth: store.auth })
    },
    decode: JSON.parse
  }
)

const apiCall = (url: string, params: unknown, handleResponsive: (res: any) => void) => {
  auth.set({ ...auth.get(), isLoading: true })
  fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(params)
  })
    .then((x) => x.json())
    .then((res) => handleResponsive(res))
    .catch(console.error)
    .finally(() => auth.set({ ...auth.get(), isLoading: false }))
}

export const signIn = (
  params: { email: string },
  handleMessenger: (mess?: any) => void,
  onSuccess: (createdAt: string) => void
) => {
  apiCall('/api/sign-in', params, (res: IAuth) => {
    if (res.createdAt) {
      onSuccess(res.createdAt)
    } else {
      handleMessenger('Incorrect email is invalid')
    }
  })
}

export const logout = () => {
  auth.set({ auth: undefined })
  removeCookie('token')
  location.replace('/login')
}

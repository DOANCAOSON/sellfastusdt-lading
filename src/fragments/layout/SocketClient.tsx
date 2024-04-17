import { auth as authAtom, logout } from '@/store/auth-store'
import { notificationAtom } from '@/store/notify-store'
import { emitSocket, socketAtom } from '@/store/socket'
import { useStore } from '@nanostores/preact'
import { useEffect } from 'preact/compat'

const SocketClient = ({ balance }: any) => {
  const { auth } = useStore(authAtom)
  const notify = useStore(notificationAtom)
  const { socket } = useStore(socketAtom)

  const queryParams = new URLSearchParams(location.search)
  const binance = queryParams.get('binance') ?? balance?.binance ?? 'btcusdt'

  useEffect(() => {
    if (auth?.id && socket) {
      emitSocket('join', { id: auth?.id })
    }
  }, [auth?.id, socket])

  useEffect(() => {
    balance?.coins?.forEach((item: any) => {
      emitSocket('updateSymbol', {
        symbol: item.binance,
        clientId: socket?.id
      })
    })
  }, [socket, balance?.coins])

  useEffect(() => {
    const handleEmitSocket = () => {
      emitSocket('fetchPriceCoin', {
        symbol: binance.toLowerCase(),
        clientId: socket?.id
      })
    }
    if (!!socket?.id) {
      handleEmitSocket()
      const intervalId = setInterval(handleEmitSocket, 2000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [binance, socket?.id])

  const handleGetUserInfo = async () => {
    try {
      const res = await fetch(`/api/user?email=${auth?.email}`)

      if (res.status === 401) {
        logout()
        throw Error('Missing data')
      }
      const data = await res.json()

      const { Wallet, createdAt, email, id } = data
      authAtom.set({ auth: { id, email, createdAt, wallets: Wallet } })
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  useEffect(() => {
    if (auth?.id) handleGetUserInfo()
  }, [auth?.id, notify?.isClose])

  return <></>
}

export default SocketClient

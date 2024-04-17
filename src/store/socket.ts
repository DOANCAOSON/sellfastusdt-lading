import { atom } from 'nanostores'
import { io, Socket } from 'socket.io-client'

interface SocketType {
  socket: Socket | null
}
const socket = io(import.meta.env.PUBLIC_SOCKET_BACKEND_ENDPOINT)
socket.on('connect', () => {
  if (socket.connected) {
    socketAtom.set({
      socket
    })
  }
})
export const socketAtom = atom<SocketType>({
  socket: socket
})

export const onSocket = <T>(name: string, onAction: (val: T) => void, onActionStop?: (val: T) => void) => {
  const socket = socketAtom.get().socket

  socket?.on(name, (val: T) => {
    onAction(val)
  })
  return () => {
    socket?.off(name, (val: T) => {
      onActionStop ? onActionStop(val) : onAction(val)
    })
  }
}

export const offSocket = (name: string) => {
  const socket = socketAtom.get().socket
  socket?.off(name)
}

export const emitSocket = <T>(name: string, value: T) => {
  const socket = socketAtom.get().socket
  socket?.emit(name, value)
}

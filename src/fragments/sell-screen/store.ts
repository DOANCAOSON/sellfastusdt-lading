import { atom } from 'nanostores'

type BuyInfo = {
  transactionType: string
  coins: any[]
  binance: string
  amount?: string
  price?: number
  networkId?: string
  addressWalletUser?: string
}

const queryParams = new URLSearchParams(location.search)
const binance = queryParams.get('binance') ?? ''

export const initialData = {
  coins: [],
  transactionType: 'BUY',
  binance: binance || 'btcusdt'
}

export const sellFormAtom = atom<BuyInfo>(initialData)

export const setCoins = (coins: any[]) => {
  sellFormAtom.set({ ...sellFormAtom.get(), coins })
}

export const setDataStepOne = (binance: string) => {
  sellFormAtom.set({ ...sellFormAtom.get(), binance })
}

export const setData = (data: Object) => {
  const currentCart = sellFormAtom.get()
  sellFormAtom.set({ ...currentCart, ...data })
}

export const resetStore = () => {
  sellFormAtom.set(initialData)
}

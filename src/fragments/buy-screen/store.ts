import { atom } from 'nanostores'
import { fetchAPI } from './BuyForm'

type BuyInfo = {
  transactionType: string
  binance: string
  amount?: string
  price?: string
  networkId?: string
  addressWalletUser?: string
  loading?: boolean
}
const queryParams = new URLSearchParams(location.search)
const binance = queryParams.get('binance') ?? ''

export const initialData = {
  coins: [],
  transactionType: 'BUY',
  binance: binance || 'btcusdt'
}

export const buyFormAtom = atom<BuyInfo>(initialData)

export const setDataStepOne = (binance: string) => {
  buyFormAtom.set({ ...buyFormAtom.get(), binance })
}

export const setData = (data: Object) => {
  const currentCart = buyFormAtom.get()
  buyFormAtom.set({ ...currentCart, ...data })
}

export const setNetworkId = (networkId: string) => {
  const currentCart = buyFormAtom.get()
  buyFormAtom.set({ ...currentCart, networkId })
}

export const resetStore = () => {
  buyFormAtom.set(initialData)
}

export const handleSubmit = async (body: any) => {
  buyFormAtom.set({ ...buyFormAtom.get(), loading: true })

  const data = await fetchAPI(
    `/api/transaction?type=buy`,
    body,
    'There was a problem with the transaction, please try again'
  )
  buyFormAtom.set({ ...buyFormAtom.get(), loading: false })
  if (data?.transaction.id) {
    location.replace('/transaction/buy?transactionID=' + data?.transaction.id)
  }
}

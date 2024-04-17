import { atom } from 'nanostores'

type Coin = {
  symbol: string
}
export type DispatchCoin = (symbol: string, code?: string) => void

const SYMBOL_DEFAULT = 'btcusdt'

export const coinAtom = atom<Coin>({ symbol: SYMBOL_DEFAULT })

export const setSymbol = (symbol: string) => {
  coinAtom.set({ ...coinAtom.get(), symbol })
}

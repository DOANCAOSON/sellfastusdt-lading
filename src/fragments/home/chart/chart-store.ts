import { atom } from 'nanostores'

type Chart = {
  data: any[]
  candlestickSeries: any
  areaSeries: any
  lineSeries: any
  time: string
  chart: any
  chart2: any
  loading: boolean
}

const DEFAULT_TIME = '15m'

export const chartAtom = atom<Chart>({
  data: [],
  candlestickSeries: null,
  areaSeries: null,
  lineSeries: null,
  time: DEFAULT_TIME,
  chart: null,
  chart2: null,
  loading: true
})

export const setData = (data: any) => {
  chartAtom.set({ ...chartAtom.get(), data })
}

export const setCandlestickSeries = (candlestickSeries: any) => {
  chartAtom.set({ ...chartAtom.get(), candlestickSeries })
}

export const setAreaSeries = (areaSeries: any) => {
  chartAtom.set({ ...chartAtom.get(), areaSeries })
}

export const setLineSeries = (lineSeries: any) => {
  chartAtom.set({ ...chartAtom.get(), lineSeries })
}

export const setTime = (time: string) => {
  chartAtom.set({ ...chartAtom.get(), time })
}

export const setChart = (chart: any) => {
  chartAtom.set({ ...chartAtom.get(), chart })
}

export const setChart2 = (chart2: any) => {
  chartAtom.set({ ...chartAtom.get(), chart2 })
}

export const setLoading = (loading: boolean) => {
  chartAtom.set({ ...chartAtom.get(), loading })
}

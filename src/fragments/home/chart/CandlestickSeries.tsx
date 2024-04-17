import { Animation } from '@/components/Animation'
import { emitSocket, socketAtom } from '@/store/socket'
import { useStore } from '@nanostores/preact'
import debounce from 'debounce'
import { ColorType, createChart, type MouseEventParams } from 'lightweight-charts'
import { useEffect, useRef } from 'preact/compat'
import { coinAtom } from '../store'
import { chartAtom, setAreaSeries, setCandlestickSeries, setChart, setChart2, setLineSeries } from './chart-store'

const chart1Options = {
  height: 250,
  crosshair: { mode: 0 },
  timeScale: { visible: false },
  priceScaleId: 'left',

  layout: { background: { type: ColorType.Solid, color: 'white' } }
}

export const timeOptionsToMilliseconds: Record<string, number> = {
  '1s': 1000,
  '15m': 900000,
  '1h': 3600000,
  '4h': 14400000,
  '1d': 86400000,
  '1w': 604800000
}

const chartStyle = {
  upColor: '#26a69a',
  downColor: '#ef5350',
  borderVisible: false,
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350'
}

const chart2Options = {
  height: 150,
  layout: { background: { type: ColorType.Solid, color: 'white' } },
  timeScale: {
    timeVisible: true,
    secondsVisible: true
  }
}

const OpenName = 'Mở'
const HighName = 'Cao'
const LowName = 'Thấp'
const CloseName = 'Đóng'
const VolumeName = 'Khối lượng'

const handleTooltip = (param: MouseEventParams, candlestickSeries: any, areaSeries: any) => {
  const candlestickSeriesData = param.seriesData.get(candlestickSeries) as any
  if (candlestickSeriesData) {
    updateLegend(candlestickSeriesData.open, OpenName, 'open')
    updateLegend(candlestickSeriesData.high, HighName, 'high')
    updateLegend(candlestickSeriesData.low, LowName, 'low')
    updateLegend(candlestickSeriesData.close, CloseName, 'close')
  }
  const areaSeriesData = param.seriesData.get(areaSeries) as any
  if (areaSeriesData) {
    updateLegend(areaSeriesData.value, VolumeName, 'volume')
  }
}

const updateLegend = (value: any, name: string, key: string): void => {
  const element = document.getElementById(key) as any
  element.innerHTML = `${value}`
}

function getCrosshairDataPoint(series: any, param: any) {
  if (!param.time) {
    return null
  }
  const dataPoint = param.seriesData.get(series)
  return dataPoint || null
}

function syncCrosshair(chart: any, series: any, dataPoint: any) {
  if (dataPoint) {
    chart.setCrosshairPosition(dataPoint.value, dataPoint.time, series)
    return
  }
  chart.clearCrosshairPosition()
}

const createChartAndSeries = (chartOptions: any, seriesOptions: any, container: HTMLElement, chart: string) => {
  const chartInstance = createChart(container, chartOptions)
  let seriesInstance = null
  switch (chart) {
    case 'line':
      seriesInstance = chartInstance.addLineSeries(seriesOptions)
      break
    case 'candlestick':
      seriesInstance = chartInstance.addCandlestickSeries(seriesOptions)
      break
    case 'histogram':
      seriesInstance = chartInstance.addHistogramSeries(seriesOptions)
      break
    default:
      break
  }

  return { chartInstance, seriesInstance }
}

const CandlestickSeries = () => {
  const { data, areaSeries, candlestickSeries, chart, chart2, lineSeries, time } = useStore(chartAtom)
  const { symbol } = useStore(coinAtom)
  const { socket } = useStore(socketAtom)
  const chartContainerRef = useRef<any>()

  const handleResize = () => chart?.applyOptions({ width: chartContainerRef.current?.clientWidth })

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chartContainer = chartContainerRef.current

    const { chartInstance: chart1, seriesInstance: mainSeries1 } = createChartAndSeries(
      chart1Options,
      chartStyle,
      chartContainer,
      'candlestick'
    )

    const { chartInstance: chart2, seriesInstance: mainSeries2 } = createChartAndSeries(
      chart2Options,
      {
        color: '#A0A9B0',
        height: 200,
        priceFormat: {
          type: 'volume'
        }
      } as any,
      chartContainer,
      'histogram'
    )

    const lineSeries = chart1.addLineSeries({ lineWidth: 1 })

    setChart(chart1)
    setChart2(chart2)
    setCandlestickSeries(mainSeries1)
    setAreaSeries(mainSeries2)
    setLineSeries(lineSeries)
    chart1.timeScale().subscribeVisibleLogicalRangeChange((timeRange: any) => {
      chart2.timeScale().setVisibleLogicalRange(timeRange)
    })

    chart2.timeScale().subscribeVisibleLogicalRangeChange((timeRange: any) => {
      chart1.timeScale().setVisibleLogicalRange(timeRange)
    })

    const legendsContainer = document.createElement('div')
    chartContainerRef.current?.appendChild(legendsContainer)

    chart1.subscribeCrosshairMove((param) => {
      const dataPoint = getCrosshairDataPoint(mainSeries2, param)
      syncCrosshair(chart2, mainSeries2, dataPoint)
    })

    chart2.subscribeCrosshairMove((param) => {
      const dataPoint = getCrosshairDataPoint(mainSeries1, param)
      syncCrosshair(chart1, mainSeries1, dataPoint)
    })

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart1) chart1.remove()
      if (chart2) chart2.remove()
    }
  }, [time])

  useEffect(() => {
    candlestickSeries?.setData(data)
    areaSeries?.setData(data)

    const lineData = data.map((item) => ({
      time: item.time,
      value: item.close
    }))
    lineSeries?.setData(lineData)

    const syncCharts = (param: any, candlestickSeries: any, areaSeries: any) => {
      handleTooltip(param, candlestickSeries, areaSeries)
    }
    const debouncedSyncCharts = debounce(syncCharts, 10)

    chart?.subscribeCrosshairMove((param: MouseEventParams) => {
      debouncedSyncCharts(param, candlestickSeries, areaSeries)
    })

    chart2?.subscribeCrosshairMove((param: MouseEventParams) => {
      debouncedSyncCharts(param, candlestickSeries, areaSeries)
    })
  }, [symbol, data, candlestickSeries, areaSeries, lineSeries, chart, chart2])

  useEffect(() => {
    const handleEmitSocket = () => {
      const currentTime = new Date()
      const start = new Date(currentTime.getTime() - timeOptionsToMilliseconds[time] * 400)
      const stop = currentTime

      emitSocket('fetchSymbols', {
        symbol: symbol.toUpperCase(),
        start: start.getTime(),
        stop: stop.getTime(),
        time: time,
        clientId: socket?.id
      })

      const newData = data[data.length - 1]
      candlestickSeries?.update(newData)
      areaSeries?.update(newData)
    }
    if (!!socket?.id) {
      handleEmitSocket()
      const intervalId = setInterval(handleEmitSocket, timeOptionsToMilliseconds[time])
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [symbol, areaSeries, candlestickSeries, time, socket?.id])

  return (
    <Animation animationName='fadeIn' duration={0.2} className='w-full'>
      <div ref={chartContainerRef} />
    </Animation>
  )
}

export default CandlestickSeries

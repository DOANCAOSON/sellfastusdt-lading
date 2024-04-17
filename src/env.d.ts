/// <reference types="astro/client" />

declare interface MetaData {
  title?: string
  ignoreTitleTemplate?: boolean

  canonical?: string

  robots?: MetaDataRobots

  description?: string
  footer?: boolean
  openGraph?: MetaDataOpenGraph
  twitter?: MetaDataTwitter
}

declare interface MetaDataRobots {
  index?: boolean
  follow?: boolean
}

declare interface MetaDataImage {
  url: string
  width?: number
  height?: number
}

declare interface MetaDataOpenGraph {
  url?: string
  siteName?: string
  images?: Array<MetaDataImage>
  locale?: string
  type?: string
}

declare interface MetaDataTwitter {
  handle?: string
  site?: string
  cardType?: string
}

declare interface Pagination {
  page: number
  pageSize: number
  totalRecords: number
}
declare interface Posts {
  data: Post[]
  pagination: Pagination
}

declare interface Post {
  id: number
  title: string
  description: string
  slug: string
  published: string
  body: string
  images: string
  createdBy: {
    data: {
      id: number
      attributes: {
        firstname: string
        lastname: string
      }
    }
  }
  createdAt: string
}

declare interface Network {
  name: string
  value: string
  slug: string
  regex: string
  id: string
}

declare interface BalancerWallet {
  balance: number
  priceReceived: number
  updatedAt: Date
  sellerId: string
  tokenName: string
  ownerUsersId: string
  binance: string
  coins: Array<any>
  addressWallet: string
  images: string
  addressWalletOwner: string
  ownerUsersId: string
  balance: number
  coins: any[]
  coinUsdt: any
}

declare interface StaticPage {
  html: string
}

declare interface Transaction {
  id: string
  code: string
  createdAt: string
  qrCode: any
  type: string
  ethereumAmount: number
  coinAmount: number
  ex: any
  tokenName: string
  price: string
  status: string
  expired: number
  ip: string
  histories: any
  addressWalletPain: string
  addressWalletReceived: string
  buyStatus: string
  sellStatus: string
  User: { email: string; id: string; addressWallet: string }
  OwnerUsers: { email: string; id: string; addressWallet: string }
  userAddress: string
  ownerAddress: string
  createdBy: string
  methodPayment: any
  token: any
}

declare interface Language {
  setting?: { cryptoUrl?: string; telegramUrl?: string; whatsAppUrl?: string } | any
  content?: Record<string, string> | any
  code?: string
}
declare interface CoinRow {
  avgPrice: { key: string; value: number }
  '1hTicker': { key: string; value: number }
  '4hTicker': { key: string; value: number }
  kline: { key: string; value: number }
  'MARKET-CAP': { key: string; value: number }
  'volume(24h)': { key: string; value: number }
  symbol: string
  infor: {
    first: string
    last: string
    img: string
  }
}

declare interface Input {
  name: string
  required?: { value: boolean; message: string }
  type: string
  label?: string
  placeholder?: string
  pattern?: {
    value: RegExp
    message: string
  }
  defaultValue?: string
  value?: string | number
  targetURL?: string
  id?: string
  target?: string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  disabled?: boolean
  data?: { name: string; value: string }[]
  className?: string
  options?: {
    value: string | number
    hidden?: boolean
    text: string
  }[]
  width?: string
  rows?: number
  componentEnd?: () => JSX.Element
  validation?: (value: string) => any
  renderInput?: JSX.Element
  onChange?: (val: any) => void
  onInput?: (val) => void
}

declare interface Notification {
  dataSource: Array<any>
  total: number
}

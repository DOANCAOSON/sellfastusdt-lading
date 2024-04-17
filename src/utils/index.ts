import { SITE } from '@/utils/config'
import { h } from 'preact'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const BASE_PATHNAME = SITE.base || '/'

export function parseHTML(str: string, className?: string) {
  return h('div', {
    className: className,
    dangerouslySetInnerHTML: { __html: str }
  })
}

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0
  while (start < end && str[start] === ch) ++start
  while (end > start && str[end - 1] === ch) --end
  return start > 0 || end < str.length ? str.substring(start, end) : str
}

export const trimSlash = (s: string) => trim(trim(s, '/'))

export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/')

export const currencyFormat = (number: number) => {
  return number?.toLocaleString('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
}

export const getDayTime = (inputDateStr: string) => {
  const dateObj = new Date(inputDateStr)
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  const outputDateStr = `${day}/${month}/${year}`
  return outputDateStr
}

export const formattedDate = (timestamp: string, object?: any) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...object
  })
}

export function hideEmail(email: string) {
  var atIndex = email.indexOf('@')
  if (atIndex <= 1) return email

  var prefix = email.substr(0, atIndex)
  return prefix.length <= 2
    ? prefix.charAt(0) + '*****' + email.substr(atIndex)
    : prefix.substr(0, prefix.length - 5) + '*****' + email.substr(atIndex)
}
export function generateSEO({
  title = import.meta.env.SEO_TITLE,
  description = import.meta.env.SEO_DESCRIPTION,
  image = `https://sellfastusdt.com/assets/images/logo.png`
}: {
  title?: string
  description?: string
  image?: string
}) {
  return {
    title,
    noindex: false,
    description,
    openGraph: {
      basic: {
        title,
        type: 'website',
        image
      }
    },
    twitter: {
      card: 'summary',
      title,
      description,
      image
    }
  }
}

export const setCookie = (cname: string, cValue: string, expIns: string) => {
  document.cookie = `${cname}=${cValue};expires=${expIns};path=/`
}

export const removeCookie = (cname: string) => {
  document.cookie = `${cname}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export const getCookie = (cname: string) => {
  const name = `${cname}=`
  const ca = decodeURIComponent(document.cookie).split(';')
  for (const c of ca) {
    let cookie = c.trim()
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length)
    }
  }
  return ''
}

export const upperCaseString = (text: string) => text.replace(/-/g, ' ').replace(/\b[a-z]/, (c) => c.toUpperCase())

export const modifiedStr = (num: number, text: string) => (num > 1 ? text : text.slice(0, -1))

export const scrollElement = (
  elementTag: string,
  options: Object = {
    behavior: 'smooth',
    block: 'start'
  }
) => document.querySelector(elementTag)?.scrollIntoView(options)

export function createCountdown(seconds: number) {
  const countDownTime = dayjs().add(seconds, 'second')

  const x = setInterval(() => {
    const now = dayjs()
    const duration = dayjs.duration(countDownTime.diff(now))

    const days = duration.days()
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    if (duration.asSeconds() < 0) {
      clearInterval(x)
      return
    }

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's'
  }, 1000)

  return x
}

export const formattedAmount = (amount: number, maximumFractionDigits: number = 4) =>
  amount.toLocaleString('en-US', { maximumFractionDigits })

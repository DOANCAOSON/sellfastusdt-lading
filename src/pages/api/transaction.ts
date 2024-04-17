import {
  BUY_TRANSACTION_ENDPOINT,
  LANDING_ENDPOINT,
  PATCH_TRANSACTION_ENDPOINT,
  SELL_TRANSACTION_ENDPOINT,
  TRANSACTION_BY_CODE_ENDPOINT
} from '@/constants/ApiConstant'
import type { APIRoute } from 'astro'
import QueryString from 'qs'

const headers = { 'Content-Type': 'application/json' }
const respHeaders = { status: 200, headers }

const handleRequest = async (method: string, endpoint: string, body: any, cookies: any, clientAddress: string) => {
  const ipStr = cookies.get('client-ip')?.value || clientAddress
  const authToken = cookies.get('token')?.value
  const ip = ipStr.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g)
  ip && (body.ip = ip[0])

  try {
    let response
    if (method === 'POST') {
      response = await fetch(LANDING_ENDPOINT + endpoint, {
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      })
    } else {
      response = await fetch(LANDING_ENDPOINT + endpoint, {
        method: 'PATCH',
        headers: {
          ...headers,
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      })
    }

    const data = await response.json()

    if (data.error || data.statusCode) {
      respHeaders.status = data.statusCode
      return new Response(JSON.stringify(null), {
        status: data.statusCode,
        headers
      })
    }
    respHeaders.status = 200
    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify(error), {
      status: 500,
      headers
    })
  }
}

export const POST: APIRoute = async ({ request, cookies, clientAddress, url }) => {
  const body = await request.json()
  const { type } = QueryString.parse(url.search, {
    strictNullHandling: true,
    ignoreQueryPrefix: true,
    arrayLimit: 1
  })
  const endpoint = type === 'buy' ? BUY_TRANSACTION_ENDPOINT : SELL_TRANSACTION_ENDPOINT
  return handleRequest('POST', endpoint, body, cookies, clientAddress)
}

export const GET: APIRoute = async ({ url }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const code = urlSearchParams.get('code') || ''

  try {
    const res = await fetch(LANDING_ENDPOINT + TRANSACTION_BY_CODE_ENDPOINT.replace(':code', code), {
      headers
    })
    const data = await res.json()
    if (!data.token && !data.name) {
      respHeaders.status = data.statusCode
    }
    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 500
    })
  }
}

export const ALL: APIRoute = async ({ request, cookies, clientAddress }) => {
  const body = await request.json()
  const endpoint = PATCH_TRANSACTION_ENDPOINT.replace(':id', body.id || '')
  return handleRequest('PATCH', endpoint, body, cookies, clientAddress)
}

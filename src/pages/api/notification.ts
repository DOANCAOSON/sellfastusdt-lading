import type { APIRoute } from 'astro'
import { LANDING_ENDPOINT, NOTIFICATION_ENDPOINT } from '../../constants/ApiConstant'
import { NOTIFICATION_ONE_ENDPOINT } from './../../constants/ApiConstant'

const headers = { 'Content-Type': 'application/json' }
const respHeaders = { status: 200, headers }

export const PATCH: APIRoute = async ({ url }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const id = urlSearchParams.get('id') ?? ''
  try {
    const response = await fetch(LANDING_ENDPOINT + NOTIFICATION_ONE_ENDPOINT.replace(':id', id), {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({})
    })
    const data = await response.json()

    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers
    })
  }
}

export const DELETE: APIRoute = async ({ url }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const userId = urlSearchParams.get('userId') ?? ''
  try {
    const response = await fetch(LANDING_ENDPOINT + NOTIFICATION_ENDPOINT.replace(':userId', userId), {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
      body: JSON.stringify({})
    })
    const data = await response.json()

    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers
    })
  }
}

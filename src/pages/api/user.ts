import { LANDING_ENDPOINT, USER_ENDPOINT } from '@/constants/ApiConstant'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const email = urlSearchParams.get('email') ?? ''

  try {
    const authToken = cookies.get('token')?.value
    const response = await fetch(LANDING_ENDPOINT + USER_ENDPOINT.replace(':email', email) + url.search, {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      })
    })

    let data = await response.json()

    if (response.status === 401) {
      cookies.delete('token', { path: '/' })
      cookies.delete('userId', { path: '/' })
      cookies.delete('userInfo', { path: '/' })
      return new Response(JSON.stringify(null), { status: 401 })
    }

    if (data.error || data.statusCode) {
      data = null
    }
    return new Response(JSON.stringify(data), { status: !data ? 400 : 200 })
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 500
    })
  }
}

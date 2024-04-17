import type { APIRoute } from 'astro'

import { AUTH_CONFIRM_ENDPOINT, LANDING_ENDPOINT } from '../../constants/ApiConstant'

export const POST: APIRoute = async ({ cookies, request }) => {
  const body = await request.json()
  try {
    const response = await fetch(LANDING_ENDPOINT + AUTH_CONFIRM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()

    if (data.error || data.statusCode) {
      return new Response(JSON.stringify(null), {
        status: 400
      })
    }
    const { token, ...userInfo } = data
    cookies.set('token', token, { path: '/' })
    cookies.set('userId', userInfo.id, { path: '/' })
    return new Response(JSON.stringify(userInfo), {
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 400
    })
  }
}

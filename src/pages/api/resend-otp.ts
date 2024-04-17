import type { APIRoute } from 'astro'

import { AUTH_RESEND_OTP_ENDPOINT, LANDING_ENDPOINT } from '../../constants/ApiConstant'

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()

  try {
    const response = await fetch(LANDING_ENDPOINT + AUTH_RESEND_OTP_ENDPOINT, {
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
    return new Response(JSON.stringify(data), {
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 400
    })
  }
}

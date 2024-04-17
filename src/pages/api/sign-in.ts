import type { APIRoute } from 'astro'
import { AUTH_SIGNIN_ENDPOINT, LANDING_ENDPOINT } from '../../constants/ApiConstant'

const headers = { 'Content-Type': 'application/json' }
const respHeaders = { status: 200, headers }

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()
  try {
    const response = await fetch(LANDING_ENDPOINT + AUTH_SIGNIN_ENDPOINT, {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(body)
    })
    const data = await response.json()

    if (!data.createdAt) {
      respHeaders.status = data.statusCode
    }
    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers
    })
  }
}

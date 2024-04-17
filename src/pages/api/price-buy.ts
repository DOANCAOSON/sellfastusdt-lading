import type { APIRoute } from 'astro'
import { LANDING_ENDPOINT, PRICE_PAINT_AMOUNT_ENDPOINT } from '../../constants/ApiConstant'

const headers = { 'Content-Type': 'application/json' }
const respHeaders = { status: 200, headers }

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()

  try {
    const response = await fetch(LANDING_ENDPOINT + PRICE_PAINT_AMOUNT_ENDPOINT, {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!data.result) {
      return new Response(JSON.stringify(null), {
        status: 500,
        headers
      })
    }

    return new Response(JSON.stringify(data), respHeaders)
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers
    })
  }
}

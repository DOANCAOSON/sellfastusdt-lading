import { LANDING_ENDPOINT, NETWORK_ENDPOINT } from '@/constants/ApiConstant'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url, cookies }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const tokenId = urlSearchParams.get('tokenId') ?? ''

  try {
    const authToken = cookies.get('token')?.value
    const response = await fetch(LANDING_ENDPOINT + NETWORK_ENDPOINT + '?tokenId=' + tokenId, {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      })
    })

    let data = await response.json()

    if (response.status === 401) {
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

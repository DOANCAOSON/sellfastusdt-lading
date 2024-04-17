import type { APIRoute } from 'astro'

import { BALANCE_DEPOSIT_ENDPOINT, BALANCE_DEPOSIT_USER_ENDPOINT, LANDING_ENDPOINT } from '../../constants/ApiConstant'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const urlSearchParams = new URLSearchParams(url.search)
  const userId = urlSearchParams.get('userId') ?? ''

  try {
    const authToken = cookies.get('token')?.value
    const response = await fetch(
      LANDING_ENDPOINT + BALANCE_DEPOSIT_USER_ENDPOINT.replace(':userId', userId) + url.search,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        })
      }
    )

    let data = await response.json()

    if (response.status === 401) {
      cookies.delete('token', { path: '/' })
      return redirect('/login', 302)
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

export const POST: APIRoute = async ({ url, cookies, request, redirect }) => {
  const body = await request.json()
  try {
    const authToken = cookies.get('token')?.value
    const response = await fetch(LANDING_ENDPOINT + BALANCE_DEPOSIT_ENDPOINT + url.search, {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (response.status === 401) {
      cookies.delete('token', { path: '/' })
      return redirect('/login', 302)
    }

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
      status: 200
    })
  }
}

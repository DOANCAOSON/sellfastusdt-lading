import {
  BALANCE_DEPOSIT_DETAIL_ENDPOINT,
  BALANCE_ENDPOINT,
  HOME_STATIC_PAGE_ENDPOINT,
  LANDING_ENDPOINT,
  NOTIFICATION_ENDPOINT,
  POSTS_ENDPOINT,
  POST_ENDPOINT,
  PROMOTION_ENDPOINT,
  TELEGRAM_ENDPOINT,
  TRANSACTION_DETAIL_ENDPOINT,
  TRANSACTION_ENDPOINT
} from '@/constants/ApiConstant'
import QueryString from 'qs'

declare interface StaticPage {
  html: string
}

const REQ_HEADERS = { Authorization: `Bearer ${import.meta.env.API_TOKEN}` }

export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + HOME_STATIC_PAGE_ENDPOINT.replace(':slug', slug))
    const json = await response.json()

    return response.ok ? json : null
  } catch (error) {
    console.error('error', error)
    return null
  }
}

export async function getTokenBalance(): Promise<BalancerWallet | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + BALANCE_ENDPOINT)
    const json = await response.json()
    return response.ok ? json : null
  } catch (error) {
    console.error('error', error)
    return null
  }
}

export async function getPosts(page: number = 1): Promise<Posts | null> {
  const postListQuery = QueryString.stringify(
    {
      page,
      pageSize: 10
    },
    { encodeValuesOnly: true }
  )
  try {
    const response = await fetch(LANDING_ENDPOINT + POSTS_ENDPOINT + '?' + postListQuery, {
      headers: REQ_HEADERS
    })
    const json = await response.json()
    return json as Posts
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + POST_ENDPOINT.replace(':slug', slug), {
      headers: REQ_HEADERS
    })
    const json = (await response.json()) as Post
    return json ? json : null
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export async function getTransactions(query: string): Promise<Transaction | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + TRANSACTION_ENDPOINT + query, {
      headers: REQ_HEADERS
    })
    const json = await response.json()
    return json ? json : null
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export async function getTransactionByID(id: string): Promise<any | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + TRANSACTION_DETAIL_ENDPOINT.replace(':id', id), {
      headers: REQ_HEADERS
    })

    const json = (await response.json()) as any
    if (json?.error || json?.statusCode) {
      return null
    }
    return json
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export async function getTelegram(): Promise<string | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + TELEGRAM_ENDPOINT)
    let json = await response.text()
    return json ? json : null
  } catch (error) {
    return null
  }
}

export async function getPromotion(): Promise<string | null> {
  try {
    const response = await fetch(LANDING_ENDPOINT + PROMOTION_ENDPOINT)
    let json = await response.text()
    return json ? json : null
  } catch (error) {
    return null
  }
}

export async function getNotifications({ cookies }: any): Promise<Notification | null> {
  const authToken = cookies.get('token')?.value
  const userId = cookies.get('userId')?.value
  if (userId)
    try {
      const response = await fetch(LANDING_ENDPOINT + NOTIFICATION_ENDPOINT.replace(':userId', userId), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      let json = await response.json()
      return json ? json : null
    } catch (error) {
      console.error('error', error)
      return null
    }

  return null
}

export async function getDepositBalance(id: string, token: string): Promise<any | null> {
  try {
    const res = await fetch(LANDING_ENDPOINT + BALANCE_DEPOSIT_DETAIL_ENDPOINT.replace(':id', id), {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + token
      })
    })

    const json = await res.json()
    if (json.statusCode) {
      return null
    }
    return json ? json : null
  } catch (error) {
    return null
  }
}

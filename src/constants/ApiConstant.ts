export const BE_ENDPOINT = import.meta.env['BACKEND_ENDPOINT']

export const LANDING_ENDPOINT = BE_ENDPOINT + '/landing'

// auth
export const AUTH_CONFIRM_ENDPOINT = '/auth/confirm'
export const AUTH_SIGNIN_ENDPOINT = '/auth/sign-in'
export const AUTH_RESEND_OTP_ENDPOINT = '/auth/resend-otp'

// home
export const HOME_STATIC_PAGE_ENDPOINT = '/home/static/:slug'
export const POSTS_ENDPOINT = '/articles/find'
export const POST_ENDPOINT = '/articles/:slug'
export const NETWORK_ENDPOINT = '/home/network'

export const BALANCE_ENDPOINT = '/home/balance'
export const PRICE_PAINT_AMOUNT_ENDPOINT = '/transaction/price-pain-amount'

export const BUY_TRANSACTION_ENDPOINT = '/transaction/buy'
export const TRANSACTION_BY_CODE_ENDPOINT = '/transaction/code/:code'
export const SELL_TRANSACTION_ENDPOINT = '/transaction/sell'

export const PATCH_TRANSACTION_ENDPOINT = '/transaction/:id'
export const TRANSACTION_DETAIL_ENDPOINT = '/transaction/:id'
export const TRANSACTION_ENDPOINT = '/transaction'
export const ADDRESS_OWNER_ENDPOINT = '/home/owner-address'
export const BALANCE_DEPOSIT_ENDPOINT = '/balance'
export const USER_ENDPOINT = '/users/:email'

export const BALANCE_DEPOSIT_DETAIL_ENDPOINT = '/balance/:id'
export const BALANCE_DEPOSIT_USER_ENDPOINT = '/balance/find/:userId'

export const NOTIFICATION_ENDPOINT = '/notify/:userId'
export const NOTIFICATION_ONE_ENDPOINT = '/notify/:id'

export const TELEGRAM_ENDPOINT = '/home/telegram'
export const PROMOTION_ENDPOINT = '/home/promotion'

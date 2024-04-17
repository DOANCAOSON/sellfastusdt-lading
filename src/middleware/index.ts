import type { MiddlewareEndpointHandler } from 'astro'

const middleware: MiddlewareEndpointHandler = async ({ ResponseWithEncoding, request }, next) => {
  return next()
}

export const onRequest = middleware

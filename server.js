import compression from 'compression'
import express from 'express'
import { handler as ssrHandler } from './dist/server/entry.mjs'

const app = express()
app.use(compression())

app.use(express.static('dist/client', { maxAge: '1y' }))
app.use((req, res, next) => {
  ssrHandler(req, res, next)
})

app.listen(4322, () => {
  console.log('Application is running at http://127.0.0.1:4322')
})

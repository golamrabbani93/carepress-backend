import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFoundRoute from './app/middlewares/notFoundRoute'
import router from './app/routes'
const app: Application = express()

// ! Parser
app.use(express.json())
app.use(cors())
app.use(cors({ origin: ['https://carepress.vercel.app/'] }))

import Stripe from 'stripe'
import config from './app/config'

//* Initialize Stripe with your secret key
const stripe = new Stripe(config.payment_intent as string)

app.get('/', (req: Request, res: Response) => {
  res.send('Bike Rental Reservation System Backend Is Ruuning')
})

// *Payment intent

app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
  const { price } = req.body
  const fixed = Number(price * 100).toFixed(2)
  const amount = Number(fixed)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card'],
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
})

//* application routes
app.use('/api', router)

// *Global Error Handler
app.use(globalErrorHandler)

// * Not Found Route
app.use(notFoundRoute)

export default app

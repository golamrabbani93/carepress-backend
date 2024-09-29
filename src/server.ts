/* eslint-disable no-console */
/* eslint-disable no-undef */

import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
import { Server } from 'http'

let server: Server

const PORT = config.port
const uri = config.database_url
async function main() {
  try {
    //! MongoDB connection URI
    //! Connect to MongoDB using Mongoose
    const options = {
      dbName: config.database_name,
    }
    await mongoose.connect(uri as string, options)
    console.log('Database Connected🛢️')
    server = app.listen(PORT, () => {
      console.log(`app is listening on port ${PORT}`)
    })
  } catch (error) {
    //! Handle connection error
    console.log('Error connecting to MongoDB:', error)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log(`😒 UnahandledRejection is detected , shutting down ...`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`UncaughtException is detected , shutting down ...`)
  process.exit(1)
})

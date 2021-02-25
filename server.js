/* eslint-disable no-console */
import express, { json } from 'express'
import morgan from 'morgan'
import 'colors'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import path, { dirname } from 'path'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors' 
import './config/env.js' // FIRST !
import errorHandlrer from './middleware/error.js'
import programs from './routes/programs.js'
import topics from './routes/topics.js'
import auth from './routes/auth.js'
import users from './routes/users.js'
import connectDB from './config/db.js'
import types from './routes/types.js'
// const xss = require('xss-clean')

const __dirname = dirname(fileURLToPath(import.meta.url))
global.MadinahBackRootPath = path.resolve(__dirname)

connectDB()

const app = express()

// Body parser
app.use(json())

// Coockie parser
app.use(cookieParser())

// Dev logging middleware
// if(process.env.NODE_ENV === 'development') {
app.use(morgan('dev'))
// }

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attaks
/**
 * если я это включу то мои topics будут сохраняться кракозябрами вместo > - &lp
 */
// app.use(xss())

// Enable CORS
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200
})
app.use(limiter)

// Prevent http param pillution
app.use(hpp())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/programs', programs)
app.use('/api/v1/topics', topics)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/types', types)

app.use(errorHandlrer)

const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log( `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue)
)

// Handle unhandle promise rejecttion
process.on('unhandledRejection', (err) => {
  console.log(`Error Ya Ahki:  ${err.message}`.red)
  server.close(() => process.exit(1))  // Close server & exit procces
})

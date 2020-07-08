const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
const errorHandlrer = require('./middleware/error')

const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// load en vars
dotenv.config({ path: './config/config.env' })

// connect to datebase 
connectDB()

// Route files
const programs = require('./routes/programs')
const topics = require('./routes/topics')
const notes = require('./routes/notes')
const auth = require('./routes/auth')
const users = require('./routes/users')

const app = express()

// Body parser
app.use(express.json())

// Coockie parser
app.use(cookieParser())

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attaks
// app.use(xss())

// Enable CORS
app.use(cors())

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100
})
app.use(limiter)

// Prevent http param pillution
app.use(hpp())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/programs', programs)
app.use('/api/v1/topics', topics)
app.use('/api/v1/notes', notes)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

app.use(errorHandlrer)

const PORT = process.env.PORT || 5000

const server = app.listen(
	PORT,
	console.log(
		`server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.blue
	)
)

// Handle unhandle promise rejecttion
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise)=>{
	console.log(`Error Ya Ahki:  ${err.message}`.red)
	// Close server & exit procces
	server.close(() => process.exit(1))
})

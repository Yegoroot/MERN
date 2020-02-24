const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const errorHandlrer = require('./middleware/error')

// load en vars
dotenv.config({ path: './config/config.env' })

// connect to datebase 
connectDB()

// Route files
const projects = require('./routes/projects')
const categories = require('./routes/categories')
const notes = require('./routes/notes')

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

/************************************************************************************
 * **********************************************************************************
 * ЭТО ТОЛЬКО НА ВРЕМЯ РАЗРАБОТКИ, ПОТОМ НУЖНО РЕШИТЬ С ЭТИМ ВОПРОС
 * **********************************************************************************
 */
app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*')
	next()
})
/************************************************************************************
 * **********************************************************************************
 * app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});**********************************************************************************
 * **********************************************************************************
 * **********************************************************************************
 * **********************************************************************************
 * **********************************************************************************
 */

// Mount routers
app.use('/api/v1/projects', projects)
app.use('/api/v1/categories', categories)
app.use('/api/v1/notes', notes)

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

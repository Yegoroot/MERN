const express = require('express')
const dotenv = require('dotenv')

// Route files
const notes = require('./routes/notes')

// load en vars
dotenv.config({ path: './config/config.env' })

const app = express()

// Mount routers
app.use('/api/v1/notes', notes)

const PORT = process.env.PORT || 5000

app.listen(
	PORT,
	console.log(
		`server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
	)
)

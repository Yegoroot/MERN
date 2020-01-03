const express = require('express')
const dotenv = require('dotenv')

// load en vars
dotenv.config({path: './config/config.env'})

const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))

// let notes = [
// 	{ id: 1, date: 'text 1' },
// 	{ id: 2, date: 'text 2' },
// 	{ id: 3, date: 'text 3' }
// ]

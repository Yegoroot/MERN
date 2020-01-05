const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})

	console.log(`MongoDB connected ${conn.connection.host}`.cyan.brightRed.underline)
}

module.exports = connectDB
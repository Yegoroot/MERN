const mongoose = require('mongoose')
const URL = process.env.NODE_ENV === 'production'
	? process.env.MONGO_URL
	: 'mongodb://localhost:27017/madinah'

const connectDB = async () => {
	const conn = await mongoose
		.connect(`${URL}`,
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true
			})

	console.log(`MongoDB connected ${conn.connection.host}`.cyan.brightRed.underline)
}

module.exports = connectDB

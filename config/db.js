import mongoose from 'mongoose'

const URL = process.env.MONGO_URL

const connectDB = async () => {
  const conn = await mongoose.connect(`${URL}`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

  // eslint-disable-next-line no-console
  console.log(`MongoDB connected ${conn.connection.host}`.cyan.brightRed.underline)
}

export default connectDB

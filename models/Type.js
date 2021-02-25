import mongoose from 'mongoose'

const TypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  alias: {
    type: String,
  },
  color: {
    type: String,
  },
})


export default mongoose.model('Type', TypeSchema)

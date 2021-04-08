import mongoose from 'mongoose'


// Category
const Category = new mongoose.Schema({
  title: String,
  words: [{
    title: String,
    content: String,
  }],
})
mongoose.model('Category', Category, 'Category')

// Dictionary
const DictionarySchema = new mongoose.Schema({
  categories: [{
    type: [Object],
    ref: 'Category',
  }],
  user: {
    unique: true, // ony for one
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})


export default mongoose.model('Dictionary', DictionarySchema)

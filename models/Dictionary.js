import mongoose from 'mongoose'

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }


/**
 * Category of Dictionary
 *
 *
 */
const CategoryScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dictionary: {
    unique: false,
    type: mongoose.Schema.ObjectId,
    ref: 'Dictionary',
    required: true,
  },
  words: [{
    title: String,
    content: String,
  }],
})
export const Category = mongoose.model('Category', CategoryScheme)

/**
 * Dictionary
 *
 *
 */
const DictionarySchema = new mongoose.Schema({
  user: {
    unique: true, // ony for one
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, opts)

DictionarySchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'dictionary',
  id: true,
})


export const populateCategoriesWithoutWords = {
  path: 'categories',
  select: 'title -dictionary',
}

export default mongoose.model('Dictionary', DictionarySchema)

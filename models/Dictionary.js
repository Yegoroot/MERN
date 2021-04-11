import mongoose from 'mongoose'

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }


/**
 * Words of Category
 *
 *
 */
const WordsScheme = new mongoose.Schema({
  title: String,
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    unique: false,
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
})
export const Word = mongoose.model('Word', WordsScheme)

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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  dictionary: {
    unique: false,
    type: mongoose.Schema.ObjectId,
    ref: 'Dictionary',
    required: true,
  },
}, opts)

CategoryScheme.virtual('words', {
  ref: 'Word',
  localField: '_id',
  foreignField: 'category',
})
CategoryScheme.virtual('countWords', {
  ref: 'Word',
  localField: '_id',
  foreignField: 'category',
  count: true,
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
})


export const populateWordsForCategory = { path: 'words', select: '_id title content' } // user

export const populateCategoriesForDictionary = {
  path: 'categories',
  select: 'title -dictionary',
  populate: {
    path: 'countWords',
  },
}

export default mongoose.model('Dictionary', DictionarySchema)

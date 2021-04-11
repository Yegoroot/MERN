import asyncHandler from '../middleware/async.js'
import Dictionary, {
  Category, Word, populateCategoriesForDictionary, populateWordsForCategory,
} from '../models/Dictionary.js'
import ErrorResponse from '../utils/errorResponse.js'


/**
 * по пользователю ищем, так как у каждого пользоваткля только один словарь
 */
// GET DICTIONARY {{URL}}/api/v1/dictionary/
//
export const getDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const dictionary = await Dictionary.findOne({ user }).populate(populateCategoriesForDictionary)
  res.status(200).json({
    success: true,
    data: dictionary || {
      _id: null,
      categories: null,
    },
  })
})


/**
 * создается один раз для пользователя
 */
// POST DICTIONARY {{URL}}/api/v1/dictionary/
//
export const createDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const values = {
    ...req.body,
    user,
  }
  let data = await Dictionary.create(values)
  data = await data.populate(populateCategoriesForDictionary).execPopulate()

  res.status(201).json({
    success: true,
    data,
  })
})


// GET CATEGORY {{URL}}/api/v1/dictionary/cat/:id
//
export const getCategoryDictionary = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user.id }).populate(populateWordsForCategory)
  if (!category) {
    return next(new ErrorResponse('404', 404))
  }
  res.status(200).json({
    success: true,
    data: category,
  })
})


// POST CATEGORY {{URL}}/api/v1/dictionary/cat
//
export const createCategoryDictionary = asyncHandler(async (req, res, next) => {
  const dictionaryId = req.body.dictionary
  const dictionary = await Dictionary.findById(dictionaryId)
  if (!dictionary) {
    return next(new ErrorResponse('Dictionary for this category not Found', 400))
  }
  const currentUserId = req.user.id.toString()
  const dictionaryUserId = dictionary.user.toString()
  if (dictionaryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  const value = {
    ...req.body,
    user: currentUserId,
  }
  let data = await Category.create(value)
  data = data.populate(populateWordsForCategory)
  res.status(201).json({
    success: true,
    data,
  })
})


// PUT CATEGORY {{URL}}/api/v1/dictionary/cat/:id
//
export const updateCategoryDictionary = asyncHandler(async (req, res, next) => {
  // :id and current_user
  // eslint-disable-next-line max-len
  const data = await Category.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true })
  if (!data) {
    return next(new ErrorResponse('404', 404))
  }

  res.status(201).json({
    success: true,
    data,
  })
})


// DELETE CATEGORY {{URL}}/api/v1/dictionary/cat/:id
//
export const deleteCategoryDictionary = asyncHandler(async (req, res, next) => {
  // :id and current_user
  const data = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!data) {
    return next(new ErrorResponse('404', 404))
  }

  res.status(201).json({
    success: true,
    data: {},
  })
})


// POST WORD {{URL}}/api/v1/dictionary/word/:id
//
export const createWordCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.body.category
  const category = await Category.findById(categoryId)
  if (!category) {
    return next(new ErrorResponse('Category for this word not Found', 400))
  }
  const currentUserId = req.user.id.toString()
  const categoryUserId = category.user.toString()
  if (categoryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  const value = {
    ...req.body,
    user: currentUserId,
  }

  const data = await Word.create(value)
  if (!data) {
    return next(new ErrorResponse('PROblems to create Word', 404))
  }
  res.status(201).json({
    success: true,
    data,
  })
})


// PUT WORD {{URL}}/api/v1/dictionary/word/:id
//
export const updateWordCategory = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line max-len
  const data = await Word.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
  if (!data) {
    return next(new ErrorResponse('404', 404))
  }
  res.status(201).json({
    success: true,
    data,
  })
})


// DELETE WORD {{URL}}/api/v1/dictionary/word/:id
//
export const deleteWordCategory = asyncHandler(async (req, res, next) => {
  const data = await Word.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!data) {
    return next(new ErrorResponse('404', 404))
  }
  res.status(201).json({
    success: true,
    data: {},
  })
})


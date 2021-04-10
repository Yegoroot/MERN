import asyncHandler from '../middleware/async.js'
import Dictionary, { Category, populateCategoriesWithoutWords } from '../models/Dictionary.js'
import ErrorResponse from '../utils/errorResponse.js'


/**
 * по пользователю ищем, так как у каждого пользоваткля только один словарь
 */
// INFO get {{URL}}/api/v1/dictionary/dictionaryId
export const getDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const dictionary = await Dictionary.findOne({ user }).populate(populateCategoriesWithoutWords)
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
// INFO create {{URL}}/api/v1/dictionary/
export const createDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const values = {
    ...req.body,
    user,
  }
  let data = await Dictionary.create(values)
  data = await data.populate(populateCategoriesWithoutWords).execPopulate()

  res.status(201).json({
    success: true,
    data,
  })
})


// INFO get {{URL}}/api/v1/dictionary/categoryId
export const getCategoryDictionary = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params
  const category = await Category.findById(categoryId).populate({
    path: 'dictionary',
    select: 'user',
  })
  const currentUserId = req.user.id.toString()
  const dictionaryUserId = category.dictionary.user.toString()
  if (!category) {
    return next(new ErrorResponse('404', 404))
  }
  if (dictionaryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  res.status(200).json({
    success: true,
    data: category,
  })
})


// INFO create {{URL}}/api/v1/dictionary/dictionaryId
export const createCategoryDictionary = asyncHandler(async (req, res, next) => {
  const { dictionaryId } = req.params
  const dictionary = await Dictionary.findById(dictionaryId)

  const currentUserId = req.user.id.toString()
  const dictionaryUserId = dictionary.user.toString()
  if (!dictionary) {
    return next(new ErrorResponse('Dictionary with this Id not Found', 400))
  }
  if (dictionaryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  const value = {
    ...req.body,
    dictionary: dictionaryId,
  }
  const data = await Category.create(value)
  res.status(201).json({
    success: true,
    data,
  })
})


// INFO put {{URL}}/api/v1/dictionary/categoryId
export const updateCategoryDictionary = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params
  const category = await Category.findById(categoryId).populate({
    path: 'dictionary',
    select: 'user',
  })
  const currentUserId = req.user.id.toString()
  const dictionaryUserId = category.dictionary.user.toString()
  if (!category) {
    return next(new ErrorResponse('404', 404))
  }
  if (dictionaryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }

  const data = await Category.findOneAndUpdate({ _id: categoryId }, req.body, { new: true, runValidators: true })
  res.status(201).json({
    success: true,
    data,
  })
})


// INFO delete {{URL}}/api/v1/dictionary/categoryId
export const deleteCategoryDictionary = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params
  const category = await Category.findById(categoryId).populate({
    path: 'dictionary',
    select: 'user',
  })
  const currentUserId = req.user.id.toString()
  const dictionaryUserId = category.dictionary.user.toString()
  if (!category) {
    return next(new ErrorResponse('404', 404))
  }
  if (dictionaryUserId !== currentUserId) { // Make shure user is owner
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }

  await Category.findOneAndDelete({ _id: req.params.categoryId })

  res.status(201).json({
    success: true,
    data: {},
  })
})

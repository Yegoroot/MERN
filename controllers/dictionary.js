import asyncHandler from '../middleware/async.js'
import Dictionary, { Category } from '../models/Dictionary.js'
import ErrorResponse from '../utils/errorResponse.js'

/**
 * по пользователю ищем, так как у каждого пользоваткля только один словарь
 */
export const getDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const dictionary = await Dictionary.find({ user }).populate({
    path: 'categories',
  })
  res.status(200).json({
    success: true,
    data: dictionary[0] || null,
  })
})

// {{URL}}/api/v1/dictionary/categoryId
export const getCategoryDictionary = asyncHandler(async (req, res) => {
  const categoryId = req.params.id
  const dictionaryId = req.user.dictionary
  const category = await Category.find({ _id: categoryId, dictionary: dictionaryId })
  res.status(200).json({
    success: true,
    data: category,
  })
})

/**
 * создается один раз для пользователя
 */
export const createDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const values = {
    ...req.body,
    user,
  }
  const data = await Dictionary.create(values)
  res.status(201).json({
    success: true,
    data,
  })
})


export const createCategoryDictionary = asyncHandler(async (req, res, next) => {
  const { user } = req
  const dictionaryId = user.dictionary[0].id
  const dictionary = await Dictionary.findById(dictionaryId)

  if (!dictionary) {
    return next(new ErrorResponse('Dictionary not found', 404))
  }
  // Make shure user is owner
  if (dictionary.user.toString() !== req.user.id) {
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

// {{URL}}/api/v1/dictionary/categoryId
export const updateCategoryDictionary = asyncHandler(async (req, res) => {
  const { user } = req
  const dictionaryId = user.dictionary[0].id
  const categoryId = req.params.id
  const data = await Category.findOneAndUpdate({
    _id: categoryId,
    dictionary: dictionaryId,
  }, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(201).json({
    success: true,
    data,
  })
})

// {{URL}}/api/v1/dictionary/categoryId
export const deleteCategoryDictionary = asyncHandler(async (req, res) => {
  const dictionaryId = req.user.dictionary
  await Category.findOneAndDelete({
    _id: req.params.id,
    dictionary: dictionaryId,
  })
  res.status(201).json({
    success: true,
    data: {},
  })
})

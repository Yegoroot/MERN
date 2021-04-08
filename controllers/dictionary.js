import asyncHandler from '../middleware/async.js'
import Dictionary from '../models/Dictionary.js'


export const getDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const dictionary = await Dictionary.find({ user })
  res.status(200).json({
    success: true,
    data: dictionary[0] || {},
  })
})


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


export const updateDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  const data = await Dictionary.findOneAndUpdate({
    _id: req.params.id,
    user,
  }, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(201).json({
    success: true,
    data,
  })
})


export const deleteDictionary = asyncHandler(async (req, res) => {
  const user = req.user.id
  await Dictionary.findOneAndDelete({
    _id: req.params.id,
    user,
  })
  res.status(201).json({
    success: true,
    data: {},
  })
})

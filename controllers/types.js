import asyncHandler from '../middleware/async.js'
import Type from '../models/Type.js'

// @desc    Get all types
// @route   GET /api/v1/auth/types
// @access  Private/superadmin
export const getTypes = asyncHandler(async (req, res) => {
  const types = await Type.find()
  res.status(200).json({
    success: true,
    count: types.length,
    data: types,
  })
})


// @desc    Get all type
// @route   GET /api/v1/auth/types
// @access  Private/superadmin
export const getType = asyncHandler(async (req, res) => {
  const type = await Type.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: type,
  })
})


// @desc    Create type
// @route   POST /api/v1/auth/types
// @access  Private/superadmin
export const createType = asyncHandler(async (req, res) => {
  const data = await Type.create(req.body)
  res.status(201).json({
    success: true,
    data,
  })
})


// @desc    Update type
// @route   PUT /api/v1/auth/types/:id
// @access  Private/superadmin
export const updateType = asyncHandler(async (req, res) => {
  const data = await Type.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    success: true,
    data,
  })
})


// @desc    Delete type
// @route   DELETE /api/v1/auth/types/:id
// @access  Private/superadmin
export const deleteType = asyncHandler(async (req, res) => {
  await Type.findByIdAndDelete(req.params.id)

  res.status(201).json({
    success: true,
    data: {},
  })
})

// const path = require('path')
// const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Type = require('../models/Type')

// @desc    Get all types
// @route   GET /api/v1/auth/types
// @access  Private/superadmin
exports.getTypes = asyncHandler(async (req, res, next) => {
	const types = await Type.find()
	res.status(200).json({
		success: true,
		count: types.length,
		data: types
	})
})


// @desc    Create type
// @route   POST /api/v1/auth/types
// @access  Private/superadmin
exports.createType = asyncHandler(async (req, res, next) => {
	const data = await Type.create(req.body)
	res.status(201).json({
		success: true,
		data
	})
})


// @desc    Update type
// @route   PUT /api/v1/auth/types/:id
// @access  Private/superadmin
exports.updateType = asyncHandler(async (req, res, next) => {

	const data = await Type.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	res.status(201).json({
		success: true,
		data
	})
})


// @desc    Delete type
// @route   DELETE /api/v1/auth/types/:id
// @access  Private/superadmin
exports.deleteType = asyncHandler(async (req, res, next) => {

	await Type.findByIdAndDelete(req.params.id)

	res.status(201).json({
		success: true,
		data: {}
	})
})
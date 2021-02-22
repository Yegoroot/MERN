// const path = require('path')
// const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const Query = require('../utils/QueryMain')

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
	const query = new Query(req.query, User, req.user)
	query.sendRequest() 
	let users = await query.getData()
	let total = await query.getTotal()
	res.status(200).json({
		success: true,
		count: users.length,
		total,
		data: users
	})
})

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	res.status(200).json({
		success: true,
		data: user
	})
})

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/superadmin
// @access  Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
	const data = await User.create(req.new_user)

	res.status(201).json({
		success: true,
		data
	})
})

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/superadmin
// @access  Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {

	delete req.new_user.password
	const data = await User.findByIdAndUpdate(req.params.id, req.new_user, {
		new: true,
		runValidators: true
	})

	res.status(201).json({
		success: true,
		data
	})
})

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

	await User.findByIdAndDelete(req.params.id)

	res.status(201).json({
		success: true,
		data: {}
	})
})
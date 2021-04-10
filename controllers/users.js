import asyncHandler from '../middleware/async.js'
import User from '../models/User.js'
import Query from '../utils/Query.js'

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const query = new Query(req.query, User, req.user)
  query.sendRequest()
  const users = await query.getData()
  const total = await query.getTotal()
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    data: users,
  })
})

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/superadmin
// @access  Private/admin
export const createUser = asyncHandler(async (req, res) => {
  const data = await User.create(req.new_user)

  res.status(201).json({
    success: true,
    data,
  })
})

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/superadmin
// @access  Private/admin
export const updateUser = asyncHandler(async (req, res) => {
  delete req.new_user.password
  const data = await User.findByIdAndUpdate(req.params.id, req.new_user, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    success: true,
    data,
  })
})

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(201).json({
    success: true,
    data: {},
  })
})

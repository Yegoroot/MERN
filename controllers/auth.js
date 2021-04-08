import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import User from '../models/User.js'
import { populateDictionaryForUser } from '../models/Dictionary.js'

// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken() // Create token
  res
    .status(statusCode)
    .json({
      user,
      token,
      success: true,
    })
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  let user = await User.create({
    name, email, password, role: 'user',
  })
  user = await user.populate(populateDictionaryForUser).execPopulate() // if you dont need "dictionary = []", you can delete this
  sendTokenResponse(user, 200, res)
})

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) { return next(new ErrorResponse('Please provide an email and password', 400)) }

  const user = await User.findOne({ email }).select('+password').populate(populateDictionaryForUser)
  if (!user) { return next(new ErrorResponse('Invalid credentials', 401)) }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) { return next(new ErrorResponse('Invalid credentials', 401)) }
  sendTokenResponse(user, 200, res)
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate(populateDictionaryForUser)
  res.status(200).json({
    success: true,
    user,
  })
})


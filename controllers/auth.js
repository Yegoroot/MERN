import { createHash } from 'crypto'
// const path = require('path')
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import sendEmail from '../utils/sendEmail.js'
import User from '../models/User.js'

// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()
  res
    .status(statusCode)
    .json({
      user,
      token,
      success: true
    })
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password /** role */ } = req.body

  // Create user only user role
  const user = await User.create({
    name, email, password, role: 'user'
  })
  sendTokenResponse(user, 200, res)
})

// eslint-disable-next-line consistent-return
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
    // return next(new ErrorResponse('Email Doesnt Exist', 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  sendTokenResponse(user, 200, res)
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  })
})

// eslint-disable-next-line consistent-return
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    })

    res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (error) {
    console.error(error)
    user.getResetPasswordToken = undefined
    user.getResetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// eslint-disable-next-line consistent-return
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed taken
  const resetPasswordToken = createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400))
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.getResetPasswordExpire = undefined
  await user.save()
  sendTokenResponse(user, 200, res)
})

export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email

  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })
})

// eslint-disable-next-line consistent-return
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

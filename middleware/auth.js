/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken'
import asyncHandler from './async.js'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/User.js'

// Protect routes
export const isAuth = asyncHandler(async (req, res, next) => {
  /**
   * FIRST, Passport.js //  token from session
   * if req.user exist this means passport define our user from session and set to req.user
   */
  // console.log(`ID USER = ${req?.user?._id}`.yellow)
  if (req?.user?._id) {
    return next()
  }

  /**
   * SECOND, JWTAuth // token from headers
   */
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1] // Get taken from Bearer taken in header
  }
  // console.log(`ID USER = ${req?.user?._id}`.yellow)
  // console.log(`Token = ${token}`.yellow)
  if (!token) {
    req.user = { _id: null, role: 'user', name: `unknown-${new Date()}` }
    return next()
  }
  // Verify by token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id) /** for every request now we have access to req.user */
    next()
  } catch (error) {
    return next(new ErrorResponse('Not authorize to access this route', 401))
  }
})

// Grant access to specific roles
export const haveAccess = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }
  next()
}

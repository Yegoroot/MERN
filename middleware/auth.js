import jwt from 'jsonwebtoken'
import asyncHandler from './async.js'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/User.js'

// Protect routes
export const isAuth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set taken from Bearer taken in header
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1]
    // Set taken from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token
  }


  if (!token) {
    req.user = {
      _id: null,
      role: 'user',
      name: 'unknown',
    }
    return next()
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    /** for every request now we have access to req.user */
    req.user = await User.findById(decoded.id)

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

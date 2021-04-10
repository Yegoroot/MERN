/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken'
import asyncHandler from './async.js'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/User.js'


/** We are checking what is current user
 *
 * 1) FIRST STEP - Passport.js is checking user under the hood for us. (if req.user exist this means passport define our user from session and set to req.user)
 * 2) SECOND STEP - if passport dont know. JWTAuth (token from headers)
 * 3) THIRD STEP - if FIRST AND SECOND dont know we Create Empty User для проверок в других местах на сайте
 *    проверок вида: req.user.id // но а если не сделать это то будет ошибка (значение от undefined)
 */

export const whoIs = asyncHandler(async (req, res, next) => {
  // FIRST
  if (req?.user?._id) {
    return next()
  }
  // SECOND
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1] // Get taken from Bearer taken in header
  }
  // THIRD
  if (!token) {
    req.user = {}
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify by token
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return next(new ErrorResponse('401 Not authorize to access this route', 401))
  }
})


/** Protect: Only for Auth user
 *
 */
export const isAuthOnly = asyncHandler(async (req, res, next) => {
  await whoIs(req, res, next)
  if (!req.user.role) {
    return next(new ErrorResponse('401 Not authorize to access this route', 401))
  }
})


/** Protect Route by role
 *
 * Grant access to specific roles
 */
export const haveAccess = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  next()
}

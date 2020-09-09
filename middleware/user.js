const asyncHandler = require('./async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
/**
 * allowed added user only superadmin and admin
 * admin can added only teacher and user role
 */
const createUserMiddleWare = (req, res, next) => {
  
	let user = {}
	
	if (req.user.role === 'superadmin') {
		user = { ...req.body, creator: req.user._id }
	}

	if (req.user.role === 'admin') {
		user = {
			...req.body,
			creator: req.user._id,
			role: ['teacher', 'user'].includes(req.body.role) ? req.body.role : 'user'
		}
	} 

	req.new_user = user
	next()
}

/**
 * this middleware chek is current user is owner
 * if not owner error, is owner next()
 */
const isOwner = asyncHandler(async (req, res, next) => {
  
	if (req.user.role !== 'superadmin') {
		let client = await User.findById(req.params.id)
		if (!client) {
			return next(new ErrorResponse('Not Found', 404))
		}

		const creator = client.creator ? client.creator.toString() : null

		if (creator !== req.user._id.toString()) {
			return next(new ErrorResponse('You didnt create this user', 400))
		}
	}
	next()
})

module.exports = {createUserMiddleWare, isOwner}
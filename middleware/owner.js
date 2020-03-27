// This middleware allow give access to owner documents or super admin

const ErrorResponse = require('../utils/errorResponse')

// Protect routes
const owner = (model) => async (req, res, next) => {

	// Check is owner this doc or admin
	const owner = await model.findOne({_id: req.params.id, user: req.user.id})

	if (!owner && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`Not allowed to work with ${req.params.id}`, 405))
	}

	next()
}
module.exports = owner
// This middleware allow give access to owner documents or super admin
// u can make the same due another way check it on https://coursehunter.net/course/node-js-api-master-klass-s-express-i-mongodb 54lesson

const ErrorResponse = require('../utils/errorResponse')

// Protect routes
const owner = model => async (req, res, next) => {

	// Check is owner this doc or admin
	const owner = await model.findOne({ _id: req.params.id, user: req.user.id })

	if (!owner && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`Not allowed to work with ${req.params.id}`, 401))
	}

	next()
}
module.exports = owner
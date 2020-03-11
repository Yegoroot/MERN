const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {

	let error = {
		...err
	}
	error.message = err.message

	// Log to console for dev
	console.log(err)

	// Mongoose bad objectID
	if(err.name === 'CastError') {
		const message = `Topic not found with id of ${err.value}`
		error = new ErrorResponse(message, 404)
	}

	// Mongoose duplicate key
	if(err.code === 11000) {
		const message = 'Duplicate' // поле с уникальным значением уже имеется при создании
		error = new ErrorResponse(message, 400)
	}

	// Mongo Validation Error
	if(err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(val => val.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error'
	})
}
module.exports = errorHandler
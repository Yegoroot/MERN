const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Example = require('../models/Examples')

// @desc    Get all examples
// @route   GET /api/v1/examples
// @access  Public
exports.getExamples = asyncHandler(async (req, res, next) => {
	let query

	// Copy req query
	let reqQuery = {...req.query}

	// Fields to exclude  // 1 это наши внутренние поля нужны для внутренней обработки 
	const removeFilelds = ['select', 'sort', 'page', 'limit']

	// loop over removeFileds and delete them from reqQuery // 2 и поэтому в запросе к БД их не должно быть (в БД таких полей нет)
	removeFilelds.forEach(param => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create opertators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	// Finding resource
	query = Example.find(JSON.parse(queryStr)) 

	// Select Fileds
	if(req.query.select) {
		const filds = req.query.select.split(',').join(' ')
		query = query.select(filds) // Стандартная ф-ия mongoose select(param1 param2) with spaces
	}

	// Sort
	if(req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		query = query.sort(sortBy)
	} else {
		query.sort('-createdAt')
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 25
	const startIndex = (page -1) * limit
	const endIndex = page * limit
	const total = await Example.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const examples = await query  

	// Pagination result
	const pagination = {}
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		}
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		}
	}

	res.status(200).json({success: true, count: examples.length, pagination, data: examples})

})

// @desc    Get single example
// @route   GET /api/v1/examples/:id
// @access  Public
exports.getExample =  asyncHandler(async (req, res, next) => {

	const example = await Example.findById(req.params.id)
		
	if(!example) {	
		return	next(new ErrorResponse(`Example not found with of id ${req.params.id}`, 404))
	}
		
	res.status(200).json({success: true, data: example})
})

// @desc    Create example
// @route   POST /api/v1/examples/:id
// @access  Private
exports.createExample = asyncHandler(async (req, res, next) => {

	const example = await Example.create(req.body)
	res.status(201).json({success: true, data: example})
})

// @desc    Update example
// @route   PUT /api/v1/examples/:id
// @access  Private
exports.updateExample = asyncHandler(async (req, res, next) => {

	const example = await Example.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	
	if (!example) {
		return	next(new ErrorResponse(`Example not found with of id ${req.params.id}`, 404))
	}
		
	return res.status(200).json({success: true, data: example})
})

// @desc    Delete example
// @route   DELETE /api/v1/examples/:id
// @access  Private
exports.deleteExample = asyncHandler(async (req, res, next) => {

	const example = await Example.findByIdAndDelete(req.params.id)
	
	if (!example) {
		return	next(new ErrorResponse(`Example not found with of id ${req.params.id}`, 404))
	}

	return res.status(200).json({success: true, data: {}})
})
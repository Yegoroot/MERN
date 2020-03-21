const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Topic = require('../models/Topic')

// @desc    Get all topics
// @route   GET /api/v1/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res, next) => {
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
	query = Topic.find(JSON.parse(queryStr)).populate({
		path: 'notes',
		select: 'title description photo'
	})

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
	const total = await Topic.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const topics = await query  

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

	res.status(200).json({success: true, count: topics.length, pagination, data: topics})

})

// @desc    Get single topic
// @route   GET /api/v1/topics/:id
// @access  Public
exports.getTopic =  asyncHandler(async (req, res, next) => {
	
	const topic = await Topic.findById(req.params.id).populate({
		path: 'notes',
		select: 'title description photo'
	})
		
	if(!topic) {	
		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
	}
		
	res.status(200).json({success: true, data: topic})
})

// @desc    Create topic
// @route   POST /api/v1/topics/:id
// @access  Private
exports.createTopic = asyncHandler(async (req, res, next) => {

	const topic = await Topic.create(req.body)
	res.status(201).json({success: true, data: topic})
})

// @desc    Update topic
// @route   PUT /api/v1/topics/:id
// @access  Private
exports.updateTopic = asyncHandler(async (req, res, next) => {

	const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	
	if (!topic) {
		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
	}
		
	return res.status(200).json({success: true, data: topic})
})

// @desc    Delete topic
// @route   DELETE /api/v1/topics/:id
// @access  Private
exports.deleteTopic = asyncHandler(async (req, res, next) => {

	const topic = await Topic.findById(req.params.id)
	
	if (!topic) {
		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
	}

	topic.remove() // не используем deleteByID потому что не сработает событие .pre('remove',

	return res.status(200).json({success: true, data: {}})
})

// @desc    Upload photo for topic
// @route   PUL /api/v1/topics/:id/photo
// @access  Private
exports.topicPhotoUpload = asyncHandler(async (req, res, next) => {

	const topic = await Topic.findById(req.params.id)
	
	if (!topic) {
		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
	}

	if (!req.files) {
		return	next(new ErrorResponse('Please upload file', 400))
	}

	const file  = req.files.file

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return	next(new ErrorResponse('Please upload an image file', 400))
	}

	// Check filesize
	if(file.size > process.env.MAX_FILE_UPLOAD) {
		return	next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
	}

	// Create custom filename
	file.name = `photo_${topic._id}${path.parse(file.name).ext}`

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err)
			return	next(new ErrorResponse('Problem with file upload', 500))
		}

		await Topic.findByIdAndUpdate(req.params.id, { photo: file.name })
		
		res.status(200).json({
			success: true,
			data: file.name
		})
	})
})
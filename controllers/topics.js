const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Topic = require('../models/Topic')

// @desc    Get all topics
// @route   GET /api/v1/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res, next) => {

	res.status(200).json(res.advancedResults)

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
	// Add user to req.body
	req.body.user = req.user.id

	// Check for publisher bootcamp

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
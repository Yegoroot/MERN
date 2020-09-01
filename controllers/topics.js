const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Topic = require('../models/Topic')

// @desc    Get all topics
// @route   GET /api/v1/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res, next) => {
	if(req.params.programId) { 	
		const topics = await Topic.find({ program: req.params.programId })		
			.populate({
				path: 'notes',
				select: 'title' 
			}) 
			.populate({
				path: 'program',
				select: 'title' 
			}) 
			.populate({
				path: 'user',
				select: 'name' 
			}) 
		return 	res.status(200).json({ 	
			success: true, 
			data: topics})
	}  else {

		req.requestModel.populate([
			{ path: 'notes', select: 'title description photo' },
			{ path: 'user', select: 'name email' },
			{ path: 'program', select: 'title' }
		])
	
		const topics = await req.requestModel

		res.status(200).json({
			success: true,
			count: topics.length,
			total: req.total,
			data: topics
		})
	}
})

// @desc    Get single topic
// @route   GET /api/v1/topics/:id
// @access  Public
exports.getTopic =  asyncHandler(async (req, res, next) => {
	
	const topic = await Topic.findById(req.params.id)
		.populate({
			path: 'notes',
			select: 'title description photo'
		})
		.populate({
			path: 'program',
			select: 'title'
		})
		.populate({
			path: 'user',
			select: 'name'
		})
		
	if(!topic || !topic.publish) {	
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
	
	if(req.body.tags) {
		req.body.tags =  JSON.parse(req.body.tags)
	}
	const topic = await Topic.create(req.body)
	res.status(201).json({success: true, data: topic})
})

// @desc    Update topic
// @route   PUT /api/v1/topics/:id
// @access  Private
exports.updateTopic = asyncHandler(async (req, res, next) => {

	let topic = await Topic.findById(req.params.id)
	if(req.body.tags) {
		req.body.tags =  JSON.parse(req.body.tags)
	}

	if (!topic) {
		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
	}
	
	// Make shure user is owner
	if (topic.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}

	topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
		
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

	// Make shure user is owner
	if (topic.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}

	topic.remove() // не используем deleteByID потому что не сработает событие .pre('remove',

	return res.status(200).json({success: true, data: {}})
})

// @desc    Delete topics
// @route   DELETE /api/v1/topics/?ids=1,2
// @access  Private
exports.deleteTopics = asyncHandler(async (req, res, next) => {
	const ids = req.query.ids.split(',')
	if ( req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${ids}`, 401))
	}
	await Topic.deleteMany(
		{	_id: {	$in: ids	}	},
		(error, result) => {
			if (error) {
				return	next(new ErrorResponse(`${error.message}`, 500))
			} else {
				res.status(200).json({success: true, data: {}})
			}
		}
	)
})

// @desc    Upload photo for topic
// @route   PUL /api/v1/topics/:id/photo
// @access  Private
// exports.topicPhotoUpload = asyncHandler(async (req, res, next) => {

// 	const topic = await Topic.findById(req.params.id)
	
// 	if (!topic) {
// 		return	next(new ErrorResponse(`Topic not found with of id ${req.params.id}`, 404))
// 	}

// 	if (!req.files) {
// 		return	next(new ErrorResponse('Please upload file', 400))
// 	}

// 	// Make shure user is owner
// 	if (topic.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
// 		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
// 	}

// 	const file  = req.files.file

// 	// Make sure the image is a photo
// 	if (!file.mimetype.startsWith('image')) {
// 		return	next(new ErrorResponse('Please upload an image file', 400))
// 	}

// 	// Check filesize
// 	if(file.size > process.env.MAX_FILE_UPLOAD) {
// 		return	next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
// 	}

// 	// Create custom filename
// 	file.name = `photo_${topic._id}${path.parse(file.name).ext}`

// 	file.mv(`${process.env.IMAGES_UPLOAD_PATH}/${file.name}`, async err => {
// 		if (err) {
// 			console.error(err)
// 			return	next(new ErrorResponse('Problem with file upload', 500))
// 		}

// 		await Topic.findByIdAndUpdate(req.params.id, { photo: file.name })
		
// 		res.status(200).json({
// 			success: true,
// 			data: file.name
// 		})
// 	})
// })
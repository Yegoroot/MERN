const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Note = require('../models/Note')

// @desc    Get all notes
// @route   GET /api/v1/notes
// @route   GET /api/v1/topics/:topicsId/notes
// @access  Public
exports.getNotes = asyncHandler(async (req, res, next) => {
	if(req.params.topicId) { 	// if find note list by topic
		const notes = await Note.find({ topic: req.params.topicId })		
			.populate({
				path: 'user',
				select: 'name email' 
			}) 
		return 	res.status(200).json({ 	
			// TODO сделать pagination in the course it doesnt exist
			success: true, 
			count: notes.length, 
			data: notes})
	}  else {

		req.requestModel.populate([
			{ path: 'topic', select: 'title description' },
			{ path: 'user', select: 'name email' }
		])
	
		const notes = await req.requestModel
		
		res.status(200).json({
			success: true,
			count: notes.length,
			total: req.total,
			data: notes
		})
	}
})

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Public
exports.getNote =  asyncHandler(async (req, res, next) => {
	const note = await Note.findById(req.params.id)
		.populate({
			path: 'topic',
			select: 'title description'
		})
		.populate({
			path: 'user',
			select: 'name email' 
		})
	if(!note || !note.publish) {	
		return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
	}
	res.status(200).json({success: true, data: note})
})

// @desc    Create note
// @route   POST /api/v1/notes/:id
// @access  Private
exports.createNote = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id // Add user to req.body
	const note = await Note.create(req.body)
	res.status(201).json({success: true, data: note})
})

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = asyncHandler(async (req, res, next) => {
	let note = await Note.findById(req.params.id)
	if (!note) {
		return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
	}
	// Make shure user is owner
	if (note.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}
	note = await Note.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	return res.status(200).json({success: true, data: note})
})

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
	const note = await Note.findById(req.params.id)
	if (!note) {
		return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
	}
	if (note.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}
	await note.remove()
	return res.status(200).json({success: true, data: {}})
})

// @desc    Delete notes
// @route   DELETE /api/v1/notes/?ids=1,2
// @access  Private
exports.deleteNotes = asyncHandler(async (req, res, next) => {
	const ids = req.query.ids.split(',')
	if ( req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${ids}`, 401))
	}
	await Note.deleteMany(
		{	_id: {	$in: ids	}	},
		function(error, result) {
			if (error) {
				res.status(200).json({success: false, error})
			} else {
				res.status(200).json({success: true, data: {}})
			}
		}
	)
})
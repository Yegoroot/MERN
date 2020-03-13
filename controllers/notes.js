const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Note = require('../models/Note')

// @desc    Get all notes
// @route   GET /api/v1/notes
// @route   GET /api/v1/topics/:topicsId/notes
// @access  Public
exports.getNotes = asyncHandler(async (req, res, next) => {
	let query

	// Copy req query
	let reqQuery = {...req.query}

	/**
	 * этот topicId перетягивается с topic роутера 
	 * и в этом месте мы получаем список категорий в определенном проекте
	 */
	if(req.params.topicId) {
		reqQuery.topic = req.params.topicId
	} 

	// Fields to exclude  // 1 это наши внутренние поля нужны для внутренней обработки 
	const removeFilelds = ['select', 'sort', 'page', 'limit']

	// loop over removeFileds and delete them from reqQuery // 2 и поэтому в запросе к БД их не должно быть (в БД таких полей нет)
	removeFilelds.forEach(param => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create opertators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	// Finding resource
	if(req.params.topicId) {
		query = Note.find(JSON.parse(queryStr)) 
	}  else {

		query = Note.find(JSON.parse(queryStr)).populate({
			path: 'topic',
			select: 'name description'
		})
	}

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
	const total = await Note.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const notes = await query  

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

	res.status(200).json({success: true, count: notes.length, pagination, data: notes})

})

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Public
exports.getNote =  asyncHandler(async (req, res, next) => {

	const note = await Note.findById(req.params.id).populate('rewiews').populate({
		path: 'topic',
		select: 'name description'
	})
		
	if(!note) {	
		return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
	}
		
	res.status(200).json({success: true, data: note})
})

// @desc    Create note
// @route   POST /api/v1/notes/:id
// @access  Private
exports.createNote = asyncHandler(async (req, res, next) => {

	const note = await Note.create(req.body)
	res.status(201).json({success: true, data: note})
})

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = asyncHandler(async (req, res, next) => {

	const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	
	if (!note) {
		return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
	}
		
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

	await note.remove()

	return res.status(200).json({success: true, data: {}})
})
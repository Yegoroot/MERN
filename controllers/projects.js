const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Project = require('../models/Project')

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
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
	query = Project.find(JSON.parse(queryStr)).populate({
		path: 'categories',
		select: 'name description photo'
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
	const total = await Project.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const projects = await query  

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

	res.status(200).json({success: true, count: projects.length, pagination, data: projects})

})

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject =  asyncHandler(async (req, res, next) => {
	
	const project = await Project.findById(req.params.id).populate({
		path: 'categories',
		select: 'name description photo'
	})
		
	if(!project) {	
		return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
	}
		
	res.status(200).json({success: true, data: project})
})

// @desc    Create project
// @route   POST /api/v1/projects/:id
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {

	const project = await Project.create(req.body)
	res.status(201).json({success: true, data: project})
})

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {

	const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
	
	if (!project) {
		return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
	}
		
	return res.status(200).json({success: true, data: project})
})

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {

	const project = await Project.findById(req.params.id)
	
	if (!project) {
		return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
	}

	project.remove() // не используем deleteByID потому что не сработает событие .pre('remove',

	return res.status(200).json({success: true, data: {}})
})
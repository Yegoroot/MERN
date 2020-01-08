const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Project = require('../models/Projects')

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getNotes = asyncHandler(async (req, res, next) => {
	let query

	let queryStr = JSON.stringify(req.query)

	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	query = Project.find(JSON.parse(queryStr)) 

	const projects = await query  

	res.status(200).json({success: true, count: projects.length, data: projects})

})

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getNote =  asyncHandler(async (req, res, next) => {

	const project = await Project.findById(req.params.id)
		
	if(!project) {	
		return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
	}
		
	res.status(200).json({success: true, data: project})
})

// @desc    Create project
// @route   POST /api/v1/projects/:id
// @access  Private
exports.createNote = asyncHandler(async (req, res, next) => {

	const project = await Project.create(req.body)
	res.status(201).json({success: true, data: project})
})

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateNote = asyncHandler(async (req, res, next) => {

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
exports.deleteNote = asyncHandler(async (req, res, next) => {

	const project = await Project.findByIdAndDelete(req.params.id)
	
	if (!project) {
		return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
	}

	return res.status(200).json({success: true, data: {}})
})
const ErrorResponse = require('../utils/errorResponse')

const Project = require('../models/Projects')

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getNotes = async (req, res, next) => {
	try {
		
		const projects = await Project.find()    
		res.status(200).json({success: true, count: projects.length, data: projects})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getNote =  async (req, res, next) => {
	try {
		const project = await Project.findById(req.params.id)
		
		if(!project) {	
			return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
		}
		
		res.status(200).json({success: true, data: project})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
	
}

// @desc    Create project
// @route   POST /api/v1/projects/:id
// @access  Private
exports.createNote = async (req, res, next) => {
	// console.log(req.body)
	try {
		const project = await Project.create(req.body)
		res.status(201).json({success: true, data: project})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}

}

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
	try {
		
		const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})
	
		if (!project) {
			return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
		}
		
		return res.status(200).json({success: true, data: project})
	} catch (error) {
		
		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
	try {
		
		const project = await Project.findByIdAndDelete(req.params.id)
	
		if (!project) {
			return	next(new ErrorResponse(`Project not found with of id ${req.params.id}`, 404))
		}

		return res.status(200).json({success: true, data: {}})
	} catch (error) {
		
		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}
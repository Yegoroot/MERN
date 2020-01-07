const ErrorResponse = require('../utils/errorResponse')

const Note = require('../model/Note')

// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Public
exports.getNotes = async (req, res, next) => {
	try {
		
		const notes = await Note.find()    
		res.status(200).json({success: true, count: notes.length, data: notes})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Public
exports.getNote =  async (req, res, next) => {
	try {
		const note = await Note.findById(req.params.id)
		
		if(!note) {	
			return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
		}
		
		res.status(200).json({success: true, data: note})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
	
}

// @desc    Create note
// @route   POST /api/v1/notes/:id
// @access  Private
exports.createNote = async (req, res, next) => {
	// console.log(req.body)
	try {
		const note = await Note.create(req.body)
		res.status(201).json({success: true, data: note})
	} catch (error) {

		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}

}

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
	try {
		
		const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})
	
		if (!note) {
			return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
		}
		
		return res.status(200).json({success: true, data: note})
	} catch (error) {
		
		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
	try {
		
		const note = await Note.findByIdAndDelete(req.params.id)
	
		if (!note) {
			return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
		}

		return res.status(200).json({success: true, data: {}})
	} catch (error) {
		
		next(error) // тут отработает app.use(errorHandlrer) middleware который мы подключили в server.js
	}
}
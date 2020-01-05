const Note = require('../model/Note')

// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Public
exports.getNotes = (req, res, next) => {
	res.status(200).json({success: true, msg: 'Show all notes'})
}

// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Public
exports.getNote = (req, res, next) => {
	res.status(200).json({success: true, msg: `Show note ${req.params.id}`})
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
		res.status(400).json({success: false})
		
	}

}

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = (req, res, next) => {
	res.status(200).json({success: true, msg: `Update note ${req.params.id}`})
}

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
exports.deleteNote = (req, res, next) => {
	res.status(200).json({success: true, msg: `Delete note ${req.params.id}`})
}
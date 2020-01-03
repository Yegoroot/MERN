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
exports.createNote = (req, res, next) => {
	res.status(200).json({success: true, msg: 'Create new note'})
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
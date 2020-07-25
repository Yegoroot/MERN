const express = require('express')
const router = express.Router()

const { 
	getPrograms, 
	getProgram, 
	createProgram, 
	updateProgram, 
	deleteProgram, 
	deletePrograms // only superadmin (control this in controllers)
} = require('../controllers/programs')

const advancedResults = require('../middleware/advancedResults')

const Program = require('../models/Program')

const { protect, authorize } = require('../middleware/auth')
const { fileUpload } = require('../middleware/fileUpload')
// Include other resource
const NoteRouter = require('./notes')

const allowedUsers = ['superadmin', 'admin', 'teacher']

// Re-route into other resourse router
router.use('/:programId/notes', NoteRouter)

const populate = [
	{ path: 'topics', select: 'title description photo' },
	{ path: 'user', select: 'name email' }
]
router.route('/')        
	.get(advancedResults(Program, populate), getPrograms)
	.post(protect, authorize(...allowedUsers), fileUpload, createProgram)
	.delete(protect, authorize(...allowedUsers), deletePrograms)

router.route('/:id')	
	.get(getProgram)
	.put(protect, authorize(...allowedUsers), fileUpload, updateProgram)
	.delete(protect, authorize(...allowedUsers), deleteProgram)

module.exports = router
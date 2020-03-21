const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes')

const Note = require('../models/Note')
const advancedResults = require('../middleware/advancedResults')

const { protect, authorize } = require('../middleware/auth')

// Include other resource
const RewiewRouter = require('./rewiews')

router.use('/:noteId/rewiews', RewiewRouter)

router.route('/')        
	.get(advancedResults(Note, { path: 'topic', select: 'title description' }), getNotes)
	.post(protect, authorize('publisher', 'admin'), createNote)

router.route('/:id')	
	.get(getNote)
	.put(protect, authorize('publisher', 'admin'), updateNote)
	.delete(protect, authorize('publisher', 'admin'), deleteNote)

module.exports = router
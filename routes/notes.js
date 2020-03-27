const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes')

const Note = require('../models/Note')
const advancedResults = require('../middleware/advancedResults')

const { protect, authorize } = require('../middleware/auth')
const owner = require('../middleware/owner')

const allowedUsers = ['superadmin', 'admin', 'teacher', 'publisher']

// Include other resource
const RewiewRouter = require('./rewiews')

router.use('/:noteId/rewiews', RewiewRouter)

router.route('/')        
	.get(advancedResults(Note, { path: 'topic', select: 'title description' }), getNotes)
	.post(protect, authorize(...allowedUsers), owner(Note), createNote)

router.route('/:id')	
	.get(getNote)
	.put(protect, authorize(...allowedUsers), owner(Note), updateNote)
	.delete(protect, authorize(...allowedUsers), owner(Note), deleteNote)

module.exports = router
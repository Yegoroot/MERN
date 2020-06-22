const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote, deleteNotes } = require('../controllers/notes')

const Note = require('../models/Note')
const advancedResults = require('../middleware/advancedResults')

const { protect, authorize } = require('../middleware/auth')

const allowedUsers = ['superadmin', 'admin', 'teacher', 'publisher']

router.route('/')        
	.get(advancedResults(Note, { path: 'topic', select: 'title description' }), getNotes)
	.post(protect, authorize(...allowedUsers), createNote)
	.delete(protect, authorize(...allowedUsers),  deleteNotes)

router.route('/:id')	
	.get(getNote)
	.put(protect, authorize(...allowedUsers), updateNote)
	.delete(protect, authorize(...allowedUsers),  deleteNote)

module.exports = router
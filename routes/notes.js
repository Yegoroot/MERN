const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes')

const Note = require('../models/Note')
const advancedResults = require('../middleware/advancedResults')

// Include other resource
const RewiewRouter = require('./rewiews')

router.use('/:noteId/rewiews', RewiewRouter)

router.route('/')        
	.get(advancedResults(Note, { path: 'topic', select: 'title description' }), getNotes)
	.post(createNote)

router.route('/:id')	
	.get(getNote)
	.put(updateNote)
	.delete(deleteNote)

module.exports = router
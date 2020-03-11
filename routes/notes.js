const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes')

// Include other resource
const RewiewRouter = require('./rewiews')

router.use('/:noteId/rewiews', RewiewRouter)

router.route('/')        
	.get(getNotes)
	.post(createNote)

router.route('/:id')	
	.get(getNote)
	.put(updateNote)
	.delete(deleteNote)

module.exports = router
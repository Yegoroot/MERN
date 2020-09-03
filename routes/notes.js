const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes, getNote, createNote, updateNote, deleteNote, deleteNotes } = require('../controllers/notes')

const Note = require('../models/Note')
const {requestModel} = require('../middleware/query')

const { isAuth, haveAccess } = require('../middleware/auth')

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')        
	.get(requestModel(Note), getNotes)
	.post(isAuth, haveAccess(...theseHaveAccess), createNote)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteNotes)

router.route('/:id')	
	.get(getNote)
	.put(isAuth, haveAccess(...theseHaveAccess), updateNote)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteNote)

module.exports = router
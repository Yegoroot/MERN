const express = require('express')
const router = express.Router()

const { 
	getPrograms, 
	getProgram, 
	createProgram, 
	updateProgram, 
	deleteProgram 
/*	deletePrograms */// only superadmin (control this in controllers)
} = require('../controllers/programs')

const Program = require('../models/Program')
const TopicRouter = require('./topics') // Re-route into other resourse router
router.use('/:programId/topics', TopicRouter)

const allowedUsers = ['superadmin', 'admin', 'teacher']

const {requestModel} = require('../middleware/query')
const { protect, authorize } = require('../middleware/auth')
const { fileUpload } = require('../middleware/fileUpload')

router.route('/')        
	.get(requestModel(Program), getPrograms)      
	.post(protect, authorize(...allowedUsers), fileUpload, createProgram)
	.delete(protect, authorize(...allowedUsers) /*deletePrograms*/)

router.route('/:id')	
	.get(getProgram)
	.put(protect, authorize(...allowedUsers), fileUpload, updateProgram)
	.delete(protect, authorize(...allowedUsers), deleteProgram)

module.exports = router
const express = require('express')
const router = express.Router()
const { 
	getPrograms, 
	getProgram, 
	createProgram, 
	updateProgram, 
	deleteProgram 
	// getMyPrograms,
	// getMyProgram
} = require('../controllers/programs')

const Program = require('../models/Program')
const TopicRouter = require('./topics') // Re-route into other resourse router
router.use('/:programId/topics', TopicRouter)

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

const {requestModel} = require('../middleware/query')
const { isAuth, haveAccess } = require('../middleware/auth')
const { fileUpload } = require('../middleware/fileUpload')

router.route('/')        
	.get(requestModel(Program), getPrograms)      
	.post(isAuth, haveAccess(...theseHaveAccess), fileUpload, createProgram)
	.delete(isAuth, haveAccess(...theseHaveAccess))

// router.route('/my')
// 	.get(getMyPrograms)
// router.route('/my/:id')
// 	.get(getMyProgram)

router.route('/:id')	
	.get(getProgram)
	.put(isAuth, haveAccess(...theseHaveAccess), fileUpload, updateProgram)
	.delete(isAuth, haveAccess(...theseHaveAccess), deleteProgram)

module.exports = router
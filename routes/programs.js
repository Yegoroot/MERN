const express = require('express')
const router = express.Router()
const { 
	getPrograms, 
	getProgram, 
	createProgram, 
	updateProgram, 
	deleteProgram
	// getMyProgram
} = require('../controllers/programs')

const { isAuth, haveAccess } = require('../middleware/auth')
const { photoUploadProtect } = require('../middleware/photoUploadProtect')

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')        
	.get(isAuth, getPrograms)      
	.post(isAuth, haveAccess(...theseHaveAccess), photoUploadProtect, createProgram)
	.delete(isAuth, haveAccess(...theseHaveAccess))

router.route('/:id')	
	.get(isAuth, getProgram)
	.put(isAuth, haveAccess(...theseHaveAccess), photoUploadProtect, updateProgram)
	.delete(isAuth, haveAccess(...theseHaveAccess), deleteProgram)

module.exports = router
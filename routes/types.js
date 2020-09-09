const express = require('express')
const router = express.Router()
const { isAuth, haveAccess } = require('../middleware/auth')
const { 
	getTypes,
	createType, 
	updateType, 
	deleteType 
} = require('../controllers/types')


router.use(isAuth) // ONLY AUTH USERS
router.use(haveAccess(...['superadmin'])) // ONLY SUOERADMIN

router.route('/')
	.get(getTypes)     
	.post(createType)   

router.route('/:id')
	.put(updateType)	
	.delete(deleteType)	

module.exports = router
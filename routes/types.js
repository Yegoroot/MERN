const express = require('express')
const router = express.Router()
const { isAuth, haveAccess } = require('../middleware/auth')
const { 
	getTypes,
	getType,
	createType, 
	updateType, 
	deleteType 
} = require('../controllers/types')


router.use(isAuth) // ONLY AUTH USERS

router.route('/')
	.get(getTypes, haveAccess(...['superadmin', 'admin']))     
	.post(createType, haveAccess(...['superadmin']))   

router.route('/:id')
	.get(getType, haveAccess(...['superadmin']))
	.put(updateType, haveAccess(...['superadmin']))
	.delete(deleteType, haveAccess(...['superadmin']))	

module.exports = router
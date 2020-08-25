const express = require('express')
const router = express.Router()

const { 
	getUsers,
	getUser,
	createUser, 
	updateUser, 
	deleteUser 
} = require('../controllers/users')

const User = require('../models/User')

const {requestModel} = require('../middleware/query')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('superadmin'))

router.route('/')
	.get(requestModel(User), getUsers)     
	.post(createUser)   

router.route('/:id')
	.get(getUser)
	.put(updateUser)	
	.delete(deleteUser)	

module.exports = router
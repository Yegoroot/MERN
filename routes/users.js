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
const { createUserMiddleWare, isOwner } = require('../middleware/user')

router.use(protect) // ONLY AUTH USERS
router.use(authorize(...['superadmin','admin'])) // ONLY SUOERADMIN and ADMIN 

router.route('/')
	.get(requestModel(User), getUsers)     
	.post(createUserMiddleWare, createUser)   

router.route('/:id')
	.get(getUser)
	.put(isOwner, createUserMiddleWare, updateUser)	
	.delete(isOwner, deleteUser)	

module.exports = router
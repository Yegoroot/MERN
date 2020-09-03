const express = require('express')
const { 
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword
} = require('../controllers/auth')

const router = express.Router()
const { isAuth } = require('../middleware/auth')

router
	.post('/register', register)
	.post('/login', login)
	.get('/logout', logout)
	.post('/forgotpassword', forgotPassword)
	.put('/resetpassword/:resettoken', resetPassword)
	.get('/me', isAuth, getMe)
	.put('/updatedetails', isAuth, updateDetails)
	.put('/updatepassword', isAuth, updatePassword)

module.exports = router
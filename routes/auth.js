const express = require('express')
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth')

const router = express.Router()
const { protect } = require('../middleware/auth')

router
	.post('/register', register)
	.post('/login', login)
	.post('/forgotpassword', forgotPassword)
	.put('/resetpassword/:resettoken', resetPassword)
	.get('/me', protect, getMe)
	.put('/updatedetails', protect, updateDetails)
	.put('/updatepassword', protect, updatePassword)

module.exports = router
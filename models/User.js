const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		match: [
			// eslint-disable-next-line no-useless-escape
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'please add a valid email'
		]
	},
	role: {
		type: String,
		enum: ['user', 'manager', 'publisher'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minLength: 6,
		select: false // downt show password in API
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	creadedAt: {
		type: Date, 
		default: Date.now
	}
})

module.exports = mongoose.model('User', UserSchema)

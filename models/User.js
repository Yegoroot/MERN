const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Please add an email'],
		match: [
			// eslint-disable-next-line no-useless-escape
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'please add a valid email'
		]
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'publisher'],
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

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next){
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return 
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	})
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)

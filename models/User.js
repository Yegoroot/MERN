const crypto = require('crypto')
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
		enum: ['superadmin', 'user', 'admin', 'teacher', 'publisher'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minLength: 6,
		select: false // downt show password in API
	},
	location: {
		type: String
	},
	status: {
		type: String
	},
	skills: [{
		type: String
		// enum: ['beginner', 'pre-intermediate', 'intermediate', 'advanced']
	}],
	bio: {
		type: String
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date, 
		default: Date.now
	},
	// who was create this
	whoCreate: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	/**
	 * This for show tag 'new' ahead smth if had smth created since last user entered  
	 */
	lastVisitedDate: {
		type: Date, 
		default: Date.now
	}
	// lastLoginDate: {
	// 	type: Date, 
	// 	default: Date.now
	// },
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next){
	if(!this.isModified('password')) {
		next()
	}

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

// Generate and hash password token - 53 lesson https://coursehunter.net/course/node-js-api-master-klass-s-express-i-mongodb
UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex')

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

	return resetToken
}

module.exports = mongoose.model('User', UserSchema)

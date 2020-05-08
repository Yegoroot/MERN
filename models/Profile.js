const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	location: {
		type: String
	},
	status: {
		type: String
	},
	skills: {
		type: [String]
	},
	bio: {
		type: String
	},
	experience: [{
		title: {
			type: String,
			requred: true
		},
		company: {
			type: String,
			requred: true 
		},
		location: {
			type: String
		},
		from: {
			type: Date,
			requred: true
		},
		to: {
			type: Date
		},
		current: {
			type: Boolean,
			default: false
		},
		description: {
			type: String
		} 
	}],
	education: [
		{
			school: {
				type: String,
				requred: true
			},
			degree:  {
				type: String,
				requred: true
			},
			fieldofstudy: {
				type: String,
				requred: true
			},
			from: {
				type: Date,
				requred: true
			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			} 
		} 
	],
	social: {
		youtube: {
			type: String
		},
		twitter: {
			type: String
		},
		facebook: {
			type: String
		},
		linkedin: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('profile', ProfileSchema)
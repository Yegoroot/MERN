const mongoose = require('mongoose')
// const slugify = require('slugify')
const opts = { toJSON: { virtuals: true }, toObject: {virtuals: true} }

const Programschemea = new mongoose.Schema({
	title: {
		type: String,
		required: [ true, 'please add a title'],
		unique: true,
		trim: true,
		maxlength: [50, 'Title can not be more than 50 characters' ]
	},
	language: String,
	translation: Array,
	// slug: String,
	publish: { 
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		// required: [ true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters' ]
	},
	photo: {
		type: String
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	// who can have access
	access: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	rating: {
		type: Number
	},
	subscribers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	// who created this program
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
}, opts)

Programschemea.virtual('topics', {
	ref: 'Topic',
	localField: '_id',
	foreignField: 'program',
	id: true
	// justOne: false
})

// Programschemea.pre('save', function(next){
// 	this.slug = slugify(this.title, { lower: true })
// 	next()
// })

Programschemea.pre('remove', async function (next){
	// eslint-disable-next-line no-console
	console.log(`Topics being removed from program ${this._id}`)
	await this.model('Topic').deleteMany({ program: this._id })
	next()
})


module.exports = mongoose.model('Program', Programschemea) 
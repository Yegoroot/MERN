const mongoose = require('mongoose')
const slugify = require('slugify')
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
	slug: String,
	publish: { 
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		required: [ true, 'please add a descripion'],
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
	// list of notes (if user dont want to use layer of topics)
	notes:[
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Note'
		}	
	],
	// list of topics
	topics: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Topic'
		}
	],
	// who can have access
	access: [
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

Programschemea.pre('save', function(next){
	this.slug = slugify(this.title, { lower: true })
	next()
})

module.exports = mongoose.model('Program', Programschemea) 
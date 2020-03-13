const mongoose = require('mongoose')
const slugify = require('slugify')

const Rewiewschemea = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [ true, 'please add a rewiew title'],
	},
	text: {
		type: String,
		required: [ true, 'please add a descripion']
	},
	rating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must can not be more than 10'],
	},
	note: {
		type: mongoose.Schema.ObjectId, 
		ref: 'Note',
		required: true
	},
	language: String,
	slug: String,
	minimumSkill: {
		type: String,
		required: [true, 'Please add a minium skill'],
		enum: ['beginner', 'pre-intermediate', 'intermediate', 'advanced']
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	// user: {
	// 	type: mongoose.mongoose.Schema.ObjectId,
	// 	ref: 'User',
	// 	required: true
	// }
})
/**
 * это то что происходит на рахных этапах этой схемы, например следующий код до моментта сохранения записи
 */
// Create bootcamp slug from the title
Rewiewschemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.title)
	this.slug = slugify(this.title, { lower: true })
	next()
})

module.exports = mongoose.model('Rewiew', Rewiewschemea) 
const mongoose = require('mongoose')
const slugify = require('slugify')

const NoteSchemea = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [ true, 'please add a category name'],
	},
	category: {
		type: mongoose.Schema.ObjectId,
		ref: 'Category',
		required: true
	},
	language: String,
	translation: Array,
	slug: String,
	description: {
		type: String,
		required: [ true, 'please add a descripion']
	},
	content: String,
	// categories: Array, // может быть и в نحو и в мотивации и дополнительные
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must can not be more than 10'],
	},
	minimumSkill: {
		type: Array,
		required: [true, 'Please add a minium skill']
		// enum: ['beginner', 'pre-intermediate', 'intermediate', 'advanced']
	},
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})
/**
 * это то что происходит на рахных этапах этой схемы, например следующий код до моментта сохранения записи
 */
// Create bootcamp slug from the name
NoteSchemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.name)
	this.slug = slugify(this.name, { lower: true })
	next()
})

module.exports = mongoose.model('Note', NoteSchemea) 
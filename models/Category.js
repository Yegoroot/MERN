const mongoose = require('mongoose')
const slugify = require('slugify')

const CategorySchemea = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'please add a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'Name can not be more than 50 characters' ]
	},
	language: String,
	translation: Object,
	slug: String,
	description: {
		type: String,
		required: [ true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters' ],
	},
	content: String,
	// это связь с моделью Project
	project: {
		type: mongoose.Schema.ObjectId,
		ref: 'Project',
		required: true
	},
	filters: Array,
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must can not be more than 10'],
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
CategorySchemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.name)
	this.slug = slugify(this.name, { lower: true })
	next()
})

module.exports = mongoose.model('Category', CategorySchemea) 
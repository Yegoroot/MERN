const mongoose = require('mongoose')
const slugify = require('slugify')

const ProjectSchemea = new mongoose.Schema({
	// name of project
	name: {
		type: String,
		required: [ true, 'please add a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'Name can not be more than 50 characters' ]
	},
	slug: String,
	// desc's project
	description: {
		type: String,
		required: [ true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters' ],
	},
	// content
	content: String,
	category: String,
	label: Array,
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must can not be more than 10'],
	},
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	level: {
		// type: [String], // aray with type string
		type: String,
		required: true,
		enum: [ // one from these
			'beginner',
			'elementary',
			'pre-intermediate',
			'intermediate',
			'upper-intermediate',	
			'advanced',
		]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	average: Number
	// mustHaveToKnow: {
	// 	type: Boolean,
	// 	default: false
	// },
    
})
/**
 * это то что происходит на рахных этапах этой схемы, например в момент сохранения записи
 */
// Create bootcamp slug from the name
ProjectSchemea.pre('save', function(next){
	console.log('Slugify ran', this.name)
	this.slug = slugify(this.name, { lower: true })
	next()
})

module.exports = mongoose.model('Project', ProjectSchemea) 
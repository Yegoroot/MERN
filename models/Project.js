const mongoose = require('mongoose')
const slugify = require('slugify')

// Subscribes model
const subscribeSchema = new mongoose.Schema({
	photo: String,
})
mongoose.model('subscribes', subscribeSchema, 'subscribes' )

// Project model
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
	content: String,
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	subscribers: {
		type: [Object],
		ref: 'subscribes'
	},
	createdAt: {
		type: Date,
		default: Date.now
	} 
})
/**
 * это то что происходит на рахных этапах этой схемы, например в момент сохранения записи
 */
// Create bootcamp slug from the name
ProjectSchemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.name)
	this.slug = slugify(this.name, { lower: true })
	next()
})

module.exports = mongoose.model('Project', ProjectSchemea) 
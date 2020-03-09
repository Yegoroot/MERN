const mongoose = require('mongoose')
const slugify = require('slugify')
const opts = { toJSON: { virtuals: true }, toObject: {virtuals: true} }

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
	icon: String,
	language: String,
	translation: Array,
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
}, opts)
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

// Cascade delete category when a project is deleted
ProjectSchemea.pre('remove', async function (next){
	// eslint-disable-next-line no-console
	console.log(`Categories being removed from project ${this._id}`)
	await this.model('Category').deleteMany({ project: this._id })
	next()
})

// Reverse populate with virtuals
/**
 * В таблицу project мы добавили те категории которые относяться к нему
 */
ProjectSchemea.virtual('categories', {
	ref: 'Category',
	localField: '_id',
	foreignField: 'project',
	// justOne: false
})

module.exports = mongoose.model('Project', ProjectSchemea) 
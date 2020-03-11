const mongoose = require('mongoose')
const slugify = require('slugify')
const opts = { toJSON: { virtuals: true }, toObject: {virtuals: true} }

// tags model
const tags = new mongoose.Schema({
	photo: String,
})
mongoose.model('tags', tags, 'tags' )

// Topic model
const Topicschemea = new mongoose.Schema({
	// name of topic
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
	// desc's topic
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
	tags: {
		type: [Object],
		ref: 'tags'
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
Topicschemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.name)
	this.slug = slugify(this.name, { lower: true })
	next()
})

// Cascade delete note when a topic is deleted
Topicschemea.pre('remove', async function (next){
	// eslint-disable-next-line no-console
	console.log(`Notes being removed from topic ${this._id}`)
	await this.model('Note').deleteMany({ topic: this._id })
	next()
})

// Reverse populate with virtuals
/**
 * В таблицу topic мы добавили те категории которые относяться к нему
 */
Topicschemea.virtual('notes', {
	ref: 'Note',
	localField: '_id',
	foreignField: 'topic',
	// justOne: false
})

module.exports = mongoose.model('Topic', Topicschemea) 
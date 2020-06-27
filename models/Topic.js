const mongoose = require('mongoose')
const slugify = require('slugify')
const opts = { toJSON: { virtuals: true }, toObject: {virtuals: true} }

// tags model
const tags = new mongoose.Schema({
	photo: String
})
mongoose.model('tags', tags, 'tags' )

// Topic model
const Topicschemea = new mongoose.Schema({
	// title of topic
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
	// desc's topic
	description: {
		type: String,
		required: [ true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters' ]
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
	updatedAt: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
}, opts)
/**
 * это то что происходит на рахных этапах этой схемы, например в момент сохранения записи
 */
// Create bootcamp slug from the title
Topicschemea.pre('save', function(next){
	// eslint-disable-next-line no-console
	console.log('Slugify ran', this.title)
	this.slug = slugify(this.title, { lower: true })
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
	id: true
	// justOne: false
})

module.exports = mongoose.model('Topic', Topicschemea) 
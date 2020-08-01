const mongoose = require('mongoose')
const opts = { toJSON: { virtuals: true }, toObject: {virtuals: true} }

// tags model
const tags = new mongoose.Schema({
	photo: String
})
mongoose.model('tags', tags, 'tags' )

// Topic model
const Topicschemea = new mongoose.Schema({
	title: {
		type: String,
		required: [ true, 'please add a title'],
		unique: true,
		trim: true,
		maxlength: [50, 'Title can not be more than 50 characters' ]
	},
	language: String,
	translation: Array,
	program: {
		type: mongoose.Schema.ObjectId,
		ref: 'Program',
		required: [ true, 'please choose a program']
	},
	publish: { 
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		required: [ true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters' ]
	},
	content: String,
	photo: {
		type: String
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
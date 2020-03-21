const mongoose = require('mongoose')
const slugify = require('slugify')
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }

const NoteSchemea = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'please add a title'],
		unique: true,
		trim: true,
		maxlength: [50, 'Title can not be more than 50 characters']
	},
	language: String,
	translation: Object,
	slug: String,
	level: Number,
	description: {
		type: String,
		required: [true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters'],
	},
	minimumSkill: [{
		type: String,
		required: [true, 'Please add a minium skill'],
		// enum: ['beginner', 'pre-intermediate', 'intermediate', 'advanced']
	}],
	content: String,
	topic: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Topic',
		required: true
	}],
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

}, opts)

NoteSchemea.virtual('rewiews', {
	ref: 'Rewiew',
	localField: '_id',
	foreignField: 'note',
	// justOne: false
})

// static method to get date of update or create date of note
NoteSchemea.statics.setUpdatedAtTopic = async function (topicIds) {
	try {
		await this.model('Topic').updateMany({ '_id': { $in: topicIds } }, {
			$set: {
				updatedAt: new Date()
			}
		})
	} catch (err) {
		console.error(err)
	}
}

NoteSchemea.pre('save', function (next) {
	console.info('Slugify ran', this.title)
	this.slug = slugify(this.title, { lower: true })
	next()
})

// call setUpdatedAtTopic after save
NoteSchemea.post('save', function () {
	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
})

// call setUpdatedAtTopic before remove
NoteSchemea.pre('remove', function () {
	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
})

module.exports = mongoose.model('Note', NoteSchemea) 
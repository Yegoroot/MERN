const mongoose = require('mongoose')
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }

// const RecordSchemea = new mongoose.Schema({
// 	subtitle: {
// 		type: String
// 	},
// 	type: {
// 		type: String,
// 		enum: ['text', 'markdown', 'audio']
// 	},
// 	data: {
// 		type: Object,
// 		required: true
// 	}
// })

// const TagsSchema = new mongoose.Schema({
// 	tag: {
// 		type: String,
// 		enum: ['text', 'md', 'audio']
// 	},
// })

const NoteSchemea = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'please add a title'],
		trim: true,
		maxlength: [150, 'Title can not be more than 50 characters']
	},
	language: String,
	translation: Object,
	publish: { 
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		required: [true, 'please add a descripion'],
		maxlength: [500, 'Descripion can not be more than 500 characters']
	},
	contents: [{
		id: String,
		subtitle: {
			type: String
		},
		type: {
			type: String,
			enum: ['text', 'markdown', 'audio']
		},
		data: {
			type: Object,
			required: true
		}
	}],
	tags: [{
		type: String
	}],
	// tags: [TagsSchema],
	topic: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Topic',
		required: true
	}],
	photo: {
		type: String
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

// // static method to get date of update or create date of note
// NoteSchemea.statics.setUpdatedAtTopic = async function (topicIds) {
// 	try {
// 		await this.model('Topic').updateMany({ '_id': { $in: topicIds } }, {
// 			$set: {
// 				updatedAt: new Date()
// 			}
// 		})
// 	} catch (err) {
// 		console.error(err)
// 	}
// }

// call setUpdatedAtTopic after save
// NoteSchemea.post('save', function () {
// 	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
// })

// call setUpdatedAtTopic before remove
// NoteSchemea.pre('remove', function () {
// 	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
// })

module.exports = mongoose.model('Note', NoteSchemea) 
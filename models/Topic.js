import mongoose from 'mongoose'
import autoIncrementModelID from './Counter.js'

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }

// const TagsShema = new mongoose.Schema({
// 	color: String,
// 	title: String
// })
// mongoose.model('tags', TagsShema )

const TopicSchemea = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please add a title'],
    trim: true,
    unique: false,
    maxlength: [150, 'Title can not be more than 50 characters'],
  },
  language: String,
  translation: Object,
  publish: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    // required: [true, 'please add a descripion'],
    maxlength: [500, 'Descripion can not be more than 500 characters'],
  },
  // order
  sequence: {
    type: Number,
  },
  contents: [{
    // id: String,
    subtitle: {
      type: String,
    },
    type: {
      type: String,
      enum: ['text', 'markdown', 'audio', 'image'],
    },
    data: {
      type: Object,
      required: true,
    },
  }],
  // tags: [{
  // 	type: [Object],
  // 	ref: 'tags'
  // }],
  // hashTag: [{
  // 	type: String
  // }],
  // tags: [TagsSchema],
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'Program',
    required: true,
  },
  photo: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, opts)

// // static method to get date of update or create date of topic
// TopicSchemea.statics.setUpdatedAtTopic = async function (topicIds) {
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
// TopicSchemea.post('save', function () {
// 	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
// })

// call setUpdatedAtTopic before remove
// TopicSchemea.pre('remove', function () {
// 	this.constructor.setUpdatedAtTopic(this.topic) // send iDs topics
// })

TopicSchemea.pre('save', function (next) {
  if (!this.isNew) {
    next()
    return
  }

  autoIncrementModelID('Topic', this, next)
})


export default mongoose.model('Topic', TopicSchemea)

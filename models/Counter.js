var mongoose = require('mongoose')
var Schema = mongoose.Schema

const counterSchema = new Schema(
	{
		_id: {type: String, required: true},
		sequence: { type: Number, default: 0 }
	}
)

counterSchema.index({ _id: 1, sequence: 1 }, { unique: true })

const counterModel = mongoose.model('counter', counterSchema)

const autoIncrementModelID = function (modelName, doc, next) {
	counterModel.findByIdAndUpdate(        // ** Method call begins **
		modelName,                           // The ID to find for in counters model
		{ $inc: { sequence: 1 } },                // The update
		{ new: true, upsert: true },         // The options
		function(error, counter) {           // The callback
			if(error) return next(error)

			doc.sequence = counter.sequence
			next()
		}
	)                                     // ** Method call ends **
}

module.exports = autoIncrementModelID
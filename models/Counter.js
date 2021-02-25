import mongoose from 'mongoose'

const { Schema } = mongoose

const counterSchema = new Schema(
  {
    _id: { type: String, required: true },
    sequence: { type: Number, default: 0 },
  },
)

counterSchema.index({ _id: 1, sequence: 1 }, { unique: true })

const counterModel = mongoose.model('counter', counterSchema)

// eslint-disable-next-line func-names
const autoIncrementModelID = function (modelName, doc, next) {
  counterModel.findByIdAndUpdate( // ** Method call begins **
    modelName, // The ID to find for in counters model
    { $inc: { sequence: 1 } }, // The update
    { new: true, upsert: true }, // The options
    // eslint-disable-next-line consistent-return
    (error, counter) => { // The callback
      if (error) return next(error)

      // eslint-disable-next-line no-param-reassign
      doc.sequence = counter.sequence
      next()
    },
  ) // ** Method call ends **
}

export default autoIncrementModelID

const mongoose = require('mongoose')

const TypeSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please add a title']
	},
	alias: {
		type: String
	},
	color: {
		type: String
	}
})


module.exports = mongoose.model('Type', TypeSchema)

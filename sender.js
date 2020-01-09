const fs = require('fs')
const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env'})

// Load models
const Projects = require('./models/Project')
const Category = require('./models/Category')

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
})

// Read JSON files
const projects = JSON.parse(fs.readFileSync(`${__dirname}/_data/projects.json`, 'utf-8'))
const categories = JSON.parse(fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8'))

// Import into DB
const importData = async () => {
	try{
		await Projects.create(projects)
		await Category.create(categories)

		// eslint-disable-next-line no-console
		console.log('data imported...'.green.inverse)
		process.exit()
	}  catch(err) {
		// eslint-disable-next-line no-console
		console.error(err)
	}
}

// Delete data
const deleteData = async () => {
	try{
		await Projects.deleteMany()
		await Category.deleteMany()

		// eslint-disable-next-line no-console
		console.log('data destroyed...'.red.inverse)
		process.exit()
	}  catch(err) {
		// eslint-disable-next-line no-console
		console.error(err)
	}
}

/**
 * import data to db "node sender.js -i"
 * delete data in db "node sender.js -d" 
 */
if(process.argv[2] === '-i'){
	importData()
} else if (process.argv[2] === '-d') {
	deleteData()
}
const express = require('express')
const router = express.Router({mergeParams: true})
const { 
	getTopics, 
	getTopic, 
	createTopic, 
	updateTopic, 
	deleteTopic, 
	deleteTopics // only superadmin (control this in controllers)
} = require('../controllers/topics')

const {requestModel} = require('../middleware/query')

const Topic = require('../models/Topic')

const { isAuth, haveAccess } = require('../middleware/auth')
const { fileUpload } = require('../middleware/fileUpload')
const NoteRouter = require('./notes')

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

// Re-route into other resourse router
router.use('/:topicId/notes', NoteRouter)


router.route('/')        
	.get(requestModel(Topic), getTopics)
	.post(isAuth, haveAccess(...theseHaveAccess), fileUpload, createTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess), deleteTopics)

router.route('/:id')	
	.get(getTopic)
	.put(isAuth, haveAccess(...theseHaveAccess), fileUpload, updateTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess), deleteTopic)

module.exports = router
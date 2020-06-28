const express = require('express')
const router = express.Router()

const { 
	getTopics, 
	getTopic, 
	createTopic, 
	updateTopic, 
	deleteTopic, 
	topicPhotoUpload, 
	deleteTopics // only superadmin (control this in controllers)
} = require('../controllers/topics')

const advancedResults = require('../middleware/advancedResults')

const Topic = require('../models/Topic')

const { protect, authorize } = require('../middleware/auth')
const { fileUpload } = require('../middleware/fileUpload')
// Include other resource
const NoteRouter = require('./notes')

const allowedUsers = ['superadmin', 'admin', 'teacher']

// Re-route into other resourse router
router.use('/:topicId/notes', NoteRouter)

router.route('/:id/photo').put(protect, authorize(...allowedUsers), topicPhotoUpload)

router.route('/')        
	.get(advancedResults(Topic, { path: 'notes', select: 'title description photo' }), getTopics)
	.post(protect, authorize(...allowedUsers), fileUpload, createTopic)
	.delete(protect, authorize(...allowedUsers), deleteTopics)

router.route('/:id')	
	.get(getTopic)
	.put(protect, authorize(...allowedUsers), fileUpload, updateTopic)
	.delete(protect, authorize(...allowedUsers), deleteTopic)

module.exports = router
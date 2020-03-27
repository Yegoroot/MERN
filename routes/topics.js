const express = require('express')
const router = express.Router()

const { getTopics, getTopic, createTopic, updateTopic, deleteTopic, topicPhotoUpload } = require('../controllers/topics')

const advancedResults = require('../middleware/advancedResults')

const Topic = require('../models/Topic')

const { protect, authorize } = require('../middleware/auth')
const owner = require('../middleware/owner')

// Include other resource
const NoteRouter = require('./notes')

const allowedUsers = ['superadmin', 'admin', 'teacher']

// Re-route into other resourse router
router.use('/:topicId/notes', NoteRouter)

router.route('/:id/photo').put(protect, authorize(...allowedUsers), owner(Topic), topicPhotoUpload)

router.route('/')        
	.get(advancedResults(Topic, { path: 'notes', select: 'title description photo' }), getTopics)
	.post(protect, authorize(...allowedUsers), owner(Topic), createTopic)

router.route('/:id')	
	.get(getTopic)
	.put(protect, authorize(...allowedUsers), owner(Topic), updateTopic)
	.delete(protect, authorize(...allowedUsers), owner(Topic), deleteTopic)

module.exports = router
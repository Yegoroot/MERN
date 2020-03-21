const express = require('express')
const router = express.Router()

const { getTopics, getTopic, createTopic, updateTopic, deleteTopic, topicPhotoUpload } = require('../controllers/topics')

const advancedResults = require('../middleware/advancedResults')

const Topic = require('../models/Topic')

// Include other resource
const NoteRouter = require('./notes')

// Re-route into other resourse router
router.use('/:topicId/notes', NoteRouter)

router.route('/:id/photo').put(topicPhotoUpload)

router.route('/')        
	.get(advancedResults(Topic, { path: 'notes', select: 'title description photo' }), getTopics)
	.post(createTopic)

router.route('/:id')	
	.get(getTopic)
	.put(updateTopic)
	.delete(deleteTopic)

module.exports = router
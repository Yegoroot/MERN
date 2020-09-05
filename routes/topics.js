const express = require('express')
const Topic = require('../models/Topic')
const router = express.Router(/*{mergeParams: true}*/)
const { 
	getTopics,
	getTopic,
	createTopic,
	updateTopic,
	deleteTopic,
	deleteTopics,
	getMyTopic
} = require('../controllers/topics')

const {requestModel} = require('../middleware/query')
const { isAuth, haveAccess } = require('../middleware/auth')

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')        
	.get(requestModel(Topic), getTopics)
	.post(isAuth, haveAccess(...theseHaveAccess), createTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteTopics)

router.route('/my')
	.get(isAuth, haveAccess(...theseHaveAccess), requestModel(Topic, 'my'),  getTopics)
router.route('/my/:id')
	.get(isAuth, haveAccess(...theseHaveAccess), getMyTopic)

router.route('/:id')	
	.get(getTopic)
	.put(isAuth, haveAccess(...theseHaveAccess), updateTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteTopic)

module.exports = router
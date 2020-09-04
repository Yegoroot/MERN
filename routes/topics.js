const express = require('express')
const router = express.Router({mergeParams: true})

const { getTopics, getTopic, createTopic, updateTopic, deleteTopic, deleteTopics } = require('../controllers/topics')

const Topic = require('../models/Topic')
const {requestModel} = require('../middleware/query')

const { isAuth, haveAccess } = require('../middleware/auth')

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')        
	.get(requestModel(Topic), getTopics)
	.post(isAuth, haveAccess(...theseHaveAccess), createTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteTopics)

router.route('/:id')	
	.get(getTopic)
	.put(isAuth, haveAccess(...theseHaveAccess), updateTopic)
	.delete(isAuth, haveAccess(...theseHaveAccess),  deleteTopic)

module.exports = router
const express = require('express')
const router = express.Router()

const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projects')

// Include other resource
const CategoryRouter = require('./categories')

// Re-route into other resourse router
router.use('/:projectId/categories', CategoryRouter)

router.route('/')        
	.get(getProjects)
	.post(createProject)

router.route('/:id')	
	.get(getProject)
	.put(updateProject)
	.delete(deleteProject)

module.exports = router
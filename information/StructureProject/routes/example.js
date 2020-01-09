const express = require('express')
const router = express.Router()

const { getExamples, getExample, createExample, updateExample, deleteExample } = require('../controllers/examples')

router.route('/')        
	.get(getExamples)
	.post(createExample)

router.route('/:id')	
	.get(getExample)
	.put(updateExample)
	.delete(deleteExample)

module.exports = router
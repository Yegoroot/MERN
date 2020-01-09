const express = require('express')
const router = express.Router({mergeParams: true})

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories')

router.route('/')        
	.get(getCategories)
	.post(createCategory)

router.route('/:id')	
	.get(getCategory)
	.put(updateCategory)
	.delete(deleteCategory)

module.exports = router
const express = require('express')
const router = express.Router({mergeParams: true})

const { getNotes } = require('../controllers/notes')

router.route('/')        
	.get(getNotes)
	// .post(createCategory)

// router.route('/:id')	
// 	.get(getCategory)
// 	.put(updateCategory)
// 	.delete(deleteCategory)

module.exports = router
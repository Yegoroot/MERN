const express = require('express')
const router = express.Router({mergeParams: true})

const { getRewiews } = require('../controllers/rewiews')

router.route('/')        
	.get(getRewiews)

module.exports = router
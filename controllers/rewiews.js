const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Rewiew = require('../models/Rewiew')

// @desc    Get all rewiews
// @route   GET /api/v1/rewiews
// @route   GET /api/v1/topics/:topicsId/rewiews
// @access  Public
exports.getRewiews = asyncHandler(async (req, res, next) => {
	let query

	// Copy req query
	let reqQuery = {...req.query}

	/**
	 * этот topicId перетягивается с topic роутера 
	 * и в этом месте мы получаем список категорий в определенном проекте
	 */
	if(req.params.noteId) {
		reqQuery.note = req.params.noteId
	} 

	// Fields to exclude  // 1 это наши внутренние поля нужны для внутренней обработки 
	const removeFilelds = ['select', 'sort', 'page', 'limit']

	// loop over removeFileds and delete them from reqQuery // 2 и поэтому в запросе к БД их не должно быть (в БД таких полей нет)
	removeFilelds.forEach(param => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create opertators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	// Finding resource
	if(req.params.noteId) {
		/** 
		 * если выводим /rewiews/__hash__/rewiews то не зачем вставлять данные о категории
		 */
		query = Rewiew.find(JSON.parse(queryStr)) 
	}  else {

		query = Rewiew.find(JSON.parse(queryStr)).populate({
			path: 'note',
			select: 'name description'
		})
	}

	// Select Fileds
	if(req.query.select) {
		const filds = req.query.select.split(',').join(' ')
		query = query.select(filds) // Стандартная ф-ия mongoose select(param1 param2) with spaces
	}

	// Sort
	if(req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		query = query.sort(sortBy)
	} else {
		query.sort('-createdAt')
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 25
	const startIndex = (page -1) * limit
	const endIndex = page * limit
	const total = await Rewiew.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const rewiews = await query  

	// Pagination result
	const pagination = {}
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		}
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		}
	}

	res.status(200).json({success: true, count: rewiews.length, pagination, data: rewiews})

})

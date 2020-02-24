const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Note = require('../models/Note')

// @desc    Get all categories
// @route   GET /api/v1/categories
// @route   GET /api/v1/projects/:projectsId/categories
// @access  Public
exports.getNotes = asyncHandler(async (req, res, next) => {
	let query

	// Copy req query
	let reqQuery = {...req.query}

	/**
	 * этот projectId перетягивается с project роутера 
	 * и в этом месте мы получаем список категорий в определенном проекте
	 */
	if(req.params.categoryId) {
		reqQuery.category = req.params.categoryId
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
	if(req.params.categoryId) {
		/** 
		 * если выводим /categories/__hash__/notes то не зачем вставлять данные о категории
		 */
		query = Note.find(JSON.parse(queryStr)) 
	}  else {

		query = Note.find(JSON.parse(queryStr)).populate({
			path: 'category',
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
	const total = await Note.countDocuments()
	query.skip(startIndex).limit(limit)

	// Executing query
	const notes = await query  

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

	res.status(200).json({success: true, count: notes.length, pagination, data: notes})

})

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
// exports.getCategory =  asyncHandler(async (req, res, next) => {

// 	const category = await Category.findById(req.params.id)
		
// 	if(!category) {	
// 		return	next(new ErrorResponse(`Category not found with of id ${req.params.id}`, 404))
// 	}
		
// 	res.status(200).json({success: true, data: category})
// })

// @desc    Create category
// @route   POST /api/v1/categories/:id
// @access  Private
// exports.createCategory = asyncHandler(async (req, res, next) => {

// 	const category = await Category.create(req.body)
// 	res.status(201).json({success: true, data: category})
// })

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private
// exports.updateCategory = asyncHandler(async (req, res, next) => {

// 	const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 		runValidators: true
// 	})
	
// 	if (!category) {
// 		return	next(new ErrorResponse(`Category not found with of id ${req.params.id}`, 404))
// 	}
		
// 	return res.status(200).json({success: true, data: category})
// })

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
// exports.deleteCategory = asyncHandler(async (req, res, next) => {

// 	const category = await Category.findByIdAndDelete(req.params.id)
	
// 	if (!category) {
// 		return	next(new ErrorResponse(`Category not found with of id ${req.params.id}`, 404))
// 	}

// 	return res.status(200).json({success: true, data: {}})
// })
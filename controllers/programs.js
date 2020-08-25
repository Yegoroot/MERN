const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Program = require('../models/Program')

// @desc    Get all programs
// @route   GET /api/v1/programs
// @access  Public
exports.getPrograms = asyncHandler(async (req, res, next) => {
	req.requestModel.populate([
		{ path: 'topics', select: 'title description photo -program' },
		{ path: 'user', select: 'name email' }
	])

	const programs = await req.requestModel

	res.status(200).json({
		success: true,
		count: programs.length,
		total: req.total,
		data: programs
	})
})

// @desc    Get single program
// @route   GET /api/v1/program/:id
// @access  Public
exports.getProgram =  asyncHandler(async (req, res, next) => {
	const program = await Program.findById(req.params.id)
		.populate({
			path: 'topics',
			select: 'title description photo'
		})
		.populate({
			path: 'user',
			select: 'name email'
		})

	if(!program || !program.publish) {	
		return	next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))
	}
	res.status(200).json({success: true, data: program})
})

// @desc    Create program
// @route   POST /api/v1/program/:id
// @access  Private
exports.createProgram = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id // Add user to req.body
	
	const program = await Program.create(req.body)
	res.status(201).json({success: true, data: program})
})

// @desc    Update program
// @route   PUT /api/v1/programs/:id
// @access  Private
exports.updateProgram = asyncHandler(async (req, res, next) => {

	let program = await Program.findById(req.params.id)

	if (!program) {
		return	next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))
	}
	
	// Make shure user is owner
	if (program.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}

	program = await Program.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})
		
	return res.status(200).json({success: true, data: program})
})

// @desc    Delete program
// @route   DELETE /api/v1/programs/:id
// @access  Private
exports.deleteProgram = asyncHandler(async (req, res, next) => {

	const program = await Program.findById(req.params.id)
	if (!program) {
		return	next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))
	}
	// Make shure user is owner
	if (program.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
		return	next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
	}
	program.remove() // не используем deleteByID потому что не сработает событие .pre('remove',
	return res.status(200).json({success: true, data: {}})
})

// @desc    Delete programs
// @route   DELETE /api/v1/programs/?ids=1,2
// @access  Private
// exports.deletePrograms = asyncHandler(async (req, res, next) => {
// 	const ids = req.query.ids.split(',')
// 	if ( req.user.role !== 'superadmin') {
// 		return	next(new ErrorResponse(`This user is not allowed to work with ${ids}`, 401))
// 	}
// 	await Program.deleteMany(
// 		{	_id: {	$in: ids	}	},
// 		(error, result) => {
// 			if (error) {
// 				res.status(200).json({success: false, error})
// 			} else {
// 				res.status(200).json({success: true, data: {}})
// 			}
// 		}
// 	)
// })


import Busboy from 'busboy'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Program from '../models/Program.js'
import { createProgramPhotoDirectories, pathProgram, convertCompress } from '../utils/fileUpload.js'
import QueryPrograms from '../utils/QueryPrograms.js'


// @desc    Get all programs
// @route   GET /api/v1/programs
// @access  Public
export const getPrograms = asyncHandler(async (req, res) => {
  const query = new QueryPrograms(req.query, Program, req.user)
  query.sendRequest()
  const programs = await query.getData()
  const total = await query.getTotal()

  res.status(200).json({
    success: true,
    count: programs.length,
    total,
    data: programs,
  })
})


// @desc    Get single program
// @route   GET /api/v1/program/:id
// @access  Public
export const getProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id)
    .populate({ path: 'topics', select: 'title description' })
    .populate({ path: 'user', select: 'name email' })
    .populate({ path: 'types', select: 'title alias color' })
  const result = () => res.status(200).json({ success: true, data: program })
  const error = () => next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))

  if (!program) {
    return error()
  }
  if (req.user.role === 'superadmin' || program.publish || `${req.user._id}` === `${program.user._id}`) {
    return result()
  }
  return error()
})


// @desc    Create program
// @route   POST /api/v1/program/:id
// @access  Private
export const createProgram = asyncHandler(async (req, res) => {
  const program = new Program({})
  // user from previous middleware
  program.user = req.user.id
  // create special folder for program
  createProgramPhotoDirectories(program.id)

  const busboy = new Busboy({ headers: req.headers })

  busboy.on('file', (fieldname, file, filename) => {
    // SAVE PHOTO
    const _fileName = `photo${path.extname(filename)}`
    const saveFileTo = path.join(pathProgram(program.id), '/photo', _fileName); file.pipe(fs.createWriteStream(saveFileTo))
    program.photo = _fileName
  })

  busboy.on('field', (fieldname, val) => {
    program[fieldname] = val
    if (fieldname === 'types') {
      program[fieldname] = JSON.parse(val)
    }
  })

  busboy.on('finish', () => {
    // eslint-disable-next-line consistent-return
    program.save(async (error) => {
      if (error) {
        rimraf.sync(pathProgram(program.id))
        return res.status(400).json({ success: false, error: JSON.stringify(error) })
      }
      // CONVERT AND COMPRESS
      const from = `public/uploads/programs/${program.id}/photo/*.{jpg,JPG,png,PNG,jpeg,JPEG}`
      const to = `public/uploads/programs/${program.id}/photo/compress`
      await convertCompress(from, to)
      res.status(201).json({ success: true, data: program })
    })
  })
  req.pipe(busboy)
})


// @desc    Update program
// @route   PUT /api/v1/programs/:id
// @access  Private
// eslint-disable-next-line consistent-return
export const updateProgram = asyncHandler(async (req, res, next) => {
  let program = await Program.findById(req.params.id)

  if (!program) {
    return next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))
  }
  // Make shure user is owner
  if (program.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
    return next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 403))
  }

  createProgramPhotoDirectories(program.id) // check if no - create

  /**
 * ----------------
 */
  const busboy = new Busboy({ headers: req.headers })

  busboy.on('file', (fieldname, file, filename) => {
    // SAVE PHOTO
    const _fileName = `photo${path.extname(filename)}`
    const saveFileTo = path.join(pathProgram(program.id), '/photo', _fileName); file.pipe(fs.createWriteStream(saveFileTo))
    program.photo = `${_fileName}?${new Date().getTime()}`
  })

  busboy.on('field', (fieldname, val) => {
    program[fieldname] = val
    if (fieldname === 'types') {
      program[fieldname] = JSON.parse(val)
    }
  })

  busboy.on('finish', async () => {
    try {
      program.updatedAt = new Date().toISOString() // date of update
      program = await Program.findByIdAndUpdate(req.params.id, program, {
        new: true,
        runValidators: true,
      })
      // CONVERT AND COMPRESS
      const from = `public/uploads/programs/${program.id}/photo/*.{jpg,JPG,png,PNG,jpeg,JPEG}`
      const to = `public/uploads/programs/${program.id}/photo/compress`
      await convertCompress(from, to)
      res.status(200).json({ success: true, data: program })
    } catch (error) {
      res.status(400).json({ success: false, error: JSON.stringify(error) || 'Here Error' })
    }
  })
  req.pipe(busboy)
  /**
 * ----------------
 */
})


// @desc    Delete program
// @route   DELETE /api/v1/programs/:id
// @access  Private
export const deleteProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id)
  if (!program) {
    return next(new ErrorResponse(`Program not found with of id ${req.params.id}`, 404))
  }
  if (program.user.toString() !== req.user.id && req.user.role !== 'superadmin') { // Make shure user is owner
    return next(new ErrorResponse(`This user is not allowed to work with ${req.params.id}`, 401))
  }
  program.remove() // не используем deleteByID потому что не сработает событие .pre('remove',
  rimraf.sync(pathProgram(program.id))
  return res.status(200).json({ success: true, data: {} })
})

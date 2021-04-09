import Busboy from 'busboy'
import path from 'path'
import fs from 'fs-extra'
import rimraf from 'rimraf'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Topic from '../models/Topic.js'
import { createRecordDirectory, createDirectory, convertCompress } from '../utils/fileUpload.js'
import QueryTopics from '../utils/QueryTopics.js'

export const createAudioRecord = asyncHandler(async (req, res) => {
  const body = {}
  let _fileName
  let size = 0
  const busboy = new Busboy({ headers: req.headers })

  busboy.on('field', (fieldname, val) => { body[fieldname] = val })
  busboy.on('file', (fieldname, file, filename) => {
    _fileName = filename

    file.on('data', (data) => {
      size = data.length + size
    })

    /*
* Сохраняем во временную папку
*/
    createDirectory('public/tmp/records/audio')
    const tmp = path.join('public/tmp/records/audio', filename)
    file.pipe(fs.createWriteStream(tmp))

    file.on('end', () => {
      /**
 * Переносим в нужную директорию
 */
      const { programId, topicId, recordId } = body
      const recordFolder = `public/uploads/programs/${programId}/topics/${topicId}/contents/${recordId}/`
      createRecordDirectory({
        programId, topicId, recordId, withoutCompress: true,
      })
      try {
        fs.moveSync(tmp, path.join(recordFolder, filename))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    })
  })

  busboy.on('finish', async () => {
    const { topicId, recordId } = body
    res.status(201).json({
      audio: `/topics/${topicId}/contents/${recordId}/${_fileName}`,
      file: _fileName,
      size,
      annotations: [],
    })
  })
  req.pipe(busboy)
})


export const createImageRecord = asyncHandler(async (req, res) => {
  const body = {}
  let _fileName
  const busboy = new Busboy({ headers: req.headers })

  busboy.on('field', (fieldname, val) => { body[fieldname] = val })
  busboy.on('file', (fieldname, file, filename) => {
    /*
* Сохраняем во временную папку
*/
    createDirectory('public/tmp/records/images')
    const tmp = path.join('public/tmp/records/images', filename)
    file.pipe(fs.createWriteStream(tmp))

    file.on('end', () => {
      /**
 * Переносим в нужную директорию
 */
      const { programId, topicId, recordId } = body
      _fileName = `image${path.extname(filename)}`
      const imageFolder = `public/uploads/programs/${programId}/topics/${topicId}/contents/${recordId}/`

      // If update image, first of all delete all in that folder
      if (fs.existsSync(imageFolder)) {
        rimraf.sync(imageFolder)
        // console.log('000')
        createRecordDirectory({ programId, topicId, recordId })
        // console.log('555')
      } else {
        // console.log('777')
        createRecordDirectory({ programId, topicId, recordId })
      }
      try {
        // console.log('888', fs.fs.existsSync(imageFolder))
        fs.moveSync(tmp, path.join(imageFolder, _fileName))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error Here 3'.red, e)
      }
    })
  })

  busboy.on('finish', async () => {
    const { programId, topicId, recordId } = body
    const imageFolder = `public/uploads/programs/${programId}/topics/${topicId}/contents/${recordId}/`

    /**
     * Сжимаем изображения
     */
    const from = `${imageFolder}*.{jpg,JPG,png,PNG,jpeg,JPEG,gif}`
    const to = path.join(imageFolder, '/compress')

    await convertCompress(from, to)
    // const a = await convertCompress(from, to)
    // console.log(`finish ${_fileName}`.green)
    // console.log(`finish from Promise ${a}`.green)
    res.status(201).json({
      image: `topics/${topicId}/contents/${recordId}/compress/${_fileName}?${new Date().getTime()}`,
    })
  })
  req.pipe(busboy)
})


export const deleteRecord = asyncHandler(async (req, res) => {
  const { programId, topicId, recordId } = req.body
  if (!!programId && !!topicId && !!recordId) {
    const recordFolder = `public/uploads/programs/${programId}/topics/${topicId}/contents/${recordId}/`
    rimraf.sync(recordFolder)
    return res.status(200).json({ success: true, data: {} })
  }
  return res.status(400).json({ success: false, error: `Not enought data ${programId} ${topicId} ${recordId}` })
})


export const getTopics = asyncHandler(async (req, res) => {
  const query = new QueryTopics(req.query, Topic, req.user)
  query.sendRequest()
  const topics = await query.getData()
  const total = await query.getTotal()

  res.status(200).json({
    success: true,
    count: topics.length,
    total,
    data: topics,
  })
})


export const getTopic = asyncHandler(async (req, res, next) => {
  const topic = await Topic.findById(req.params.id)
    .populate({ path: 'program', select: 'title' })
    .populate({ path: 'user', select: 'name' })

  const result = () => res.status(200).json({ success: true, data: topic })
  const error = () => next(new ErrorResponse('404 The requested topic was not found', 404))

  if (!topic) {
    return error()
  }
  if (req.user.role === 'superadmin' || topic.publish || `${req.user._id}` === `${topic.user._id}`) {
    return result()
  }
  return error()
})

export const createTopic = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id
  /**
  * Move directory
  */
  if (req.body.programId !== req.body.program) {
    try {
      fs.copySync(
        `public/uploads/programs/${req.body.programId}/topics/${req.body._id}`,
        `public/uploads/programs/${req.body.program}/topics/${req.body._id}`,
      )
      rimraf.sync(`public/uploads/programs/${req.body.programId}/topics/${req.body._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (req.body.sections) {
    req.body.sections = JSON.parse(req.body.sections)
  }
  const topic = await Topic.create(req.body)
  res.status(201).json({ success: true, data: topic })
})

export const updateTopic = asyncHandler(async (req, res, next) => {
  let topic = await Topic.findById(req.params.id)
  if (!topic) {
    return next(new ErrorResponse('404 The requested topic was not found', 404))
  }
  // Make shure user is owner
  if (topic.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  /**
  * Move directory
  */
  if (req.body.programId !== req.body.program) {
    try {
      fs.copySync(
        `public/uploads/programs/${req.body.programId}/topics/${req.body._id}`,
        `public/uploads/programs/${req.body.program}/topics/${req.body._id}`,
      )
      rimraf.sync(`public/uploads/programs/${req.body.programId}/topics/${req.body._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  // req.body.updatedAt = Date.now

  req.body.updatedAt = new Date().toISOString() // date of update

  topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  return res.status(200).json({ success: true, data: topic })
})

export const deleteTopic = asyncHandler(async (req, res, next) => {
  const topic = await Topic.findById(req.params.id)
  if (!topic) {
    return next(new ErrorResponse('404 The requested topic was not found', 404))
  }
  if (topic.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('403 Not allowed to access this route', 403))
  }
  const topicFolder = `public/uploads/programs/${topic.program}/topics/${req.params.id}`
  await topic.remove()
  rimraf.sync(topicFolder)
  return res.status(200).json({ success: true, data: {} })
})

// eslint-disable-next-line consistent-return
// export const deleteTopics = asyncHandler(async (req, res, next) => {
//   const ids = req.query.ids.split(',')
//   if (req.user.role !== 'superadmin') {
//     return next(new ErrorResponse('403 Not allowed to access this route', 403))
//   }
//   await Topic.deleteMany(
//     { _id: { $in: ids } },
//     // eslint-disable-next-line consistent-return
//     (error) => {
//       if (error) {
//         return next(new ErrorResponse(`${error.message}`, 500))
//       }
//       res.status(200).json({ success: true, data: {} })
//     },
//   )
// })


export const updateTopics = asyncHandler(async (req, res) => {
  const { topics } = req.body
  return Topic.bulkWrite(topics.map((obj) => {
    // console.log(obj);
    const { _id, ...update } = obj
    return {
      updateOne: {
        filter: { _id },
        update: { // obj.sequence
          // $setOnInsert: { author: author },
          $set: update,
        },
        upsert: true,
      },
    }
  }))
    .then(() => {
      // console.log(result)
      res.status(200).json({ success: true, data: {} })
    })
  // .catch((e) => reject(e));
})

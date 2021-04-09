import express from 'express'
import {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  createImageRecord,
  createAudioRecord,
  deleteRecord,
  updateTopics,
} from '../controllers/topics.js'

import { whoIs, haveAccess } from '../middleware/auth.js'

const router = express.Router(/* {mergeParams: true} */)

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.use(whoIs)

router.route('/')
  .get(getTopics)
  .post(haveAccess(...theseHaveAccess), createTopic)

// order topics
router.route('/order')
  .post(haveAccess(...theseHaveAccess), updateTopics)

router.route('/record/image')
  .post(haveAccess(...theseHaveAccess), createImageRecord)
router.route('/record/audio')
  .post(haveAccess(...theseHaveAccess), createAudioRecord)
router.route('/recorddelete')
  .post(haveAccess(...theseHaveAccess), deleteRecord)

router.route('/:id')
  .get(getTopic)
  .put(haveAccess(...theseHaveAccess), updateTopic)
  .delete(haveAccess(...theseHaveAccess), deleteTopic)

export default router

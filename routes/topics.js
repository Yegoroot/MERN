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

import { isAuth, haveAccess } from '../middleware/auth.js'

const router = express.Router(/* {mergeParams: true} */)

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')
  .get(isAuth, getTopics)
  .post(isAuth, haveAccess(...theseHaveAccess), createTopic)

// order topics
router.route('/order')
  .post(isAuth, haveAccess(...theseHaveAccess), updateTopics)

router.route('/record/image')
  .post(isAuth, haveAccess(...theseHaveAccess), createImageRecord)
router.route('/record/audio')
  .post(isAuth, haveAccess(...theseHaveAccess), createAudioRecord)
router.route('/recorddelete')
  .post(isAuth, haveAccess(...theseHaveAccess), deleteRecord)

router.route('/:id')
  .get(isAuth, getTopic)
  .put(isAuth, haveAccess(...theseHaveAccess), updateTopic)
  .delete(isAuth, haveAccess(...theseHaveAccess), deleteTopic)

export default router

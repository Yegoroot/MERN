import express from 'express'
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programs.js'

import { whoIs, haveAccess } from '../middleware/auth.js'
import { photoUploadProtect } from '../middleware/photoUploadProtect.js'

const router = express.Router()

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.use(whoIs)

router.route('/')
  .get(getPrograms)
  .post(haveAccess(...theseHaveAccess), photoUploadProtect, createProgram)

router.route('/:id')
  .get(getProgram)
  .put(haveAccess(...theseHaveAccess), photoUploadProtect, updateProgram)
  .delete(haveAccess(...theseHaveAccess), deleteProgram)

export default router

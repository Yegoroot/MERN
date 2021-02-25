import express from 'express'
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  // getMyProgram
} from '../controllers/programs.js'

import { isAuth, haveAccess } from '../middleware/auth.js'
import { photoUploadProtect } from '../middleware/photoUploadProtect.js'

const router = express.Router()

const theseHaveAccess = ['superadmin', 'admin', 'teacher']

router.route('/')
  .get(isAuth, getPrograms)
  .post(isAuth, haveAccess(...theseHaveAccess), photoUploadProtect, createProgram)
  .delete(isAuth, haveAccess(...theseHaveAccess))

router.route('/:id')
  .get(isAuth, getProgram)
  .put(isAuth, haveAccess(...theseHaveAccess), photoUploadProtect, updateProgram)
  .delete(isAuth, haveAccess(...theseHaveAccess), deleteProgram)

export default router

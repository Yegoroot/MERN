import express from 'express'

import { isAuth, haveAccess } from '../middleware/auth.js'
import {
  getTypes,
  getType,
  createType,
  updateType,
  deleteType,
} from '../controllers/types.js'

const router = express.Router()

router.use(isAuth) // ONLY AUTH USERS

router.route('/')
  .get(getTypes, haveAccess(...['superadmin', 'admin']))
  .post(createType, haveAccess(...['superadmin']))

router.route('/:id')
  .get(getType, haveAccess(...['superadmin']))
  .put(updateType, haveAccess(...['superadmin']))
  .delete(deleteType, haveAccess(...['superadmin']))

export default router

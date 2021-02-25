import express from 'express'

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js'

import { isAuth, haveAccess } from '../middleware/auth.js'
import { createUserMiddleWare, isOwner } from '../middleware/user.js'

const router = express.Router()

router.use(isAuth) // ONLY AUTH USERS
router.use(haveAccess(...['superadmin', 'admin'])) // ONLY SUOERADMIN and ADMIN

router.route('/')
  .get(getUsers)
  .post(createUserMiddleWare, createUser)

router.route('/:id')
  .get(getUser)
  .put(isOwner, createUserMiddleWare, updateUser)
  .delete(isOwner, deleteUser)

export default router

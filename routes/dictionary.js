import express from 'express'

import { isAuth } from '../middleware/auth.js'
import {
  getDictionary,
  createDictionary,
  updateDictionary,
  deleteDictionary,
} from '../controllers/dictionary.js'

const router = express.Router()

router.use(isAuth) // ONLY AUTH USERS

router.route('/')
  .get(getDictionary)
  .post(createDictionary)

router.route('/:id')
  // .get(getDictionary)
  .put(updateDictionary)
  .delete(deleteDictionary)


export default router

import express from 'express'

import { isAuth } from '../middleware/auth.js'
import {
  getDictionary,
  createDictionary,
  getCategoryDictionary,
  updateCategoryDictionary,
  deleteCategoryDictionary,
  createCategoryDictionary,
} from '../controllers/dictionary.js'

const router = express.Router()

router.use(isAuth) // ONLY AUTH USERS

router.route('/')
  .get(getDictionary)
  .post(createDictionary)

router.route('/:id')
  .get(getCategoryDictionary)
  .post(createCategoryDictionary)
  .put(updateCategoryDictionary)
  .delete(deleteCategoryDictionary)

export default router

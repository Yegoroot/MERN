import express from 'express'

import { isAuthOnly } from '../middleware/auth.js'
import {
  // INFO dictionary
  getDictionary,
  createDictionary,
  // INFO category
  getCategoryDictionary,
  updateCategoryDictionary,
  deleteCategoryDictionary,
  createCategoryDictionary,
  // INFO word
  deleteWordCategory,
  createWordCategory,
  updateWordCategory,
} from '../controllers/dictionary.js'

const router = express.Router()

router.use(isAuthOnly) // checking what user is

/**
 * Dictionary routes
 */
router.route('/')
  .get(getDictionary) // get dictionary for current user
  .post(createDictionary) // create dictionary from current user

/**
 * Category routes
 */
router.route('/cat')
  .post(createCategoryDictionary)

router.route('/cat/:id')
  .get(getCategoryDictionary)
  .put(updateCategoryDictionary)
  .delete(deleteCategoryDictionary)

/**
 * Word routes
 */
router.route('/word')
  .post(createWordCategory)

router.route('/word/:id')
  .put(updateWordCategory)
  .delete(deleteWordCategory)

export default router

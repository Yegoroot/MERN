import express from 'express'
import {
  register,
  login,
  logout,
  getMe
  // forgotPassword,
  // resetPassword,
  // updateDetails,
  // updatePassword,
} from '../controllers/auth.js'
import { isAuth } from '../middleware/auth.js'

const router = express.Router()

router
  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)
  // .post('/forgotpassword', forgotPassword)
  // .put('/resetpassword/:resettoken', resetPassword)
  .get('/me', isAuth, getMe)
  // .put('/updatedetails', isAuth, updateDetails)
  // .put('/updatepassword', isAuth, updatePassword)

export default router

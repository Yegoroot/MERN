import express from 'express'
import passport from 'passport'
import { register, login, getMe } from '../controllers/auth.js'
import { isAuth } from '../middleware/auth.js'

const router = express.Router()

router
  .post('/register', register)
  .post('/login', login)
  .get('/me', isAuth, getMe)

  // -------------- google
  .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  .get('/google/redirect', passport.authenticate('google', { failureRedirect: '/failed', session: true }),
    (req, res) => {
      res.redirect(process.env.DOMAIN_CLIENT)
    })
  .get('/logout', (req, res) => {
    if (req.user) {
      req.logout()
    }
    res.status(200).json({
      success: true,
      user: null,
    })
  })

export default router

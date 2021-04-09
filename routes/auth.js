import express from 'express'
import passport from 'passport'
import { register, login, getMe } from '../controllers/auth.js'
import { whoIs } from '../middleware/auth.js'

const router = express.Router()

const succesRedirect = (req, res) => {
  res.redirect(`${process.env.DOMAIN_CLIENT}/app/programs`)
}

const authenticateParams = { failureRedirect: `${process.env.DOMAIN_CLIENT}/login`, session: true }

router
  .post('/register', register)
  .post('/login', login)
  .get('/me', whoIs, getMe)

  // -------------- google
  .get('/social/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  .get('/social/google/redirect', passport.authenticate('google', authenticateParams), succesRedirect)
  // -------------- twitter
  .get('/social/twitter', passport.authenticate('twitter'))
  .get('/social/twitter/redirect', passport.authenticate('twitter', authenticateParams), succesRedirect)
  // -------------- github
  .get('/social/github', passport.authenticate('github'))
  .get('/social/github/redirect', passport.authenticate('github', authenticateParams), succesRedirect)
  // ------------
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

/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable padded-blocks */
import express, { json } from 'express'
import morgan from 'morgan'
import 'colors'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import './config/env.js' // FIRST !
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import errorHandlrer from './middleware/error.js'
import programs from './routes/programs.js'
import topics from './routes/topics.js'
import auth from './routes/auth.js'
import users from './routes/users.js'
import connectDB from './config/db.js'
import types from './routes/types.js'
import User from './models/User.js'

// const xss = require('xss-clean')

const __dirname = dirname(fileURLToPath(import.meta.url))
global.MadinahBackRootPath = path.resolve(__dirname)

connectDB()

const app = express()

app.use(session({
  secret: 'secretcode',
  resave: true,
  saveUninitialized: true,
  // cookie: {
  //   sameSite: 'none',
  //   secure: true,
  //   maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
  // },
}))

// Passport

passport.serializeUser((user, done) => {
  console.log('serialise'.blue, user)
  return done(null, user._id)
})
passport.deserializeUser((id, done) => {
  console.log('passport.deserializeUser'.bgCyan.black, id)
  return User.findById(id, (err, user) => {
    if (err) { return done(err) }
    done(null, user)
  })
})
passport.use(
  new GoogleStrategy(
    {
      clientID: '791056805684-cr7s4rpmur3a31m8c6afi4hcr374r5mt.apps.googleusercontent.com',
      clientSecret: 'VQ034eSriGlu4yUvA_arwpWN',
      callbackURL: '/api/v1/auth/google/redirect',
    },
    async (accessToken, refreshToken, profileGoogle, done) => await User.findOne({ 'profile.id': profileGoogle.id },
      (err, user) => {
        if (err) { return done(err) }

        if (!user) {
          user = new User({
            name: profileGoogle.displayName,
            email: profileGoogle.emails[0].value,
            username: profileGoogle.username,
            provider: 'google',
            profile: {
              id: profileGoogle.id,
              name: profileGoogle.displayName,
              email: profileGoogle.emails[0].value,
              photo: profileGoogle.photos[0].value,
            },
          })
          user.save((_err) => {
            if (_err) console.log('err ser'.red, _err)
            return done(_err, user)
          })
        } else {
        // found user. Return
          return done(err, user)
        }
      })
    ,
  ),
)

app.use(passport.initialize())
app.use(passport.session())
/*
- _
-
-
-
-
-
--

*/

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// Body parser
app.use(json())

// Dev logging middleware if(process.env.NODE_ENV === 'development') {// }
app.use(morgan('dev'))

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attaks // если я это включу то мои topics будут сохраняться кракозябрами вместo > - &lp
// app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
})
app.use(limiter)

// Prevent http param pillution
app.use(hpp())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/topics', topics)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/programs', programs)
app.use('/api/v1/types', types)

app.use(errorHandlrer)

const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue),
)

// Handle unhandle promise rejecttion
process.on('unhandledRejection', (err) => {
  console.log(`Error Ya Ahki:  ${err.message}`.red)
  server.close(() => process.exit(1)) // Close server & exit procces
})

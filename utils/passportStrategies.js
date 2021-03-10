/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
import { Strategy as AuthGoogleStrategy } from 'passport-google-oauth20'
// import { Strategy as AuthTwitterStrategy } from 'passport-twitter'
import { Strategy as AuthGitHubStrategy } from 'passport-github'
import User from '../models/User.js'

export const GoogleStrategy = () => new AuthGoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN_SERVER}/api/v1/auth/social/google/redirect`,
  },
  async (accessToken, refreshToken, socialProfile, cb) => await User.findOne({ 'profile.id': socialProfile.id, provider: 'google' },
    (err, user) => {
      if (err) { return cb(err) }
      if (!user) {
        user = new User({
          name: socialProfile.displayName,
          email: socialProfile.emails[0].value,
          username: socialProfile.username,
          provider: 'google',
          profile: {
            id: socialProfile.id,
            name: socialProfile.displayName,
            email: socialProfile.emails[0].value,
            photo: socialProfile.photos[0].value,
          },
        })
        user.save((_err) => {
          if (_err) console.log('err ser'.red, _err)
          return cb(_err, user)
        })
      } else {
        // found user. Return
        return cb(err, user)
      }
    }),
)


// export const TwitterStrategy = () => new AuthTwitterStrategy({
//   consumerKey: `${process.env.TWITTER_CLIENT_ID}`,
//   consumerSecret: `${process.env.TWITTER_CLIENT_SECRET}`,
//   callbackURL: `${process.env.DOMAIN_SERVER}/api/v1/auth/social/twitter/redirect`,
// },
// async (accessToken, refreshToken, socialProfile, cb) => await User.findOne({ 'profile.id': socialProfile.id, provider: 'twitter' },
//   (err, user) => {
//     if (err) { return cb(err) }

//     console.log(socialProfile, 'socialProfile'.red)
//     if (!user) {
//       user = new User({
//         name: socialProfile.displayName,
//         email: socialProfile.emails[0].value,
//         username: socialProfile.username,
//         provider: 'twitter',
//         profile: {
//           id: socialProfile.id,
//           name: socialProfile.displayName,
//           email: socialProfile.emails[0].value,
//           photo: socialProfile.photos[0].value,
//         },
//       })
//       user.save((_err) => {
//         if (_err) console.log('err ser'.red, _err)
//         return cb(_err, user)
//       })
//     } else {
//     // found user. Return
//       return cb(err, user)
//     }
//   }))


export const GithubStrategy = () => new AuthGitHubStrategy({
  clientID: `${process.env.GITHUB_CLIENT_ID}`,
  clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
  callbackURL: `${process.env.DOMAIN_SERVER}/api/v1/auth/social/github/redirect`,
},
async (accessToken, refreshToken, socialProfile, cb) => await User.findOne({ 'profile.id': socialProfile.id, provider: 'github' },
  (err, user) => {
    if (err) { return cb(err) }
    if (!user) {
      user = new User({
        name: socialProfile.username,
        email: socialProfile?.emails ? socialProfile.emails[0].value : null,
        username: socialProfile.username,
        provider: 'github',
        profile: {
          id: socialProfile.id,
          name: socialProfile.username,
          email: socialProfile?.emails ? socialProfile.emails[0].value : null,
          photo: socialProfile.photos[0].value,
        },
      })
      user.save((_err) => {
        if (_err) console.log('err ser'.red, _err)
        return cb(_err, user)
      })
    } else {
      return cb(err, user)
    }
  }))

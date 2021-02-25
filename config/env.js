// import 'dotenv/config.js'
import * as dotenv from 'dotenv'

dotenv.config({
  silent: true,
  path: process.env.NODE_ENV === 'production'
    ? './config/production.env'
    : './config/devolopment.env',
})


export default '-'

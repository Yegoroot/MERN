/* eslint-disable func-names */
/* eslint-disable no-return-await */
/* eslint-disable no-useless-escape */
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please add an email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please add a valid email'],
  },
  role: {
    type: String,
    enum: ['superadmin', 'user', 'admin', 'teacher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [false, 'Please add a password'],
    minLength: 6,
    select: false, // downt show password in API
  },
  profile: { type: Object },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // who was create this
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

export default mongoose.model('User', UserSchema)

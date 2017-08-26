const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  retryConnectNumber: { type: Number, default: 0 },
  lastTimeConnectRetry: Date,
  
  tokens: Array,
  
  profile: {
    name: { type: String, default: 'Anonyme' },
    premiumDate: Date,
    addedTorrent: Number,
    lastSeen: { type: Date, default: new Date() },
    username: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Autre'], required: true },
    debug: { type: Boolean, default: false },
    rank: { type: Number, enum: [ 0, 1, 2, 3 ], default: 0 }
  }
}, {
  timestamps: true
})

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

userSchema.methods.updateRetry = function updateRetry() {
  this.retryConnectNumber++
  this.lastTimeConnectRetry = new Date()
  this.save()
}

userSchema.virtual('avatar_200').get(function() {
  return this.gravatar(200)
})

const User = mongoose.model('User', userSchema)

module.exports = User

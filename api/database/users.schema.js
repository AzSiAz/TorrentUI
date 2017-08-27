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

  activated: { type: Boolean, default: false },
  activationToken: { type: String, default: '' },

  tokens: Array,
  
  profile: {
    name: { type: String, default: 'Anonyme' },
    premiumDate: Date,
    addedTorrent: Number,
    lastSeen: { type: Date, default: Date.now },
    username: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Autre'], required: true },
    rank: { type: String, enum: [ 'Admin', 'Moderator', 'Member', 'Premium Member' ], default: 'Member' }
  }
}, {
  timestamps: true
})

/**
 * Password hash middleware.
 * TODO look at https://github.com/emilbayes/secure-password for argon2 password hashing
 */
userSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(12, (err, salt) => {
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

userSchema.methods.setActivationToken = function setActivationToken(token, cb) {
  this.activationToken = token
  return this.save()
}

userSchema.methods.activateUser = function activateUser() {
  this.activated = true
  return this.save()
}

userSchema.virtual('avatar_200').get(function() {
  return this.gravatar(200)
})

const User = mongoose.model('User', userSchema)

module.exports = User

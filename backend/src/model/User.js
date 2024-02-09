const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: [true, 'Username is required'],
  },
  following: {
    type: [
      {
        type: String,
        ref: 'user',
      },
    ],
    default: [],
  },
  googleId: String,
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
  created: {
    type: Date,
    required: [true, 'Created date is required'],
    default: Date.now,
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User

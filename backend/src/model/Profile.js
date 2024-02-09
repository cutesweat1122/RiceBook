const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: [true, 'username is required'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
  },
  headline: {
    type: String,
    default: 'Hellow World!',
  },
  dob: {
    type: String,
  },
  phone: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  headline: {
    type: String,
    default: 'Headline',
  },
  avatar: {
    type: String,
    default: 'https://picsum.photos/id/64/60/60',
  },
})

const Profile = mongoose.model('profile', profileSchema)

module.exports = Profile

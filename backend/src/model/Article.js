const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'author is required'],
  },
  text: {
    type: String,
    required: [true, 'text is required'],
  },
  image: String,
  comments: [
    {
      id: {
        type: Number,
        required: [true, 'id is required'],
      },
      text: {
        type: String,
        required: [true, 'text is required'],
      },
      author: {
        type: String,
        required: [true, 'author is required'],
      },
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  created: {
    type: Date,
    required: [true, 'Created date is required'],
    default: Date.now,
  },
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article

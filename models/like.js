// @flow
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
  id: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  postTime: {
    type: Date,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('Like', LikeSchema)

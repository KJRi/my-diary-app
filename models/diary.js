// @flow
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiarySchema = new Schema({
  author: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  postTime: {
    type: Date,
    default: Date.now()
  },
  weather: {
    type:String,
    require: true
  },
  location: {
    type:Array,
    require: true
  },
  photo: {
    type:Array,
    require: true
  }
})

module.exports = mongoose.model('Diary', DiarySchema)

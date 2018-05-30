// @flows
const express = require('express')
const Diary = require('../models/diary')
const router = express.Router()

// 写日记
router.post('/create', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    var newDiary = new Diary({
      author: req.body.username,
      title: req.body.title,
      content: req.body.content,
      weather: req.body.weather,
      location: req.body.location,
      photo: req.body.photo
    })
    newDiary.save((err) => {
      if (err) {
        return res.json({ success: false, message: '写日记失败!' })
      }
      res.json({ success: true, message: '写日记成功!' })
    })
  }
})

// 根据值获取日记
router.get('/get', (req, res) => {
  if (req.query.id) {
    Diary.findById(req.query.id).exec().then((posts) => {
      return res.json(posts)
    })
  } else if (req.query.author) {
    Diary.find({ 'author': req.query.author }).sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  } else if (req.query.title) {
    var reg = new RegExp(req.query.title)
    Diary.find({ 'title': reg }).sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  } else if (req.query.timeOne && req.query.timeTwo) {
    Diary.find({ 'postTime':
    { '$gte': new Date(req.query.timeOne),
      '$lt': new Date(req.query.timeTwo) } }).sort({ _id: -1 }).exec().then((posts) => {
        return res.json(posts)
      })
  }
})

// 添加照片
router.post('/addPhoto', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    Diary.update({ '_id': req.body.id },
    { $push: { 'photo': req.body.imageUrl } }, { upsert: true }, (err) => {
      if (err) {
        return res.json({ success: false, message: '添加失败!' })
      }
      res.json({ success: true, message: '添加成功!' })
    })
  }
})
// 删除照片
router.post('/deletePhoto', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    Diary.update({ '_id': req.body.id },
    { $pull: { 'photo': req.body.imageUrl } }, (err) => {
      if (err) {
        return res.json({ success: false, message: '删除失败!' })
      }
      res.json({ success: true, message: '删除成功!' })
    })
  }
})

module.exports = router

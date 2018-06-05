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
// 获取所有日记
router.get('/all', (req, res) => {
  if (req.query.title) {
    var reg = new RegExp(req.query.title)
    Diary.find({ 'title': reg }).sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  } else {
    Diary.find().sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  }
})
// 根据值获取日记
router.get('/get', (req, res) => {
  if (req.query.id) {
    Diary.findById(req.query.id).exec().then((posts) => {
      return res.json(posts)
    })
  } else if (req.query.title) {
    var reg = new RegExp(req.query.title)
    Diary.find({ 'title': reg, 'author': req.query.author }).sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  } else if (req.query.timeOne && req.query.timeTwo) {
    Diary.find({ 'postTime':
    { '$gte': new Date(req.query.timeOne),
      '$lt': new Date(req.query.timeTwo) },
      'author': req.query.author }).sort({ _id: -1 }).exec().then((posts) => {
        return res.json(posts)
      })
  } else {
    Diary.find({ 'author': req.query.author }).sort({ _id: -1 }).exec().then((posts) => {
      return res.json(posts)
    })
  }
})

// 添加删除照片
router.post('/addPhoto', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    Diary.update({ '_id': req.body.id },
    { 'photo': req.body.imageUrl }, (err) => {
      if (err) {
        return res.json({ success: false, message: '修改失败!' })
      }
      res.json({ success: true, message: '修改成功!' })
    })
  }
})
// 删除日记
router.post('/delete', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    // 删除
    Diary.remove({ '_id': req.body.id }, (err) => {
      if (err) {
        return res.json({ success: false, message: '删除日记失败!' })
      }
      res.json({ success: true, message: '删除日记成功!' })
    })
  }
})

module.exports = router

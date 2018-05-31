// @flows
const express = require('express')
const Like = require('../models/like')
const router = express.Router()

// 添加评论
router.post('/add', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    var newLike = new Like({
      id: req.body.id,
      title: req.body.title,
      author: req.body.username,
      content: req.body.content,
      postTime: req.body.postTime
    })
    // 存储
    newLike.save((err) => {
      if (err) {
        return res.json({ success: false, message: '收藏失败!' })
      }
      res.json({ success: true, message: '收藏成功!' })
    })
  }
})
// 删除点赞
router.post('/delete', (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, message: '未登录' })
  } else {
    var newLike = {
      id: req.body.id,
      author: req.body.username
    }
    // 删除
    Like.remove(newLike, (err) => {
      if (err) {
        return res.json({ success: false, message: '取消收藏失败!' })
      }
      res.json({ success: true, message: '取消收藏成功!' })
    })
  }
})
// 获取用户点赞
router.get('/getByUser', (req, res) => {
  Like.find({ 'author': req.query.username }).sort({ _id: -1 }).exec().then((like) => {
    return res.json(like)
  })
})

// 查看是否点赞过
router.get('/getBy', (req, res) => {
  Like.find({ 'id': req.query.id, 'author': req.query.username }).sort({ _id: -1 }).exec().then((like) => {
    return res.json(like)
  })
})

module.exports = router

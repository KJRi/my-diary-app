// @flows
const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const UserInfo = require('../models/userinfo')
const project = require('../config/project.config')
const passport = require('passport')
const router = express.Router()

require('../passport')(passport)

// 注册账户
router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, message: '请输入您的账号密码.' })
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    // 保存用户账号
    newUser.save((err) => {
      if (err) {
        return res.json({ success: false, message: '注册失败!' })
      }
      res.json({ success: true, message: '成功创建新用户!' })
    })
  }
})

// 检查用户名与密码并生成一个accesstoken如果验证通过
router.post('/user/accesstoken', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      throw err
    }
    if (!user) {
      res.json({ success: false, message:'认证失败,用户不存在!' })
    } else if (user) {
      // 检查密码是否正确
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign({ username: user.username }, project.secret, {
            expiresIn: 10080
          })
          user.token = token
          user.save(function (err) {
            if (err) {
              res.send(err)
            }
          })
          res.json({
            success: true,
            message: '验证成功!',
            token: 'Bearer ' + token,
            username: user.username
          })
        } else {
          res.send({ success: false, message: '认证失败,密码错误!' })
        }
      })
    }
  })
})

// passport-http-bearer token 中间件验证
// 通过 header 发送 Authorization -> Bearer  + token
// 或者通过 ?access_token = token
router.get('/users/info',
  passport.authenticate('bearer', { session: false }),
  function (req, res) {
    res.json({ username: req.user.username })
  })

module.exports = router

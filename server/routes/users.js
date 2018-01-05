var express = require('express')
var router = express.Router()
var User = require('./../models/user')
require('./../util/util')

router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: '2',
          msg: '用户名或者密码不正确'
        })
      }
    }
  })
})

// 登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

// 检测等冷
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

// 购物车列表
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 购物车删除
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({userId: userId}, {$pull: {'cartList': {'productId': productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 购物车增减数量
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  User.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 购物车选择所有
router.post('/editCheckAll', function (req, res, next) {
  var userId = req.cookies.userId
  var checkAll = req.body.checkAll ? '1' : '0'
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    }
  })
})

// 查询用户地址接口
router.get('/addressList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList.reverse()
      })
    }
  })
})

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList
      addressList.forEach((item) => {
        if (item.addressId === addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})

// 删除地址接口
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  console.log(addressId)
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 添加收获地址
router.post('/addAddress', (req, res, next) => {
  let userName = req.body.userName
  let streetName = req.body.streetName
  let postCode = parseInt(req.body.postCode)
  let tel = parseInt(req.body.tel)
  let userId = req.cookies.userId
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList
      let arr = []
      addressList.forEach((item) => {
        arr.push(item.addressId)
      })
      let max = Math.max(...arr)
      let obj = {
        addressId: max + 1,
        userName: userName,
        streetName: streetName,
        postCode: postCode,
        tel: tel,
        isDefault: false
      }
      addressList.push(obj)
      doc.save((err2, doc2) => {
        if (err2) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'suc'
          })
        }
      })
    }
  })
})

// 生成订单
router.post('/payment', (req, res, next) => {
  let userId = req.cookies.userId
  let orderTotal = req.body.orderTotal
  let addressId = req.body.addressId
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: 'err.message'
      })
    } else {
      let address = ''
      let goodList = []
      doc.addressList.forEach((item) => {
        if (addressId === item.addressId) {
          address = item
        }
      })
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodList.push(item)
        }
      })
      let platform = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = `${platform}${r1}${sysDate}${r2}`
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodList: goodList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(order)
      doc.save((err1, doc) => {
        if (err1) {
          res.json({
            status: '1',
            msg: 'err.message'
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})
module.exports = router

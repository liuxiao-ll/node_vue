var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/shop')

mongoose.connection.on('connected', () => {
  console.log('连接成功')
})

mongoose.connection.on('error', () => {
  console.log('连接失败')
})

mongoose.connection.on('disconnected', () => {
  console.log('连接断开')
})

router.get('/', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceLevel = req.param('priceLevel')
  let priceGt = ''
  let priceLte = ''
  let params = {}
  if (priceLevel !== '-1') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte = 100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 5000
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lt: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

router.post('/addCart', (req, res, next) => {
  if (!req.cookies.userId) {
    res.json({
      status: '00',
      msg: '未登录',
      result: ''
    })
  } else {
    let userId = req.cookies.userId
    let productId = req.body.productId
    let User = require('../models/user')
    User.findOne({userId: userId}, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        if (userDoc) {
          let goodsItem = ''
          userDoc.cartList.forEach((item) => {
            if (item.productId === productId) {
              goodsItem = item
              item.productNum ++
            }
          })
          if (goodsItem) {
            userDoc.save((err2, doc2) => {
              if (err2) {
                res.json({
                  status: '12',
                  msg: err2.message
                })
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: 'suc'
                })
              }
            })
          } else {
            Goods.findOne({productId: productId}, (err1, doc) => {
              if (err1) {
                res.json({
                  status: '1',
                  msg: err1.message
                })
              } else {
                doc.productNum = 1
                doc.checked = 1
                userDoc.cartList.push(doc)
                userDoc.save((err2, doc2) => {
                  if (err2) {
                    res.json({
                      status: '12',
                      msg: err2.message
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
          }
        }
      }
    })
  }
})

module.exports = router

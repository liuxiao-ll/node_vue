let mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [
    {
      'productId': String,
      'productName': String,
      'salePrice': Number,
      'checked': String,
      'productNum': String,
      'productImage': String
    }
  ],
  'addressList': Array
})
module.exports = mongoose.model('users', userSchema)

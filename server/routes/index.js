var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '啊啊啊啊啊啊' });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.user) {
    return res.render('login', {})
  }
  res.render('index', {})
});

router.get('/login', (req, res, next) => {
  res.render('login', {})
})

router.get('/tuijian', (req, res, next) => {
  if (!req.session.user) {
    return res.render('login', {})
  }
  res.render('tuijian', {})
})

// 编辑

router.get('/edit', (req, res, next) => {
  if (!req.session.user) {
    return res.render('login', {})
  }

  let type = req.query.type
  if (type) {
    let obj = {}
    switch (type) {
      case 'sanwen':
        obj = {}
        break
      case 'it':
        obj = {}
        break
      case 'manager':
        obj = {}
        break
      case 'cookies':
        obj = {}
        break
      default:
        return res.send({
          status: 0,
          info: '参数错误'
        })
        break
    }
    fs.readFile(PATH + type + '.json', (err, data) => {
      if (err) {
        res.send({
          status: 0,
          info: '读取文件失败'
        })
      }
      let obj = JSON.parse(data.toString())
      return res.render('edit', {
        data: obj
      })
    })
  } else {
    return res.send({
      status: 0,
      info: '参数错误'
    })
  }
})

// 首页大表单

module.exports = router;

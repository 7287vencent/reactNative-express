let express = require('express')
let router = express.Router()
let fs = require('fs')
let PATH = './public/data/'

// 读取数据模块，供客户端调用
// 查询接口，toke校验
// 公共接口，无需校验
// /data/read?type=it
// /data/read?type=it.json

router.get('/read', (req, res, next) => {
  let type = req.param('type') || ''
  fs.readFile(`${PATH}${type}.json`, (err, data) => {
    console.log("`${PATH}${type}.json`", `${PATH}${type}.json`)
    if (err) {
      return res.send({
        status: 0,
        info: '读取文件出现异常'
      })
    }
    // 限制返回文件的数量
    let COUNT = 50
    let obj = []
    // 测试 防止返回的数据为 null
    try {
      obj = JSON.parse(data.toString())
    } catch (e) {
      obj = []
    }
    // 限制返回的数量
    if (obj.length > COUNT) {
      obj = obj.slice(0, COUNT)
    }
    return res.send({
      status: 1,
      data: obj
    })
  })
})

// 数据存储模块 后台开发使用
router.post('/write', (req, res, next) => {
  // 验证 session
  // if (!req.session.user) {
  //   return res.send({
  //     status: 0,
  //     info: '未鉴权验证'
  //   })
  // }

  // 验证文件
  let type = req.param('type') || ''
  let url = req.param('url') || ''
  let title = req.param('title') || ''
  let img = req.param('img') || ''

  if (!type || !url || !title || !img) {
    return res.send({
      status: 0,
      info: '提交的字段不全'
    })
  }
  // 1) 读取文件
  let filePath = PATH + type + '.json'
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.send({
        status: 0,
        info: '读取数据失败'
      })
    }
    let arr = JSON.parse(data.toString())
    // 代表每一条记录
    let obj = {
      img: img,
      url: url,
      title: title,
      id: guidGenerate(),
      time: new Date()
    }
    arr.splice(0, 0, obj)
    // 2) 写入文件
    let newData = JSON.stringify(arr)
    fs.writeFile(filePath, newData, (err) => {
      if (err) {
        return res.send({
          status: 0,
          info: '写入文件失败😭'
        })
      }
      return res.send({
        status: 1,
        info: '写入文件成功😊',
        data: obj
      })
    })
  })
})

// 阅读模块 写入接口 后台开发使用
router.post('/write_config', (req, res, next) => {
  // 验证 session
  // if (!req.session.user) {
  //   return res.send({
  //     status: 0,
  //     info: '未鉴权认证'
  //   })
  // }
  // TODD: 后期进行提交数据的验证
  // 防 xss 攻击 xss
  // npm install xss
  // require('xss)
  // let str = xss(name)
  let data = req.body.data

  // TODD : try catch
  let obj = []
  try {
    obj = JSON.parse(data)
  } catch (e) {
    obj = []
  }
  let newData = JSON.stringify(obj)
  // 写入
  fs.writeFile(PATH + 'config.json', newData, (err) => {
    if (err) {
      return res.send({
        status: 0,
        info: '写入数据失败😭'
      })
    }
    return res.send({
      status: 1,
      info: '写入数据成功😊',
      data: obj
    })
  })
})

// 登陆接口
router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  // TODD：对用户名、密码进行校验
  // xss 处理、判空

  // 密码加密 md5(md5(password + '随机字符串))
  // 密码需要加密 -> 可以写入 JSON文件
  if (username === 'admin' && password === '123456') {
    req.session.user = {
      username: username
    }
    return res.send({
      status: 1
    })
  }
  // 登陆失败 
  return res.send({
    status: 0,
    info: '登陆失败'
  })
})

//guid
function guidGenerate () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}

module.exports = router
const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const {isAdmin} = require('../../middleware/auth')
const trainingDataList = require('../../models/trainingDataSeeds.json')
const yaml = require('js-yaml')

const sql = require('mssql')
const pool = require('../../config/connectPool')
const {resetMail} = require('../../modules/sendMail')
const jwt = require('jsonwebtoken')
const {auth} = require('../../middleware/auth')
const User = require('../../models/user')
const TrainingData = require('../../models/trainingData')
const trainingDataSeeds = require('../../models/trainingDataSeeds.json')

const SECRET = 'thisisthenewjwttoken'

// user 重置密碼
router.get('/resetPassword/:email/update', (req, res) => {
  const {email} = req.params
  const {password, confirmPassword} = req.query
  const request = new sql.Request(pool)

  // 驗證密碼與確認密碼是否相符
  if(password !== confirmPassword){
    return res.send({status: 'warning', message: '密碼與確認密碼不符，請重新嘗試'})
  }

  // 驗證帳號使否存在
  request.query(`select * 
  from BOTFRONT_USERS_INFO
  where EMAIL = '${email}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const emailCheck = result.recordset[0]
    if(!emailCheck){
      return res.send({status: 'error', message: '查無此帳號，請重新嘗試'})
    }else{
      // 使用bcrypt加密並存入資料庫
      return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        request.input('password', sql.NVarChar(100), hash)
        .query(`update BOTFRONT_USERS_INFO
        set PASSWORD = @password
        where EMAIL = '${email}'`, (err, result) => {
        if(err){
          console.log(err)
          return
        }
        })
      }).then(() => {
        // 寄送修改密碼完成mail
        resetMail(res, 'mail_resetPasswordDone', email, 'ChatBot 密碼修改成功')
        res.send({status: 'success', message: '密碼修改成功，請使用新密碼登入'})
      }).catch(err => console.log(err))
    }
  })
})

// 郵件連接至重設密碼頁面
router.get('/resetPassword/:email', (req, res) => {
  const {email} = req.params
  return res.render('resetPassword', {email})
})

// 發送重設密碼郵件
router.get('/sendResetMail', (req, res) => {
  const {email} = req.query
  const request = new sql.Request(pool)

  if(!email) return res.send({status: 'warning', message: '請輸入E-mail'})

  // 驗證帳號是否存在
  request.query(`select * 
  from BOTFRONT_USERS_INFO
  where EMAIL = '${email}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const emailCheck = result.recordset[0]
    if(!emailCheck){
      res.send({status: 'error', message: '查無此帳號，請重新嘗試'})
    }else{
      resetMail(res, 'mail_resetPassword', email, 'ChatBot 密碼重置')
      res.send({status: 'success', message: `重設密碼郵件已經發送至${email}，請至信箱查看`})
    }
  })
})

// user 註冊帳號
router.get('/register/insert', (req, res) => {
  const {cpy_no, cpy_name, email, password, confirmPassword} = req.query

  const request = new sql.Request(pool)

  // 由於0 = false，如果這邊設定檢覈的話，會一直false
  if(!cpy_no || !cpy_name || !email || !password || !confirmPassword) return res.send({status: 'warning', message: '所有欄位都是必填的'})
  if(password !== confirmPassword) return res.send({status: 'warning', message: '密碼和確認密碼不相符!'})

  request.query(`select * 
  from BOTFRONT_USERS_INFO
  where EMAIL = '${email}' or CPY_ID = '${cpy_no}' or CPY_NAME = '${cpy_name}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const cpnyCheck = result.recordset
    if(cpnyCheck.length){
      cpnyCheck.forEach(user => {
        if(user.CPY_NAME == cpy_name) return res.send({status: 'warning', message: '此「公司名稱」已經註冊過'})
        if(user.CPY_ID == cpy_no) return res.send({status: 'warning', message: '此「公司代號」已經註冊過'})
        if(user.EMAIL == email) return res.send({status: 'warning', message: '此「Email」已經註冊過'})
      })
    }else{
      bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        request.input('cpy_no', sql.NVarChar(30), cpy_no)
        .input('cpy_name', sql.NVarChar(80), cpy_name)
        .input('email', sql.NVarChar(80), email)
        .input('password', sql.NVarChar(100), hash)
        .query(`insert into BOTFRONT_USERS_INFO (CPY_ID, CPY_NAME, EMAIL, PASSWORD)
        values (@cpy_no, @cpy_name, @email, @password)`, (err, result) => {
          if(err){
            console.log(err)
            return
          }
        })
        return cpy_no
      })
      .then(cpnyNo => {
        let count = 0
        trainingDataList.map(data => {
          let content = JSON.stringify(data.content)
          if(data.name === 'config-test'){
            content = yaml.dump(data.content)
          }
          request.input(`cpny_no${count}`, sql.NVarChar(30), cpnyNo)
          .input(`dataName${count}`, sql.NVarChar(50), data.name)
          .input(`dataContent${count}`, sql.NVarChar(sql.MAX), content)
          .query(`insert into BF_JH_DATA_TEST(CPNY_ID, DATA_NAME, DATA_CONTENT)
          values (@cpny_no${count}, @dataName${count}, @dataContent${count})`, (err, result) => {
            if(err){
              console.log(err)
              return
            }
          })
          count++
        })
      })
      .then(() => {
        return res.send({status: 'success', message: '帳號註冊成功'})
      })
      .catch(err => console.log(err))
    }
  })
})

// mongodb 註冊帳號
router.post('/register/mongodb', (req, res) => {
  const {cpy_no, cpy_name, email, password, confirmPassword} = req.body

  if(password !== confirmPassword) return res.send({status: 'warning', message: '密碼和確認密碼不相符!'})

  User.findOne({
    $or: [
      {email},
      {cpy_no}
    ]
  })
  .then(user => {
    // 判斷使用者是否已註冊過
    if(user){
      if(user.email === email){
        return res.send({status: 'warning', message: '此帳號已註冊過'})
      }
      if(user.cpny_id === cpy_no){
        return res.send({status: 'warning', message: '此公司代號已註冊過'})
      }
    }
    // 加密密碼
    return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => User.create({
      cpny_id: cpy_no,
      cpny_name: cpy_name,
      email,
      password: hash
    }))
    .then(() => {
      // 添加預設資料
      User.findOne({email})
      .then(user => {
        const userId = user._id

        return Promise.all(trainingDataSeeds.map(data => {
          return TrainingData.create({data_name: data.name, data_content: data.content, userId})
        }))
      })
    })
    .then(() => res.redirect('/users/login'))
    .catch(err => console.log(err))
  })
})

// JWT TOKEN 註冊帳號 
router.post('/register', (req, res) => {
  const {cpy_no, cpy_name, email, password, confirmPassword} = req.body
  const request = new sql.Request(pool)
  if(!cpy_no || !cpy_name || !email || !password || !confirmPassword) return res.send({status: 'warning', message: '所有欄位都是必填的'})
  if(password !== confirmPassword) return res.send({status: 'warning', message: '密碼和確認密碼不相符!'})

  request.query(`select * 
  from BOTFRONT_USERS_INFO
  where EMAIL = '${email}' or CPY_ID = '${cpy_no}' or CPY_NAME = '${cpy_name}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const cpnyCheck = result.recordset
    if(cpnyCheck.length){
      cpnyCheck.forEach(user => {
        if(user.CPY_NAME == cpy_name) return res.send({status: 'warning', message: '此「公司名稱」已經註冊過'})
        if(user.CPY_ID == cpy_no) return res.send({status: 'warning', message: '此「公司代號」已經註冊過'})
        if(user.EMAIL == email) return res.send({status: 'warning', message: '此「Email」已經註冊過'})
      })
    }else{
      bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        const token = jwt.sign({id: cpy_no, email}, SECRET)
        request.input('cpy_no', sql.NVarChar(30), cpy_no)
        .input('cpy_name', sql.NVarChar(80), cpy_name)
        .input('email', sql.NVarChar(80), email)
        .input('password', sql.NVarChar(100), hash)
        .query(`insert into BOTFRONT_USERS_INFO (CPY_ID, CPY_NAME, EMAIL, PASSWORD)
        values (@cpy_no, @cpy_name, @email, @password)`, (err, result) => {
          if(err){
            console.log(err)
            return
          }
        })
        return {cpy_no, email, token}
      })
      .then(info => {
        let count = 0
        trainingDataList.map(data => {
          let content = JSON.stringify(data.content)
          if(data.name === 'config-test'){
            content = yaml.dump(data.content)
          }
          request.input(`cpny_no${count}`, sql.NVarChar(30), info.cpy_no)
          .input(`dataName${count}`, sql.NVarChar(50), data.name)
          .input(`dataContent${count}`, sql.NVarChar(sql.MAX), content)
          .query(`insert into BF_JH_DATA_TEST(CPNY_ID, DATA_NAME, DATA_CONTENT)
          values (@cpny_no${count}, @dataName${count}, @dataContent${count})`, (err, result) => {
            if(err){
              console.log(err)
              return
            }
          })
          count++
        })
        return {cpnyId: info.cpy_no, email: info.email, token: info.token}
      })
      .then((data) => {
        request.query(`select CPY_ID, CPY_NAME, EMAIL, ISADMIN
        from BOTFRONT_USERS_INFO
        where CPY_ID = '${data.cpnyId}'
        and EMAIL = '${data.email}'`, (err, result) => {
          if(err){
            console.log(err)
            return
          }
          const user = result.recordset[0]
          res.send({status: 'success', message: '帳號註冊成功', user, token: data.token})
        })
        
      })
      .catch(err => console.log(err))
    }
  })
})

// JWT TOKEN 登入
router.post('/react/login', (req, res) => {
  const {email, password} = req.body

  const request = new sql.Request(pool)
  request.query(`select CPY_ID, CPY_NAME, EMAIL, PASSWORD, ISADMIN
    from BOTFRONT_USERS_INFO
    where EMAIL = '${email}'`, (err, result) => {
      if(err){
        console.log(err)
        return
      }

      const user = result.recordset[0]

      if(!user) return res.send({status:'error', message: '這個Email還未註冊'})
      
      return bcrypt.compare(password, user.PASSWORD)
      .then(isMatch => {
        if(!isMatch) return res.send({statue:'warning', message: '帳號或密碼錯誤'})
        const token = jwt.sign({id: user.CPY_ID, email}, SECRET)
        res.send({status: 'success', message: '登入成功', user, token})
      }).catch(err => console.log(err))
    })
})

// JWT TOKEN 驗證
router.get('/react/auth', auth, (req, res) => {
  const user = req.user
  const token = req.token
  res.status(200).send({user, token})
})

// 顯示user註冊頁面
router.get('/register', (req, res) => {
    res.render('register')
})

// user登入
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

// 顯示user登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// user登出
router.get('/logout', (req, res) => {
  const user = res.locals.user
  if(!user) {
    res.redirect('/users/login')
    return 
  }
	const cpnyId = user.CPY_ID
  const request = new sql.Request(pool)

  request.input('logout', sql.Bit, 0)
  .query(`update BOTFRONT_USERS_INFO
  set ISLOGIN = @logout
  where CPY_ID = '${cpnyId}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    req.logOut()
    res.redirect('/users/login')
    req.session.destroy()
    
  })
})


module.exports = router
const express = require('express')
const router = express.Router()

const sql = require('mssql')
const pool = require('../../config/connectPool')

const {fsJhWriteInfo, fsJhWritePosition, fsWriteSubsidy, fsWriteLeave, fsJsAddSynonyms} = require('../../modules/fileSystem')
const {setInfoDict, setPositionDict} = require('../../modules/setDict')
const {randomNum, checkNum} = require('../../modules/randomNum')
const {insertDes, updateDes, deleteDes, insertCategory, querySynonym, queryEditSynonym} = require('../../modules/useSql')

// 增加同義字功能API
router.get('/:infoId/queryCategory/insert', (req, res) => {
  const {cnName, entity_name, synonym} = req.query
  const request = new sql.Request(pool)

  if(!cnName || !entity_name) return res.send({status: 'warning', message: '所有欄位都是必填的'})
  if(cnName == synonym) return res.send({status: 'warning', message: '同義字重複'})

  const infoData = {
    category: 'leave',
    cnName,
    entity_name,
    synonym
  }

  const fsFunc = {
    fsJhWriteInfo,
    fsJhWritePosition,
    fsWriteLeave,
    fsWriteSubsidy,
    setInfoDict,
    setPositionDict,
    insertCategory
  }

  fsJsAddSynonyms(request, sql, res, infoData, fsFunc)  
})

// 顯示增加同義字頁面
router.get('/:infoId/queryCategory', (req, res) => {
  const {infoId} = req.params
  const user = res.locals.user
	const cpnyId = user.CPY_ID 
  const jh_new_synonym = true
  const category = 'leave'
  const request = new sql.Request(pool)

  request.query(`select b.LEAVE_NAME as cnName, b.ENTITY_NAME as entity_name
  from BF_JH_LEAVE a
  left join BF_JH_LEAVE_CATEGORY b
  on a.LEAVE_ID = b.LEAVE_ID
  where a.INFO_ID = '${infoId}'
  and a.CPY_ID = '${cpnyId}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    try {
      const cnName = result.recordset[0]['cnName']
      const entity_name = result.recordset[0]['entity_name']
      res.render('index', {jh_new_synonym, cnName, entity_name, infoId, category})
    } catch (error) {
      return res.send('<pre>{"status":"warning","message":"查無此資料，請重新嘗試"}</pre>')
    }
  })
})

// 顯示編輯假別資訊頁面
router.get('/:entity_name/edit', (req, res) => {
  const {entity_name} = req.params
  const user = res.locals.user
	const cpnyId = user.CPY_ID
  const jh_edit_des = true
  const category = 'leave'
  const request = new sql.Request(pool)

  request.query(`select a.LEAVE_DES as des, b.LEAVE_NAME as name, b.ENTITY_NAME as entity_name, a.INFO_ID as infoId
  from BF_JH_LEAVE a
  left join BF_JH_LEAVE_CATEGORY b
  on a.LEAVE_ID = b.LEAVE_ID
  where b.ENTITY_NAME = '${entity_name}'
  and a.CPY_ID = '${cpnyId}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }

    const desInfo = result.recordset[0]
    if(!desInfo){
      return res.send('<pre>{"status":"warning","message":"查無此假別資訊資料，請重新嘗試"}</pre>')
    }else{
      queryEditSynonym(res, desInfo, jh_edit_des, category)
    }
  })

})

// 徵厲害刪除假別API
router.get('/delete', (req, res) => {
  const {infoId} = req.query
  const request = new sql.Request(pool)

  const data = {
    category: 'leave',
    infoId
  }

  deleteDes(request, res, data)
})

// 徵厲害編輯假別API
router.get('/:entity_name/edit/update', (req, res) => {
  const {entity_name} = req.params
  const {des, infoId} = req.query
  const request = new sql.Request(pool)

  const data = {
    category: 'leave',
    entity_name,
    des,
    infoId
  }

  updateDes(request, sql, res, data)
})

// 徵厲害新增假別API
router.get('/new/insert', async (req, res) => {
  const user = res.locals.user
	const cpnyId = user.CPY_ID
  const {cnName, entity_name, des} = req.query
  const request = new sql.Request(pool)
  const num = await randomNum(cpnyId, request, checkNum)

  if(!cnName || !entity_name || !des){
    return res.send({status: 'warning', message: '所有欄位都為必填欄位'})
  }
  const data = {
    category: 'leave',
    cpnyId,
    cnName,
    entity_name,
    des,
    num
  }

  const fsFunc = {
    fsJhWriteInfo,
    fsJhWritePosition,
    fsWriteSubsidy,
    fsWriteLeave,
    setInfoDict,
    setPositionDict
  }

  insertDes(request, sql, res, data, fsFunc)
})

// 顯示新增假別頁面
router.get('/new', (req, res) => {
  const jh_new_des = true
  const category = 'leave'

  res.render('index', {jh_new_des, category})
})

// 顯示假別資訊頁面
router.get('/', (req, res) => {
  const user = res.locals.user
	const cpnyId = user.CPY_ID
  const request = new sql.Request(pool)
  const jh_des = true
  const category = 'leave'
  const warning = []

  request.query(`select a.LEAVE_DES as des, b.LEAVE_NAME as name, b.ENTITY_NAME as entity_name, a.INFO_ID as infoId
  from BF_JH_LEAVE a
  left join BF_JH_LEAVE_CATEGORY b
  on a.LEAVE_ID = b.LEAVE_ID
  where a.CPY_ID = ${cpnyId}
  order by b.ENTITY_NAME ASC`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const desInfo = result.recordset
    querySynonym(res, desInfo, jh_des, warning, category)
  })
})

module.exports = router
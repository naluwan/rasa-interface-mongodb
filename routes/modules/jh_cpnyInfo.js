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

  if(!cnName || !entity_name || !synonym) return res.send({status: 'warning', message: '所有欄位都是必填的'})
  if(cnName == synonym) return res.send({status: 'warning', message: '同義字重複'})

  const infoData = {
    category: 'cpnyinfo',
    cnName,
    synonym,
    entity_name
  }

  const fsFunc = {
    fsJhWriteInfo,
    fsJhWritePosition,
    fsWriteSubsidy,
    fsWriteLeave,
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
  const category = 'cpnyinfo'
  const request = new sql.Request(pool)

  request.query(`select b.CPNYINFO_NAME as cnName, b.ENTITY_NAME as entity_name
  from BF_JH_CPNYINFO a
  left join BF_JH_CPNYINFO_CATEGORY b
  on a.CPNYINFO_ID = b.CPNYINFO_ID
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

// 顯示編輯公司資訊頁面
router.get('/:entity_name/edit', (req, res) => {
  const user = res.locals.user
	const cpnyId = user.CPY_ID
  const {entity_name} = req.params
  const jh_edit_des = true
  const category = 'cpnyinfo'
  const request = new sql.Request(pool)

  request.query(`select a.CPNYINFO_DES as des, b.CPNYINFO_NAME as name, b.ENTITY_NAME as entity_name, a.INFO_ID as infoId
  from BF_JH_CPNYINFO a
  left join BF_JH_CPNYINFO_CATEGORY b
  on a.CPNYINFO_ID = b.CPNYINFO_ID
  where b.ENTITY_NAME = '${entity_name}'
  and a.CPY_ID = '${cpnyId}'`, (err, result) => {
    if(err){
      console.log(err)
      return
    }
    const desInfo = result.recordset[0]

    if(!desInfo){
      return res.send('<pre>{"status":"warning","message":"查無此資訊資料，請重新嘗試"}</pre>')
    }else{
      queryEditSynonym(res, desInfo, jh_edit_des, category)
    }
  })
})

// 徵厲害刪除資訊API
router.get('/delete', (req, res) => {
  const {infoId} = req.query
  const request = new sql.Request(pool)

  const data = {
    category: 'cpnyinfo',
    infoId
  }

  deleteDes(request, res, data)
})

// 徵厲害編輯資訊API
router.get('/:entity_name/edit/update', (req, res) => {
  const {entity_name} = req.params
  const {des, infoId} = req.query
  const request = new sql.Request(pool)

  const data = {
    category: 'cpnyinfo',
    entity_name,
    des,
    infoId
  }

  updateDes(request, sql, res, data)
})

// 徵厲害新增資訊API
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
    category: 'cpnyinfo',
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

// 顯示公司新增資訊頁面
router.get('/new', (req, res) => {
  const jh_new_des = true
  const category = 'cpnyinfo'

  res.render('index', {jh_new_des, category})
})

// 顯示公司資訊頁面
router.get('/', (req, res) => {
  const user = res.locals.user
	const cpnyId = user.CPY_ID
  const request = new sql.Request(pool)
  const jh_des = true
  const category = 'cpnyinfo'
  const warning = []

  // 抓取公司資訊
  request.query(`select a.CPNYINFO_DES as des, b.CPNYINFO_NAME as name, b.ENTITY_NAME as entity_name, a.INFO_ID as infoId
  from BF_JH_CPNYINFO a
  left join BF_JH_CPNYINFO_CATEGORY b
  on a.CPNYINFO_ID = b.CPNYINFO_ID
  where CPY_ID = '${cpnyId}'
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
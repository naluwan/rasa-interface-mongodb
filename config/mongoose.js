const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log(`mongoose error!`)
})

db.once('open', () => {
  console.log(`mongoose connected!`)
})

module.exports = db
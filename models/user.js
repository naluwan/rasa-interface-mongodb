const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  cpny_id: {
    type: String,
    required: true
  },
  cpny_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isHr: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'hire'
  }
})

module.exports = mongoose.model('User', userSchema)
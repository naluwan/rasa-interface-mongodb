const mongoose = require('mongoose')
const Schema = mongoose.Schema

const trainingDataSchema = new Schema({
  data_name: {
    type: String,
    required: true
  },
  data_content: {
    type: Object,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('TrainingData', trainingDataSchema)
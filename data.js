const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema(
  {
    message: String
  },
  {timestamps: true}
)

module.exports = mongoose.model("Data", DataSchema)

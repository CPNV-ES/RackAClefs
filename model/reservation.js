var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservationSchema = mongoose.Schema({
  name: String,
  filename: String,
  reserved_at: Date,
  returned_at: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Reservation', reservationSchema)

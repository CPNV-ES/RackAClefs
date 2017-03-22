/**
 * Load dependencies
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * Create Mongoose Schema for the reservation
 */
var reservationSchema = mongoose.Schema({
  name: String,
  filename: String,
  reserved_at: Date,
  returned_at: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

/**
 * Export Mongoose Model for MongoDB
 */
module.exports = mongoose.model('Reservation', reservationSchema)

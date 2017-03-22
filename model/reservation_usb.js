/**
 * Load dependencies
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * Create Mongoose Schema for the reservation of usb keys 
 */
var reservationUsb = mongoose.Schema({
  reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
  usb: { type: Schema.Types.ObjectId, ref: 'Usb' }
})

/**
 * Export Mongoose model for MongoDB
 */
module.exports = mongoose.model('ReservationUsb', reservationUsbSchema)

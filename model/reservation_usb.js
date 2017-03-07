var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservationUsb = mongoose.Schema({
  reservation: { type: Schema.Types.ObjectId, ref: 'Reservation' },
  usb: { type: Schema.Types.ObjectId, ref: 'Usb' }
})

module.exports = mongoose.model('ReservationUsb', reservationUsbSchema)

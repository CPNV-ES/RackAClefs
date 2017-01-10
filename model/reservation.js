var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservationSchema = mongoose.Schema({
    name: String,
    usb: [{ type: Schema.Types.ObjectId, ref: 'Usb' }],
    filename: String,
    status: Number,
    reserved_at: Date,
    returned_at: Date,
    user: Number
})

module.exports = mongoose.model('Reservation', reservationSchema)
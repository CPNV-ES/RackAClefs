var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reservationSchema = mongoose.Schema({
    name: String,
    usbs: [{ type: Schema.Types.ObjectId, ref: 'Usb' }],
    filename: String,
    status: Boolean,
    reserved_at: Date,
    returned_at: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Reservation', reservationSchema)
var mongoose = require('mongoose')

var usbSchema = mongoose.Schema({
  name: String,
  status: Boolean,
  reserved: Boolean,
  uuid: String,
  initialized: Boolean
})

module.exports = mongoose.model('Usb', usbSchema)

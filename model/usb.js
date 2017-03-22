/**
 * Load dependencies
 */
var mongoose = require('mongoose')

/**
 * Create Mongoose Schema for usb keys
 */
var usbSchema = mongoose.Schema({
  name: String,
  status: Boolean,
  reserved: Boolean,
  uuid: String,
  initialized: Boolean
})

/**
 * Export Mongoose Model for MongoDB
 */
module.exports = mongoose.model('Usb', usbSchema)

/**
 * Load dependencies
 */
var mongoose = require('mongoose')

/**
 * Create Mongoose Schema from LDAP Data
 */
var userSchema = mongoose.Schema({
  displayName: String,
  mail: String,
  dn: String,
  admin: Boolean,
  groups: Object
})

/**
 * Export Mongoose model for MongoDB
 */
module.exports = mongoose.model('User', userSchema)

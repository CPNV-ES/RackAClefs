var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    displayName: String,
    mail: String,
    dn: String,
    admin: Boolean,
    groups: Object
})

module.exports = mongoose.model('User', userSchema)

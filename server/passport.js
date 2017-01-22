var LdapStrategy = require('passport-ldapauth')
var config = require('../config/config')

module.exports = function (passport) {
  passport.use(new LdapStrategy(config.ldap))

  passport.serializeUser(function (user, done) {
    console.log(user)
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    console.log(user)
    done(null, user)
  })
}

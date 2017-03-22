/**
 * Load dependencies
 */
var LdapStrategy = require('passport-ldapauth')
var config = require('../config/config')

/**
 * Export PassportJS Strategy
 */
module.exports = function (passport) {
  passport.use(new LdapStrategy(config.ldap))

  /**
   * Serialize User Data
   */
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  /**
   * Deserialize User Data
   */
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}

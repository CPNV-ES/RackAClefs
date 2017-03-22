/**
 * Load dependencies and models
 */
var ldap = require('ldapjs')
var config = require('../config/config')
var User = require('../model/user')

/**
 * Export ExpressJS routes
 * @param app: ExpressJS application
 * @param passport: PassportJS Middleware
 */
module.exports = function (app, passport) {

  /**
   * Route for the home page
   * @method GET
   * @param req: request from ExpressJS
   * @param res: response from ExpressJS
   */
  app.get('/', (req, res) => {
    // Check if user is logged
    isLoggedIn(req, res, () => {
      // Check if user is an administrator
      if (req.session.user.admin === true) { res.locals.adminUniq = adminUniq }
      // render the page and pass in user data
      res.render('index', {user: req.session.user})
    })
  })

  /**
   * Route for the home page
   * @method GET
   * @param req: request from ExpressJS
   * @param res: response from ExpressJS
   */
  app.get('/login', function (req, res) {
    // Check if user is logged
    if (req.isAuthenticated()) {
      // Redirect user to home page
      res.redirect('./')
    }

    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') })
  })

  /**
   * Route for the home page
   * @method POST
   * @param req: request from ExpressJS
   * @param res: response from ExpressJS
   */
  app.post('/login', function (req, res) {
    // User Credentials
    var username = req.body.username
    var password = req.body.password

    // Return flash if password is empty
    if (password === '') {
      res.render('login', {message: 'The empty password trick does not work here.'})
    }

    // Connect to the LDAP Server
    var adClient = ldap.createClient({ url: config.ldap.server.url })
    adClient.bind(username, password, function (err) {
      if (err != null) {
        if (err.name === 'InvalidCredentialsError') { res.render('login', { message: 'Credentials error' }) } else { res.send(err) }
      } else {
        adClient.search(config.ldap.server.searchBase, {
          scope: 'sub',
          filter: config.ldap.server.searchFilter.replace('{{username}}', username)
        }, function (err, ldapResult) {
          if (err !== null) {
            res.send('LDAP search error: ' + err)
            return
          }

          ldapResult.on('searchEntry', function (entry) {
            var groups = []
            var groupsAD = entry.object.memberOf

            if (typeof groupsAD === 'string') { groupsAD = [groupsAD] }

            if (groupsAD !== undefined) {
              for (var i = 0; i < groupsAD.length; i++) {
                var grp = groupsAD[i].split(',')
                for (var j = 0; j < grp.length; j++) {
                  grp[j] = grp[j].replace('CN=', '')
                  grp[j] = grp[j].replace('DC=', '').toLowerCase()
                }
                groups.push(grp.join('.'))
              }
            }

            User.findOne({ dn: entry.object.dn }, function (err, user) {
              if (user) {
                user.groups = groups
                user.save(function (err, user) {
                  req.session.user = user
                  res.setHeader('Set-Cookie', ['session.id=' + user._id])
                  res.redirect('/')
                })
              } else {
                var u = new User()
                u.displayName = entry.object.name
                u.mail = entry.object.userPrincipalName
                u.dn = entry.object.dn
                u.admin = false
                u.groups = groups
                u.save(function (err, user) {
                  req.session.user = user
                  res.setHeader('Set-Cookie', ['session.id=' + user._id])
                  res.redirect('/')
                })
              }
            })
          })
        })
      }
    })
  })
}

/**
 * Check if user is logged
 * @param req: request from ExpressJS
 * @param res: response from ExpressJS
 * @param next: callback of the middleware
 */
function isLoggedIn (req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.session.user != null) { return next() }

  // if they aren't redirect them to the home page
  res.redirect('./login')
}

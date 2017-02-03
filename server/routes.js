var ldap = require('ldapjs')
var config = require('../config/config')
var User = require('../model/user')

module.exports = function (app, passport) {
  app.get('/', (req, res) => {
    isLoggedIn(req, res, () => {
      console.log(req.session.user)
      if (req.session.user.admin === true) { res.locals.adminUniq = adminUniq }
      res.render('index', {user: req.session.user})
    })
  })

  app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('./')
    }

        // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') })
  })

  app.post('/login', function (req, res) {
    var username = req.body.username
    var password = req.body.password

    if (password === '') {
      res.render('login', {message: 'The empty password trick does not work here.'})
    }

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

function isLoggedIn (req, res, next) {
    // if user is authenticated in the session, carry on
  if (req.session.user != null) { return next() }

    // if they aren't redirect them to the home page
  res.redirect('./login')
}

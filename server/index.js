var express = require('express')
var app = express()
var config = require('../config/config')
var port = config.app.port || 5555
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var domain = require('domain')

var server = require('http').createServer(app)

var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var MongoStore = require('connect-mongo')(session)

var io = require('socket.io')(server)

var uniqid = require('uniqid')

Object.defineProperty(global, 'adminUniq', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: uniqid()
})

var databaseUrl = config.database.url

var mongoOptions = {}

if (config.database.user != null && config.database.password != null) {
  mongoOptions.user = config.database.user
  mongoOptions.pass = config.database.password
}

users = {}

server.listen(port)

mongoose.connect(databaseUrl, mongoOptions)

var mongoStore = new MongoStore({mongooseConnection: mongoose.connection})

require('./passport')(passport)

var passportSocketIo = require('passport.socketio')

app.set('views', __dirname + '/../client')

app.use(cookieParser())
app.use(bodyParser())

app.set('view engine', 'ejs')

app.use(session({
  secret: config.secret != null ? config.secret : 'ilovescotchscotfsefeschyscotch',
  key: 'express.id',
  store: mongoStore
}))

// app.use(passport.initialize())
// app.use(passport.session())
app.use(flash())

app.use('/static', express.static(__dirname + '/../client/static/'))
app.use('/views', express.static(__dirname + '/../client/views/'))

require('./routes')(app, passport)

/* io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: config.secret != null ? config.secret : 'ilovescotchscotfsefeschyscotch',
    key: 'express.id',
    passport: passport,
    store: mongoStore,
    fali: (data, message, error, accept) => {
        console.log('fail', message, error)
        accept(null, false)
    },
    success: () => {
        accept()
    }
})) */

var d = domain.create()
require('./sockets')(io, d)
require('./usb')()

console.log('The magic happens on port : ' + port)

var endApp = () => {
  server.close()
  console.log('========== Closing App ==========')
  process.exit()
}

process.once('SIGUSR1', endApp)
process.once('SIGUSR2', endApp)
process.once('SIGHUP', endApp)
process.once('SIGINT', endApp)
process.once('SIGTERM', endApp)

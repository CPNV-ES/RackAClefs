/**
 * Load dependencies
 */
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
var passportSocketIo = require('passport.socketio')

/**
 * Protect administrators token from modification
 */
Object.defineProperty(global, 'adminUniq', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: uniqid()
})

/**
 * Define MongoDB Authentification
 */
var mongoOptions = {}

if (config.database.user != null && config.database.password != null) {
  mongoOptions.user = config.database.user
  mongoOptions.pass = config.database.password
}

users = {}

// Start server on configuration port
server.listen(port)

// Initialize MongoDB connection
mongoose.connect(config.database.url, mongoOptions)

var mongoStore = new MongoStore({mongooseConnection: mongoose.connection})

require('./passport')(passport)

app.set('views', __dirname + '/../client')

/**
 * ExpressJS middleware
 * Initialize cookie parsing
 * Initialize body parsing
 */
app.use(cookieParser())
app.use(bodyParser())

/**
 * Set view engine to ejs view template
 */
app.set('view engine', 'ejs')

/**
 * Define ExpressJS Authentification for Security
 * @param secret: the session_secret to parse the cookie
 * @param key: the name of the cookie where express/connect stores its session_id
 * @param store: we NEED to use a sessionstore. no memorystore please
 */
app.use(session({
  secret: config.app.secret != null ? config.app.secret : 'ilovescotchscotfsefeschyscotch',
  key: 'express.id',
  store: mongoStore
}))

/**
 * ExpressJS middleware
 * Initialize PassportJS
 * Initialize flash message storage
 */
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/**
 * Define static folder for ExpressJS
 */
app.use('/static', express.static(__dirname + '/../client/static/'))
app.use('/views', express.static(__dirname + '/../client/views/'))

// Load routes for ExpressJS
require('./routes')(app, passport)

/**
 * Define Socket.IO Authentification for Security
 * @param cookieParser: the same middleware you registrer in express
 * @param secret: the session_secret to parse the cookie
 * @param key: the name of the cookie where express/connect stores its session_id
 * @param store: we NEED to use a sessionstore. no memorystore please
 * @callback fail: *optional* callback on fail/error - read more below
 * @callback success: *optional* callback on success - read more below
 */
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: config.app.secret != null ? config.app.secret : 'ilovescotchscotfsefeschyscotch',
    key: 'express.id',
    passport: passport,
    store: mongoStore,
    fail: (data, message, error, accept) => {
        console.log('fail', message, error)
        accept(null, false)
    },
    success: () => {
        accept()
    }
}))

var d = domain.create()
// Import socket and usb detection modules
require('./sockets')(io, d)
require('./usb')()

console.log('The magic happens on port : ' + port)

/**
 * function for end process that will close ExpressJS server
 */
var endApp = () => {
  server.close()
  console.log('========== Closing App ==========')
  process.exit()
}

/**
 * Catch edn process signals
 */
process.once('SIGUSR1', endApp)
process.once('SIGUSR2', endApp)
process.once('SIGHUP', endApp)
process.once('SIGINT', endApp)
process.once('SIGTERM', endApp)

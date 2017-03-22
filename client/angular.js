/**
 * Load dependencies
 */
var io = require('socket.io-client')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var angular = require('angular')
require('angular-route')
require('angular-sanitize')
require('angular-socket-io')
require('angular-animate')
require('angularjs-toaster')
require('angular-gettext')
require('angular-ui-sortable')
require('angular-file-upload')

/**
 * Initialize new AngularJS application
 */
var app = angular.module('racapp', ['ngRoute', 'btford.socket-io', 'ngSanitize', 'toaster', 'ngAnimate', 'gettext', 'ui.sortable', 'angularFileUpload'])

/**
 * Define AngularJS router
 * templateUrl: is located in client folder
 */
app.config(function ($routeProvider) {
  app.routeProvider = $routeProvider
  $routeProvider.when('/home', {
    templateUrl: 'views/home/index.html',
    controller: 'HomeController'
  })

  $routeProvider.when('/reservations', {
    templateUrl: 'views/reservations/index.html',
    controller: 'ReservationController'
  })

  $routeProvider.when('/admin', {
    templateUrl: 'views/admin/index.html',
    controller: 'AdminController'
  })

  $routeProvider.when('/admin/reservations', {
    templateUrl: 'views/admin/reservations.html',
    controller: 'AdminController'
  })

  $routeProvider.otherwise({
    redirectTo: '/home'
  })
})

/**
 * AngularJS Directive 
 */
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter)
        })

        event.preventDefault()
      }
    })
  }
})

/**
 * AngularJS Factory for Socket.IO Client
 */
app.factory('socket', function (socketFactory, $rootScope, toaster) {
  var myIoSocket = io.connect()
  myIoSocket.on('globalSettings', function (globalSettings) {
    $rootScope.globalSettings = globalSettings
  })

  /**
   * Show error alert on server error
   */
  myIoSocket.on('server-error', function (msg, error) {
    console.error(error, typeof (error), msg)
    toaster.pop('error', 'Error', msg)
  })

  /**
   * Show error alert on socket disconnection
   */
  myIoSocket.on('disconnect', function () {
    toaster.pop('warning', 'Connexion lost', 'The server is no longer reachable')
    $rootScope.$apply()
  })

  /**
   * Show info alert on socket reconnection
   */
  myIoSocket.on('reconnect', function () {
    toaster.pop('info', 'Reconnected', 'The server is reachable again')
    $rootScope.$apply()
  })
  return socketFactory({ioSocket: myIoSocket})
})

/**
 * Load AngularJS Services
 */
app.service('sharedData', require('./service/sharedData.js'))
app.service('fileUpload', ['$http', require('./service/uploadFile.js')])

app.run(function ($rootScope) {
  $rootScope.range = function (n) {
    var l = []
    for (var i = 0; i < n; i++) {
      l.push(i)
    }
    return l
  }
  $rootScope.passport = passport
  $rootScope.admin = adminUniq
})

/**
 * Function to get the current AngularJS route
 */
app.run(function ($location, $rootScope) {
  $rootScope.currentPath = $location.path()
  $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
    $rootScope.currentPath = $location.path()
  })
})

/**
 * Load AngularJS Controllers
 */
app.controller('MainController', function ($scope) { $scope.init = true })
app.controller('HomeController', require('./controller/home'))
app.controller('ReservationController', require('./controller/reservation'))
app.controller('AdminController', require('./controller/admin'))

/**
 * Load AngularJS Views Directives for the layout
 */
require('./directive/views.js')(app)

/**
 * Bootloader for the AngularJS application
 */
var tId = setInterval(function () {
  clearInterval(tId)

  angular.element(document).ready(function () {
    setTimeout(function () {
      while (angular.element(document.body).scope() == null) {
        angular.bootstrap(document.body, ['racapp'])
        console.warn('retry start angular module')
      }
    }, 0)
  })
}, 5)

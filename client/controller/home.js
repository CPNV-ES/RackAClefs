/**
 * Export Home Controller
 */
module.exports = function ($scope, socket, $rootScope, toaster, $interval, fileUpload) {
  // List of all usb keys
  $scope.usbs = []
  // state of the modal view box
  $scope.modal = null

  /**
   * Get all usb keys
   */
  socket.emit('usb/list', function (err, list) {
    if (err) console.log(err)
    $scope.usbs = list
  })

  /**
   * Get all usb keys every 5 seconds
   */
  $interval(function () {
    socket.emit('usb/list', function (err, list) {
      if (err) console.log(err)
      $scope.usbs = list
    })
  }, 5000)

  /**
   * Function will initialize the modal view box
   */
  $scope.newModal = function () {
    $scope.modal = {
      count: 2,
      step: 0
    }
  }

  /**
   * Function will create new reservation
   */
  $scope.newReservation = function () {
    /**
     * @param id: the current id of the reservation
     * @param name: the current name of the reservation
     * @param count: the current number of keys that the user need
     * @param userId: the current connectde user id
     */
    var id = $scope.modal.id
    var name = $scope.modal.name
    var count = $scope.modal.count
    var userId = $rootScope.passport.user.id

    /**
     * Send new reservation to the socket server
     */
    socket.emit('reservation/save', { id: id, name: name, count: count, user: userId }, function (err, data) {
      if (err) {
        toaster.pop('error', 'Error', err)
      } else {
        $scope.modal.id = data.id
        $scope.modal.step = 1
        console.log(' Reserved ' + data)
      }
    })
  }

  /**
   * Will return the state of the usb key
   */
  $scope.keyState = function (key) {
    if (!key.initialized && key.status) {
      return { tag: 'Inconnue', classInfo: 'blue' }
    }

    if (key.reserverd) {
      return { tag: 'Reservée', classInfo: 'orange' }
    }

    if (key.status) {
      return { tag: 'Disponnible', classInfo: 'green' }
    } else {
      return { tag: 'Absente', classInfo: 'red' }
    }
  }

  /**
   * Function for file Upload
   */
  $scope.uploadFile = function () {
    // Contain the file
    var file = $scope.modal.file
    // Contain the reservation id
    var id = $scope.modal.id
    // Contain the upload url for files
    var uploadUrl = ''
    // Call uploadFIleToUrl form UploadFile Directive 
    fileUpload.uploadFIleToUrl(file, id, uploadUrl)
  }
}

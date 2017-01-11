module.exports = function($scope, socket, $rootScope, toaster, $interval, fileUpload) {

    $scope.usbs = [];
    $scope.modal = null

    socket.emit('usb/list', function(err, list){
      if(err) console.log(err);
      $scope.usbs = list
    })

    $interval(function() {
      socket.emit('usb/list', function(err, list){
        if(err) console.log(err);
        $scope.usbs = list
      })
    }, 5000)

    $scope.newModal = function () {
        $scope.modal = {
          count: 2,
          step: 0
        }
    }

    $scope.newReservation = function () {
      var id = $scope.modal.id
      var name = $scope.modal.name
      var count = $scope.modal.count
      var user_id = $rootScope.passport.user.id

      socket.emit('reservation/save', { id: id, name: name, count: count, user: user_id }, function (err, data) {
        if (err) {
          toaster.pop('error', 'Error', err)
        }else {
          $scope.modal.id = data.id
          $scope.modal.step = 1
          console.log(" Reserved " + data)
        }
          
      })

    }

    $scope.keyState = function(key) {
      if (!key.initialized && key.status) {
        return { tag: 'Inconnue', classInfo: 'info' }
      }

      if (key.reserverd) {
        return { tag: 'Reservée', classInfo: 'warning' }
      }

      if (key.status) {
        return { tag: 'Disponnible', classInfo: 'success' }
      } else {
        return { tag: 'Absente', classInfo: 'danger' }
      }
    }

    $scope.uploadFile = function () {
      var file = $scope.modal.file
      var id = $scope.modal.id

      var uploadUrl = ""

      fileUpload.uploadFIleToUrl(file, id, uploadUrl)
    }
}
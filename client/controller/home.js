module.exports = function($scope, socket, $rootScope, toaster, $interval, FileUploader){

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
          count: 2
        }
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
}
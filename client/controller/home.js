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
}
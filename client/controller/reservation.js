module.exports = function($scope, socket, $rootScope, toaster){

  $scope.widgets = [];

  socket.emit('reservation/list', function(err, reservations){
    if(err) return;
    $scope.reservations = reservations
  })

}
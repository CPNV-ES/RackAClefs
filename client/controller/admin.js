/**
 * Export Admin Controller
 * 
 * @global adminUniq: is the administrators token generated on application start for socket security
 */
module.exports = function ($scope, socket, $rootScope, toaster, $interval) {

  // 
  $scope.usbs = []

  /**
   * Get all usb keys
   */
  socket.emit(adminUniq + '/admin/usb/list', function (err, list) {
    if (err) console.log(err)
    $scope.usbs = list
  })

  /**
   * Get all keys every 5 seconds
   */
  $interval(function () {
    socket.emit(adminUniq + '/admin/usb/list', function (err, list) {
      if (err) console.log(err)
      $scope.usbs = list
    })
  }, 5000)
}

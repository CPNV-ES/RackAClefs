/**
 * Export Reservation Controller
 */
module.exports = function ($scope, socket, $rootScope, toaster) {
  // Store all reservations
  $scope.reservations = []

  /**
   * Get all reservations
   */
  socket.emit('reservation/list', function (err, reservations) {
    if (err) return
    $scope.reservations = reservations
  })
}

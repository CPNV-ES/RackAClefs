module.exports = function($scope, socket, $rootScope, toaster, $interval){
    $scope.usbs = []

    socket.emit(adminUniq + '/admin/usb/list', function(err, list){
        if(err) console.log(err);
        $scope.usbs = list
    })

    $interval(function() {
        socket.emit(adminUniq + '/admin/usb/list', function(err, list){
            if(err) console.log(err);
            $scope.usbs = list
        })
    }, 5000)

}
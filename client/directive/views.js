module.exports = function (app) {
  app.directive('topBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/topbar/index.html'
    }
  })

  app.directive('appScript', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/scripts.html',
      link: function () {
        /* if(!controlSideBarLoaded){
          var intervalID = setInterval(function(){
            if(controlSideBarLoaded){
              clearInterval(intervalID);
              $.AdminLTE.controlSidebar.activate();
            }
          }, 250);

        } */
      }
    }
  })

  app.directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel)
        var modelSetter = model.asign
        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0])
          })
        })
      }
    }
  }])
}

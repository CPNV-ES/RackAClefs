/**
 * Export View Directive for layout
 */
module.exports = function (app) {

  /**
   * Define topbar directive for <top-bar></top-bar> tag
   * @global templateUrl: located in client folder
   */
  app.directive('topBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/topbar/index.html'
    }
  })

  /**
   * Define appscript directive for <app-script></app-script> tag
   * @global templateUrl: located in client folder
   */
  app.directive('appScript', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/scripts.html'
    }
  })

  /**
   * Define topbar directive for fileModel attibute in tags
   * Assign file to  model variable
   */
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

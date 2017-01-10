module.exports = function(app){
  app.directive("topBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/topbar/index.html"
    };
  });
  
  app.directive("appScript", function(){
    return {
      restrict: "E",
      templateUrl: "views/scripts.html",
      link: function(){
        /*if(!controlSideBarLoaded){
          var intervalID = setInterval(function(){
            if(controlSideBarLoaded){
              clearInterval(intervalID);
              $.AdminLTE.controlSidebar.activate();
            }
          }, 250);

        }*/
      }
    };
  });  
}

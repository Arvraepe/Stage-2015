'use strict';

/**
 * @ngdoc function
 * @name clientApp.decorator:Toolbardecorator
 * @description
 * # Toolbardecorator
 * Decorator of the clientApp
 */
angular.module('stageprojectApp')
  .config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate','$modal','$routeParams', function(taRegisterTool, taOptions,$modal, $routeParams){
      // $delegate is the taOptions we are decorating
      // register the tool with textAngular
      taRegisterTool('taskFind', {
        iconclass: "fa fa-briefcase",
        action: function(size){
          var taskObj =  {};
          var modalInstance = $modal.open({
            templateUrl: 'views/project/projecttasks.html',
            controller: 'ProjectTasksCtrl',
            size:size,
            resolve:{
              projectId: function(){
                return $routeParams.pid;
              }
            }
          });
          modalInstance.result.then(function (task) {
            //$scope.board.states[0].tasks.push(task);
            taskObj=task;
          }, function () {
          });

          this.$editor().wrapSelection('forecolor', 'red');
        }
      });
      // add the button to the default toolbar definition
      taOptions.toolbar[1].push('taskFind');
      return taOptions;
    }]);
  });

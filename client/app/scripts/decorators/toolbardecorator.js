'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.decorator:Toolbardecorator
 * @description
 * # Toolbardecorator
 * Decorator of the stageprojectApp
 */
angular.module('stageprojectApp')
  .config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate','$modal','$routeParams','$rootScope', function(taRegisterTool, taOptions,$modal, $routeParams, $rootScope){
      // register the tool with textAngular
      taRegisterTool('taskFind', {
        iconclass: "fa fa-briefcase",
        tooltiptext: "Link a task",
        //action(deffered, restoreSelection)
        action: function(promise,restoreSelection){
          var taskObj =  {};
          var that = this;
          var insertLinkModalScope=$rootScope.$new();
          insertLinkModalScope.modalInstance = $modal.open({
            templateUrl: 'views/project/projecttasks.html',
            controller: 'ProjectTasksCtrl',
            size:'',
            resolve:{
              projectId: function(){
                return $routeParams.pid;
              }
            }
          });
          insertLinkModalScope.modalInstance.result.then(function (task) {
            restoreSelection();
            taskObj=task;
            that.$editor().wrapSelection('insertHTML', "<a href='#/project/" + taskObj.projectId +"/task/"+taskObj._id+"'>"+taskObj.title +"</a>");
            promise.resolve();
          });
          //return false so editor waits with generating the link until after the promise is resolved
          return false;
        }
      });
      //add button to the toolbar
      taOptions.toolbar[1].push('taskFind');
      return taOptions;
    }]);
  });

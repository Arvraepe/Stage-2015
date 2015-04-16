'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectCtrl' ,['$scope', '$routeParams', 'projectRequestFactory',
    'userRequestHandler', function ($scope, $routeParams, projectRequestFactory, userRequestHandler) {
    $scope.project = {};
    $scope.collaborators = [];
    $scope.leader = {};
    $scope.getProjectInfo = function(){
      var projectId = {
        projectId:$routeParams.pid
      };
      projectRequestFactory.getProjectById({
        params: projectId,
        success: function(response){
          angular.forEach(response.data.collaborators, function(collab){
            $scope.collaborators.push(collab);
          });
          $scope.leader = response.data.leader;
          $scope.project = response.data;

        },
        error:function(error){
          console.log(error);
        }
      })
    };


  }]);

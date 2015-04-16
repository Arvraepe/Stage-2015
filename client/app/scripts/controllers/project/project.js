'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectCtrl' ,['$scope', '$routeParams', 'projectRequestFactory', function ($scope, $routeParams, projectRequestFactory) {
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
          $scope.project=response.data;
          angular.forEach($scope.project.collaborators, function(collaborator){
            projectRequestFactory.getUserById({
              params: collaborator,
              success: function(response){
                console.log(response);
                $scope.collaborators.push(response.data);
              },
              error:function(error){
                console.log(error);
              }
            })
          });
          projectRequestFactory.getUserById({
            params:$scope.project.leader,
            success : function(response){
              console.log(response);
              $scope.leader = response.data;
            }
          })
        },
        error:function(error){
          console.log(error);
        }
      })
    };


  }]);

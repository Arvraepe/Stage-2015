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
          $scope.project=response.data;
          angular.forEach($scope.project.collaborators, function(collaborator){
            var collab = {
              userId : collaborator
            };
            userRequestHandler.getUserById({
              params: collab,
              success: function(response){
                console.log(response);
                $scope.collaborators.push(response.data.user);
              },
              error:function(error){
                console.log(error);
              }
            })
          });
          var projectLeader = {
            userId : $scope.project.leader
          };
          userRequestHandler.getUserById({
            params:projectLeader,
            success : function(response){
              console.log(response);
              $scope.leader = response.data.user;
            },
            error: function(error){
              console.log(error);
            }
          })
        },
        error:function(error){
          console.log(error);
        }
      })
    };


  }]);

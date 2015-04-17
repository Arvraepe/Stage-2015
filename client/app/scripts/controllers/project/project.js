'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectCtrl', ['$scope', '$routeParams', 'projectRequestFactory', '$modal',
    function ($scope, $routeParams, projectRequestFactory, $modal) {
      $scope.project = {};
      $scope.collaborators = [];
      $scope.leader = {};
      $scope.isLeader = function(){
        return ($scope.leader.username === $scope.$parent.currentUser.username);
      };

      $scope.openDetailsModal = function(size){
        var modalInstance = $modal.open({
          templateUrl: 'views/project/updatedetails.html',
          controller: 'UpdateDetailsCtrl',
          size: size,
          resolve: {
            project: function(){
              return $scope.project;
            }
          }
        });
        modalInstance.result.then(function(project){
          $scope.project = project;
        }, function(){
          console.log('Modal dismissed at: ' + new Date());
        })
      };

      $scope.getProjectInfo = function () {
        var projectId = {
          projectId: $routeParams.pid
        };
        projectRequestFactory.getProjectById({
          params: projectId,
          success: function (response) {
            angular.forEach(response.data.collaborators, function (collab) {
              $scope.collaborators.push(collab);
            });
            $scope.leader = response.data.leader;
            $scope.project = response.data;

          },
          error: function (error) {
            console.log(error);
          }
        })
      };

      $scope.openModal = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'views/project/updatecollaborators.html',
          controller: 'UpdateCollaboratorsCtrl',
          size: size
        })
      };


    }]);

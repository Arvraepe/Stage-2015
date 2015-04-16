'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DashboardCtrl', ['$scope', '$window', '$modal', 'projectRequestFactory', function ($scope, $window, $modal, projectRequestFactory) {
    $scope.userLeaderProjects = [];
    $scope.userCollaboratorProjects=[];
    $scope.showMyLeaderProjects = function(){
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userLeaderProjects);
    };

    $scope.showMyCollaborationProjects = function(){
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userCollaboratorProjects);
    };

    $scope.openModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/project/newproject.html',
        controller: 'NewProjectCtrl',
        size: size
      })
    };
    $scope.projectsToShow = [];



    function getProjectsForUser(){
      projectRequestFactory.getProjectsForUser({
        path:'project/getprojects',
        method:'GET',
        params: {},
        success: function(response){
          console.log(response);
          /*angular.forEach(response.data.myprojects, function(project){
            $scope.userLeaderProjects.push(project);
          });
          angular.forEach(response.data.otherprojects)*/
          $scope.userLeaderProjects = response.data.myProjects;
          $scope.userCollaboratorProjects = response.data.otherProjects;
          $scope.showAllProjects();
        },
        error: function(error){
          console.log(error);
        }
      })
    }

    $scope.showAllProjects = function(){
      $scope.projectsToShow = [];

      angular.forEach($scope.userLeaderProjects, function(project){
        $scope.projectsToShow.push(project);
      });
      angular.forEach($scope.userCollaboratorProjects, function(project){
        $scope.projectsToShow.push(project);
      });
    };



    getProjectsForUser();



  }]);

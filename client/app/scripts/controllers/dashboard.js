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


    $scope.title= 'All My Projects';



    $scope.openModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/project/newproject.html',
        controller: 'NewProjectCtrl',
        size: size
      })
    };
    $scope.projectsToShow = [];



    $scope.getProjectsForUser= function(){
      projectRequestFactory.getProjectsForUser({

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
      $scope.title = 'All My Projects';
    };

    $scope.showMyCollaborationProjects = function(){
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userCollaboratorProjects);
      $scope.title = 'Projects as Collaborator';
    };

    $scope.showMyLeaderProjects = function(){
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userLeaderProjects);
      $scope.title = 'Projects I own';
    };

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.numberOfPages = function(){
      return Math.ceil($scope.projectsToShow.length/$scope.pageSize);
    };


    /*$scope.paginate = {};
    $scope.paginate.size = 7;
    $scope.paginate.start = 0;

    $scope.prevPage = function(){
      if($scope.paginate.start){
        $scope.paginate.start -= $scope.paginate.size;
      }
    };

    $scope.nextPage = function(){
      $scope.paginate.start += $scope.paginate.size;
    };

    $scope.getProjectList = function(project,index){
      return (index>=$scope.paginate.start && index<$scope.paginate.start + $scope.paginate.size);
    };*/







  }]);

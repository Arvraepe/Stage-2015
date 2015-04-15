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

    $scope.openModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/project/newproject.html',
        controller: 'NewProjectCtrl',
        size: size
      })
    };
    getProjectsForUser();

    function getProjectsForUser(){
      projectRequestFactory.getProjectsForUser({
        path:'project/getprojects',
        method:'GET',
        params: {}
      }, getProjectsSuccessTrue, getProjectsSuccessFalse, getProjectsError)
    }

    function getProjectsSuccessTrue(response){
      console.log(response);
      $scope.myProjects = response.data.myprojects;
      $scope.otherProjects = response.data.otherprojects;
    }
    function getProjectsSuccessFalse(response){
      console.log(response);
    }
    function getProjectsError(response){
      console.log(response);
    }


  }]);

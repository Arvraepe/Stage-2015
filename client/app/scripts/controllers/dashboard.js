'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DashboardCtrl', ['$scope','$window', '$modal', function ($scope,$window, $modal) {

  $scope.openModal = function(size){

    var modalInstance = $modal.open({
      templateUrl: 'views/project/newproject.html',
      controller: 'NewProjectCtrl',
      size:size
    })
  }



  }]);

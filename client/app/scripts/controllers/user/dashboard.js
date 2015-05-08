'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('DashboardCtrl', ['$scope', '$modal', 'projectRequestFactory','notificationRequestFactory', '$location',function ($scope, $modal, projectRequestFactory, notificationRequestFactory, $location) {
    $scope.userLeaderProjects = [];
    $scope.userCollaboratorProjects = [];


    $scope.title = 'All My Projects';


    $scope.openModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/project/newproject.html',
        controller: 'NewProjectCtrl',
        size: size
      });
      modalInstance.result.then(function (project) {
          $scope.userLeaderProjects.push(project);
          $scope.showAllProjects();
        }, function () {

        }
      );
    };
    $scope.projectsToShow = [];


    $scope.getProjectsForUser = function () {
      projectRequestFactory.getProjectsForUser({
        params: {},
        success: function (response) {
          $scope.userLeaderProjects = response.data.myProjects;
          $scope.userCollaboratorProjects = response.data.otherProjects;
          $scope.showAllProjects();
          $scope.getNotifications();
        },
        error: function (error) {
        }
      })
    };

    $scope.getNotifications = function () {
      console.log('lel');
      notificationRequestFactory.getNotificationsForUser({
        params: {},
        success: function (response) {
          $scope.notifications = response.data.notifications;
          makeNotificationLink($scope.notifications);
        },
        error: function (error) {
          console.log(error);
        }
      })
    };

    $scope.showAllProjects = function () {
      $scope.projectsToShow = [];

      angular.forEach($scope.userLeaderProjects, function (project) {
        $scope.projectsToShow.push(project);
      });
      angular.forEach($scope.userCollaboratorProjects, function (project) {
        $scope.projectsToShow.push(project);
      });
      $scope.title = 'Projects';
    };

    $scope.showMyCollaborationProjects = function () {
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userCollaboratorProjects);
      $scope.title = 'Projects as Collaborator';
    };

    $scope.showMyLeaderProjects = function () {
      $scope.projectsToShow = [];
      $scope.projectsToShow = angular.copy($scope.userLeaderProjects);
      $scope.title = 'Projects I own';
    };


    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.numberOfPages = function () {
      return Math.ceil($scope.projectsToShow.length / $scope.pageSize);
    };

    $scope.pageChanged = function(){
      console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    function makeNotificationLink(notifications){
      angular.forEach(notifications, function (notification) {
        switch(notification.subjectType.toUpperCase()){
          case 'PROJECT': notification.link = '/project/'+notification.subjectDescriptor.projectId;
                break;
        }
      })
    }

    $scope.notificationRead=function(notificationLink){
      $location.path(notificationLink);
    }


  }]);

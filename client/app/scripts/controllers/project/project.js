'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ProjectCtrl', ['$scope', '$routeParams', 'projectRequestFactory', '$modal', 'notificationFactory', '$location', 'boardRequestFactory', '$filter', 'notificationRequestFactory',
    function ($scope, $routeParams, projectRequestFactory, $modal, notificationFactory, $location, boardRequestFactory, $filter, notificationRequestFactory) {
      $scope.project = {};
      $scope.collaborators = [];
      $scope.leader = {};
      $scope.isLeader = function () {
        return ($scope.leader.username === $scope.$parent.currentUser.username);
      };

      $scope.openDetailsModal = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'views/project/updatedetails.html',
          controller: 'UpdateDetailsCtrl',
          size: size,
          resolve: {
            project: function () {
              return $scope.project;
            }
          }
        });
        modalInstance.result.then(function (project) {
          $scope.project = project;
          $scope.leader = project.leader;
          $scope.collaborators = [];
          angular.forEach(project.collaborators, function(collab){
            $scope.collaborators.push(collab);
          });
          calculateTimeDifference();
        }, function () {
        })
      };

      $scope.openBoardModal = function(size){
        var modalInstance = $modal.open({
          templateUrl: 'views/board/newboard.html',
          controller: 'NewBoardCtrl',
          size: size,
          resolve:{
            projectId: function(){
              return $routeParams.pid;
            },
            states:function(){
              return $scope.project.standardStates;
            }
          }
        });
        modalInstance.result.then(function (board) {
          //TODO: ADD BOARD TO PROJECT SO IT JOINS THE BOARDLISTVIEW
          $scope.project.boards.push(board);
        }, function () {
        })
      };

      $scope.openPromoteModal = function(collab,size ){
        var modalInstance = $modal.open({
          templateUrl: 'views/project/promoteuser.html',
          controller: 'PromoteUserCtrl',
          size: size,
          resolve:{
            collaborator: function(){
              return collab;
            },
            projectId: function(){
              return $routeParams.pid
            }
          }
        });
        modalInstance.result.then(function (data) {
          $scope.leader = data.leader;
          $scope.collaborators = [];
          angular.forEach(data.collaborators, function (collab) {
            $scope.collaborators.push(collab);
          });
          $scope.project = data;
        }, function () {
        })
      };


      $scope.getProjectInfo = function () {
        var projectId = {
          projectId: $routeParams.pid
        };
        projectRequestFactory.getProjectById({
          params: projectId,
          success: function (response) {
            angular.forEach(response.data.project.collaborators, function (collab) { $scope.collaborators.push(collab);
            });
            $scope.leader = response.data.project.leader;
            $scope.project = response.data.project;
            calculateTimeDifference();
            $scope.getBoardNotifications();
          },
          error: function (error) {
            console.log(error);
          }
        })
      };

      $scope.getBoardNotifications = function () {
        angular.forEach($scope.project.boards, function (board) {
          var boardInfo={
            boardId : board._id,
            limit:5
          };
          notificationRequestFactory.getBoardNotifications({
            params: boardInfo,
            success: function (response) {
              board.notifications = response.data.notifications;
            },
            error: function (error) {
              console.log(error);
            }
          })
        });

      };



      $scope.deleteProject = function () {
        notificationFactory.createConfirm({
          title: 'Delete project ' + $scope.project.name,
          body: 'Are you sure?',
          confirm: function () {
            var projectId = {
              projectId: $routeParams.pid
            };
            projectRequestFactory.deleteProject({
              params: projectId,
              success: function (response) {
                notificationFactory.createNotification(response);
                $location.path('/dashboard');
              },
              error: function (error) {
                console.log(error);
              }
            });
          },
          cancel: function () {

          }
        });
      };

      $scope.openDeleteProjectModal = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'views/project/deleteproject.html',
          controller: 'DeleteProjectCtrl',
          size: size,
          resolve:{
            project: function(){
              return $scope.project;
            }
          }
        });
        modalInstance.result.then(function (data) {
          $location.path('/dashboard');
        }, function () {
        })

      };

      function calculateTimeDifference() {
        var now = moment();
        var deadline = moment($scope.project.deadline);
        var duration = moment.duration(deadline.diff(now));
        var days = duration.asDays();
        $scope.lazyDate = days;
      }

      $scope.createNewBoard = function (board) {
        //naam & deadline nodig
        board.projectId = $routeParams.pid;
        boardRequestFactory.createBoard({
          data: board,
          success:function(response){
            $scope.project.boards.push(response.data);
          },
          error:function(error){
            console.log(error);
          }
        });
      };

      $scope.openDeleteBoardModal = function(board,size ){
        var modalInstance = $modal.open({
          templateUrl: 'views/board/deleteboard.html',
          controller: 'DeleteBoardCtrl',
          size: size,
          resolve:{
            board: function(){
              return board;
            }
          }
        });
        modalInstance.result.then(function (data) {

          $scope.project.boards = $filter('filter')($scope.project.boards, {_id: '!'+data._id});
        }, function () {
        })
      };


    }])
;

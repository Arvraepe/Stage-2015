'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('BoardCtrl', function ($scope, $routeParams, boardRequestFactory, $modal, taskRequestFactory, notificationFactory, columnHeightFactory, $interval,$q) {
    $scope.board = {};
    $scope.amountOfStates = 0;
    $scope.columnWidth = 0;
    $scope.arrowIsHidden = [];
    $scope.dragging=false;
    $scope.dropzoneFields =[];

    function calculateTimeDifference() {
      var now = moment();
      var deadline = moment($scope.board.deadline);
      var duration = moment.duration(deadline.diff(now));
      var days = duration.asDays();
      $scope.lazyDate = days;
    }


    $scope.isLeader = function () {
      if ($scope.board.leader != undefined) {
        return ($scope.board.leader._id === $scope.$parent.currentUser._id);
      }
    };


    $scope.getBoardInfo = function () {
      var boardName = {
        boardId: $routeParams.boardId
      };
      boardRequestFactory.getBoardInfo({
        params: boardName,
        success: function (response) {
          $scope.board = response.data.board;
          $scope.amountOfStates = $scope.board.states.length;
          $scope.columnWidth = Math.floor(100 / $scope.amountOfStates) + '%';
          $scope.board.collaborators = response.data.board.parentProject.collaborators;
          $scope.board.collaborators.push(angular.copy(response.data.board.parentProject.leader));
          $scope.board.leader = response.data.board.parentProject.leader;
          addTasksToStates();
          calculateTimeDifference();
          var projectId = {
            projectId: $scope.board.parentProject._id
          };
          boardRequestFactory.getBoards({
            params: projectId,
            success: function (response) {
              angular.forEach(response.data.boards, function (board, index, array) {
                if (board._id === $scope.board._id) {
                  array.splice(index, 1);
                }
              });
              $scope.projectboards = response.data.boards;
              angular.forEach($scope.projectboards, function (board, index, array) {
                $scope.arrowIsHidden.push(true);
              });
              $scope.height = columnHeightFactory.resetHeight();
              $scope.determineColumnHeight();
            },
            error: function (error) {

            }
          })
        },
        error: function (error) {
          console.log(error);
        }
      })
    };

    function addTasksToStates() {
      var states = [];
      angular.forEach($scope.board.states, function (state) {
        var stateObj = {
          name: state,
          tasks: []
        };
        states.push(stateObj);
      });
      angular.forEach($scope.board.tasks, function (task) {
        angular.forEach(states, function (state) {
          if (task.state == state.name) {
            state.tasks.push(task);
          }
        });
      });
      $scope.board.states = [];
      $scope.board.states = states;
    }

    $scope.openEditBoardModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/board/editboard.html',
        controller: 'EditBoardCtrl',
        size: size,
        resolve: {
          board: function () {
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (data) {
        $scope.board = data;
        $scope.amountOfStates = $scope.board.states.length;
        $scope.columnWidth = Math.floor(100 / $scope.amountOfStates) + '%';
        $scope.board.collaborators = data.parentProject.collaborators;
        $scope.board.collaborators.push(angular.copy(data.parentProject.leader));
        $scope.board.leader = data.parentProject.leader;
        addTasksToStates();
        calculateTimeDifference();
      }, function () {
      })
    };

    $scope.openCreateTaskModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/task/createtask.html',
        controller: 'CreateTaskCtrl',
        size: size,
        resolve: {
          board: function () {
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (task) {
        addTaskToState(task);
      }, function () {
      })
    };

    function addTaskToState(task) {
      angular.forEach($scope.board.states, function (state) {
        if (state.name === task.state) {
          state.tasks.push(task);
        }
      })
    }


    function updateTaskStatus(task) {
      angular.forEach($scope.board.states, function (state) {
        angular.forEach(state.tasks, function (stateTask, index, array) {
            if (stateTask._id === task._id) {
              array.splice(index,1);
            }
          }
        );
        if(task.state == state.name){
          state.tasks.push(task);
        }
      })
    }

    $scope.stateSortOptions={
      start: function (e, ui) {

      },
      stop: function (e, ui) {

      },
      update: function (e, ui) {

      }
    };

    $scope.taskSortOptions = {
      placeholder: 'app',
      connectWith: '.stateLayout',
      start: function (e,ui) {
        $scope.$apply(function () {
          $scope.dragging=true;
        });
        $('.dropzone').sortable('refresh');

      },
      stop: function (e,ui) {
        if(ui.item.sortable.droptarget == undefined ){
          $scope.$apply($scope.dragging = false);
          return;
        }
        else if (ui.item.sortable.droptarget[0].classList[2] == "dropzone") {
          // run code when item is dropped in the dropzone
          $scope.$apply($scope.dragging = false);
        }
        else{
          $scope.$apply($scope.dragging = false);
        }
      },
      update: function (e, ui) {
        var uiStuff = ui;
        var taskModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget[0].classList[2] === "dropzone"){
          var cancelMethod = ui.item.sortable.cancel;
          var size={};
          var modalInstance = $modal.open({
            templateUrl: 'views/board/changeboard.html',
            controller: 'ChangeBoardCtrl',
            size: size,
            resolve: {
              board: function () {
                return $scope.board;
              },
              ui: function () {
                return uiStuff
              }
            }
          });
          modalInstance.result.then(function (board) {
            taskModel.boardId = board._id;
            var taskInformation = {
              task: {
                _id : taskModel._id,
                boardId : taskModel.boardId
              }
            };
            taskRequestFactory.updateTask({
              data:taskInformation,
              success:function(response){
                notificationFactory.createNotification(response);
              },
              error: function (error) {
                console.log(error);
              }
            })

          }, function (lala) {
            console.log(lala);
          })
        }
        else if(ui.item.sortable.droptarget[0].classList[1] === "boardView"){
          taskModel.state = ui.item.sortable.droptarget[0].title;
          var taskInformation = {
            task: {
              _id : taskModel._id,
              state : taskModel.state
            }
          };
          taskRequestFactory.changeState({
            data:taskInformation,
            success:function(response){

            },
            error: function (error) {
              console.log(error);
            }
          });
        }
      }
    };

    $scope.otherBoardsTasks = [{}];

    $scope.determineColumnHeight = function () {
      $interval(function () {
        $scope.height = columnHeightFactory.getMaxHeight();
      }, 1000);
    };


  }
)
;

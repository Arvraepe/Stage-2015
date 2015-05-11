'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('BoardCtrl', function ($scope, $routeParams, boardRequestFactory,$modal, taskRequestFactory, notificationFactory, columnHeightFactory, $interval) {
    $scope.board = {};
    $scope.amountOfStates = 0;
    $scope.columnWidth = 0;
    $scope.arrowIsHidden=[];

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



    $scope.getBoardInfo = function(){
        var boardName = {
          boardId:$routeParams.boardId
        };
        boardRequestFactory.getBoardInfo({
          params: boardName,
          success:function(response){
            $scope.board = response.data.board;
            $scope.amountOfStates = $scope.board.states.length;
            $scope.columnWidth= Math.floor(100/$scope.amountOfStates) + '%';
            $scope.board.collaborators = response.data.board.parentProject.collaborators;
            $scope.board.collaborators.push(angular.copy(response.data.board.parentProject.leader));
            $scope.board.leader = response.data.board.parentProject.leader;
            addTasksToStates();
            calculateTimeDifference();
            var projectId = {
              projectId : $scope.board.parentProject._id
            };
            boardRequestFactory.getBoards({
              params: projectId,
              success:function(response){
                angular.forEach(response.data.boards, function (board, index, array) {
                  if(board._id === $scope.board._id){
                    array.splice(index,1);
                  }
                });
                $scope.projectboards = response.data.boards;
                angular.forEach($scope.projectboards, function (board, index, array) {
                  $scope.arrowIsHidden.push(true);
                });
                $scope.height = columnHeightFactory.resetHeight();
                $scope.determineColumnHeight();
              },
              error: function(error){

              }
            })
          },
          error: function(error){
            console.log(error);
          }
        })
    };

    function addTasksToStates(){
      var states = [];
      angular.forEach($scope.board.states, function(state){
        var stateObj = {
          name: state,
          tasks : []
        };
        states.push(stateObj);
      });
      angular.forEach($scope.board.tasks, function(task){
        angular.forEach(states, function(state){
          if(task.state == state.name){
            state.tasks.push(task);
          }
        });
      });
      $scope.board.states = states;
    }

    $scope.openEditBoardModal = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'views/board/editboard.html',
        controller: 'EditBoardCtrl',
        size: size,
        resolve:{
          board: function(){
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (data) {
        $scope.board = data;
        $scope.amountOfStates = $scope.board.states.length;
        $scope.columnWidth= Math.floor(100/$scope.amountOfStates)+'%';
        $scope.board.collaborators = data.parentProject.collaborators;
        $scope.board.collaborators.push(angular.copy(data.parentProject.leader));
        $scope.board.leader = data.parentProject.leader;
        addTasksToStates();
        calculateTimeDifference();
      }, function () {
      })
    };

    $scope.openCreateTaskModal = function(size){
      var modalInstance = $modal.open({
        templateUrl: 'views/task/createtask.html',
        controller: 'CreateTaskCtrl',
        size: size,
        resolve:{
          board: function(){
            return $scope.board;
          }
        }
      });
      modalInstance.result.then(function (task) {
        addTaskToState(task);
      }, function () {
      })
    };

    function addTaskToState(task){
      angular.forEach($scope.board.states, function(state){
        if(state.name===task.state){
          state.tasks.push(task);
        }
      })
    }

    $scope.taskSortOptions = {
      itemMoved:function(event){
        console.log(event);
        if(event.dest.sortableScope.$parent.projectBoard){
          var taskInfo = {task:{
            _id : event.source.itemScope.modelValue._id,
            boardId : event.dest.sortableScope.$parent.projectBoard._id,
          }};
          taskRequestFactory.switchBoard({
            data: taskInfo,
            success:function(response){
              notificationFactory.createNotification(response);
            },
            error: function (error) {
              notificationFactory.createNotification(error);
            }
          })
        }
        event.source.itemScope.modelValue.state = event.dest.sortableScope.$parent.state.name;
        var task = {
          task:{
            _id : event.source.itemScope.modelValue._id,
            state : event.source.itemScope.modelValue.state,
            assignee : event.source.itemScope.modelValue.assignee._id,
            creator : event.source.itemScope.modelValue.creator._id,
            title : event.source.itemScope.modelValue.title,
            description:event.source.itemScope.modelValue.description
          }
        };

        console.log(event);
        taskRequestFactory.changeState({
          data: task,
          success:function(response){
            //taken opnieuw tekenen
            angular.forEach($scope.board.tasks, function (task, index, array) {
              if(task._id === response.data.task._id){
                array[index] = response.data.task;
              }
            })
          },
          error: function(error){
            console.log(error);
          }
        })
      },
      orderChanged: function(event){

      },
      dragStart: function (object) {
        $scope.arrowIsHidden[0]=false;

      },
      dragEnd: function (object) {
        $scope.arrowIsHidden[0]=true;
        columnHeightFactory.resetHeight();
        $scope.height = columnHeightFactory.getMaxHeight();
      },
      containerPositioning:'relative',
      additionalPlaceholderClass:'dragPlaceholder'
    };

    $scope.otherBoardsTasks = [{}];

    $scope.determineColumnHeight = function () {
      $interval(function () {
        $scope.height = columnHeightFactory.getMaxHeight();
        console.log(columnHeightFactory.getMaxHeight());
      },1000);
    };




  });

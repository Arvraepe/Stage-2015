'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:ResetpasswordCtrl
 * @description
 * # ResetpasswordCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('ResetpasswordCtrl', ['$scope', 'userRequestHandler', '$window','notificationFactory', function ($scope, userRequestHandler, $window, notificationFactory) {
    $scope.user = {
      email: ''
    };

    $scope.resetPassword = function (user) {
      userRequestHandler.resetPassword({
        data:user,
        success: function(response){
          notificationFactory.createNotification(response);
          $window.location.href = '#/';
        },
        error: function(error){
          console.log(error);
        }
      });
    }

  }]);

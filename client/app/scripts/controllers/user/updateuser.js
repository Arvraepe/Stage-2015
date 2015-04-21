'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UpdateuserCtrl
 * @description
 * # UpdateuserCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UpdateuserCtrl', ['$scope', 'userRequestHandler', 'Session', '$window', 'notificationFactory', function ($scope, userRequestHandler, Session, $window, notificationFactory) {
    $scope.userinfotochange = angular.copy($scope.currentUser);
    $scope.confirmpassword = '';
    var sId = Session.getId();
    $scope.copyOfUserInfoToChange = {};


    $scope.updateUser = function (userinfotochange) {
      if ($scope.passwordForm.$invalid && $scope.userForm.$valid) {
        $scope.copyOfUserInfoToChange.firstname = userinfotochange.firstname;
        $scope.copyOfUserInfoToChange.lastname = userinfotochange.lastname;
        $scope.copyOfUserInfoToChange.email = userinfotochange.email;
        userRequestHandler.updateUser({
          data: $scope.copyOfUserInfoToChange,
          success: function (response) {
            notificationFactory.createNotification(response);
            $scope.setCurrentUser(response.data.user, sId);
            $window.location.href = '#/dashboard';
          },
          error: function (error) {

          }
        });
      }
      else if ($scope.passwordForm.$valid && $scope.userForm.$valid) {
        $scope.copyOfUserInfoToChange.firstname = userinfotochange.firstname;
        $scope.copyOfUserInfoToChange.lastname = userinfotochange.lastname;
        $scope.copyOfUserInfoToChange.email = userinfotochange.email;
        $scope.copyOfUserInfoToChange.oldPassword = userinfotochange.oldPassword;
        $scope.copyOfUserInfoToChange.newPassword = userinfotochange.newPassword;
        userRequestHandler.updateUser({
          data: $scope.copyOfUserInfoToChange,
          success: function (response) {
            if (response.data != undefined) {
              notificationFactory.createNotification(response);
              $scope.setCurrentUser(response.data.user, sId);
            }

            $window.location.href = '#/dashboard';
          },
          error: function (error) {

          }
        });
      }
    }


  }]);

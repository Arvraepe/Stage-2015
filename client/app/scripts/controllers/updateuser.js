'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UpdateuserCtrl
 * @description
 * # UpdateuserCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UpdateuserCtrl', ['$scope', 'userFactory', 'Session', '$window', function ($scope, userFactory, Session, $window) {
    $scope.userinfotochange = angular.copy($scope.currentUser);
    $scope.confirmpassword= '';
    var sId = Session.getId();

    /*if($scope.updateUserForm.oldpasswordField.$dirty){
      $scope.updateUserForm.newpasswordField.$setRequired();
      $scope.updateUserForm.confirmPasswordField;
    }*/
    $scope.copyOfUserInfoToChange = {};


    $scope.updateUser = function (userinfotochange) {
      if($scope.passwordForm.$invalid && $scope.updateUserForm.firstnameField.$valid &&
        $scope.updateUserForm.lastnameField.$valid && $scope.updateUserForm.emailField.$valid){
        $scope.copyOfUserInfoToChange.firstname = userinfotochange.firstname;
        $scope.copyOfUserInfoToChange.lastname = userinfotochange.lastname;
        $scope.copyOfUserInfoToChange.email = userinfotochange.email;
        userFactory.updateUser($scope.copyOfUserInfoToChange, function(data){
          $scope.setCurrentUser(data.user, sId);
          $window.location.href = '#/dashboard';
        });
      }
      else if($scope.passwordForm.$valid && $scope.updateUserForm.firstnameField.$valid &&
        $scope.updateUserForm.lastnameField.$valid && $scope.updateUserForm.emailField.$valid){
        $scope.copyOfUserInfoToChange.firstname = userinfotochange.firstname;
        $scope.copyOfUserInfoToChange.lastname = userinfotochange.lastname;
        $scope.copyOfUserInfoToChange.email = userinfotochange.email;
        $scope.copyOfUserInfoToChange.oldPassword = userinfotochange.oldPassword;
        $scope.copyOfUserInfoToChange.newPassword = userinfotochange.newPassword;
        userFactory.updateUser($scope.copyOfUserInfoToChange, function (data) {
          console.log($scope.currentUser);
          if(data!=undefined){
            $scope.setCurrentUser(data.user, sId);
            $window.location.href = '#/dashboard';
          }

        });
      }
    }


  }]);

'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('RegisterCtrl', ['$scope', 'userFactory', '$window', 'notificationService', function ($scope, userFactory, $window, notificationService) {
    $scope.user = {};
    $scope.confirmpassword = "";


    $scope.success = function (response) {
      if (response.success) {
        notificationService.success(response.messages.message);
      }
      else {
        notificationService.notice(response.messages.message);
      }
    };
    $scope.error = function (response) {
      console.log(response);
      notificationService.error('Something went wrong, ' + response.messages.message);
    };
    $scope.register = function () {
      if (angular.equals($scope.confirmpassword, $scope.user.password)) {
        userFactory.registerUser($scope.user, $scope.success, $scope.error);
      }


      /*WERKENDE VERSIE DEZE COMMENT
       requestFactory.sendRequest({
       path: 'register',
       method: 'post',
       data: $scope.user,
       success: function (response) {
       if(response.success){
       notificationService.success('Register successful');
       }
       },
       error: function(response){
       console.log("error voorgekomen");
       console.error(response)
       }
       });*/
      /* httpFactory.httpPost("/register", $scope.user).success(function (data) {
       notificationService.success('Register succesful');
       //$window.location.href="";

       }).error(function (err) {
       notificationService.error('Something went wrong while registering, please try again.');
        console.log('Something went wrong while registering ' + err);
       });*/

    }

  }]);

'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('RegisterCtrl', ['$scope', 'httpFactory',, '$http', function ($scope, httpFactory, $http) {
    $scope.user = {};
    $scope.register = function () {
      httpFactory.httpPost("/register", $scope.user).success(function (data) {
        //notificationService.success('Successing text')  ;
      }).error(function (err) {
        //notificationService.error('Something went wrong while registering, please try again.');
        console.log(err);
      });
      /*$http({
       url:'http://localhost:8080/register',
       method: 'POST',
       dataType: 'json',
       data: {
       'username' : $scope.user.username,
       'firstname' : $scope.user.firstname,
       'lastname' : $scope.user.lastname,
       'password' : $scope.user.password,
       'email' : $scope.user.email
       }
       }).success(function(data){
       alert("het gaat goed");
       }).error(function(err){
       alert(err);
       console.log(err);
       });
       */
      /*httpFactory.httpPost('/register',$scope.user).success(function(data){
       console.log("callback succesvol");
       alert('we zijn binneuuu ' + data);
       }).error(function(data){
       alert('fout bij registreren');
       $scope.user.password = '';
       })*/
    }

  }]);

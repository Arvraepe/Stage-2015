'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:InvitecoworkersCtrl
 * @description
 * # InvitecoworkersCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('InvitecoworkersCtrl', ['$scope', 'userRequestHandler','notificationFactory', function ($scope, userRequestHandler, notificationFactory) {
    $scope.coworkersToInvite = [{
      email: ''
    }];

    $scope.invite = function (coworkersToInvite) {
      var inviteCoworkersInfo = {
        emails : $scope.coworkersToInvite,
        domain:'http://localhost:9000',
        registerPath:'/#/register/'
      };
      userRequestHandler.inviteCoworkers({
        data:inviteCoworkersInfo,
        success:function(response){
          notificationFactory.createNotification(response);
        },
        error: function(error){
          console.log(error);
        }
      });
    };
    $scope.addCoworker = function () {
      $scope.coworkersToInvite.push({
        email: ''
      })
    };
  }]);

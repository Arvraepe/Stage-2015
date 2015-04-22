'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:PromoteuserCtrl
 * @description
 * # PromoteUserCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('PromoteUserCtrl', function ($scope, $modalInstance, collaborator,projectId, projectRequestFactory, notificationFactory) {
    $scope.collaborator = collaborator;


    $scope.promoteUserToLeader = function () {
      var postSettings = {
        projectId : projectId,
        userId : collaborator._id
      };
      projectRequestFactory.promoteToLeader({
        data: postSettings,
        success:function(response){
          /*$scope.leader = response.data.leader;
          $scope.collaborators = [];
          angular.forEach(response.data.collaborators, function (collab) {
            $scope.collaborators.push(collab);
          });
          $scope.project = response.data;*/
          $modalInstance.close(response.data)
          notificationFactory.createNotification(response);
          console.log(response);
        },
        error : function(error){
          console.log(error);
        }
      })
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };




  });

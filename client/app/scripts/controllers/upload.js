'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UploadCtrl
 * @description
 * # UploadctrlCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UploadCtrl', ['$scope', '$upload', 'Session', function ($scope, $upload, Session) {
    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          $upload.upload({
            url: 'http://localhost:6543/user/uploadavatar',
            token: Session.getId(),
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
          });
        }
      }
    };


  }]);

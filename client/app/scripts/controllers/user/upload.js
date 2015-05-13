'use strict';

/**
 * @ngdoc function
 * @name stageprojectApp.controller:UploadCtrl
 * @description
 * # UploadctrlCtrl
 * Controller of the stageprojectApp
 */
angular.module('stageprojectApp')
  .controller('UploadCtrl', ['$scope', '$upload', 'Session', 'loginFactory', 'notificationFactory',
    'userFactory', function ($scope, $upload, Session, loginFactory, notificationFactory, userFactory) {
    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });


    $scope.upload = function (files) {
      console.log(files);
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          $upload.upload({
            url: 'http://localhost:6543/user/uploadavatar',
            data: Session.getId(),
            enctype: 'multipart/form-data',
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            $scope.setImageUrl(data.data.imageUrl);
            notificationFactory.createNotification(data);
          });
        }
      }
    };


  }]);

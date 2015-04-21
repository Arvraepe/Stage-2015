'use strict';

/**
 * @ngdoc service
 * @name stageprojectApp.notificationFactory
 * @description
 * # notificationFactory
 * Factory in the stageprojectApp.
 */
angular.module('stageprojectApp')
  .factory('notificationFactory', ['notificationService', function (notificationService) {
    // Service logic
    // ...
    var notificationFactory = {};


    // Public API here
    notificationFactory.createNotification = function (data) {
      angular.forEach(data.messages, function (message) {
        switch (message.code) {
          case 'INFO':
            notificationService.success(message.message);
            break;
          case 'WARN':
            notificationService.notice(message.message);
            break;
          case 'ERROR':
            notificationService.error(message.message);
            break;
          case 'FATAL':
            notificationService.error(message.message);
            break;
        }

      });

    };

    notificationFactory.createConfirm = function(config){
      notificationService.notify({
        title: config.title,
        text: config.body,
        hide: false,
        confirm: {
          confirm: true
        },
        buttons: {
          closer: false,
          sticker: false
        },
        history: {
          history: false
        }
      }).get().on('pnotify.confirm', config.confirm
      ).on('pnotify.cancel', config.cancel);
    };

    return notificationFactory;
  }]);

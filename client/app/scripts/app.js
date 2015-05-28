'use strict';

/**
 * @ngdoc overview
 * @name stageprojectApp
 * @description
 * # stageprojectApp
 *
 * Main module of the application.
 */
var app = angular.module('stageprojectApp', [
  'ngAnimate',
  'ngCookies',
  'ngRoute',
  'ngTouch',
  'jlareau.pnotify',
  'validation.match',
  'angularFileUpload',
  'LocalStorageModule',
  'ui.bootstrap',
  'ui.select',
  'ngSanitize',
  'ui.sortable',
  'angularMoment',
  'textAngular',
  'infinite-scroll'
]);

app.config(function ($routeProvider, $locationProvider, USERROLES) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'ApplicationCtrl'
    })
    .when('/login', {
      templateUrl: 'views/user/login.html',
      controller: 'LoginCtrl'
    })
    .when('/register', {
      templateUrl: 'views/user/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/updateuser', {
      templateUrl: 'views/user/updateuser.html',
      controller: 'UpdateuserCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/invitecoworkers', {
      templateUrl: 'views/user/invitecoworkers.html',
      controller: 'InvitecoworkersCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/resetpassword', {
      templateUrl: 'views/user/resetpassword.html',
      controller: 'ResetpasswordCtrl'
    })
    .when('/user/recover/:uuid', {
      templateUrl: 'views/user/recover.html',
      controller: 'UserRecoverCtrl'
    })
    .when('/register/:email', {
      templateUrl: 'views/user/registeremail.html',
      controller: 'RegisterCtrl'
    })
    .when('/project/:pid', {
      templateUrl: 'views/project/project.html',
      controller: 'ProjectCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/register/:email/:pid', {
      templateUrl: 'views/user/registeremailproject.html',
      controller: 'RegisterCtrl'
    })
    .when('/project/:pid/board/:boardId', {
      templateUrl: 'views/board/board.html',
      controller: 'BoardCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/project/:pid/task/:taskId', {
      templateUrl: 'views/task/task.html',
      controller: 'TaskCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/updateTask', {
      templateUrl: 'views/updatetask.html',
      controller: 'UpdatetaskCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/landingPage', {
      templateUrl: 'views/landingpage.html',
      controller: 'LandingpageCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
});

app.config(function (datepickerConfig) {
  console.log(datepickerConfig);
  datepickerConfig.maxDate = "2020-01-01";
});
app.config(function (datepickerPopupConfig) {
  console.log(datepickerPopupConfig);
  datepickerPopupConfig.datepickerPopup= "'dd-MM-yyyy'";

});


app.run(function ($rootScope, $location, AUTHEVENTS, AuthService, userFactory, Session, localStorageService, loginFactory) {
  if (localStorageService.get('userInfo') != null) {
    var userInfo = localStorageService.get('userInfo');
    loginFactory.setUser(userInfo);
    Session.create(localStorageService.get('tokenInfo'), userInfo.role);
  }

  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (next.$$route != undefined && next.$$route.data != undefined) {

      var authorizedRoles = next.$$route.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          //user is not allowed
          $rootScope.$broadcast(AUTHEVENTS.notAuthenticated);
        } else {
          //user is not logged in
          $rootScope.$broadcast(AUTHEVENTS.notAuthenticated);
        }
      }
    }

  });
});




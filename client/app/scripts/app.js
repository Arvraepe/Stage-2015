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
  'validation.match'
]);

/*angular
 .module('stageprojectApp', [
 'ngAnimate',
 'ngCookies',
 'ngRoute',
 'ngTouch',
 'services',
 'jlareau.pnotify'
 ])*/
app.config(function ($routeProvider, USERROLES) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/editUser', {
      templateUrl: 'views/edituser.html',
      controller: 'EdituserCtrl',
      data: {
        authorizedRoles: USERROLES.user
      }
    })
    .otherwise({
      redirectTo: '/'
    });
});


app.run(function ($rootScope, AUTHEVENTS, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (next.data != undefined) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTHEVENTS.notAuthorized);
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTHEVENTS.notAuthenticated);
        }
      }
    }

  });
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})


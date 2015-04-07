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
  'LocalStorageModule'
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
app.config(function ($routeProvider, $locationProvider, USERROLES) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'ApplicationCtrl'
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
      /* resolve: {
       auth: function resolveAuthentication(AuthResolver) {
       return AuthResolver.resolve();
       }
       },*/

    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/editUser', {
      templateUrl: 'views/edituser.html',
      controller: 'EdituserCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .when('/updateuser', {
      templateUrl: 'views/updateuser.html',
      controller: 'UpdateuserCtrl',
      data: {
        authorizedRoles: [USERROLES.user]
      }
    })
    .otherwise({
      redirectTo: '/'
    });
});


app.run(function ($rootScope, $location, AUTHEVENTS, AuthService, userFactory, Session, localStorageService) {
  if (localStorageService.get('userInfo') != null) {
    var userInfo = localStorageService.get('userInfo');
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

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      console.log($injector.get('AuthInterceptor'));
      return $injector.get('AuthInterceptor');
    }
  ]);
});


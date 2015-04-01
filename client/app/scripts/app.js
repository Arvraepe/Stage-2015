'use strict';

/**
 * @ngdoc overview
 * @name stageprojectApp
 * @description
 * # stageprojectApp
 *
 * Main module of the application.
 */
angular
  .module('stageprojectApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngTouch',
    'services'
  ])
  .config(function ($routeProvider) {
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
        controller: 'EdituserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

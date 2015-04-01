/**
 * Created by OEM on 31/03/2015.
 */
'use strict';
var services = angular.module('services', []);

services.factory('httpFactory', ['$http', function ($http) {
  return {
    httpPost: function (urlParam, data) {
      return $http({
        url: 'http://localhost:6543' + urlParam,
        method: 'POST',
        dataType: 'json',
        data: data
      });

      // return $http.post(url,data);
    },
    httpGet: function (urlParam) {
      return $http({
        url: 'http://localhost:6543' + urlParam,
        method: 'GET',
        dataType: 'json',
        data: data
      });
      //return $http.get(url);
    }
  };
}]);


services.factory('loginFactory', function () {
  var loggedInUser = {};

  return {
    getUser: function () {
      return loggedInUser;
    },
    setUser: function (value) {
      loggedInUser = value;
    },
    clearUser: function () {
      loggedInUser = {};
    }
  };
});

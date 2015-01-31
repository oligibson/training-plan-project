'use strict';

angular.module('trainingServerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/docs', {
        templateUrl: 'app/docs/docs.html',
        controller: 'DocsCtrl'
      });
  });

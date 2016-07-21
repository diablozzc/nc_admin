'use strict';

/**
 * @ngdoc overview
 * @name propertyAdminApp
 * @description
 * # propertyAdminApp
 *
 * Main module of the application.
 */
var lodash = _.noConflict();

var app = angular
  .module('propertyAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload',
    'ui.router',
    'ui.grid',
    'ui.bootstrap.buttons',
    'ui.select',
    'ui.tree',
    'ui.sortable',
    'ui.layout',
    'ui.validate',
    'ui.bootstrap.datetimepicker',
    'LocalStorageModule',
    'daterangepicker',
    'cgNotify',
    'cgBusy',
    'angularMoment',
    'textAngular',
    'ngDialog',
    'ngTable',
    'ngTagsInput',
    'angularChart',
    'mgcrea.ngStrap',
    'AngularPrint',
    'summernote'
  ]);

window.app = app;
window.md5 = md5;

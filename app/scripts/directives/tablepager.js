'use strict';

/**
 * @ngdoc directive
 * @name adAdminApp.directive:tablePager
 * @description
 * # tablePager
 */

  app.directive('tablePager', function () {
    return {
      templateUrl:'/partials/pager.html',
      restrict: 'E',
      replace:true,
      link: function postLink(scope, element, attrs) {

        scope.cp = scope.params.page();
        scope.ms = 5;


        scope.$watch('params.total() / params.count()',function(val){
          scope.tp = val ? Math.ceil(val) : 1;
        });

        scope.$watch('params.page()',function(val){
          scope.cp = val;
        });

        scope.$watch('tp + cp + ms', function(value) {
          scope.pages = [];
          var maxSize = 5;
          if (angular.isDefined(scope.ms) && scope.ms > scope.tp) {
            maxSize = scope.tp;
          }else{
            maxSize = scope.ms;

          }
          var startPage = scope.cp - Math.floor(maxSize / 2);

          if (startPage < 1) {
            startPage = 1;
          }
          if ((startPage + maxSize - 1) > scope.tp) {
            startPage = startPage - ((startPage + maxSize - 1) - scope.tp);
          }

          for (var i = 0; i < maxSize && i < scope.tp; i++) {
            scope.pages.push(startPage + i);
          }

        });
        scope.noPrev = function() {
          return scope.cp === 1;
        };
        scope.noNext = function() {
          return scope.cp === scope.tp;
        };
        scope.selectPage = function(page) {
          scope.cp = page;
          scope.params.page(scope.cp);
          //scope.onSelectPage({
          //  curpage: page
          //});
        };
        scope.isActive = function(page) {
          return scope.cp === page;
        };
        scope.selectPrev = function() {
          if (!scope.noPrev()) {
            scope.selectPage(scope.cp - 1);
          }
        };
        scope.selectNext = function() {
          if (!scope.noNext()) {
            scope.selectPage(scope.cp + 1);
          }
        };

        scope.onSelectPage = function(data){
          //console.log(data);
          //scope.$emit('update_page',data);
        };
      }
    };
  });

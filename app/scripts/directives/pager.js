'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:pager
 * @description
 * # pager
 */
app.directive('olaPager',function(config,localStorageService){
  return{
    restrict:'AE',
    replace:true,
    scope:{
      tp:'=',
      cp:'=',
      ms:'=',
      table:'='
    },
    templateUrl:'/partials/pager.html',
    link:function(scope,element,attrs){

      scope.$watch('table.total() / table.count()',function(val){
        scope.tp = val ? Math.ceil(val) : 1;
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

        scope.table.page(scope.cp);
        scope.onSelectPage({
          curpage: page
        });
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
        scope.$emit('updatePage',data);
      };
    }
  }
});

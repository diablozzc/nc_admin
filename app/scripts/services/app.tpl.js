/**
 * Created by zhangzhichao on 15/10/21.
 */
(function(window) {
  'use strict';
  var app = window.app;

  app.run([ '$templateCache', function($templateCache) {
    $templateCache.put('confirmPopover.html','<div class="popover"><div class="arrow"></div><h3 class="popover-title" ng-bind-html="title" ng-show="title"></h3><div class="popover-content"><form name="popoverForm"><p ng-bind-html="content"></p><div class="form-actions"><button type="button" class="btn btn-sm btn-danger" ng-click="$hide()">{{closeText}}</button> <button type="button" class="btn btn-sm btn-primary" ng-click="confirm();$hide()">{{confirmText}}</button></div></form></div></div>');
  } ]);

  app.run([ '$templateCache', function($templateCache) {
    $templateCache.put('suggestions_searcher.html','<div class="admin-form">' +
      '<h4> 查询过滤</h4>' +
      '<hr class="short">' +
      '<div class="row">' +
      '<div class="section">' +
      '<div class="form-group">' +
      '<div item-select item-data="community_list" selected-value="the_search.community" title="所属小区" name-key="name" val-key="code" on-change="communityChange" label-class="text-muted-lighter" required="false"></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<hr class="short">' +
      '<div class="section">' +
      '<button class="btn btn-default btn-sm ph25" type="button" ng-click="search()">查询</button>' +
      '</div>' +
      '</div>');
  } ]);

  app.run([ '$templateCache', function($templateCache) {
    $templateCache.put('repairs_searcher.html','<div class="admin-form">' +
      '<h4> 查询过滤</h4>' +
      '<hr class="short">' +
      '<div class="row">' +
      '<div class="section">' +
      '<div class="form-group">' +
      '<div item-select item-data="community_list" selected-value="the_search.community" title="所属小区" name-key="name" val-key="code" on-change="communityChange" label-class="text-muted-lighter" required="false"></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<hr class="short">' +
      '<div class="section">' +
      '<button class="btn btn-default btn-sm ph25" type="button" ng-click="search()">查询</button>' +
      '</div>' +
      '</div>');
  } ]);

})(window);

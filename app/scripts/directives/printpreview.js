'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:printPreview
 * @description
 * # printPreview
 */

  app.directive('printPreview', function ($timeout,$templateCache,$compile) {
    return {

      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        element.html('<iframe />');
        var $iframe = (element.find('iframe'));
        $iframe.appendTo("body");
        var doc = $iframe[0].contentWindow.document;
        doc.write('<link rel="stylesheet" type="text/css" href="/assets/skin/default_skin/css/theme.css">');

        scope.$on('print',function(e,data){
          scope.tpl_data = data.data;
          var tpl = $templateCache.get(data.tpl);
          var tpl_element = $compile(tpl)(scope);

          $timeout(function(){
            var tpl_txt = tpl_element[0].outerHTML;
            doc.write(tpl_txt);
            doc.close();
            $iframe[0].contentWindow.print();
          });


        });

      }
    };
  });

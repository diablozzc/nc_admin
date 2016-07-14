'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:olaTree
 * @description
 * # olaTree
 */

  app.directive('olaTree', function ($rootScope,$timeout,$templateCache,$compile,treeConfig) {
    return {
      scope:{
        treeData:'='
      },

      restrict: 'A',
      controller:function(){
        treeConfig.treeClass='ola-tree';
        treeConfig.nodesClass='';
        treeConfig.nodeClass = '';
        treeConfig.handleClass = '';
      },
      link: function (scope, element, attrs) {
        scope.selectedItem = [];

        var getChildren = function(item){
            var event_name = 'expand'+item.type;
            $rootScope.$broadcast(event_name,item);
        };
        // 展开或折叠节点
        scope.toggleIt = function(item){
          if(angular.isUndefined(item.children)){
            getChildren(item);
          }else{
            item.collapsed = !item.collapsed;
          }

        };
        // 选择节点数据
        scope.selectData = function(item,sendEvent){
          sendEvent = angular.isUndefined(sendEvent) ? true : sendEvent;

          lodash.forEach(scope.selectedItem,function(item){
            item.selected = false
          });
          scope.selectedItem = [];
          if(!item.isLeaf){
            getChildren(item);
          }

          item.selected = true;
          scope.selectedItem.push(item);
          if(sendEvent){
            var event_name = 'select'+ item.type;
            $rootScope.$broadcast(event_name,item);
          }
        };

        scope.findNode = function(data,item){
          var index = lodash.findIndex(data,{'code':item.code,'type':item.type});
          if(index === -1){
            for(var i=0,max=data.length; i<max; i++){
              if(angular.isDefined(data[i].children) && data[i].children.length>0){
                var result = scope.findNode(data[i].children, item);
                if(result !== -1){
                  return result;
                }
              }
            }
          }else{
            //console.log(data,index,data[index]);
            return data[index];
          }
          //console.log('not found');
          return -1;
        };

        // 选择节点事件
        scope.$on('onSelectTreeNode',function(e,data){
          scope.selectData(data.node,data.send);
        });
        // 展开折叠节点事件
        scope.$on('onToggleTreeNode',function(e,data){
          data.collapsed = !data.collapsed;
        });

        // 更新节点
        scope.$on('onUpdateTreeNode',function(e,data){
          var item = scope.findNode(scope.selectedItem,data);
          if(item !== -1){
            var event_name = 'update'+ item.type;
            $rootScope.$broadcast(event_name,item);
          }

        });

        var tpl = $templateCache.get("olaTreeTpl");
        element.html(tpl);
        $compile(element.contents())(scope);

        $rootScope.$broadcast('initTree');

      }
    }



  });

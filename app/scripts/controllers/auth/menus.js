'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:MenusCtrl
 * @description
 * # MenusCtrl
 * Controller of the propertyAdminApp
 */

app.controller('MenusCtrl', function ($scope, $state, $stateParams, $location, ngTableParams, localStorageService, Models, ngDialog, config, notify, ucauth) {
  $scope.system = 'prop';
  $scope.serverKey = $scope.system + '_server';
  $scope.menuGroupsSaved = true;
  $scope.user = ucauth.getUser();

  $scope.ucauth = ucauth;
  $scope.flag = {};
  $scope.flag.add_menugroup = false;
  $scope.flag.edit_menugroup = false;
  $scope.flag.del_menugroup = false;
  $scope.flag.save_menugroup = false;

  ucauth.hasRole('add_menugroup',$scope.flag);
  ucauth.hasRole('edit_menugroup',$scope.flag);
  ucauth.hasRole('del_menugroup',$scope.flag);
  ucauth.hasRole('save_menugroup',$scope.flag);

  // 菜单
  $scope.menus = [

  ];
  $scope.menus_builder = [];

  $scope.getMenu = function(item,parent){

    if(angular.isDefined(parent)){
      item.parent = parent;
    }
    //console.log(item.autoId,$scope.selectedIds,);
    //console.log($scope.selectedIds);
    item.selected = lodash.indexOf($scope.selectedIds,item.autoId) >= 0;


    if(item.menus.length > 0){

      angular.forEach(item.menus,function(sub){
        $scope.getMenu(sub,item);
      })

    }

    if(item.roleKey && item.roleKey.length > 0){
      angular.forEach(item.roleKey,function(role){
        role.parent = item;
        role.selected = lodash.indexOf($scope.selectedIds,role.keyCode) >= 0;
      });
    }
  };


  $scope.getMenuTree = function (skey) {


    Models.init('Menus/UserMenus').actions('get',{}).then(function(ret){
      
      $scope.menus = ret;
    });

  };


  $scope.add = function (item) {

    if (angular.isUndefined(item)) {
      item = {autoId: 0};
    }

    ngDialog.open({
      template: 'menuEditorTpl',
      controller: 'menuEditorWindow',
      resolve: {
        info: function menuFactory() {
          var info = {};
          info.action = 'add';
          info.this_menu = item;
          info.system = $scope.system;
          return info;
        }
      },
      preCloseCallback: function (value) {
        $scope.getMenuTree($scope.serverKey);
      }
    });


  };

  $scope.edit = function (item) {

    ngDialog.open({
      template: 'menuEditorTpl',
      controller: 'menuEditorWindow',
      resolve: {
        info: function menuFactory() {
          var info = {};
          info.action = 'edit';
          info.this_menu = item;
          info.system = $scope.system;
          return info;
        }
      },
      preCloseCallback: function (value) {
        $scope.getMenuTree($scope.serverKey);
      }
    });

  };

  $scope.del = function (item) {
    if (window.confirm("确定要删除" + item.name + "菜单吗?")) {
      Models.init('Menus/id', $scope.serverKey).actions('delete', {}, {'autoId': item.autoId}).then(function (ret) {
        if (ret.meta.code == 200) {
          notify({message: '删除成功', classes: 'alert-success'});
          $scope.getMenuTree($scope.serverKey);
        } else {
          notify({message: ret.meta.info, classes: 'alert-danger'});
        }
      });
    }
  };

  // 菜单组
  $scope.menuGroups = [];
  //$scope.selectedGroup = {};

  //获取菜单组列表
  $scope.getMenuGroupList = function (skey) {


    Models.init('MenuGroups', skey).actions('list', {code:$scope.user.property}).then(function (ret) {
      $scope.menuGroups = ret.data;

      lodash.map($scope.menuGroups,function(item){
        item.isActive = false;
      });
    });
  };

  // 新增菜单组
  $scope.addMenuGroup = function() {
    ngDialog.open({
      template: 'menuGroupEditorTpl',
      controller: 'menuGroupEditorWindow',
      resolve: {
        info: function menuFactory() {
          var info = {};
          info.action = 'add';
          info.system = $scope.system;
          return info;
        }
      },
      preCloseCallback: function (value) {
        $scope.getMenuGroupList($scope.serverKey);
      }
    });
  };

  // 修改菜单组
  $scope.editMenuGroup = function (group) {
    ngDialog.open({
      template: 'menuGroupEditorTpl',
      controller: 'menuGroupEditorWindow',
      resolve: {
        info: function menuFactory() {
          var info = {};
          info.action = 'edit';
          info.item = group;
          info.system = $scope.system;
          return info;
        }
      },
      preCloseCallback: function (value) {
        $scope.getMenuGroupList($scope.serverKey);
      }
    });
  };

  $scope.delMenuGroup = function(group){
    if (window.confirm("确定要删除 " + group.groupName + " 吗?")) {

      Models.init('MenuGroups/id', $scope.serverKey).actions('delete', {}, {'autoId': group.autoId}).then(function (ret) {
        if (ret.meta.code == 200) {
          notify({message: '删除成功', classes: 'alert-success'});
          $scope.getMenuGroupList($scope.serverKey);
        } else {
          notify({message: ret.meta.info, classes: 'alert-danger'});
        }
      });
    }
  };

  // 重置菜单组
  $scope.resetMenuGroup = function(){
    // TODO 获取已有菜单-菜单组关系
    Models.init('GroupMenus/id',$scope.serverKey).actions('get',{'groupId':$scope.selectedGroup.autoId}).then(function(ret){
      $scope.selectedIds = [];
      if(angular.isDefined(ret.data)){
        //console.log(ret.data);
        $scope.selectedIds = ret.data.split(',');
        $scope.selectedIds = lodash.map($scope.selectedIds,function(item){
          if(isNaN(item - 0)){
            return item;
          }else{
            return item - 0;
          }
        });
      }

      $scope.menus_builder = lodash.clone($scope.menus, true);
      lodash.map($scope.menus_builder,function(item){
        $scope.getMenu(item);
      });

    });

  };

  // 选择或取消菜单
  $scope.toggleSelected = function(item){
    item.selected = !item.selected;

    $scope.setSubMenuSelected(item,item.selected);
    $scope.setParentMenuSelected(item,item.selected);

    $scope.menuGroupsSaved = false;

  };

  // 选定菜单组
  $scope.selectGroup = function(the_group){
    lodash.map($scope.menuGroups,function(item){
      item.isActive = false;
    });
    the_group.isActive = true;

    $scope.selectedGroup = the_group;

    $scope.resetMenuGroup();
    $scope.menuGroupsSaved = true;

  };

  // 选择或取消子菜单
  $scope.setSubMenuSelected = function(item,value){
    item.selected = value;
    if(item.menus && item.menus.length > 0){

      angular.forEach(item.menus,function(sub){
        $scope.setSubMenuSelected(sub,value);
      });

    }
    if(item.roleKey && item.roleKey.length >0){
      angular.forEach(item.roleKey,function(role){
        role.selected = value;
      });
    }
  };

  // 选择或取消父级菜单
  $scope.setParentMenuSelected = function(item){

    if(angular.isDefined(item.parent)) {
      var index;

      if(item.roleName){
        index = lodash.findIndex(item.parent.roleKey, {'selected': true});
      }else{
        index = lodash.findIndex(item.parent.menus, {'selected': true});

      }


      if (index == -1) {
        item.parent.selected = false;
      } else {
        item.parent.selected = true;
      }

      $scope.setParentMenuSelected(item.parent);
    }
  };

  // 获取已选的菜单ID
  $scope.getSelectedMenuId = function(menus,menus_id){
    angular.forEach(menus,function(item){
      if(item.selected){
        var role_key_str = '';
        if(item.roleKey && item.roleKey.length > 0){
          var tmp = [];
          angular.forEach(item.roleKey,function(role){
            if(role.selected){
              tmp.push(role.keyCode);
            }
          });
          role_key_str = tmp.join(',');
        }

        menus_id.push(item.autoId + ':' + role_key_str);

        if(item.menus.length > 0){
          $scope.getSelectedMenuId(item.menus,menus_id);
        }

      }
    });
  };


  // 保存菜单组关系
  $scope.saveMenuGroup = function(){
    $scope.menuGroupsSaved = true;

    var menus_id = [];
    $scope.getSelectedMenuId($scope.menus_builder,menus_id);
    //console.log(menus_id);

    var the_menu_group = {};
    the_menu_group.groupId = $scope.selectedGroup.autoId;
    the_menu_group.menus = menus_id.join('|');



    Models.init('GroupMenus', $scope.serverKey).actions('build', the_menu_group).then(function (ret) {

      if(ret.meta.code !== 200){
        notify({message:ret.meta.error , classes:'alert-danger'});
      }else{
        notify({message:'添加成功',classes:'alert-success'});

      }

    });

  };

  $scope.getMenuTree($scope.serverKey);
  $scope.getMenuGroupList($scope.serverKey);
  //}
});


app.controller('menuGroupEditorWindow', function ($scope, config, Models, info, notify,ucauth) {

  var serverKey = info.system + '_server';

  switch (info.action) {
    case 'add':

      $scope.the_menu_group = {};
      $scope.the_menu_group.code = ucauth.getUser().property;

      $scope.title = "添加菜单组";


      break;
    case 'edit':
      $scope.the_menu_group = info.item;
      $scope.title = "编辑菜单组 " + info.item.groupName;

      break;
  }


  $scope.save = function () {
    switch (info.action) {
      case 'add':
        Models.init('MenuGroups', serverKey).actions('add', $scope.the_menu_group).then(function (ret) {
          if (ret.meta.code == 200) {
            notify({message: '添加成功', classes: 'alert-success'});
            $scope.closeThisDialog();
          } else {
            notify({message: ret.meta.error + " " + ret.meta.info, classes: 'alert-danger'});
          }
        });
        break;
      case 'edit':

        Models.init('MenuGroups/id', serverKey).actions('edit', $scope.the_menu_group, {autoId: info.item.autoId}).then(function (ret) {
          if (ret.meta.code == 200) {
            notify({message: '修改成功', classes: 'alert-success'});
            $scope.closeThisDialog();
          } else {
            notify({message: ret.meta.error + " " + ret.meta.info, classes: 'alert-danger'});
          }
        });

        break;

    }

  };

  $scope.close = function () {
    $scope.closeThisDialog();
  }

});
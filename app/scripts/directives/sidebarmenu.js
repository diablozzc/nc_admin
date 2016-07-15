'use strict';

/**
 * @ngdoc directive
 * @name propertyAdminApp.directive:sidebarMenu
 * @description
 * # sidebarMenu
 */

  app.directive('sidebarMenu', function ($state,config,ucauth,$timeout,Models) {
    return {
      templateUrl: '/partials/sidebar_menu.html',
      restrict: 'A',
      replace:true,
      link: function postLink(scope, element, attrs) {

        //处理菜单数据扁平化
        function flatMenu(menus){
          
          var flat = [];
          angular.forEach(menus,function(value,key){
            if(value.type === 'group'){
              flat.push({name:value.name,type:value.type,is_group:true,isShow:value.isShow});

              angular.forEach(value.menus,function(sub,k){
                if(sub.type === 'menu') sub.is_menu = true;
                if(sub.type === 'fold') sub.is_fold = true;
                flat.push(sub);

              });
            }
          },flat);
          return flat;
        }

        scope.initMenu = function(){
          $('.sidebar-menu li a.accordion-toggle').on('click', function(e) {
            e.preventDefault();

            // If the clicked menu item is minified and is a submenu (has sub-nav parent) we do nothing
            if ($('body').hasClass('sb-l-m') && !$(this).parents('ul.sub-nav').length) { return; }

            // If the clicked menu item is a dropdown we open its menu
            if (!$(this).parents('ul.sub-nav').length) {

              // If sidebar menu is set to Horizontal mode we return
              // as the menu operates using pure CSS
              if ($(window).width() > 900) {
                if ($('body.sb-top').length) { return; }
              }

              $('a.accordion-toggle.menu-open').next('ul').slideUp('fast', 'swing', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
              });
            }
            // If the clicked menu item is a dropdown inside of a dropdown (sublevel menu)
            // we only close menu items which are not a child of the uppermost top level menu
            else {
              var activeMenu = $(this).next('ul.sub-nav');
              var siblingMenu = $(this).parent().siblings('li').children('a.accordion-toggle.menu-open').next('ul.sub-nav')

              activeMenu.slideUp('fast', 'swing', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
              });
              siblingMenu.slideUp('fast', 'swing', function() {
                $(this).attr('style', '').prev().removeClass('menu-open');
              });
            }

            // Now we expand targeted menu item, add the ".open-menu" class
            // and remove any left over inline jQuery animation styles
            if (!$(this).hasClass('menu-open')) {
              $(this).next('ul').slideToggle('fast', 'swing', function() {
                $(this).attr('style', '').prev().toggleClass('menu-open');
              });
            }

          });

        };

        //scope.menus = flatMenu(config.data.menus);

        scope.linkMenu = function(menu){
          if(menu.menus && menu.menus.length>0){
            angular.forEach(menu.menus,function(sub){
              sub.parent = menu;
              scope.linkMenu(sub);
            });
          }
        };
        scope.subActive = function(sub){
          var isActive = $state.includes(sub.path);
          if(isActive){
            sub.parent.isOpen = true;
          }
          return isActive;

        };

        Models.init('Menus/UserMenus').actions('get',{}).then(function(ret){
          //console.log(ret);
          //var my_roles = [];
          //
          //var getRoles = function(menus,roles){
          //  angular.forEach(menus,function(item){
          //    if(item.roleKey){
          //      angular.forEach(item.roleKey,function(role){
          //        //console.log(roles,role);
          //        roles.push(role.keyCode);
          //      });
          //    }
          //    if(item.menus && item.menus.length > 0){
          //      getRoles(item.menus,roles);
          //    }
          //  });
          //};
          //
          //getRoles(ret.data,my_roles);
          //console.log(my_roles);
          ucauth.setRoleFromMenus(ret);

          scope.menus = flatMenu(ret);
          lodash.map(scope.menus,function(menu){
            scope.linkMenu(menu);
          });


          $timeout(function(){
            scope.initMenu();
          },1000);

        });

      }
    };
  });

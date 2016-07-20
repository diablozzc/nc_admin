/**
 * Created by zhangzhichao on 15/10/19.
 */

// 配置路由
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/signin');

  $stateProvider
  // 页面路由
    .state('pages', {
      templateUrl: 'views/pages.html'
    })
    // 登录
    .state('pages.signin', {
      url: '/signin',
      views: {
        '': {
          templateUrl: 'views/signin.html',
          controller: 'SigninCtrl'
        }
      }
    })
    // 注册
    .state('pages.signup', {
      url: '/signup',
      views: {
        '': {
          templateUrl: 'views/signup.html',
          controller: 'SignupCtrl'
        }
      }
    })

    // 后台路由
    .state('admin', {
      abstract: true,
      url: '/',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      templateUrl: 'views/admin.html',
      controller: 'AdminCtrl'
    })
    // 欢迎屏
    .state('admin.welcome', {
      url: 'welcome',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/welcome.html',
          controller: 'WelcomeCtrl'
        }
      }
    })
    // 小区管理
    .state('admin.communities', {
      url: 'communities',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/communities.html',
          controller: 'CommunitiesCtrl'
        }
      }
    })
    .state('admin.communities.list', {
      url: '/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'table': {
          templateUrl: 'views/communities_list.html',
        }
      }
    })
    .state('admin.communities.add', {
      url: '/{action:add}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'partials/editor_community.html',
          controller: 'EditorcommunityCtrl'
        }
      }
    })
    .state('admin.communities.edit', {
      url: '/{itemId:[0-9]{1,4}}/{action:edit}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'partials/editor_community.html',
          controller: 'EditorcommunityCtrl'
        }
      }
    })

    //系统管理
    .state('admin.sys', {
      url: 'sys',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/sys/sys.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('admin.sys.account', {
      url: '/account',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'account': {
          templateUrl: 'views/sys/account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('admin.sys.add', {
      url: '/{action:add}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'partials/editor_employee.html',
          controller: 'EditoremployeeCtrl'
        }
      }
    })
    .state('admin.sys.edit', {
      url: '/{itemId:[0-9]{1,4}}/{action:edit}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'partials/editor_employee.html',
          controller: 'EditoremployeeCtrl'
        }
      }
    })
    .state('admin.sys.role', {
      url: '/role',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'role': {
          templateUrl: 'views/communities.html',
          controller: 'CommunitiesCtrl'
        }
      }
    })
    .state('admin.sys.column', {
    url: '/column',
    resolve: {
      auth: function (authService) {
        return authService.auth();
      }
    },
    views: {
      'column': {
        templateUrl: 'views/column/columns.html',
        controller: 'ColumnCtrl'
      }
    }
  })

    .state('admin.sys.setposter', {
      url: '/setposter?itemKey',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'setposter': {
          templateUrl: 'views/column/setposter.html',
          controller: 'SetPosterCtrl'
        }
      }
    })

    //文章管理
    .state('admin.article', {
      url: 'article',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/articles/articles.html',

        }
      }
    })
    .state('admin.article.new', {
      url: '/{action:new}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'views/articles/edit_article.html',
          controller: 'EditorarticleCtrl'
        }
      }
    })
    .state('admin.article.edit', {
      url: '/{itemId:[0-9]{1,4}}/{action:edit}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'forms': {
          templateUrl: 'views/articles/edit_article.html',
          controller: 'EditorarticleCtrl'
        }
      }
    })
    .state('admin.article.listedit', {
      url: '/{action:listedit}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'editList': {
          templateUrl: 'views/articles/articles_search.html',
          controller: 'ArticlesSearchCtrl'
        }
      }
    })
    .state('admin.article.list', {
      url: '/{action:list}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'articleList': {
          templateUrl: 'views/articles/articles_search.html',
          controller: 'ArticlesSearchCtrl'
        }
      }
    })
    .state('admin.article.search', {
      url: '/{action:search}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'searchlist': {
          templateUrl: 'views/articles/articles_search.html',
          controller: 'ArticlesSearchCtrl'
        }
      }
    })

    //信息反馈
    .state('admin.comment', {
      url: 'comment',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/comment/comment.html',
          controller: 'CommentCtrl'
        }
      }
    })
    .state('admin.comment.list', {
      url: '/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'list': {
          templateUrl: 'views/comment/commentlist.html',
          controller: 'CommentCtrl'
        }
      }
    })
    .state('admin.feedback', {
      url: 'feedback',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/feedback/feedback.html'
        }
      }
    })
    .state('admin.feedback.list', {
      url: '/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'feedback': {
          templateUrl: 'views/feedback/feedback_list.html',
          controller: 'FeedbackCtrl'
        }
      }
    })
    .state('admin.feedback.detail', {
      url: '/{itemId:[0-9]{1,4}}/{action:entry}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'feedback': {
          templateUrl: 'views/feedback/feedback_detail.html',
          controller: 'FeedbackDetailCtrl'
        }
      }
    })


    //活动管理
    .state('admin.activity', {
      url: 'activity',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'content': {
          templateUrl: 'views/activity/activity.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('admin.activity.add', {
      url: '/{action:add}',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'add': {
          templateUrl: 'views/activity/editor_activity.html',
          controller: 'EditoractivityCtrl'
        }
      }
    })
    .state('admin.activity.edit', {
      url: '/{action:edit}?itemId',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'add': {
          templateUrl: 'views/activity/editor_activity.html',
          controller: 'EditoractivityCtrl'
        }
      }
    })
    .state('admin.activity.list', {
      url: '/published/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'list': {
          templateUrl: 'views/activity/activitylist.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('admin.activity.listedit', {
      url: '/edit/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'list': {
          templateUrl: 'views/activity/activitylist.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('admin.activity.search', {
      url: '/search/list',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'list': {
          templateUrl: 'views/activity/activitylist.html',
          controller: 'ActivityCtrl'
        }
      }
    })
    .state('admin.activity.signupinfo', {
      url: '/signupinfo?activityId',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'list': {
          templateUrl: 'views/activity/activity_signup.html',
          controller: 'ActivitySignupCtrl'
        }
      }
    })
    // 楼宇管理
    // .state('admin.buildings',{
    //   url:'buildings',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'content':{
    //       templateUrl:'views/buildings.html',
    //       controller:'BuildingsCtrl'
    //     }
    //   }
    // })
    // .state('admin.buildings.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/buildings_list.html',
    //     }
    //   }
    // })
    // .state('admin.buildings.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_building.html',
    //       controller:'EditorbuildingCtrl'
    //     }
    //   }
    // })
    // .state('admin.buildings.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_building.html',
    //       controller:'EditorbuildingCtrl'
    //     }
    //   }
    // })
    // // 房间管理
    // .state('admin.rooms',{
    //   url:'rooms',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'content':{
    //       templateUrl:'views/rooms.html',
    //       controller:'RoomsCtrl'
    //     }
    //   }
    // })
    // .state('admin.rooms.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/rooms_list.html',
    //     }
    //   }
    // })
    // .state('admin.rooms.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_room.html',
    //       controller:'EditorroomCtrl'
    //     }
    //   }
    // })
    //
    // .state('admin.rooms.generate',{
    //   url:'/{action:generate}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/room_generator.html',
    //       controller:'RoomgeneratorCtrl'
    //     }
    //   }
    // })
    //
    // .state('admin.rooms.edit',{
    //   url:'/{roomId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_room.html',
    //       controller:'EditorroomCtrl'
    //     }
    //   }
    // })
    // // 住户管理
    // .state('admin.tenement',{
    //   url:'tenement',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'content':{
    //       templateUrl:'views/tenement.html',
    //       controller:'TenementCtrl'
    //     }
    //   }
    // })
    // .state('admin.tenement.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/tenement_list.html'
    //     }
    //   }
    // })
    // .state('admin.tenement.add',{
    //   url:'/{action:add}?ownerType&roomId',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_owner.html',
    //       controller:'EditorownerCtrl'
    //     }
    //   }
    // })
    // .state('admin.tenement.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_owner.html',
    //       controller:'EditorownerCtrl'
    //     }
    //   }
    // })
    // // App入驻审核
    // .state('admin.entering',{
    //   url:'entering',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'content':{
    //       templateUrl:'views/entering.html',
    //       controller:'EnteringCtrl'
    //     }
    //   }
    // })
    // .state('admin.entering.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/entering_list.html'
    //     }
    //   }
    // })
    // // 缴费管理
    // .state('admin.payment',{
    //   url:'payment',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/payment.html'
    //     }
    //   }
    // })
    // .state('admin.payment.items',{
    //   url:'/items',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/items.html',
    //       controller:'ItemsCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.additem',{
    //   url:'/items/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_items.html',
    //       controller:'EditoritemsCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.edititem',{
    //   url:'/items/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_items.html',
    //       controller:'EditoritemsCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.meters',{
    //   url:'/meters',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/meters.html',
    //       controller:'MetersCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.addmeter',{
    //   url:'/meters/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_meter.html',
    //       controller:'EditormeterCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.editmeter',{
    //   url:'/meters/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_meter.html',
    //       controller:'EditormeterCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.bills',{
    //   url:'/bills',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/bills.html',
    //       controller:'BillsCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.createbills',{
    //   url:'/bills/{action:create}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/creator_bills.html',
    //       controller:'CreatorbillsCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.addbill',{
    //   url:'/bills/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_bill.html',
    //       controller:'EditorbillCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.record',{
    //   url:'/record',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'views/pay_record.html',
    //       controller:'PayrecordCtrl'
    //     }
    //   }
    // })
    // // 附加缴费项目管理
    // .state('admin.payment.itemappend',{
    //   url:'/items/{itemId:[0-9]{1,4}}/append',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/items_append.html',
    //       controller:'ItemAppendCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.additemappend',{
    //   url:'/items/{itemId:[0-9]{1,4}}/append/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_append_item.html',
    //       controller:'EditorAppendItemCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.edititemappend',{
    //   url:'/items/{itemId:[0-9]{1,4}}/append/{appendId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_append_item.html',
    //       controller:'EditorAppendItemCtrl'
    //     }
    //   }
    // })
    // //特殊缴费
    // .state('admin.payment.itemspecial',{
    //   url:'/items/{itemId:[0-9]{1,4}}/special',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/items_special.html',
    //       controller:'ItemSpecialCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.additemspecial',{
    //   url:'/items/{itemId:[0-9]{1,4}}/special/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_special_item.html',
    //       controller:'EditorSpecialItemCtrl'
    //     }
    //   }
    // })
    // .state('admin.payment.edititemspecial',{
    //   url:'/items/{itemId:[0-9]{1,4}}/special/{specialId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_special_item.html',
    //       controller:'EditorSpecialItemCtrl'
    //     }
    //   }
    // })
    //
    // // 员工管理
    // .state('admin.employees',{
    //   url:'employees',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/employees.html',
    //       controller:'EmployeesCtrl'
    //     }
    //   }
    // })
    // .state('admin.employees.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/employees_list.html',
    //     }
    //   }
    // })
    // .state('admin.employees.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_employee.html',
    //       controller:'EditoremployeeCtrl'
    //     }
    //   }
    // })
    // .state('admin.employees.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_employee.html',
    //       controller:'EditoremployeeCtrl'
    //     }
    //   }
    // })
    // .state('admin.employees.menus',{
    //   url:'/{itemId:[0-9]{1,4}}/menus',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/employees_menus.html',
    //       controller:'AssignmenusCtrl'
    //     }
    //   }
    // })
    //
    //
    // // 公告管理
    // .state('admin.affiches',{
    //   url:'affiches',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/affiches.html',
    //       controller:'AffichesCtrl'
    //     }
    //   }
    // })
    // .state('admin.affiches.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/affiches_list.html'
    //     }
    //   }
    // })
    // .state('admin.affiches.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_affiche.html',
    //       controller:'EditorafficheCtrl'
    //     }
    //   }
    // })
    // .state('admin.affiches.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_affiche.html',
    //       controller:'EditorafficheCtrl'
    //     }
    //   }
    // })
    // .state('admin.affiches.publish',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:publish}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/publish_affiche.html',
    //       controller:'PublishafficheCtrl'
    //     }
    //   }
    // })
    // .state('admin.affiches.details',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:details}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'partials/affiches_details.html',
    //       controller:'AffichesdetailsCtrl'
    //     }
    //   }
    // })
    // //投诉建议管理
    // .state('admin.suggestions',{
    //   url:'suggestions',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/suggestions.html',
    //
    //     }
    //   }
    // })
    // .state('admin.suggestions.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/suggestions_list.html',
    //       controller:'SuggestionsCtrl'
    //     },
    //     'searcher':{
    //       templateProvider:function($templateCache){
    //         return $templateCache.get('suggestions_searcher.html');
    //       },
    //       controller:'SuggestionssearcherCtrl'
    //     }
    //   }
    // })
    // .state('admin.suggestions.check',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:check}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/feedback_suggestion.html',
    //       controller:'FeedbacksuggestionCtrl'
    //     }
    //   }
    // })
    // .state('admin.suggestions.feedback',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:feedback}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/feedback_suggestion.html',
    //       controller:'FeedbacksuggestionCtrl'
    //     }
    //   }
    // })
    // //活动管理
    // .state('admin.activities',{
    //   url:'activities',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/activities.html',
    //       controller:'ActivitiesSearchCtrl'
    //     }
    //   }
    // })
    // .state('admin.activities.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/activities_list.html',
    //       controller:'ActivitiesCtrl'
    //     }
    //   }
    // })
    // .state('admin.activities.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_activity.html',
    //       controller:'EditoractivityCtrl'
    //     }
    //   }
    // })
    // .state('admin.activities.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_activity.html',
    //       controller:'EditoractivityCtrl'
    //     }
    //   }
    // })
    // .state('admin.activities.entry',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:entry}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'partials/activity_entry.html',
    //       controller:'ActivityentryCtrl'
    //     }
    //   }
    // })
    // //报修信息
    // .state('admin.repairs',{
    //   url:'repairs',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/repairs.html'
    //     }
    //   }
    // })
    //
    // .state('admin.repairs.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/repairs_list.html',
    //       controller:'RepairsCtrl'
    //     },
    //     'searcher':{
    //       templateProvider:function($templateCache){
    //         return $templateCache.get('repairs_searcher.html');
    //       },
    //       controller:'RepairssearcherCtrl'
    //     }
    //   }
    // })
    //
    // .state('admin.repairs.check',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:check}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/feedback_repair.html',
    //       controller:'FeedbackrepairCtrl'
    //     }
    //   }
    // })
    // .state('admin.repairs.feedback',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:feedback}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/feedback_repair.html',
    //       controller:'FeedbackrepairCtrl'
    //     }
    //   }
    // })
    // //便民信息
    // .state('admin.conveniences',{
    //   url:'conveniences',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/conveniences.html'
    //
    //     }
    //   }
    // })
    //
    // .state('admin.conveniences.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/conveniences_list.html',
    //       controller:'ConveniencesCtrl'
    //     }
    //   }
    // })
    //
    // .state('admin.conveniences.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_convenience.html',
    //       controller:'EditorconvenienceCtrl'
    //     }
    //   }
    // })
    // .state('admin.conveniences.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_convenience.html',
    //       controller:'EditorconvenienceCtrl'
    //     }
    //   }
    // })
    // // 菜单管理
    // .state('admin.menus',{
    //   url:'menus',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/menus.html',
    //       //controller:'MenusCtrl'
    //     }
    //   }
    // })
    // .state('admin.menus.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'list':{
    //       templateUrl:'views/menus_list.html',
    //       controller:'MenusCtrl'
    //     }
    //   }
    // })
    // // 规章制度管理
    // .state('admin.bylaw',{
    //   url:'bylaw',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/bylaw.html'
    //     }
    //   }
    // })
    // .state('admin.bylaw.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/bylaw_list.html',
    //       controller:'BylawCtrl'
    //     }
    //   }
    // })
    // .state('admin.bylaw.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_bylaw.html',
    //       controller:'EditorbylawCtrl'
    //     }
    //   }
    // })
    // .state('admin.bylaw.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_bylaw.html',
    //       controller:'EditorbylawCtrl'
    //     }
    //   }
    // })
    // .state('admin.guide',{
    //   url:'guide',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/guide.html'
    //     }
    //   }
    // })
    //
    // .state('admin.guide.list',{
    //   url:'/list',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'table':{
    //       templateUrl:'views/guide_list.html',
    //       controller:'GuideCtrl'
    //     }
    //   }
    // })
    // .state('admin.guide.add',{
    //   url:'/{action:add}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_guide.html',
    //       controller:'EditorguideCtrl'
    //     }
    //   }
    // })
    // .state('admin.guide.edit',{
    //   url:'/{itemId:[0-9]{1,4}}/{action:edit}',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'forms':{
    //       templateUrl:'partials/editor_guide.html',
    //       controller:'EditorguideCtrl'
    //     }
    //   }
    // })
    //
    // .state('admin.checkin',{
    //   url:'checkin',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/checkin.html',
    //       controller:'CheckinCtrl'
    //     }
    //   }
    // })
    // .state('admin.meter_report',{
    //   url:'meter_report',
    //   resolve:{
    //     auth:function(authService){
    //       return authService.auth();
    //     }
    //   },
    //   views:{
    //     'breadcrumb':{
    //       templateUrl:'views/breadcrumb.html',
    //       controller:'BreadcrumbCtrl'
    //     },
    //     'content':{
    //       templateUrl:'views/meters_report.html',
    //       controller:'MeterreportCtrl'
    //     }
    //   }
    // })
    .state('admin.usercenter', {
      url: 'usercenter',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'breadcrumb': {
          templateUrl: 'views/breadcrumb.html',
          controller: 'BreadcrumbCtrl'
        },
        'content': {
          templateUrl: 'views/usercenter.html',
          controller: 'UsercenterCtrl'
        }
      }
    })
    .state('admin.usercenter.userinfo', {
      url: '/userinfo',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'table': {
          templateUrl: 'views/userinfo.html',
          controller: 'UserinfoCtrl'
        }
      }
    })
    .state('admin.usercenter.password', {
      url: '/password',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'table': {
          templateUrl: 'views/password.html',
          controller: 'PasswordCtrl'
        }
      }
    })
  // .state('admin.usercenter.withdraw',{
  //   url:'/list',
  //   resolve:{
  //     auth:function(authService){
  //       return authService.auth();
  //     }
  //   },
  //   views:{
  //     'table':{
  //       templateUrl:'views/withdraw.html',
  //       controller:'WithdrawCtrl'
  //     }
  //   }
  // })


  $httpProvider.interceptors.push('authInterceptor');


});

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
          templateUrl: 'views/auth/menus_list.html',
          controller: 'RoleCtrl'
        }
      }
    })
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

    .state('admin.sys.columnconfig', {
      url: '/column/config',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'column': {
          templateUrl: 'views/column/config.html',
          controller: 'ColumnConfigCtrl'
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

    .state('admin.article.count', {
      url: '/article/count',
      resolve: {
        auth: function (authService) {
          return authService.auth();
        }
      },
      views: {
        'searchlist': {
          templateUrl: 'views/articles/articles_count.html',
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

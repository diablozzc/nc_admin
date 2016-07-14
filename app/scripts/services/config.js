'use strict';

/**
 * @ngdoc service
 * @name propertyAdminApp.config
 * @description
 * # config
 * Value in the propertyAdminApp.
 */
// var server = 'http://file.muranyun.com/';
  app.value('config', {
    global:{
      // server_domain:server,
      //auth_server:'http://auth.muranyun.com:8080/api/v1/',
      //prop_server:'http://pp.muranyun.com:8081/api/v1/',
      //sys_server:'http://sys.muranyun.com:8082/api/v1/',
      //fs_server:'http://fs.muranyun.com:8084/api/v1/',
      //ad_server:'http://ad.muranyun.com:8085/api/v1/',
      //ps_server:'http://ps.muranyun.com:8087/api/v1/',
      //as_server:'http://as.muranyun.com:8088/api/v1/',
      //sc_server:'http://sc.muranyun.com:8090/api/v1/',

      auth_server:'http://auth.muranyun.com/api/v1/',
      prop_server:'http://pp.muranyun.com/api/v1/',
      sys_server:'http://sys.muranyun.com/api/v1/',
      fs_server:'http://fs.muranyun.com/api/v1/',
      ad_server:'http://ad.muranyun.com/api/v1/',
      ps_server:'http://ps.muranyun.com/api/v1/',
      as_server:'http://as.muranyun.com/api/v1/',
      sc_server:'http://sc.muranyun.com/api/v1/',
      nc_server:'http://nc.mrshare.cn/api/',

      upload_service:'files',
      download_payrecords:'payrecords/reports/excel',
      download_bills:'bills/reports/excel',
      qiniu_pub_domain:'http://7xjr8j.com1.z0.glb.clouddn.com/',
      user_sys:'property',
      check_action_auth:true
    },
    data:{
      menus:[
        {name:'物业管理',type:'group',menus:[
          {name:'小区管理',type:'menu',icon:'imoon imoon-office',path:'admin.communities.list'},
          {name:'楼宇管理',type:'menu',icon:'imoon imoon-home',path:'admin.buildings.list'},
          {name:'住户管理',type:'fold',icon:'imoon imoon-users',menus:[
            {name:'业主管理',type:'sub',icon:'imoon imoon-user3',path:'admin.tenement.list.owners'},
            {name:'租赁管理',type:'sub',icon:'imoon imoon-user',path:'admin.tenement.list.lessee'},
            {name:'入驻管理',type:'sub',icon:'imoon imoon-user',path:'admin.tenement.list.entering'}
          ]},
          {name:'缴费管理',type:'fold',icon:'imoon imoon-coin',menus:[
            {name:'缴费项目',type:'sub',icon:'imoon imoon-coin',path:'admin.payment.items'},
            {name:'抄表信息',type:'sub',icon:'imoon imoon-coin',path:'admin.payment.meters'},
            {name:'账单信息',type:'sub',icon:'imoon imoon-coin',path:'admin.payment.bills'}
          ]},
          {name:'员工管理',type:'menu',icon:'imoon imoon-user2',path:'admin.employees.list'},
          {name:'公告管理',type:'menu',icon:'imoon imoon-podcast',path:'admin.affiches.list'}
        ]},
        {name:'社区管理',type:'group',menus:[
          {name:'投诉建议',type:'menu',icon:'imoon imoon-bug',path:'admin.suggestions'},
          {name:'报修信息',type:'menu',icon:'imoon imoon-wrench',path:'admin.repairs'},
          {name:'活动管理',type:'menu',icon:'imoon imoon-gift',path:'admin.activities.list'},
          {name:'便民信息',type:'menu',icon:'imoon imoon-gift',path:'admin.conveniences'}
        ]}
      ],
      breadcrumb:{
        'admin.welcome':{parent:'',text:'物业管理系统',href:'admin.welcome'},
        'admin.communities.list':{parent:'admin.welcome',text:'小区管理',href:'admin.communities.list'},
        'admin.communities.add':{parent:'admin.communities.list',text:'新增小区',href:'admin.communities.add'},
        'admin.communities.edit':{parent:'admin.communities.list',text:'修改小区',href:'admin.communities.edit'},
        'admin.buildings.list':{parent:'admin.welcome',text:'楼宇管理',href:'admin.buildings.list'},
        'admin.buildings.add':{parent:'admin.buildings.list',text:'新增楼宇',href:'admin.buildings.add'},
        'admin.buildings.edit':{parent:'admin.buildings.list',text:'修改楼宇',href:'admin.buildings.edit'},
        'admin.rooms.list':{parent:'admin.buildings.list',text:'房间管理',href:'admin.rooms.list'},
        'admin.rooms.add':{parent:'admin.rooms.list',text:'新增房间',href:'admin.rooms.add'},
        'admin.rooms.generate':{parent:'admin.rooms.list',text:'房间生成器',href:'admin.rooms.generate'},
        'admin.rooms.edit':{parent:'admin.rooms.list',text:'修改房间',href:'admin.rooms.edit'},

        'admin.tenement.list':{parent:'admin.welcome',text:'住户档案',href:'admin.tenement.list'},
        'admin.tenement.add':{parent:'admin.tenement.list',text:'新增住户',href:'admin.tenement.add'},
        'admin.tenement.edit':{parent:'admin.tenement.list',text:'修改住户',href:'admin.tenement.edit'},
        'admin.entering.list':{parent:'admin.welcome',text:'入住管理',href:'admin.entering.list'},

        'admin.payment.items':{parent:'admin.welcome',text:'缴费项目',href:'admin.payment.items'},
        'admin.payment.additem':{parent:'admin.payment.items',text:'新增缴费项目',href:'admin.payment.additem'},
        'admin.payment.edititem':{parent:'admin.payment.items',text:'编辑缴费项目',href:'admin.payment.edititem'},
        'admin.payment.itemappend':{parent:'admin.payment.items',text:'附加缴费项目',href:'admin.payment.itemappend'},
        'admin.payment.additemappend':{parent:'admin.payment.items',text:'新增附加项目',href:'admin.payment.additemappend'},
        'admin.payment.edititemappend':{parent:'admin.payment.items',text:'编辑附加项目',href:'admin.payment.edititemappend'},
        'admin.payment.itemspecial':{parent:'admin.payment.items',text:'特殊缴费项目',href:'admin.payment.itemspecial'},
        'admin.payment.additemspecial':{parent:'admin.payment.items',text:'新增特殊项目',href:'admin.payment.additemspecial'},
        'admin.payment.edititemspecial':{parent:'admin.payment.items',text:'编辑特殊项目',href:'admin.payment.edititemspecial'},

        'admin.payment.meters':{parent:'admin.welcome',text:'抄表信息',href:'admin.payment.meters'},
        'admin.payment.addmeter':{parent:'admin.payment.meters',text:'新增抄表信息',href:'admin.payment.addmeter'},
        'admin.payment.editmeter':{parent:'admin.payment.meters',text:'编辑抄表信息',href:'admin.payment.editmeter'},
        'admin.payment.bills':{parent:'admin.welcome',text:'账单信息',href:'admin.payment.bills'},
        'admin.payment.createbills':{parent:'admin.payment.bills',text:'生成账单',href:'admin.payment.createbills'},
        'admin.payment.addbill':{parent:'admin.payment.bills',text:'添加账单',href:'admin.payment.addbill'},
        'admin.payment.record':{parent:'admin.welcome',text:'缴费记录',href:'admin.payment.record'},

        'admin.employees.list':{parent:'admin.welcome',text:'员工管理',href:'admin.employees.list'},
        'admin.employees.add':{parent:'admin.employees.list',text:'新增员工',href:'admin.employees.add'},
        'admin.employees.edit':{parent:'admin.employees.list',text:'修改员工信息',href:'admin.employees.edit'},
        'admin.employees.menus':{parent:'admin.employees.list',text:'分配菜单',href:'admin.employees.menus'},

        'admin.affiches.list':{parent:'admin.welcome',text:'公告管理',href:'admin.affiches.list'},
        'admin.affiches.add':{parent:'admin.affiches.list',text:'新增公告',href:'admin.affiches.add'},
        'admin.affiches.edit':{parent:'admin.affiches.list',text:'编辑公告',href:'admin.affiches.edit'},
        'admin.affiches.publish':{parent:'admin.affiches.list',text:'发布公告',href:'admin.affiches.publish'},
        'admin.affiches.details':{parent:'admin.affiches.list',text:'公告发布详情',href:'admin.affiches.details'},

        'admin.suggestions.list':{parent:'admin.welcome',text:'投诉建议',href:'admin.suggestions.list'},
        'admin.suggestions.check':{parent:'admin.suggestions.list',text:'审查投诉建议',href:'admin.suggestions.check'},
        'admin.suggestions.feedback':{parent:'admin.suggestions.list',text:'投诉建议反馈',href:'admin.suggestions.feedback'},

        'admin.activities.list':{parent:'admin.welcome',text:'活动管理',href:'admin.activities.list'},
        'admin.activities.add':{parent:'admin.activities.list',text:'新增活动',href:'admin.activities.add'},
        'admin.activities.edit':{parent:'admin.activities.list',text:'修改活动',href:'admin.activities.edit'},
        'admin.activities.entry':{parent:'admin.activities.list',text:'活动详情',href:'admin.activities.entry'},

        'admin.repairs.list':{parent:'admin.welcome',text:'报修信息',href:'admin.repairs.list'},
        'admin.repairs.check':{parent:'admin.repairs.list',text:'审查报修信息',href:'admin.repairs.check'},
        'admin.repairs.feedback':{parent:'admin.repairs.list',text:'报修反馈',href:'admin.repairs.feedback'},

        'admin.conveniences.list':{parent:'admin.welcome',text:'便民信息',href:'admin.conveniences.list'},
        'admin.conveniences.add':{parent:'admin.conveniences.list',text:'新增便民信息',href:'admin.conveniences.add'},
        'admin.conveniences.edit':{parent:'admin.conveniences.list',text:'修改便民信息',href:'admin.conveniences.edit'},
        'admin.menus.list':{parent:'admin.welcome',text:'菜单管理',href:'admin.menus.list'},

        'admin.bylaw.list':{parent:'admin.welcome',text:'管理规定',href:'admin.bylaw.list'},
        'admin.bylaw.add':{parent:'admin.bylaw.list',text:'新增管理规定',href:'admin.bylaw.add'},
        'admin.bylaw.edit':{parent:'admin.bylaw.list',text:'修改管理规定',href:'admin.bylaw.edit'},

        'admin.guide.list':{parent:'admin.welcome',text:'办事指南管理',href:'admin.guide.list'},
        'admin.guide.add':{parent:'admin.guide.list',text:'新增办事指南',href:'admin.guide.add'},
        'admin.guide.edit':{parent:'admin.guide.list',text:'修改办事指南',href:'admin.guide.edit'},

        'admin.checkin':{parent:'admin.welcome',text:'入驻统计',href:'admin.checkin'},
        'admin.meter_report':{parent:'admin.welcome',text:'抄表统计',href:'admin.meter_report'},

        'admin.usercenter.userinfo':{parent:'admin.welcome',text:'用户中心',href:'admin.usercenter.userinfo'},
        'admin.usercenter.password':{parent:'admin.welcome',text:'密码管理',href:'admin.usercenter.password'},
        'admin.usercenter.withdraw':{parent:'admin.welcome',text:'提款管理',href:'admin.usercenter.withdraw'},


      },
      resources:{
        'Users':{
            name:'Users',uri:'users',actions:[
              {action:'signup',method:'POST',isArray:false}
            ],serverKey:'auth_server'
        },
        'Usernames':{
          name:'Usernames',uri:'usernames',actions:[
            {action:'check',method:'POST',isArray:false}
          ],serverKey:'auth_server'
        },
        'Usertokens':{
          name:'Usertokens',uri:'usertokens',actions:[
            {action:'signin',method:'POST',isArray:false},
            {action:'signout',method:'DELETE',isArray:false}
          ],serverKey:'auth_server'
        },
        'Passwords/Update':{
          name:'Passwords/Update',uri:'passwords/update',actions:[
            {action:'update',method:'POST',isArray:false}
          ],serverKey:'auth_server'
        },

        'Properties/getbycode':{
          name:'Properties/getbycode',uri:'properties/getbycode/:code',actions:[
            {action:'getbycode',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Communities/id':{
          name:'Communities/id',uri:'communities/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Communities':{
          name:'Communities',uri:'communities',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Communities/code':{
          name:'Communities/code',uri:'communities/community/:code',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Buildings':{
          name:'Buildings',uri:'buildings',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Buildings/id':{
          name:'Buildings/id',uri:'buildings/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Rooms':{
          name:'Rooms',uri:'rooms',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Rooms/id':{
          name:'Rooms/id',uri:'rooms/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Rooms/Reports':{
          name:'Rooms/Reports',uri:'rooms/reports',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Rooms/AutoCreate':{
          name:'Rooms/AutoCreate',uri:'rooms/autoCreate',actions:[
            {action:'create',method:'POST',isArray:false,requestType:'json'}
          ],serverKey:'prop_server'
        },
        'Owners':{
          name:'Owners',uri:'owners',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Owners/id':{
          name:'Owners/id',uri:'owners/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Entering':{
          name:'Entering',uri:'entering/propaudit',actions:[
            {action:'list',method:'GET',isArray:false},
          ],serverKey:'prop_server'
        },
        'Entering/idCode':{
          name:'Entering/idCode',uri:'entering/:idCode',actions:[
            {action:'audit',method:'PUT',isArray:false},
          ],serverKey:'prop_server'
        },

        'Items':{
          name:'Items',uri:'items',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Items/id':{
          name:'Items/id',uri:'items/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'ItemAppend':{
          name:'ItemAppend',uri:'itemappend',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'ItemAppend/id':{
          name:'ItemAppend/id',uri:'itemappend/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'ItemAppend/TypeValue/id':{
          name:'ItemAppend/TypeValue/id',uri:'itemappend/typevalue/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
          ],serverKey:'prop_server'
        },
        //特殊缴费项目
        'ItemConfig':{
          name:'ItemConfig',uri:'itemconfig',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'ItemConfig/id':{
          name:'ItemConfig/id',uri:'itemconfig/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'ItemConfig/TypeValue/id':{
          name:'ItemConfig/TypeValue/id',uri:'itemconfig/typevalue/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
          ],serverKey:'prop_server'
        },


        'Meters':{
          name:'Meters',uri:'meters',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Meters/id':{
          name:'Meters/id',uri:'meters/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Meters/last':{
          name:'Meters/last',uri:'meters/lastMeter',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Meters/Reports':{
          name:'Meters/Reports',uri:'meters/reports',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bills':{
          name:'Bills',uri:'bills',actions:[
            {action:'create',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bills/bill':{
          name:'Bills/bill',uri:'bills/bill',actions:[
            {action:'add',method:'POST',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bills/id':{
          name:'Bills/id',uri:'bills/:autoId',actions:[
            {action:'get',method:'GET',isArray:false}
            //{action:'update',method:'PUT',isArray:false},
            //{action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bills/PayBills':{
          name:'Bills/PayBills',uri:'bills/paybills',actions:[
            {action:'pay',method:'POST',isArray:false}
          ],serverKey:'prop_server'
        },
        'PayRecords':{
          name:'PayRecords',uri:'payrecords',actions:[
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'PayRecords/Voucher':{
          name:'PayRecords/Voucher',uri:'payrecords/voucher/:payBillNo',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'DownloadIds':{
          name:'DownloadIds',uri:'downloadids',actions:[
            {action:'downloadids',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },

        'Admins':{
          name:'Admins',uri:'admins',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Admins/id':{
          name:'Admins/id',uri:'admins/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Admins/getByUsername/username':{
          name:'Admins/getByUsername/username',uri:'admins/getbyusername/:username',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Affiches':{
          name:'Affiches',uri:'affiches',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Affiches/id':{
          name:'Affiches/id',uri:'affiches/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Affiches/publish/id':{
          name:'Affiches/publish/id',uri:'affiches/publish/:autoId',actions:[
            {action:'publish',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Affiches/cancel/id':{
          name:'Affiches/cancel/id',uri:'affiches/cancel/:autoId',actions:[
            {action:'cancel',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Affiches/id/details':{
          name:'Affiches/id/details',uri:'affiches/:autoId/details',actions:[
            {action:'details',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Suggestions':{
          name:'Suggestions',uri:'suggestions',actions:[
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Suggestions/id':{
          name:'Suggestions/id',uri:'suggestions/:autoId',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Suggestions/accept/id':{
          name:'Suggestions/accept/id',uri:'suggestions/accept/:autoId',actions:[
            {action:'accept',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Suggestions/feedback/id':{
          name:'Suggestions/feedback/id',uri:'suggestions/feedback/:autoId',actions:[
            {action:'feedback',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Activities':{
          name:'Activities',uri:'activities',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Activities/id':{
          name:'Activities/id',uri:'activities/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'ActivityDetails':{
          name:'ActivityDetails',uri:'activitydetails',actions:[
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'ActivityDetails/id':{
          name:'ActivityDetails/id',uri:'activitydetails/:autoId',actions:[
            {action:'confirm',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Repairs':{
          name:'Repairs',uri:'repairs',actions:[
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Repairs/id':{
          name:'Repairs/id',uri:'repairs/:autoId',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Repairs/accept/id':{
          name:'Repairs/accept/id',uri:'repairs/accept/:autoId',actions:[
            {action:'accept',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'Repairs/feedback/id':{
          name:'Repairs/feedback/id',uri:'repairs/feedback/:autoId',actions:[
            {action:'feedback',method:'PUT',isArray:false}
          ],serverKey:'prop_server'
        },
        'ConveniencesTypes':{
          name:'ConveniencesTypes',uri:'conveniencetypes',actions:[
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Conveniences':{
          name:'Conveniences',uri:'conveniences',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Conveniences/id':{
          name:'Conveniences/id',uri:'conveniences/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bylaws':{
          name:'Bylaws',uri:'bylaws',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Bylaws/id':{
          name:'Bylaws/id',uri:'bylaws/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'Guides':{
          name:'Guides',uri:'guides',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'Guides/id':{
          name:'Guides/id',uri:'guides/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },
        'GuideContents':{
          name:'GuideContents',uri:'guidecontents',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false,requestType:'json'}
          ],serverKey:'prop_server'
        },
        'GuideContents/id':{
          name:'GuideContents/id',uri:'guidecontents/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'update',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'prop_server'
        },

        'Menus/UserMenus':{
          name:'Menus/UserMenus',uri:'menus/usermenus',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'prop_server'
        },
        'MenuGroups':{
          name:'MenuGroups',uri:'menugroups',actions:[
            {action:'add',method:'POST',isArray:false},
            {action:'list',method:'GET',isArray:false}
          ],serverKey:''
        },

        'MenuGroups/id':{
          name:'MenuGroups/id',uri:'menugroups/:autoId',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'edit',method:'PUT',isArray:false},
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:''
        },

        'GroupMenus':{
          name:'GroupMenus',uri:'groupmenus',actions:[
            {action:'build',method:'POST',isArray:false}
          ],serverKey:''
        },
        'GroupMenus/id':{
          name:'GroupMenus/id',uri:'groupmenus/:groupId',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:''
        },

        'UserMenuGroup':{
          name:'UserMenuGroup',uri:'usermenugroups',actions:[
            {action:'build',method:'POST',isArray:false},
            {action:'get',method:'GET',isArray:false}
          ],serverKey:''
        },
        'Roles/isRoleOk':{
          name:'Roles/isRoleOk',uri:'roles/isroleok/:rolekey',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:''
        },
        'RoleRelations/getByKey/clientKey':{
          name:'RoleRelations/getByKey/clientKey',uri:'rolerelations/getbykey/:clientKey',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'sys_server'
        },

        'Provinces/getchild':{
          name:'Provinces/getchild',uri:'provinces/:parentId',actions:[
            {action:'getchild',method:'GET',isArray:false}
          ],serverKey:'sys_server'
        },
        'Provinces/getall':{
          name:'Provinces/getall',uri:'provinces/all/:code',actions:[
            {action:'getall',method:'GET',isArray:false}
          ],serverKey:'sys_server'
        },
        'Files':{
          name:'Files',uri:'files',actions:[
            {action:'delete',method:'DELETE',isArray:false}
          ],serverKey:'fs_server'
        },
        'Accounts':{
          name:'Accounts',uri:'accounts',actions:[
            {action:'get',method:'GET',isArray:false}
          ],serverKey:'as_server'
        },
        'Accounts/Trdpwd':{
          name:'Accounts/Trdpwd',uri:'accounts/trdpwd',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'set',method:'POST',isArray:false},
            {action:'reset',method:'PUT',isArray:false}
          ],serverKey:'as_server'
        },
        'WdAttachs':{
          name:'WdAttachs',uri:'wdAttachs',actions:[
            {action:'get',method:'GET',isArray:false},
            {action:'bindit',method:'POST',isArray:false}
          ],serverKey:'as_server'
        },
        'WdApplys':{
          name:'WdApplys',uri:'wdapplys',actions:[
            {action:'list',method:'GET',isArray:false},
            {action:'applyit',method:'POST',isArray:false}
          ],serverKey:'as_server'
        },
        'WdApplys/Cancel':{
          name:'WdApplys/Cancel',uri:'wdapplys/cancle/:autoId',actions:[
            {action:'cancel',method:'PUT',isArray:false}
          ],serverKey:'as_server'
        }

      },
      states:{
        saleState:[
          {val:0,name:'未出售'},
          {val:1,name:'已出售'}
        ],
        useState:[
          {val:0,name:'空闲'},
          {val:1,name:'物业已出租'},
          {val:2,name:'业主自用'},
          {val:3,name:'业主已出租'}
        ],
        houseDoorModel:[
          {val:'一室一厅',name:'一室一厅'},
          {val:'两室一厅',name:'两室一厅'},
          {val:'三室一厅',name:'三室一厅'},
          {val:'三室两厅',name:'三室两厅'},
          {val:'四室两厅',name:'四室两厅'}
        ],
        buildingHead:[
          {val:'朝南',name:'朝南'},
          {val:'朝北',name:'朝北'},
          {val:'朝东',name:'朝东'},
          {val:'朝西',name:'朝西'}
        ],
        national:[
          {val:'汉族',name:'汉族'}
        ],
        gender:[
          {val:false,name:'女'},
          {val:true,name:'男'}
        ],
        ownerType:[
          {val:0,name:'业主'},
          {val:1,name:'租户'},
          {val:2,name:'家属'}
        ],
        idType:[
          {val:'T',name:'租户'},
          {val:'O',name:'业主'},
          {val:'F',name:'家属'}
        ],
        enteringStatus:[
          {val:0,name:'提交审核'},
          {val:1,name:'审核通过'},
          {val:2,name:'驳回'}
        ],
        chargeType:[
          {val:0,name:'固定类'},
          {val:1,name:'抄表类'},
          {val:2,name:'面积类'}
        ],
        rateType:[
          {val:1,name:'固定费率'},
          {val:2,name:'阶梯（分阶计算）'},
          {val:3,name:'阶梯（不分阶计算）'}
        ],
        //预交费
        prePayment:[
          {val:true,name:'是'},
          {val:false,name:'否'}
        ],
        scopeType:[
          //{val:0,name:'小区'},
          {val:1,name:'楼宇'},
          {val:2,name:'房间'}
        ],
        appendRateType:[
          {val:0,name:'固定值'},
          {val:1,name:'固定费率'},
          {val:2,name:'阶梯（分阶计算）'},
          {val:3,name:'阶梯（不分阶计算）'}
        ],
        billType:[
          {val:0,name:'自动'},
          {val:1,name:'手动'}
        ],
        payChannel:[
          {val:0,name:'网络'},
          {val:1,name:'人工'}
        ],
        userTag:[
          {val:1,name:'普通管理员'}
        ],
        afficheType:[
          {val:0,name:'小区公告'},
          {val:1,name:'物业公告'}
        ],
        acceptType:[
          {val:0,name:'小区'},
          {val:1,name:'楼宇'},
          {val:2,name:'单元'},
          {val:3,name:'房间'}
        ],
        activityStatus:[
          {val:0,name:'未开始'},
          {val:1,name:'进行中'},
          {val:2,name:'已结束'}
        ],
        activityConfirmStatus:[
          {val:0,name:'未确认'},
          {val:1,name:'已确认'}
        ],
        accountType:[
          {val:'alipay',name:'支付宝'},
          {val:'bank',name:'银行'}
        ]

      },
      //operation: [
      //  {clientOperKey:'add_community',clientOperName:'新增小区',serverRoleKey:'property_community_add',serverRoleName:''},
      //  {clientOperKey:'edit_community',clientOperName:'编辑',serverRoleKey:'property_community_edit',serverRoleName:''},
      //  {clientOperKey:'del_community',clientOperName:'删除',serverRoleKey:'property_community_delete',serverRoleName:''}
      //]
    }
  });
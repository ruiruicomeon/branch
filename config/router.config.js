/**
 * 全局路由文件
 */
export default [
   // user
   {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
         { path: '/user', redirect: '/user/login' },
         { path: '/user/login', name: 'login', component: './User/Login' },
         { path: '/user/register', name: 'register', component: './User/Register' },
         {
            path: '/user/register-result',
            name: 'register.result',
            component: './User/RegisterResult',
         },
         {
            component: '404',
         },
      ],
   },

   {
      path: '/wx',
      component: '../layouts/WeUiLayout',
      name: 'wx',
      routes: [
         { path: '/wx', redirect: '/wx/app' },
         {
            path: '/wx/app',
            component: './Wx/AppWeUi',
            name: 'app',
         },
         {
            path: '/wx/register_from',
            component: './Wx/RegisterFromWeUi',
            name: 'register_from',
         },
         {
            path: '/wx/dispose',
            component: './Wx/DisposeWeUi',
            name: 'dispose',
         },
         {
            path: '/wx/dispose_form',
            component: './Wx/DisposeFromWeUi',
            name: 'dispose_form',
         },
         {
            path: '/wx/ExceptionDateil',
            component: './Wx/ExceptionDateil',
            name: 'exception_dateil',
         },
         {
            path: '/wx/SearchInfo',
            component: './Wx/SearchInfo',
            name: 'SearchInfo',
         },
         {
            path: '/wx/SearchOrder',
            component: './Wx/SearchOrder',
            name: 'SearchOrder',
         },
         {
            path: '/wx/Loginout',
            component: './Wx/Loginout',
            name: 'Loginout',
         },

         {
            path: '/wx/Forward',
            component: './Wx/ForwardIndex',
            name: 'Forward',
         },
         {
            path: '/wx/Exception/403',
            component: './Wx/Exception/403',
            name: '403',
         },
         {
            path: '/wx/Exception/404',
            component: './Wx/Exception/404',
            name: '404',
         },
         {
            path: '/wx/Exception/500',
            component: './Wx/Exception/500',
            name: '500',
         },
      ],
   },

   // app
   {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
         //  enhance
         { path: '/', redirect: '/index' },
         {
            path: '/index',
            name: 'index',
            component: './worktree/index',
            hideInMenu: true,
         },
         {
            path: '/Warning',
            name: 'Warning',
            component: './worktree/Warning',
         },
         {
            path: '/Warning/ForwardPage',
            name: 'ForwardPage',
            component: './worktree/ForwardPage',
            hideInMenu: true,
         },
         {
            path: '/orderquerylist', // 订单查询
            name: 'OrderQueryList',
            component: './worktree/OrderqueryList',
            hideInMenu: false,
         },
         {
            path: '/worktree',
            name: 'worktree',
            routes: [
               {
                  path: '/worktree/backlogList',
                  name: 'backlogList',
                  component: './worktree/backlogList',
               },
               {
                  path: '/worktree/listdone',
                  name: 'listdone',
                  component: './worktree/listdone',
               },
               {
                  path: '/worktree/Dutyjudge',
                  name: 'Dutyjudge',
                  component: './worktree/Dutyjudge',
               },
               {
                  path: '/worktree/abnormal',
                  name: 'abnormal',
                  component: './worktree/abnormal',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/BatchRegist',
                  name: 'BatchRegist',
                  component: './worktree/BatchRegist',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/error_communication',
                  name: 'error_communication',
                  component: './worktree/ErrorCommunication',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/Abnormallist', // 异常列表
                  name: 'Abnormallist',
                  component: './worktree/Abnormallist',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/exception', // 异常详情
                  name: 'exception',
                  component: './worktree/ExceptionDateil',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/Communication', // 沟通记录
                  name: 'Communication',
                  component: './worktree/Communication',
                  hideInMenu: true,
               },
               {
                  path: '/worktree/Batch_dispose', // 批量处理
                  name: 'Batch_dispose',
                  component: './worktree/Batch_dispose',
                  hideInMenu: true,
               },
            ],
         },

         {
            path: '/FormStatistics',
            name: 'FormStatistics',
            // component: './worktree/FormStatistics',
            routes: [
               {
                  path: '/FormStatistics/warningstatistic',
                  name: 'warningstatistic',
                  component: './worktree/FormStatistics',
               },
            ],
         },
         {
            path: '/baseconfiguration',
            name: 'baseconfiguration',
            routes: [
               {
                  path: '/baseconfiguration/Power',
                  name: 'Power',
                  component: './worktree/Power',
               },
               {
                  path: '/baseconfiguration/Modification_power',
                  name: 'Modification_power',
                  component: './worktree/Modification_power',
                  hideInMenu: true,
               },

               {
                  path: '/baseconfiguration/sys-user/form',
                  component: './worktree/SysUserForm',
               },
               {
                  path: '/baseconfiguration/administrative',
                  name: 'administrative',
                  component: './worktree/department',
               },
               {
                  path: '/baseconfiguration/admindepartmentdate',
                  name: 'admindepartmentdate',
                  component: './worktree/DepartmentDate',
               },
               {
                  path: '/baseconfiguration/dictionaries',
                  name: 'dictionaries',
                  component: './worktree/Dictionaries',
                  hideInMenu: true,
               },
               {
                  path: '/baseconfiguration/categorymanage',
                  name: 'categorymanage',
                  component: './worktree/CategoryManage',
               },
               {
                  path: '/baseconfiguration/causeclass',
                  name: 'causeclass',
                  component: './worktree/CauseClass',
               },
               {
                  path: '/baseconfiguration/Dutydepartment',
                  name: 'Dutydepartment',
                  component: './worktree/Dutydepartment',
               },
               {
                  path: '/baseconfiguration/Basemanage',
                  name: 'Basemanage',
                  component: './worktree/Basemanage',
                  hideInMenu: true,
               },
               {
                  path: '/baseconfiguration/SpeakSleight',
                  name: 'SpeakSleight',
                  component: './worktree/SpeakSleight',
                  hideInMenu: false,
               },
            ],
         },
      ],
   },
];

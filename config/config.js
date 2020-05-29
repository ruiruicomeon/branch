/**
 *
 */
// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import { homeUrl, homeUrl_xs } from './baseConfig';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const { pwa, primaryColor } = defaultSettings;
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { APP_TYPE, TEST } = process.env;

const plugins = [
   [
      'umi-plugin-react',
      {
         antd: true,
         dva: {
            hmr: true,
         },
         locale: {
            enable: true, // default false
            default: 'zh-CN', // default zh-CN
            baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
         },
         dynamicImport: {
            loadingComponent: './components/PageLoading/index',
            webpackChunkName: true,
            level: 3,
         },
         pwa: pwa
            ? {
                 workboxPluginMode: 'InjectManifest',
                 workboxOptions: {
                    importWorkboxFrom: 'local',
                 },
              }
            : false,
         ...(!TEST && os.platform() === 'darwin'
            ? {
                 dll: {
                    include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                    exclude: ['@babel/runtime', 'netlify-lambda'],
                 },
                 hardSource: false,
              }
            : {}),
      },
   ],
   'umi-plugin-gh-pages',
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
if (APP_TYPE === 'site') {
   plugins.push([
      'umi-plugin-ga',
      {
         code: 'UA-72788897-6',
      },
   ]);
}

export default {
   // add for transfer to umi
   plugins,
   define: {
      'process.env.IMAGE_FORMAT_LIMIT': '.jpg,.jpeg,.bmp,.png,.gif',
      APP_TYPE: APP_TYPE || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
   },
   treeShaking: true,
   targets: {
      ie: 11,
   },
   devtool: APP_TYPE ? 'source-map' : false,
   // 路由配置
   routes: pageRoutes,
   // Theme for antd
   // https://ant.design/docs/react/customize-theme-cn
   theme: {
      'primary-color': primaryColor,
   },
   // proxy: {
   //   '/server/api/': {
   //     target: 'https://preview.pro.ant.design/',
   //     changeOrigin: true,
   //     pathRewrite: { '^/server': '' },
   //   },
   // },

   outputPath: '/admin',
   history: 'hash',
   proxy: {
      '/apo': {
         target: homeUrl,
         changeOrigin: true,
         pathRewrite: {
            '^/apo': '',
         },
      },
      '/api': {
         target: homeUrl,
         changeOrigin: true,
         pathRewrite: {
            '^/api': '',
         },
      },
   },

   ignoreMomentLocale: true,
   lessLoaderOptions: {
      javascriptEnabled: true,
   },
   disableRedirectHoist: true,
   cssLoaderOptions: {
      modules: true,
      getLocalIdent: (context, localIdentName, localName) => {
         if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
            return localName;
         }
         const match = context.resourcePath.match(/src(.*)/);
         if (match && match[1]) {
            const antdProPath = match[1].replace('.less', '');
            const arr = slash(antdProPath)
               .split('/')
               .map(a => a.replace(/([A-Z])/g, '-$1'))
               .map(a => a.toLowerCase());
            return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
         }
         return localName;
      },
   },
   manifest: {
      basePath: '/',
   },
   chainWebpack: webpackPlugin,
   hash: true,
   base: '/admin/',
   publicPath: '/admin/',
};
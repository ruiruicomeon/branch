import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import { getStorage, setStorage } from '../utils/localStorageUtils';
import { isNotBlank, } from '@/utils/utils';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import { homeUrl } from '../../config/baseConfig';
// import Footer from './Footer';
import Exception403 from '../pages/Exception/403';


// lazy load SettingDrawer
// const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
    return data
        .map(item => {
            if (!item.name || !item.path) {
                return null;
            }

            let locale = 'menu';
            if (parentName) {
                locale = `${parentName}.${item.name}`;
            } else {
                locale = `menu.${item.name}`;
            }

            const result = {
                ...item,
                name: formatMessage({ id: locale, defaultMessage: item.name }),
                locale,
                authority: item.authority || parentAuthority,
            };
            if (item.routes) {
                const children = formatter(item.routes, item.authority, locale);
                // Reduce memory usage
                result.children = children;
            }
            delete result.routes;
            return result;
        })
        .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};

class WeUiLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        const ua = navigator.userAgent.toLowerCase();

        if (ua.indexOf('micromessenger') !== -1) {
            if (
                isNotBlank(props.location.query) &&
                isNotBlank(props.location.query.token) &&
                props.location.query.token !== 'null'
            ) {
                setStorage('token', props.location.query.token);
            } else if (!isNotBlank(getStorage('token'))) {
                const href1 = window.location.href;
                const antUrl = encodeURIComponent(encodeURIComponent(href1));
                window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
                return;
            }
        }
        this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        this.getPageTitle = memoizeOne(this.getPageTitle);
    }

    state = {
        rendering: true,
        isMobile: false,
    };

    componentDidMount() {

    }

    componentDidUpdate(preProps) {
        const { isMobile } = this.state;
        const { collapsed } = this.props;
        if (isMobile && !preProps.isMobile && !collapsed) {
            this.handleMenuCollapse(false);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.renderRef);
        unenquireScreen(this.enquireHandler);
    }

    getContext() {
        const { location } = this.props;
        return {
            location,
            breadcrumbNameMap: this.breadcrumbNameMap,
        };
    }

    /**
     * 获取面包屑映射
     * @param {Object} menuData 菜单配置
     */

    getBreadcrumbNameMap() {
        const routerMap = {};
        const mergeMenuAndRouter = data => {
            data.forEach(menuItem => {
                if (menuItem.children) {
                    mergeMenuAndRouter(menuItem.children);
                }
                // Reduce memory usage
                routerMap[menuItem.path] = menuItem;
            });
        };
        mergeMenuAndRouter(this.getMenuData());
        return routerMap;
    }

    getMenuData() {
        const {
            route: { routes },
        } = this.props;
        return memoizeOneFormatter(routes);
    }


    getPageTitle = pathname => {
        const currRouterData = this.matchParamsPath(pathname);

        if (!currRouterData) {
            return '';
        }
        const messages = formatMessage({
            id: currRouterData.locale || currRouterData.name,
            defaultMessage: currRouterData.name,
        });
        return `${messages}`;
    };

    getLayoutStyle = () => {
        const { isMobile } = this.state;
        const { fixSiderbar, collapsed, layout } = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    getContentStyle = () => {
        const { fixedHeader } = this.props;
        return {
            margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0,
        };
    };

    matchParamsPath = pathname => {
        const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return this.breadcrumbNameMap[pathKey];
    };

    renderSettingDrawer = () => {
        // Do not render SettingDrawer in production
        // unless it is deployed in preview.pro.ant.design as demo
        // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
        const { rendering } = this.state;
        if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
            return null;
        }
        return <SettingDrawer />;
    };

    render() {
        const {
            children,
            location: { pathname },
        } = this.props;

        const routerConfig = this.matchParamsPath(pathname);

        const layout = (
            <Layout>
                <Content style={{ height: '100%' }}>
                    <Authorized authority={routerConfig && routerConfig.authority} noMatch={<Exception403 />}>
                        {children}
                    </Authorized>
                </Content>

            </Layout>
        );
        return (
            <React.Fragment>
                <DocumentTitle title={this.getPageTitle(pathname)}>
                    <ContainerQuery query={query}>
                        {params => <div className={classNames(params)}>{layout}</div>}
                    </ContainerQuery>
                </DocumentTitle>
                {this.renderSettingDrawer()}
            </React.Fragment>
        );
    }
}

export default WeUiLayout;
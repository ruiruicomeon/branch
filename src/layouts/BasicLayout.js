import React, { Suspense } from 'react';
import { Layout } from 'antd';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/logo.jpg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import PageTabs from '@/components/PageTabs';
import PageLoading from '@/components/PageLoading';
import getPageTitle from '@/utils/getPageTitle';
import { transferMenuData } from '@/utils/enhanceUtils';
import { isNotBlank, GetQueryString } from '@/utils/utils';
import { getStorage, setStorage } from '../utils/localStorageUtils';
import { loginUrl, homeUrl } from '../../config/baseConfig';
import styles from './BasicLayout.less';
import router from 'umi/router';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

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

class BasicLayout extends React.Component {
    componentDidMount() {
        const {
            dispatch,
            location,
            // route: { routes, path, authority },
        } = this.props;
        console.log(`Basic==============${window.location.href}`);
        const ua = navigator.userAgent.toLowerCase();
        if (
            isNotBlank(location.query) &&
            isNotBlank(location.query.token) &&
            location.query.token !== 'null'
        ) {
            setStorage('token', location.query.token);
        } else if (!isNotBlank(getStorage('token'))) {
            if (ua.indexOf('micromessenger') !== -1) {
                if (ua.indexOf('mobile') !== -1) {
                    const href1 = window.location.href.split('#')[0];
                    const href2 = href1.split('?')[0];
                    const href3 = `${href2}#/wx`;
                    const antUrl = encodeURIComponent(encodeURIComponent(href3));
                    window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
                } else {
                    const href1 = window.location.href.split('#')[0];
                    const href2 = href1.split('?')[0];
                    const href3 = `${href2}#/`;
                    const antUrl = encodeURIComponent(encodeURIComponent(href3));
                    window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
                }

                // const href1 = window.location.href;
                // const antUrl = encodeURIComponent(encodeURIComponent(href1));
                // window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
                return;
            } else {
                dispatch({
                    type: 'login/logout',
                });
                return;
            }
        }

        if (isNotBlank(getStorage('token'))) {
            if (ua.indexOf('micromessenger') === -1 || ua.indexOf('mobile') === -1) {
                dispatch({
                    type: `user/fetchCurrent`,
                    callback: data => {
                        if (!isNotBlank(data)) {
                            dispatch({
                                type: 'login/logout',
                            });
                        }
                        dispatch({
                            type: 'menu/getMenuData',
                            payload: { routes, authority },
                        });
                    },
                });
                dispatch({
                    type: 'setting/getSetting',
                });
            }
        }
    }

    getContext() {
        const { location, breadcrumbNameMap } = this.props;
        return {
            location,
            breadcrumbNameMap,
        };
    }

    getLayoutStyle = () => {
        const { fixSiderbar, isMobile, collapsed, layout } = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    renderSettingDrawer = () => {
        // Do not render SettingDrawer in production
        // unless it is deployed in preview.pro.ant.design as demo
        // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
        if (
            process.env.NODE_ENV === 'production' &&
            APP_TYPE !== 'site'
        ) {
            return null;
        }
        return <SettingDrawer />;
    };

    render() {
        const {
            navTheme,
            layout: PropsLayout,
            children,
            pageTabs = true,
            location: { pathname },
            isMobile,
            menuData,
            breadcrumbNameMap,
            fixedHeader,
            menuLoading,
            publicPath = '/user',
        } = this.props;

        const isTop = PropsLayout === 'topmenu';
        let contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
        contentStyle = pageTabs ? { ...contentStyle, margin: 'unset' } : { ...contentStyle };

        const renderMenuData = transferMenuData(publicPath, menuLoading, menuData);
        const renderContent = () => {
            if (pageTabs) {
                if (renderMenuData.length) {
                    return <PageTabs {...this.props} />;
                }
                return <PageLoading />;
            }
            return children;
        };

        const layout = (
            <Layout>
                {isTop && !isMobile ? null : (
                    <SiderMenu
                        logo={logo}
                        theme={navTheme}
                        onCollapse={this.handleMenuCollapse}
                        isMobile={isMobile}
                        {...this.props}
                        menuData={renderMenuData}
                    />
                )}
                <Layout
                    style={{
                        minHeight: '100vh',
                        ...this.getLayoutStyle(),
                    }}
                >
                    <Header
                        handleMenuCollapse={this.handleMenuCollapse}
                        logo={logo}
                        isMobile={isMobile}
                        {...this.props}
                        menuData={renderMenuData}
                    />
                    <Content className={styles.content} style={contentStyle}>
                        {renderContent()}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        );
        return (
            <React.Fragment>
                <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
                    <ContainerQuery query={query}>
                        {params => (
                            <Context.Provider value={this.getContext()}>
                                <div className={classNames(params)}>{layout}</div>
                            </Context.Provider>
                        )}
                    </ContainerQuery>
                </DocumentTitle>
                <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense>
            </React.Fragment>
        );
    }
}

export default connect(({ user, global, setting, menu: menuModel, loading }) => ({
    collapsed: global.collapsed,
    currentUser: user.currentUser,
    layout: setting.layout,
    menuData: menuModel.menuData,
    breadcrumbNameMap: menuModel.breadcrumbNameMap,
    ...setting,
    originalMenuData: menuModel.originalMenuData,
    menuLoading: loading.effects['menu/getMenuData'],
}))(props => (
    <Media query="(max-width: 599px)">
        {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
    </Media>
));

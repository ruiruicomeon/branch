import React, { Component, Fragment } from 'react';
// import { formatMessage } from 'umi-plugin-react/locale';s
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.jpg';
import getPageTitle from '@/utils/getPageTitle';

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: '',
//   },
// ];

const copyright = (
  <Fragment>
    <div>Copyright <Icon type="copyright" /> 2019 All Rights Reserved</div>
    <div>版权所有 欧派家居集团</div>
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>订单协同平台</span>
                </Link>
              </div>
              <div className={styles.desc}>欧派家居集团</div>
            </div>
            {children}
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);

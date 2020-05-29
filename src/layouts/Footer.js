import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          <div>Copyright <Icon type="copyright" /> 2019 All Rights Reserved</div>
          <div>版权所有 欧派家居集团</div>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Spin } from 'antd';
import { getStorage, setStorage } from '@/utils/localStorageUtils';
import { isNotBlank } from '@/utils/utils';
import { getAuthority } from '@/utils/authority';
import { homeUrl } from '../../../config/baseConfig';

@connect(() => ({}))
class Index extends Component {
    componentDidMount() {
        // const { location, dispatch } = this.props;
        const ua = navigator.userAgent.toLowerCase();
        if (isNotBlank(getStorage('token'))) {
            if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('mobile') !== -1) {
                const href1 = window.location.href.split('#')[0];
                const href2 = href1.split('?')[0];
                const href3 = `${href2}#/wx`;
                const antUrl = encodeURIComponent(encodeURIComponent(href3));
                window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
            } else {
                router.push('/Warning');
            }
        }
    }

    render() {
        return (
            <div style={{ height: '100vh', backgroundColor: '#FFFFFF', paddingTop: '56px' }}>
                <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
            </div>
        );
    }
}
export default Index;

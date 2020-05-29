import React, { Fragment, PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Icon, Card, Result } from 'antd';
import styles from './Loginout.less';
import { connect } from 'dva';
import { router } from 'umi';
import { wxUrl ,homeUrl } from '../../../config/baseConfig';
@connect(({ login, loading }) => ({
    ...login,
    loading: loading.models.login,
}))
class LoginOut extends PureComponent {
    state = {
        height: document.documentElement.clientHeight,
    };

    handleLoginOut() {
        const { dispatch } = this.props;
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            // dispatch({
            //     type: 'login/logout_wx',
            // });
            const href1 = window.location.href.split('#')[0];
            const href2 = href1.split('?')[0];
            const href3 = `${href2}#/wx`;
            const antUrl = encodeURIComponent(encodeURIComponent(href3));
            // const href1 = `$http://{window.location.host}/#/admin/wx`
            // const antUrl = encodeURIComponent(encodeURIComponent(href1));
            window.location.href = `${homeUrl}/Api/wechat?antUrl=${antUrl}`;
        }
    }
    render() {
        const { loading } = this.props;
        return (
            <div className={styles.loginout_content} style={{ height: this.state.height }}>
                <Result className={styles.result} title="是否确定退出登录!" />
                <div className={styles.button}>
                    <Button
                        loading={loading}
                        type="primary"
                        key="console"
                        size="large"
                        onClick={() => {
                            this.handleLoginOut();
                        }}
                    >
                        退出登录
                    </Button>
                </div>
            </div>
        );
    }
}

export default LoginOut;

import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, Form, } from 'antd';
import Login from '@/components/Login';
import { isNotBlank } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import { homeUrl } from '../../../config/baseConfig'
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {

  constructor(props) {
    super(props);
    setTimeout(this.onTabChange, 500);
  }

  state = {
    type: 'mobile',
    autoLogin: true,
  };

  onTabChange = type => {
    if (type != null && typeof type !== 'undefined') {
      this.setState({ type });
    } else {
      window.WwLogin({
        "id": "login_container",
        "appid": "ww912d7ef6839bbb70",
        "agentid": "1000034",
        "redirect_uri": `http://order.oppein.com/Api/callback?client_name=wechatCpWebClient`,
        "state": "qrcode",
        "href": "",
      });
      
      // window.WwLogin({
      //   "id": "login_container",
      //   "appid": "ww152cff25ae1dc86c",
      //   "agentid": "1000002",
      //   "redirect_uri": `${homeUrl}/Api/callback?client_name=wechatCpWebClient`,
      //   "state": "qrcode",
      //   "href": "",
      // });

      // window.WxLogin({
      //   id: 'login_container',
      //   appid: 'wx805402902d465bf9',
      //   scope: 'snsapi_login',
      //   redirect_uri: 'http://mem.smuszh.com/Mem/callback?client_name=wechatWebClient',
      //   state: 'login',
      // });
    }
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
        callback: () => {
          dispatch({
            type: 'login/get_token'
          })
        }
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting, } = this.props;
    const { type } = this.state;

    const errMsg = () => {
      if (login.status === 'error' && isNotBlank(login.msg)) {
        return this.renderMessage(login.msg);
      }
      if (login.status === 'error' && !isNotBlank(login.msg)) {
        return this.renderMessage("账号密码错误--admin/admin");
      }
      return '';
    }

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="mobile" tab="微信登录" />
          <div
            id="login_container"
            style={
              type === 'account'
                ? { marginLeft: '25px', display: 'none' }
                : { marginLeft: '25px', display: '' }
            }
          />
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {errMsg()}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          {type === 'account' ?
            <Submit loading={submitting}>
              <FormattedMessage id="app.login.login" />
            </Submit>
            : null}
        </Login>
      </div>
    );
  }
}

export default LoginPage;

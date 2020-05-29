import { routerRedux } from 'dva/router';
import { login, logout, getToken } from '@/services/api';
import { setStorage, getStorage } from '../utils/localStorageUtils';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

export default {
    namespace: 'login',

    state: {
        status: undefined,
    },

    effects: {
        *get_token({ payload }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(getToken, value);
            if (isNotBlank(response) && isNotBlank(response.id)) {
                setStorage('userid', response.id);
                setStorage('username', response.name);
                setStorage('areaname', response.areaName);
                setStorage('companyname', response.companyName);
                setStorage('userno', response.no);
                setStorage('area', response.area.name);
            }
        },
        *login({ payload, callback }, { call, put }) {
            const a = `${payload.username}:${payload.password}`;
            const base64Str = window.btoa(a);
            const loginMsg = { Authorization: `Basic ${base64Str}` };
            const response = yield call(login, loginMsg);
            // Login successfully
            if (!isNotBlank(response) || response.success === 0 || response.success === '0') {
                response.status = 'error';
            }
            yield put({
                type: 'changeLoginStatus',
                payload: response,
            });
            // Login successfully
            if (isNotBlank(response) || response.success === 1 || response.success === '1') {
                // setStorage('TOKEN_ADMIN', response.data);
                setStorage('token', response.data);
                if (callback) callback();
                yield put(routerRedux.push('/'));
            }
        },
        *logout(_, { call, put }) {
            if (isNotBlank(getStorage('token'))) {
                yield call(logout);
            }
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    currentAuthority: 'guest',
                },
            });
            localStorage.clear();
            // reloadAuthorized();
            const ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('mobile') !== -1) {
                yield put(
                    routerRedux.push({
                        pathname: '/wx/app',
                    })
                );
            } else {
                yield put(
                    routerRedux.push({
                        pathname: '/user/login',
                    })
                );
            }
        },
        *logout_wx(_, { call, put }) {
            yield call(logout);
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    currentAuthority: 'guest',
                },
            });
            localStorage.clear();
            // reloadAuthorized();
            yield put(
                routerRedux.push({
                    pathname: '/wx/app',
                })
            );
        },
        *logout401(_, { call, put }) {
            yield call(logout);
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    currentAuthority: 'guest',
                },
            });
            localStorage.clear();
            // reloadAuthorized();
            yield put(
                routerRedux.push({
                    pathname: '/user/login',
                })
            );
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            // setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
    },
};

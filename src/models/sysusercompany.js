import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
    addusercompany,
    queryusercompany,
    deleteusercompanyu
} from '../services/api';

export default {
    namespace: 'sysusercom',

    state: {
        usercomlist: {
            list: [],
            pagination: {},
        },
        usercomlist1: {
            list: [],
            pagination: {},
        },
        usercomdetail: {}
    },

    effects: {
        *fetch({ payload, callback }, { call, put, select }) {
            const value = jsonToFormData(payload);
            const { usercomlist: { list } } = yield select(state => state.sysusercom);
            const response = yield call(queryusercompany, value);
            let dataMSG = {};
            if(response.success===1||response.success==='1'){
                if(callback) callback(response)
            }
            if (isNotBlank(response) && isNotBlank(response.data)&&isNotBlank(response.data.list)) {
                let arrayList = [];
                if (!isNotBlank(payload.current) || payload.current <= 1) {
                    arrayList = [...response.data.list];
                } else {
                    arrayList = [...list, ...response.data.list];
                }
                dataMSG = {
                    list: arrayList,
                    pagination: response.data.pagination,
                };
            } else {
                dataMSG = {
                    list: [],
                    pagination: {},
                };
            }
            yield put({
                type: 'usercomlist',
                payload: dataMSG,
            });
        },
        *fetch1({ payload, callback }, { call, put, select }) {
            const value = jsonToFormData(payload);
            const { usercomlist1: { list } } = yield select(state => state.sysusercom);
            const response = yield call(queryusercompany, value);
            let dataMSG = {};
            if (isNotBlank(response) && isNotBlank(response.data)&&isNotBlank(response.data.list)) {
                let arrayList = [];
                if (!isNotBlank(payload.current) || payload.current <= 1) {
                    arrayList = [...response.data.list];
                } else {
                    arrayList = [...list, ...response.data.list];
                }
                dataMSG = {
                    list: arrayList,
                    pagination: response.data.pagination,
                };
                if(callback) callback()
            } else {
                dataMSG = {
                    list: [],
                    pagination: {},
                };
            }
            yield put({
                type: 'usercomlist1',
                payload: dataMSG,
            });
        },
        *add_usercompany({ payload, callback }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(addusercompany, value);
            if (isNotBlank(response) && response.success === '1') {
                message.success("操作成功");
                if (callback) callback();
            } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
                message.error(response.msg);
            } else {
                message.error("操作失败");
            }
        },
        *del_usercompany({ payload, callback }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(deleteusercompanyu, value);
            if (isNotBlank(response) && response.success === '1') {
                message.success("删除成功");
                if (callback) callback();
            } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
                message.error(response.msg);
            } else {
                message.error("删除失败");
            }
        }
    },

    reducers: {
        usercomlist(state, action) {
            return {
                ...state,
                usercomlist: action.payload,
            };
        },
        usercomlist1(state, action) {
            return {
                ...state,
                usercomlist1: action.payload,
            };
        },
        usercomdetail(state, action) {
            return {
                ...state,
                usercomdetail: action.payload,
            };
        },
        clear() {
            return {
                userlist: {
                    list: [],
                    pagination: {},
                },
                usercomlist: {
                    list: [],
                    pagination: {},
                },
                usercomlist1: {
                    list: [],
                    pagination: {},
                }
            };
        },
    },
};

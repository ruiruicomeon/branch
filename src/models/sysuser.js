import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
    queryDicts,
    queryMemSysUser,
    removeMemSysUser,
    addMemSysUser,
    formMemSysUser,
    getEnNameUser,
    getUserMain,
    getMainDeptRepair,
    AddPersonnelToBase,
    cancelOfficeUser,
} from '../services/api';

export default {
    namespace: 'sysuser',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        dicts: [],
        formData: {},
        endata: [],
        mainData: {
            user: {},
            monthRepair: [],
            repairAllNumber: '',
            userOrderNumber: '',
            completeRepairNumber: '',
            meanScoreSatis: '',
            radarList: [],
            repairList: [],
        },
        deptRepairData: [],
    },

    effects: {
        *cancel_office_user({ payload, callback }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(cancelOfficeUser, value);
            if (isNotBlank(response) && response.success === '1') {
                message.success('撤销成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('撤销失败');
            }
        },

        *fetch({ payload, callback }, { call, put }) {
            const value = jsonToFormData(payload);
            let response = yield call(queryMemSysUser, value);
            if (
                response == null ||
                response === 'undefined' ||
                typeof response === 'undefined' ||
                response.list == null ||
                response.list === 'undefind' ||
                typeof response.list === 'undefined'
            ) {
                response = { list: [], pagination: {} };
            }
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback) callback(response);
        },
        *main({ payload }, { call, put }) {
            const response = yield call(getUserMain, payload);
            yield put({
                type: 'data',
                payload: response,
            });
        },
        *main_dept_repair({ payload }, { call, put }) {
            const response = yield call(getMainDeptRepair, payload);
            yield put({
                type: 'dept_repair_data',
                payload: response,
            });
        },
        *enfetch({ payload }, { call, put }) {
            let response = yield call(getEnNameUser, payload);
            if (response == null || response === 'undefined') {
                response = [];
            }
            yield put({
                type: 'ensave',
                payload: response,
            });
        },
        *add({ payload, callback }, { call, put }) {
            const addData = new FormData();

            if (payload.addfileList != null && payload.addfileList !== 'undefined') {
                payload.addfileList.forEach(file => {
                    addData.append('addfileList', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'addfileList') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const addrequest = yield call(addMemSysUser, addData);

            if (
                addrequest != null &&
                typeof addrequest !== 'undefined' &&
                addrequest.success != null &&
                typeof addrequest.success !== 'undefined'
            ) {
                if (addrequest.success === '1') {
                    message.success(addrequest.msg);
                    yield put(routerRedux.push('/baseconfiguration/admindepartmentdate'));
                } else {
                    message.error(addrequest.msg);
                }
            }
            if (callback) callback();
        },
        *add_personnel_tobase({ payload, callback }, { call, put }) {
            const AddPersonnelData = new FormData();
            if (isNotBlank(payload)) {
                Object.keys(payload).forEach(key => {
                    AddPersonnelData.append(key, payload[key]);
                });
            }
            const response = yield call(AddPersonnelToBase, AddPersonnelData);
            if (response.success == 1 || response.success == '1') {
                message.success(response.msg);
            } else {
                message.error(response.msg);
            }
            if (callback) callback();
        },

        *form_data({ payload, callback }, { call, put }) {
            const response = yield call(formMemSysUser, payload);
            if (
                response != null &&
                response !== 'undefined' &&
                typeof response !== 'undefined' &&
                response.success != null &&
                typeof response.success !== 'undefined' &&
                response.success === '1'
            ) {
                yield put({
                    type: 'form',
                    payload: response,
                });
            }
            if (callback) callback(response);
        },

        *remove({ payload, callback }, { call }) {
            const response = yield call(removeMemSysUser, payload);
            if (
                response != null &&
                response !== 'undefined' &&
                typeof response !== 'undefined' &&
                response.success != null &&
                typeof response.success !== 'undefined'
            ) {
                if (response.success === '1') {
                    message.success(response.msg);
                    if (callback) callback();
                } else {
                    message.error(response.msg);
                }
            }
        },
        *dicts({ payload }, { call, put }) {
            const response = yield call(queryDicts, payload);
            yield put({
                type: 'saveDicts',
                payload: Array.isArray(response) ? response : [],
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        ensave(state, action) {
            return {
                ...state,
                endata: action.payload,
            };
        },
        dept_repair_data(state, action) {
            return {
                ...state,
                deptRepairData: action.payload,
            };
        },
        data(state, action) {
            return {
                ...state,
                mainData: action.payload,
            };
        },
        form(state, action) {
            return {
                ...state,
                formData: action.payload.data,
            };
        },
        saveDicts(state, action) {
            return {
                ...state,
                dicts: action.payload,
            };
        },
        clear() {
            return {
                data: {
                    list: [],
                    pagination: {},
                },
                dicts: [],
                formData: {},
                endata: [],
                mainData: {
                    user: {},
                    monthRepair: [],
                    repairAllNumber: '',
                    userOrderNumber: '',
                    completeRepairNumber: '',
                    meanScoreSatis: '',
                    radarList: [],
                    repairList: [],
                },
            };
        },
    },
};

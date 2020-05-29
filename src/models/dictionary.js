import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { dictlist, adddict, deldict } from '../services/api';

export default {
    namespace: 'dictionaryL',

    state: {
        listdict: {
            list: [],
            pagination: {},
        },
        departmentList: [],
        departmentFailure: {
            list: [],
            pagination: {},
        },
        basemanage: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const value = jsonToFormData(payload);
            const response = yield call(dictlist, value);
            let dataMSG = {};
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                isNotBlank(response.data.list)
            ) {
                dataMSG = {
                    list: response.data.list,
                    pagination: response.data.pagination,
                };
            } else {
                dataMSG = {
                    list: [],
                    pagination: {},
                };
            }
            yield put({
                type: 'listdict',
                payload: dataMSG,
            });
            if (isNotBlank(payload.type) && payload.type === 'failure') {
                const value = jsonToFormData(payload);
                const response = yield call(dictlist, value);
                let dataMSG = {
                    list: [],
                    pagination: {},
                };
                if (
                    isNotBlank(response) &&
                    isNotBlank(response.data) &&
                    isNotBlank(response.data.list)
                ) {
                    dataMSG = {
                        list: response.data.list,
                        pagination: response.data.pagination,
                    };
                } else {
                    dataMSG = {
                        list: [],
                        pagination: {},
                    };
                }
                yield put({
                    type: 'listfailure',
                    payload: dataMSG,
                });
                if (callback) callback(dataMSG);
            } else if (isNotBlank(payload.type) && payload.type == 'duty') {
                const value = jsonToFormData(payload);
                const response = yield call(dictlist, value);
                let dataMSG = {};
                if (
                    isNotBlank(response) &&
                    isNotBlank(response.data) &&
                    isNotBlank(response.data.list)
                ) {
                    dataMSG = {
                        list: response.data.list,
                        pagination: response.data.pagination,
                    };
                } else {
                    dataMSG = {
                        list: [],
                        pagination: {},
                    };
                }
                yield put({
                    type: 'departmentList',
                    payload: dataMSG,
                });
            } else if (isNotBlank(payload.type) && payload.type == 'base') {
                const value = jsonToFormData(payload);
                const response = yield call(dictlist, value);
                let dataMSG = {};
                if (
                    isNotBlank(response) &&
                    isNotBlank(response.data) &&
                    isNotBlank(response.data.list)
                ) {
                    dataMSG = {
                        list: response.data.list,
                        pagination: response.data.pagination,
                    };
                } else {
                    dataMSG = {
                        list: [],
                        pagination: {},
                    };
                }
                yield put({
                    type: 'savebase',
                    payload: dataMSG,
                });
            }
        },
        *add_dict({ payload, callback }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(adddict, value);
            if (isNotBlank(response) && response.success === '1') {
                message.success('操作成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('操作失败');
            }
        },
        *del_dict({ payload, callback }, { call }) {
            const value = jsonToFormData(payload);
            const response = yield call(deldict, value);
            if (isNotBlank(response) && response.success === '1') {
                message.success('删除成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('删除失败');
            }
        },
    },

    reducers: {
        listdict(state, action) {
            return {
                ...state,
                listdict: action.payload,
            };
        },
        departmentList(state, action) {
            return {
                ...state,
                departmentList: action.payload,
            };
        },
        listfailure(state, action) {
            return {
                ...state,
                departmentFailure: action.payload,
            };
        },
        savebase(state, action) {
            return {
                ...state,
                basemanage: action.payload,
            };
        },
        clear() {
            return {
                listdict: {
                    list: [],
                    pagination: {},
                },
            };
        },
    },
};

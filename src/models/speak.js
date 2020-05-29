import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
    addSpeakList,
    getSpeakList,
    updateSpeakList,
    deleteSpeakList
} from '../services/api';

export default {
    namespace: 'speaklist',

    state: {
        getCommList: {   // 面板数据
            list: [],
            pagination: {},
        },
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            payload = jsonToFormData(payload);
            const response = yield call(getSpeakList, payload);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
                let res = {
                    list: response.data.list,
                    pagination: response.data.pagination,
                };
                yield put({
                    type: 'save',
                    payload: res,
                });
                if (callback) callback(res);
            } else if (
                isNotBlank(response) &&
                response.success == '0' &&
                isNotBlank(response.msg)
            ) {
                message.warning(response.mag);
            } 
        },
        *addSpeakList({ payload, callback }, { call, put }) {
            
            payload = jsonToFormData(payload);
            const response = yield call(addSpeakList, payload);
            if (isNotBlank(response) && response.success === '1') {
                message.success('新增成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('新增失败');
            }
        },
        *updateSpeakList({ payload, callback }, { call, put }) {
            payload = jsonToFormData(payload);
            const response = yield call(updateSpeakList, payload);
            if (isNotBlank(response) && response.success === '1') {
                message.success('修改成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('新增失败');
            }
        },
        *deleteSpeakList({ payload, callback }, { call, put }) {
            payload = jsonToFormData(payload);
            const response = yield call(deleteSpeakList, payload);
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
        save(state, action) {
            return {
                ...state,
                getCommList: action.payload,
            };
        },
        
    },
};

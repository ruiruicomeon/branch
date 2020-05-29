import { message } from 'antd';
import { queryDicts, queryMemSysArealist, removeMemSysArea, addMemSysArea } from '../services/api';

export default {
  namespace: 'sysareaonly',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dicts: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMemSysArealist, payload);
      if (
        response.list == null ||
        response.list === 'undefind' ||
        typeof response.list === 'undefined'
      ) {
        response.list = [];
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const addrequest = yield call(addMemSysArea, payload);
      if (addrequest.success === '1') {
        message.success(addrequest.msg);
        const response = yield call(queryMemSysArealist);
        if (
          response.list == null ||
          response.list === 'undefind' ||
          typeof response.list === 'undefined'
        ) {
          response.list = [];
        }
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(addrequest.msg);
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeMemSysArea, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success!=null && typeof(response.success)!=="undefined"
      ) {
        if(response.success === '1'){
          message.success("部门删除成功");
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
    saveDicts(state, action) {
      return {
        ...state,
        dicts: action.payload,
      };
    },
  },
};

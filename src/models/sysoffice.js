import { message } from 'antd';
import { queryMemSysOffice, removeMemSysOffice, addMemSysOffice } from '../services/api';

export default {
  namespace: 'sysoffice',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dicts: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMemSysOffice, payload);
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
      const addrequest = yield call(addMemSysOffice, payload);
      if (addrequest!=null && typeof(addrequest)!=="undefined" && addrequest.success === '1') {
        message.success(addrequest.msg);
        const response = yield call(queryMemSysOffice);
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
      const response = yield call(removeMemSysOffice, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success !=null && typeof(response.success)!=="undefined"
      ) {
        if(response.success === '1'){
          message.success(response.msg);
          if (callback) callback();
        } else {
          message.error(response.msg);
        }
      }
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

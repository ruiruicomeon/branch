import { message } from 'antd';
import {
  queryDicts,
  queryMemSysRoleApo,
  removeMemSysRole,
  addMemSysRoleApo,
  formMemSysRole,
  queryMemSysRoleAll,
  queryMemSysRole,
  roleApplySave,
  applyRoleList,
  applyRoleForm,
  applyRoleSave,
} from '../services/api';

export default {
  namespace: 'sysroleList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataAll: {
      list: [],
      pagination: {},
    },
    dicts: [],
    formData: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryMemSysRole, payload);
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
      if (callback) callback(response);
    },
    *fetchall({ payload, callback }, { call, put }) {
      const response = yield call(queryMemSysRoleAll, payload);
      if (
        response.list == null ||
        response.list === 'undefind' ||
        typeof response.list === 'undefined'
      ) {
        response.list = [];
      }
      yield put({
        type: 'allsave',
        payload: response,
      });
      if (callback) callback(response);
    },
    *applyrolelist({ payload, callback }, { call, put }) {
      const response = yield call(applyRoleList, payload);
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
      if (callback) callback(response);
    },
    *applyroleform({ payload }, { call, put }) {
      const response = yield call(applyRoleForm, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success!=null && typeof(response.success) !== "undefined" &&
        response.success === '1'
      ) {
        yield put({
          type: 'form',
          payload: response,
        });
      }
    },
    *applyrolesave({ payload, callback }, { call }) {
      const response = yield call(applyRoleSave, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success!=null && typeof(response.success)!=="undefined"
      ) {
        if(response.success === '1'){
          message.success(response.msg);
          if (callback) callback();
        } else {
          message.error(response.msg);
        }
      }
    },
    *add({ payload, callback }, { call }) {
      const addData = new URLSearchParams();
      for (const item in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, item)) {
          addData.set(item, payload[item]);
        }
      }
      const addrequest = yield call(addMemSysRole, addData);

      if (
        addrequest != null &&
        addrequest !== 'undefined' &&
        typeof addrequest !== 'undefined' &&
        addrequest.success!=null && typeof(addrequest.success)!=="undefined"
      ) {
        if(addrequest.success === '1'){
          message.success(addrequest.msg);
          if (callback) callback();
        } else {
          message.error(addrequest.msg);
        }
      }
    },
    *rolesave({ payload, callback }, { call }) {
      const addrequest = yield call(roleApplySave, payload);
      if (
        addrequest != null &&
        addrequest !== 'undefined' &&
        typeof addrequest !== 'undefined' &&
        addrequest.success!=null && typeof(addrequest.success)!=="undefined"
      ) {
        if(addrequest.success === '1'){
          message.success(addrequest.msg);
          if (callback) callback();
        } else {
          message.error(addrequest.msg);
        }
      }
    },

    *form_data({ payload, callback }, { call, put }) {
      const response = yield call(formMemSysRole, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
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
      const response = yield call(removeMemSysRole, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success!=null && typeof(response.success)!=="undefined"
      ) {
        if(response.success === '1'){
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
    allsave(state, action) {
      return {
        ...state,
        dataAll: action.payload,
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
  },
};

import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
  // queryDicts,
  queryMemSysRole,
  // removeMemSysRole,
  // addMemSysRole,
  // formMemSysRole,
  addMemSysRole,
  queryMemSysArea,
  addEditmenu,
  deletemenu
  // roleApplySave,
  // applyRoleList,
  // applyRoleForm,
  // applyRoleSave,
} from '../services/api';

export default {
  namespace: 'sysrole',

  state: {
    rolelist:{
      list:[]
    },
    formData: {},
  },

  effects: {
    *fetch({ payload}, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(queryMemSysRole, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.list)) {
          let arrayList = [];
            arrayList = [...response.list];
          dataMSG = {
             list:arrayList
          }
        } else {
          dataMSG = {
             list:[]
          }
        }
        yield put({
          type: 'rolelist',
          payload: dataMSG,
        });
    },
    *add_role({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addMemSysRole, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *add_menu({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addEditmenu, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *del_menu({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deletemenu, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },
    *form_data({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(queryMemSysArea, value);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success == 1
      ) {
         if (callback) callback(response);
        yield put({
          type: 'form',
          payload: response,
        });
      }
     
    },
  },

  reducers: {
    rolelist(state, action) {
      return {
        ...state,
        rolelist: action.payload,
      };
    },
    form(state, action) {
      return {
        ...state,
        formData: action.payload.data,
      };
    },
  clear() {
    return {
      formData:{
        role:{}
      },
      rolelist: {
        list: [],
      }
    }
  }
}
}
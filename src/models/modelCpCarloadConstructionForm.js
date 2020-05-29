import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpCarloadConstructionForm, addCpCarloadConstructionForm, listNotPageCpCarloadConstructionForm, revocationCpCarloadConstructionForm, deleteCpCarloadConstructionForm, updateCpCarloadConstructionForm, getCpCarloadConstructionForm, listCpCarloadConstructionFormTreeData } from '../services/api';

export default {
  namespace: 'cpCarloadConstructionForm',

  state: {
    cpCarloadConstructionFormList: {
      list: [],
      pagination: {},
    },
    cpCarloadConstructionFormNotPageList: [],
    cpCarloadConstructionFormTreeDataList: [],
    cpCarloadConstructionFormGet: {}
  },

  effects: {
    *cpCarloadConstructionForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpCarloadConstructionForm, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpCarloadConstructionFormList',
        payload: dataMSG,
      });
    },
    *cpCarloadConstructionForm_NotPageList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpCarloadConstructionForm, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpCarloadConstructionFormNotPageList',
        payload: dataMSG,
      });
    },
    *cpCarloadConstructionForm_TreeData({ payload }, { call, put }) {
      const response = yield call(listCpCarloadConstructionFormTreeData, payload);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpCarloadConstructionFormTreeDataList',
        payload: dataMSG,
      });
    },
    *cpCarloadConstructionForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpCarloadConstructionForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *cpCarloadConstructionForm_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpCarloadConstructionForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpCarloadConstructionForm_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(revocationCpCarloadConstructionForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },
    *cpCarloadConstructionForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpCarloadConstructionForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpCarloadConstructionFormGet',
        payload: response.data,
      });
    },
    *cpCarloadConstructionForm_Delete({ payload, callback }, { call }) {
      const response = yield call(deleteCpCarloadConstructionForm, payload);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },
  },
  reducers: {
    cpCarloadConstructionFormList(state, action) {
      return {
        ...state,
        cpCarloadConstructionFormList: action.payload,
      };
    },
    cpCarloadConstructionFormNotPageList(state, action) {
      return {
        ...state,
        cpCarloadConstructionFormNotPageList: action.payload,
      };
    },
    cpCarloadConstructionFormTreeDataList(state, action) {
      return {
        ...state,
        cpCarloadConstructionFormTreeDataList: action.payload,
      };
    },
    cpCarloadConstructionFormGet(state, action) {
      return {
        ...state,
        cpCarloadConstructionFormGet: action.payload,
      };
    },
    clear() {
      return {
        cpCarloadConstructionFormList: {
          list: [],
          pagination: {},
        },
        cpCarloadConstructionFormNotPageList: [],
        cpCarloadConstructionFormTreeDataList: [],
        cpCarloadConstructionFormGet: {},
      }
    }
  },
};


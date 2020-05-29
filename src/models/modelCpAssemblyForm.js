import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listSearchCpAssemblyLine,listCpAssemblyForm, addCpAssemblyForm, listNotPageCpAssemblyForm, deleteCpAssemblyForm, updateCpAssemblyForm, getCpAssemblyForm, listCpAssemblyFormTreeData } from '../services/api';

export default {
  namespace: 'cpAssemblyForm',

  state: {
    cpAssemblyFormList: {
      list: [],
      pagination: {},
    },
    cpAssemblyFormNotPageList: [],
    cpAssemblyFormTreeDataList:[],
    cpAssemblyFormGet: {},
    CpAssemblySearchList:{}
  },

  effects: {
    *CpAssembly_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpAssemblyLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAssemblySearchList',
        payload: dataMSG,
      });
    },
    *cpAssemblyForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAssemblyForm, value);
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
        type: 'cpAssemblyFormList',
        payload: dataMSG,
      });
    },
    *cpAssemblyForm_NotPageList({ payload }, { call, put }) {
     const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpAssemblyForm, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpAssemblyFormNotPageList',
        payload: dataMSG,
      });
    },
    *cpAssemblyForm_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAssemblyFormTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpAssemblyFormTreeDataList',
        payload: dataMSG,
      });
    },
    *cpAssemblyForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAssemblyForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAssemblyForm_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpAssemblyForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpAssemblyForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAssemblyForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAssemblyFormGet',
        payload: response.data,
      });
    },
    *cpAssemblyForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAssemblyForm, value);
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
    CpAssemblySearchList(state, action) {
      return {
        ...state,
        CpAssemblySearchList: action.payload,
      };
    },
    cpAssemblyFormList(state, action) {
      return {
        ...state,
        cpAssemblyFormList: action.payload,
      };
    },
    cpAssemblyFormNotPageList(state, action) {
      return {
        ...state,
        cpAssemblyFormNotPageList: action.payload,
      };
    },
    cpAssemblyFormTreeDataList(state, action) {
      return {
        ...state,
        cpAssemblyFormTreeDataList: action.payload,
      };
    },
    cpAssemblyFormGet(state, action) {
      return {
        ...state,
        cpAssemblyFormGet: action.payload,
      };
    },
    clear() {
      return {
        cpAssemblyFormList: {
          list: [],
          pagination: {},
        },
        cpAssemblyFormNotPageList: [],
        cpAssemblyFormTreeDataList:[],
        cpAssemblyFormGet: {},
      }
    }
  },
};


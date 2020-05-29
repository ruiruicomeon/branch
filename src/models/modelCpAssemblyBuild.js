import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpAssemblyBuild, addCpAssemblyBuild, listNotPageCpAssemblyBuild, deleteCpAssemblyBuild, updateCpAssemblyBuild, getCpAssemblyBuild, listCpAssemblyBuildTreeData } from '../services/api';

export default {
  namespace: 'cpAssemblyBuild',

  state: {
    cpAssemblyBuildList: {
      list: [],
      pagination: {},
    },
    cpAssemblyBuildNotPageList: [],
    cpAssemblyBuildTreeDataList:[],
    cpAssemblyBuildGet: {}
  },

  effects: {
    *cpAssemblyBuild_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAssemblyBuild, value);
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
        type: 'cpAssemblyBuildList',
        payload: dataMSG,
      });
    },
    *cpAssemblyBuild_NotPageList({ payload }, { call, put }) {
     const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpAssemblyBuild, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpAssemblyBuildNotPageList',
        payload: dataMSG,
      });
    },
    *cpAssemblyBuild_TreeData({ payload }, { call, put }) {
      const response = yield call(listCpAssemblyBuildTreeData, payload);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpAssemblyBuildTreeDataList',
        payload: dataMSG,
      });
    },
    *cpAssemblyBuild_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAssemblyBuild, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAssemblyBuild_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpAssemblyBuild, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpAssemblyBuild_Get({ payload, callback }, { call, put }) {
      const response = yield call(getCpAssemblyBuild, payload);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAssemblyBuildGet',
        payload: response.data,
      });
    },
    *cpAssemblyBuild_Delete({ payload, callback }, { call }) {
      const response = yield call(deleteCpAssemblyBuild, payload);
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
    cpAssemblyBuildList(state, action) {
      return {
        ...state,
        cpAssemblyBuildList: action.payload,
      };
    },
    cpAssemblyBuildNotPageList(state, action) {
      return {
        ...state,
        cpAssemblyBuildNotPageList: action.payload,
      };
    },
    cpAssemblyBuildTreeDataList(state, action) {
      return {
        ...state,
        cpAssemblyBuildTreeDataList: action.payload,
      };
    },
    cpAssemblyBuildGet(state, action) {
      return {
        ...state,
        cpAssemblyBuildGet: action.payload,
      };
    },
    clear() {
      return {
        cpAssemblyBuildList: {
          list: [],
          pagination: {},
        },
        cpAssemblyBuildNotPageList: [],
        cpAssemblyBuildTreeDataList:[],
        cpAssemblyBuildGet: {},
      }
    }
  },
};


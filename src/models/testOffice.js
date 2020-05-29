import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listTestOffice, addTestOffice, listNotPageTestOffice, deleteTestOffice, updateTestOffice, getTestOffice, listTestOfficeTreeData } from '../services/api';

export default {
  namespace: 'testOffice',

  state: {
    testOfficeList: {
      list: [],
      pagination: {},
    },
    testOfficeNotPageList: [],
    testOfficeTreeDataList:[],
    testOfficeGet: {}
  },

  effects: {
    *testOffice_List({ payload }, { call, put }) {
      const response = yield call(listTestOffice, payload);
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
        type: 'testOfficeList',
        payload: dataMSG,
      });
    },
    *testOffice_NotPageList({ payload }, { call, put }) {
      const response = yield call(listNotPageTestOffice, payload);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'testOfficeNotPageList',
        payload: dataMSG,
      });
    },
    *testOffice_TreeData({ payload }, { call, put }) {
      const response = yield call(listTestOfficeTreeData, payload);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'testOfficeTreeDataList',
        payload: dataMSG,
      });
    },
    *testOffice_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addTestOffice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *testOffice_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateTestOffice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *testOffice_Get({ payload, callback }, { call, put }) {
      const response = yield call(getTestOffice, payload);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'testOfficeGet',
        payload: response.data,
      });
    },
    *testOffice_Delete({ payload, callback }, { call }) {
      const response = yield call(deleteTestOffice, payload);
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
    testOfficeList(state, action) {
      return {
        ...state,
        testOfficeList: action.payload,
      };
    },
    testOfficeNotPageList(state, action) {
      return {
        ...state,
        testOfficeNotPageList: action.payload,
      };
    },
    testOfficeTreeDataList(state, action) {
      return {
        ...state,
        testOfficeTreeDataList: action.payload,
      };
    },
    testOfficeGet(state, action) {
      return {
        ...state,
        testOfficeGet: action.payload,
      };
    },
    clear() {
      return {
        testOfficeList: {
          list: [],
          pagination: {},
        },
        testOfficeNotPageList: [],
        testOfficeTreeDataList:[],
        testOfficeGet: {},
      }
    }
  },
};

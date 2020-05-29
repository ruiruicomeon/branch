import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpClient, addCpClient, listNotPageCpClient, deleteCpClient, updateCpClient, getCpClient, listCpClientTreeData, listSearchCpLient } from '../services/api';

export default {
  namespace: 'cpClient',

  state: {
    cpClientList: {
      list: [],
      pagination: {},
    },
    cpClientNotPageList: [],
    cpClientTreeDataList: [],
    cpClientGet: {},
    cpClientSearchList: {},
  },

  effects: {
    *cpClient_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpClient, value);
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
        type: 'cpClientList',
        payload: dataMSG,
      });
    },
    *cpClient_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpLient, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpClientSearchList',
        payload: dataMSG,
      });
    },
    *cpClient_NotPageList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpClient, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpClientNotPageList',
        payload: dataMSG,
      });
    },
    *cpClient_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpClientTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpClientTreeDataList',
        payload: dataMSG,
      });
    },
    *cpClient_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpClient, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpClient_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpClient, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpClient_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpClient, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpClientGet',
        payload: response.data,
      });
    },
    *cpClient_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpClient, value);
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
    cpClientList(state, action) {
      return {
        ...state,
        cpClientList: action.payload,
      };
    },
    cpClientSearchList(state, action) {
      return {
        ...state,
        cpClientSearchList: action.payload,
      };
    },
    cpClientNotPageList(state, action) {
      return {
        ...state,
        cpClientNotPageList: action.payload,
      };
    },
    cpClientTreeDataList(state, action) {
      return {
        ...state,
        cpClientTreeDataList: action.payload,
      };
    },
    cpClientGet(state, action) {
      return {
        ...state,
        cpClientGet: action.payload,
      };
    },
    clear() {
      return {
        cpClientList: {
          list: [],
          pagination: {},
        },
        cpClientNotPageList: [],
        cpClientTreeDataList: [],
        cpClientGet: {},
      }
    }
  },
};


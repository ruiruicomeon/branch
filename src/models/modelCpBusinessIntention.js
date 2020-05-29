import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {listSearchCpBusinessIntentionLine , undoBusinessIntention, listCpBusinessIntention, addCpBusinessIntention, listNotPageCpBusinessIntention, deleteCpBusinessIntention, updateCpBusinessIntention, getCpBusinessIntention, listCpBusinessIntentionTreeData ,getCpClientLine} from '../services/api';

export default {
  namespace: 'cpBusinessIntention',

  state: {
    cpBusinessIntentionList: {
      list: [],
      pagination: {},
    },
    cpBusinessIntentionNotPageList: [],
    cpBusinessIntentionTreeDataList:[],
    cpBusinessIntentionGet: {},
    CpBusinessIntentionSearchList:{}
  },

  effects: {
    *CpBusinessIntention_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpBusinessIntentionLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpBusinessIntentionSearchList',
        payload: dataMSG,
      });
    },
    *cpBusinessIntention_undo({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(undoBusinessIntention, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },
    *cpBusinessIntention_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBusinessIntention, value);
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
        type: 'cpBusinessIntentionList',
        payload: dataMSG,
      });
    },
    *cpBusinessIntention_NotPageList({ payload }, { call, put }) {
     const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpBusinessIntention, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBusinessIntentionNotPageList',
        payload: dataMSG,
      });
    },
    *cpBusinessIntention_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBusinessIntentionTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBusinessIntentionTreeDataList',
        payload: dataMSG,
      });
    },
    *cpBusinessIntention_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpBusinessIntention, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpBusinessIntention_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpBusinessIntention, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpBusinessIntention_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBusinessIntention, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpBusinessIntentionGet',
        payload: response.data,
      });
    },
    *cpBusinessIntention_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpBusinessIntention, value);
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
    cpBusinessIntentionList(state, action) {
      return {
        ...state,
        cpBusinessIntentionList: action.payload,
      };
    },
    cpBusinessIntentionNotPageList(state, action) {
      return {
        ...state,
        cpBusinessIntentionNotPageList: action.payload,
      };
    },
    cpBusinessIntentionTreeDataList(state, action) {
      return {
        ...state,
        cpBusinessIntentionTreeDataList: action.payload,
      };
    },
    cpBusinessIntentionGet(state, action) {
      return {
        ...state,
        cpBusinessIntentionGet: action.payload,
      };
    },
    CpBusinessIntentionSearchList(state, action) {
      return {
        ...state,
        CpBusinessIntentionSearchList: action.payload,
      };
    },
    clear() {
      return {
        cpBusinessIntentionList: {
          list: [],
          pagination: {},
        },
        cpBusinessIntentionNotPageList: [],
        cpBusinessIntentionTreeDataList:[],
        cpBusinessIntentionGet: {},
      }
    }
  },
};



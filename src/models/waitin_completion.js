/**
 * zc和At待完工施工单model
 */

import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listWaitinCompletion, listSearchCpCarloadConstructionLine, updateCompletion } from '../services/api';

export default {
  namespace: 'waitinCompletion',

  state: {
    ZCWaitinCompletionList: {
      list: [],
      pagination: {},
    },
    ATWaitinCompletionList: {
      list: [],
      pagination: {},
    },
    completionSearchList: {},
  },

  effects: {

    *completion_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpCarloadConstructionLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'completionSearchList',
        payload: dataMSG,
      });
    },

    *waitinCompletion_ZCList({ payload }, { call, put }) {
      const val = { ...payload };
      val.type = 1;
      const value = jsonToFormData(val);
      const response = yield call(listWaitinCompletion, value);
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
        type: 'ZCWaitinCompletionList',
        payload: dataMSG,
      });
    },
    *waitinCompletion_ATList({ payload }, { call, put }) {
      const val = { ...payload };
      val.type = 2;
      const value = jsonToFormData(val);
      const response = yield call(listWaitinCompletion, value);
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
        type: 'ATWaitinCompletionList',
        payload: dataMSG,
      });
    },
    *update_Completion({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCompletion, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("成功完成");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("完工失败");
      }
    },

  },
  reducers: {
    ZCWaitinCompletionList(state, action) {
      return {
        ...state,
        ZCWaitinCompletionList: action.payload,
      };
    },
    ATWaitinCompletionList(state, action) {
      return {
        ...state,
        ATWaitinCompletionList: action.payload,
      };
    },
    completionSearchList(state, action) {
      return {
        ...state,
        completionSearchList: action.payload,
      };
    },

    clear() {
      return {
        ZCWaitinCompletionList: {
          list: [],
          pagination: {},
        },
        ATWaitinCompletionList: {
          list: [],
          pagination: {},
        },
        completionSearchList: {},
      }
    }
  },
};


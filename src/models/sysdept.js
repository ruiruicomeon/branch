import { message } from 'antd';
import { jsonToFormData } from '@/utils/utils';
import { queryMemSysDept,
   removeMemSysDept, 
   addMemSysDept,
    getDeptMain, 
   queryMemSysDeptList, 
   querydeptlist,
   getbuNamelist
   } from '../services/api';

export default {
  namespace: 'sysdeptList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dicts: [],
    mainData: {
      dept: {},
      equiInfoList: [],
      numberAccount: '',
      priceAccount: '',
      deptAllEquiNum: '',
      deptAllPrice: '',
      inUseNumber: '',
      inUsePrice: '',
      maintainNumber: '',
      maintainPrice: '',
      useDeptAllPrice: '',
      repairNumber: '',
      repairPrice: '',
      scrapNumber: '',
      scrapPrice: '',
      monthRepair: [],
    },
    getbuNamelist:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMemSysDept, payload);
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
    *list({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(querydeptlist, value);
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
      if (callback) {
        callback(response)
      }
    },
    *getbuNamelist({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getbuNamelist, value);
      if (
        response.list == null ||
        response.list === 'undefind' ||
        typeof response.list === 'undefined'
      ) {
        response.list = [];
      }

      yield put({
        type: 'savegetbuNamelist',
        payload: response.list,
      });
      if (callback) {
        callback(response.list)
      }
    },
    *main({ payload }, { call, put }) {
      const response = yield call(getDeptMain, payload);
      yield put({
        type: 'data',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const addrequest = yield call(addMemSysDept, payload);
      if (addrequest != null && typeof (addrequest) !== "undefined" && addrequest.success === '1') {
        message.success(addrequest.msg);
        const response = yield call(queryMemSysDept);
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
      const response = yield call(removeMemSysDept, payload);
      if (
        response != null &&
        response !== 'undefined' &&
        typeof response !== 'undefined' &&
        response.success != null && typeof (response.success) !== "undefined"
      ) {
        if (response.success === '1') {
          message.success("删除部门成功");
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
    data(state, action) {
      return {
        ...state,
        mainData: action.payload,
      };
    },
    saveDicts(state, action) {
      return {
        ...state,
        dicts: action.payload,
      };
    },
    savegetbuNamelist(state, action) {
      return {
        ...state,
        getbuNamelist: action.payload,
      };
    },
    clear() {
      return {
        data: {
          list: [],
          pagination: {},
        },
        dicts: [],
        mainData: {
          dept: {},
          equiInfoList: [],
          deptAllEquiNum: '',
          deptAllPrice: '',
          numberAccount: '',
          priceAccount: '',
          inUseNumber: '',
          inUsePrice: '',
          maintainNumber: '',
          useDeptAllPrice: '',
          maintainPrice: '',
          repairNumber: '',
          repairPrice: '',
          scrapNumber: '',
          scrapPrice: '',
          monthRepair: [],
        },
      };
    },
  },
};

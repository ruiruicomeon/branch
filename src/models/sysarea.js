import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { queryMemSysArea} from '../services/api';

export default {
  namespace: 'sysarea',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    arealist :{
      list: [],
      pagination: {},
    },
    dicts: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(queryMemSysArea, value);
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
        type: 'arealist',
        payload: dataMSG,
      });
    },
    // *add({ payload, callback }, { call, put }) {
    //   const addrequest = yield call(addMemSysArea, payload);
    //   if (addrequest.success === '1') {
    //     message.success(addrequest.msg);
    //     const response = yield call(queryMemSysArea);
    //     if (
    //       response.list == null ||
    //       response.list === 'undefind' ||
    //       typeof response.list === 'undefined'
    //     ) {
    //       response.list = [];
    //     }
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //   } else {
    //     message.error(addrequest.msg);
    //   }
    //   if (callback) callback();
    // },
    // *remove({ payload, callback }, { call }) {
    //   const response = yield call(removeMemSysArea, payload);
    //   if (
    //     response != null &&
    //     response !== 'undefined' &&
    //     typeof response !== 'undefined' &&
    //     response.success!=null && typeof(response.success)!=="undefined"
    //   ) {
    //     if(response.success === '1'){
    //       message.success(response.msg);
    //       if (callback) callback();
    //     } else {
    //       message.error(response.msg);
    //     }
    //   }
    // },
    // *dicts({ payload }, { call, put }) {
    //   const response = yield call(queryDicts, payload);
    //   yield put({
    //     type: 'saveDicts',
    //     payload: Array.isArray(response) ? response : [],
    //   });
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    arealist(state, action) {
      return {
        ...state,
        arealist: action.payload,
      };
    },
    saveDicts(state, action) {
      return {
        ...state,
        dicts: action.payload,
      };
    },
    clear() {
      return {
        arealist: {
            list: [],
            pagination: {},
          },
          data: {
            list: [],
            pagination: {},
          },
      }
    }
  },
};

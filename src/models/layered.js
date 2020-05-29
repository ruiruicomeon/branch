import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { adddept , deletedept , querydeptlist } from '../services/api';

export default {
  namespace: 'sysdept',

  state: {
    // layerlist1:{
    //   list:[]
    // },
    // layerlist1:{
    //     list:[]
    //   }
    // ,
    deptlist:{
      list:[]
    }
  },

  effects: {
    // *fetch({ payload, callback }, { call, put }) {
    //   const value = jsonToFormData(payload);
    //     const response = yield call(queryOffice, value);
    //     let dataMSG = {};
    //     if (isNotBlank(response) && isNotBlank(response.list)) {
    //       let arrayList = [];
    //         arrayList = [...response.list];
    //       dataMSG = {
    //          list:arrayList
    //       }
    //     } else {
    //       dataMSG = {
    //          list:[]
    //       }
    //     }
    //     yield put({
    //       type: 'levellist',
    //       payload: dataMSG,
    //     });
    // },
    // *fetch1({ payload, callback }, { call, put }) {
    //     const value = jsonToFormData(payload);
    //       const response = yield call(queryOffice, value);
    //       let dataMSG = {};
    //       if (isNotBlank(response) && isNotBlank(response.list)) {
    //         let arrayList = [];
    //           arrayList = [...response.list];
    //         dataMSG = {
    //            list:arrayList
    //         }
    //       } else {
    //         dataMSG = {
    //            list:[]
    //         }
    //       }
    //       yield put({
    //         type: 'levellist1',
    //         payload: dataMSG,
    //       });
    //   },
      *query_dept({ payload }, { call, put }) {
        const value = jsonToFormData(payload);
          const response = yield call(querydeptlist, value);
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
            type: 'deptlist',
            payload: dataMSG,
          });
      },
    *add_dept({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(adddept, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *del_dept({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deletedept, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
  },

  reducers: {
    levellist(state, action) {
      return {
        ...state,
        levellist: action.payload,
      };
    },
    levellist1(state, action) {
        return {
          ...state,
          levellist1: action.payload,
        };
      },
      deptlist(state, action) {
    return {
      ...state,
      deptlist: action.payload,
    };
  },
  },
  clear() {
    return {
      levellist: {
        list: [],
        pagination: {},
      },
      levellist1: {
        list: [],
        pagination: {},
      },
      deptlist: {
        list: [],
        pagination: {},
      },
    }
  }
};

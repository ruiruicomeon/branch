import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { queryOffice , addOffice , deleteOffice ,queryOfficelist} from '../services/api';

export default {
  namespace: 'syslevel',

  state: {
    levellist:{
      list:[]
    },
    levellist1:{
        list:[]
      }
    ,
    queryofflist:{
      list:[]
    },
    levellist2:{
      list:[]
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(queryOffice, value);
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
          type: 'levellist',
          payload: dataMSG,
        });
    },
    *fetch1({ payload }, { call, put }) {
        const value = jsonToFormData(payload);
          const response = yield call(queryOffice, value);
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
            type: 'levellist1',
            payload: dataMSG,
          });
      },
      *fetch2({ payload }, { call, put }) {
        const value = jsonToFormData(payload);
          const response = yield call(queryOffice, value);
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
            type: 'levellist2',
            payload: dataMSG,
          });
      },
      *query_office({ payload }, { call, put }) {
        const value = jsonToFormData(payload);
          const response = yield call(queryOfficelist, value);
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
            type: 'queryofflist',
            payload: dataMSG,
          });
      },
    *add_office({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addOffice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *del_office({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteOffice, value);
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
      levellist2(state, action) {
        return {
          ...state,
          levellist2: action.payload,
        };
      },
      queryofflist(state, action) {
    return {
      ...state,
      queryofflist: action.payload,
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
      levellist2: {
        list: [],
        pagination: {},
      },
      queryofflist: {
        list: [],
        pagination: {},
      },
    }
  }
};

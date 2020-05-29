import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { addcompany , delcompany , querycompanylist , companydetail ,queryOffice} from '../services/api';

export default {
  namespace: 'company',

  state: {
    companylist:{
        list:[]
      }
    ,
    complist:{
      list: [],
      pagination: {}
    },
    detailcom:{}
  },

  effects: {
    *company_detail({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(companydetail, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.data)) {
          let arrayList = {};
            arrayList = response.data;
          dataMSG =arrayList
        } else {
          dataMSG ={}
        }
        yield put({
          type: 'detailcom',
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
            type: 'companylist',
            payload: dataMSG,
          });
      },
      *query_comp({ payload}, { call, put ,select}) {
        const value = jsonToFormData(payload);
          const { complist: { list } } = yield select(state => state.company);
          const response = yield call(querycompanylist, value);
          let dataMSG = {};
          if (isNotBlank(response) && (response.success === '1'||response.success === 1)) {
            let arrayList = [];
            if (!isNotBlank(payload.current) || payload.current <= 1) {
              arrayList = [...response.list];
            } else {
              arrayList = [...list, ...response.list];
            }
            dataMSG = {
              list: arrayList,
              pagination: response.pagination,
            };
          } else {
            dataMSG = {
              list: [],
              pagination: {},
            };
          }
          yield put({
            type: 'complist',
            payload: dataMSG,
          });
      },
    *add_comp({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addcompany, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *del_comp({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(delcompany, value);
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
    companylist(state, action) {
      return {
        ...state,
        companylist: action.payload,
      };
    },
    detailcom(state, action) {
      return {
        ...state,
        detailcom: action.payload,
      };
    },
      complist(state, action) {
    return {
      ...state,
      complist: action.payload,
    };
  },
  arrayList(state, action) {
    return {
      ...state,
      arrayList: action.payload,
    };
  },
  clear() {
  return {
    companylist: {
      list: [],
      pagination: {},
    },
    complist: {
      list: [],
      pagination: {},
    },
    arrayList: {
      list: [],
      pagination: {},
    },
    detailcom: {}
  }
}
}
}

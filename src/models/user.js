import { query as queryUsers, queryCurrent ,GetwxConfig } from '@/services/user';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    saveCurrentUser_myself:{}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response && response.user) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.user,
        });
      }
    },
    *fetchCurrent_myself({_,callback}, { call, put }) {
      const response = yield call(queryCurrent);
      if (response && response.user) {
        yield put({
          type: 'saveCurrentUser_myself',
          payload: response.user,
        });
        if(callback)callback(response.user)
      }
    },
    *get_wx_config({payload,callback},{ call,put }){
      const response =  yield call(GetwxConfig,payload)
      if(response.success == 1 ){
         if(callback)callback(response.data)
      } else {
        message.error(response.msg)
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveCurrentUser_myself(state,action){
      return {
        ...state,
        saveCurrentUser_myself:action.payload
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

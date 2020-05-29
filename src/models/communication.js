import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import { getCommunicationInfoList, postCommunicationInfo, getTodoMatterinfo, getCompletedMatterinfo, getAllBaseNameList, getWorkShopList, getbuNamelist, getScondNameList, getAllNewBaseList, batchgetCommunicationByUser, batchgetFailureByUser, formStatisticeList } from '../services/api';

export default {
   namespace: 'communication',

   state: {
      communicationData: [],
      AddOnerecord: {}, // 跳转数据
      TodoMatterinfoList: {
         list: [],
         pagination: {},
      }, // 待办事项
      CompletedMatterList: {
         list: [],
         pagination: {},
      }, // 已办事项
      getAllBaseNameList: [], //所有基地
      getWorkShopList: [], // 车间  根据基地查询
      getbuNamelist: [], // 所有的品类
      getScondNameList: [], // 二级品类
      getCommunicationByUser: [], // 批量处理  话术获取
      getFailureByUser: [], // 批量处理  责任分类
      add_selectdata_close: [], //选中id
      add_selectdata_comm: [],
      batchregist_list: [],
      add_selectdata_obj: {},
      formStatisticeList_obj: {
         list: [],
         pagination: {},
      },
   },

   effects: {
      *fetch({ payload, callback }, { call, put }) {
         //查询对话列表
         payload = jsonToFormData(payload);
         const response = yield call(getCommunicationInfoList, payload);
         if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
            yield put({
               type: 'save',
               payload: response.data,
            });
            if (callback) callback(res);
         } else if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },

      *addcommrecoed({ payload, callback }, { call, put }) {
         // 增加一条记录
         payload = jsonToFormData(payload);
         const response = yield call(postCommunicationInfo, payload);
         if (isNotBlank(response) && response.success === '1') {
            message.success('评论成功');
            if (callback) callback();
         } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
            message.error(response.msg);
         }
      },

      *getTodoMatterinfo({ payload, callback }, { call, put, select }) {
         // 待办事项
         let payloadvalue = jsonToFormData(payload);
         const {
            TodoMatterinfoList: { list },
         } = yield select(state => state.communication);
         Toast.loading('loading...', 0);
         const response = yield call(getTodoMatterinfo, payloadvalue);
         let dataMSG = {};
         if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.list) && response.success == '1') {
            Toast.hide();
            let arrayList = [];
            if (!isNotBlank(payload.current) || payload.current <= 1) {
               arrayList = [...response.data.list];
            } else {
               arrayList = [...list, ...response.data.list];
            }
            dataMSG = {
               list: arrayList,
               pagination: response.data.pagination,
            };
            yield put({
               type: 'savetodoMatter',
               payload: dataMSG,
            });
            if (callback) callback(arrayList);
         } else {
            Toast.hide();
            dataMSG = {
               list: [],
               pagination: {},
            };
            yield put({
               type: 'savetodoMatter',
               payload: dataMSG,
            });
            if (callback) callback();
            Toast.hide();
         }
      },
      *getCompletedMatterinfo({ payload, callback }, { call, put, select }) {
         // 已办事项
         let payloadvalue = jsonToFormData(payload);
         const {
            CompletedMatterList: { list },
         } = yield select(state => state.communication);
         Toast.loading('Loading...', 0);
         const response = yield call(getCompletedMatterinfo, payloadvalue);
         let dataMSG = {};
         if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.list) && response.success == '1') {
            Toast.hide();
            let arrayList = [];
            if (!isNotBlank(payload.current) || payload.current <= 1) {
               arrayList = [...response.data.list];
            } else {
               arrayList = [...list, ...response.data.list];
            }
            dataMSG = {
               list: arrayList,
               pagination: response.data.pagination,
            };
            yield put({
               type: 'saveCompletedMatter',
               payload: dataMSG,
            });
            if (callback) callback(response.data);
         } else {
            Toast.hide();
            dataMSG = {
               list: [],
               pagination: {},
            };
            yield put({
               type: 'saveCompletedMatter',
               payload: dataMSG,
            });
            message.warning('暂无数据!');
         }
      },

      *fetch_basenamelist({ payload, callback }, { call, put }) {
         //  查询所有基地
         payload = jsonToFormData(payload);
         const response = yield call(getAllNewBaseList, payload);
         if (isNotBlank(response) && isNotBlank(response.list) && response.success == '1') {
            yield put({
               type: 'save_basename',
               payload: response.list,
            });
            if (callback) callback(response.list);
         } else {
            yield put({
               type: 'save_basename',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *fetch_workshop_wx({ payload, callback }, { call, put }) {
         //  车间
         payload = jsonToFormData(payload);
         const response = yield call(getWorkShopList, payload);
         if (isNotBlank(response) && isNotBlank(response.list) && response.success == '1') {
            yield put({
               type: 'save_workshop',
               payload: response.list,
            });
            if (callback) callback(response.list);
         } else {
            yield put({
               type: 'save_workshop',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *fetch_buname_wx({ payload, callback }, { call, put }) {
         //  所有的品类
         payload = jsonToFormData(payload);
         const response = yield call(getbuNamelist, payload);
         if (isNotBlank(response) && isNotBlank(response.list) && response.success == '1') {
            yield put({
               type: 'save_buname_list',
               payload: response.list,
            });
            if (callback) callback(response.list);
         } else {
            yield put({
               type: 'save_buname_list',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *fetch_secondname_wx({ payload, callback }, { call, put }) {
         //  根据品类查找二级品类
         payload = jsonToFormData(payload);
         const response = yield call(getScondNameList, payload);
         if (isNotBlank(response) && isNotBlank(response.list) && response.success == '1') {
            yield put({
               type: 'save_secondname_list',
               payload: response.list,
            });
            if (callback) callback(response.list);
         } else {
            yield put({
               type: 'save_secondname_list',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *batchgetCommunicationByUser({ payload, callback }, { call, put }) {
         //  批量处理  获取话术
         payload = jsonToFormData(payload);
         const response = yield call(batchgetCommunicationByUser, payload);
         if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
            yield put({
               type: 'save_getCommunicationByUser',
               payload: response.data,
            });
            if (callback) callback(response.data);
         } else {
            yield put({
               type: 'save_getCommunicationByUser',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *batchgetFailureByUser({ payload, callback }, { call, put }) {
         //  批量处理 责任分类
         payload = jsonToFormData(payload);
         const response = yield call(batchgetFailureByUser, payload);
         if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
            yield put({
               type: 'save_getFailureByUser',
               payload: response.data,
            });
            if (callback) callback(response.data);
         } else {
            yield put({
               type: 'save_getFailureByUser',
               payload: [],
            });
         }
         if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
            message.warning(response.mag);
         }
      },
      *formStatistice_batch({ payload, callback }, { call, put }) {
         //  网页端报表
         payload = jsonToFormData(payload);
         const response = yield call(formStatisticeList, payload);
         let dataMSG = {};
         if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.list) && response.success == '1') {
            dataMSG = {
               list: response.data.list,
               pagination: response.data.pagination,
            };
            yield put({
               type: 'save_formStatisticeList',
               payload: dataMSG,
            });
            if (callback) callback(response.data);
         } else {
            dataMSG = {
               list: [],
               pagination: {},
            };
            yield put({
               type: 'save_formStatisticeList',
               payload: dataMSG,
            });
            message.warning('未查询到数据!');
         }
      },
   },

   reducers: {
      save(state, action) {
         return {
            ...state,
            communicationData: action.payload,
         };
      },
      saveone(state, action) {
         return {
            ...state,
            getSingleofId: action.payload,
         };
      },
      AddOnerecord(state, action) {
         // 存一条数据
         return {
            ...state,
            AddOnerecord: action.payload.AddOnerecord,
         };
      },
      add_selectdata_comm(state, action) {
         return {
            ...state,
            add_selectdata_comm: action.payload.selectdata,
         };
      },
      add_selectdata_obj(state, action) {
         return {
            ...state,
            add_selectdata_obj: action.payload,
         };
      },
      add_selectdata_batchregist(state, action) {
         return {
            ...state,
            batchregist_list: action.payload.selectdata,
         };
      },
      savetodoMatter(state, action) {
         // 待办事项的数据
         return {
            ...state,
            TodoMatterinfoList: action.payload,
         };
      },
      saveCompletedMatter(state, action) {
         // 待办事项的数据
         return {
            ...state,
            CompletedMatterList: action.payload,
         };
      },
      saveCurrentUser(state, action) {
         return {
            ...state,
            currentUser: action.payload || {},
         };
      },
      save_basename(state, action) {
         return {
            ...state,
            getAllBaseNameList: action.payload,
         };
      },
      save_workshop(state, action) {
         return {
            ...state,
            getWorkShopList: action.payload,
         };
      },
      save_buname_list(state, action) {
         return {
            ...state,
            getbuNamelist: action.payload,
         };
      },
      save_getCommunicationByUser(state, action) {
         return {
            ...state,
            getCommunicationByUser: action.payload,
         };
      },
      save_getFailureByUser(state, action) {
         return {
            ...state,
            getFailureByUser: action.payload,
         };
      },
      save_secondname_list(state, action) {
         return {
            ...state,
            getScondNameList: action.payload,
         };
      },
      save_formStatisticeList(state, action) {
         return {
            ...state,
            formStatisticeList_obj: action.payload,
         };
      },
      clear_fetch_secondname_wx(state, action) {
         return {
            ...state,
            getScondNameList: [],
         };
      },
      clear_fetch_workshop_wx(state, action) {
         return {
            ...state,
            getWorkShopList: [],
         };
      },
      clearAddOnerecord(state) {
         // 清除数据
         return {
            ...state,
            AddOnerecord: {},
         };
      },
      clearSearchRecord(state) {
         return {
            ...state,
            getWorkShopList: [], // 车间  根据基地查询
            getbuNamelist: [], // 所有的品类
            getScondNameList: [], // 二级品类
            add_selectdata_comm: [],
            add_selectdata_obj: {},
         };
      },
   },
};

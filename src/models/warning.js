import { isNotBlank, jsonToFormData,array_diff } from '@/utils/utils';
import { message } from 'antd';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import {
    queryWarninglist,
    addWarninglist,
    delectWarninglist,
    getWarningofSingle,
    handleChangeOrderStatus,
    postCommunicationInfo,
    queryExceptionOrderList,
    getOrderExceptionDateil,
    findoneofIdBaygegiter,
    findmeneyofIdfor_wx_forward,
    SearchTofind_wccnum,
    batchExport_warning
} from '../services/api';

export default {
    namespace: 'warning',

    state: {
        Graydata: {
            // 面板数据
            list: [],
            pagination: {},
        },
        getSingleofId: {},
        findoneofIdBaygegiter: {}, // 登记页面 单个oid获取的值
        warningDateil: {},
        warningList: {
            // 面板数据
            list: [],
            pagination: {},
        },
        orderDateilqueryList: {
            // 查询详情
            list: [],
            pagination: {},
        },
        queryExceptionOrderList_wx: {
            // 订单查询 手机端
            list: [],
            totalCount: '',
        },
        getOrderExceptionDateil: {},
        addItem_register_wx: {},
        add_search_value_orderlistobj: {},
        warning_search_value: {},
        orderlist_pc: {},
        wx_forwardList: [],
        pc_forwardList: [],
        srcolltop_current: {
            srcolltop: 0,
            current: 1,
            pageSize: 5,
        },
        formvalues_warning: {
            formvalues: {},
            current: 0,
            pageSize: 0,
        },
        formvalues_duty:{
            formvalues: {},
            current: 0,
            pageSize: 0,
        },
    },

    effects: {
        // 求数据
        *fetch({ payload, callback }, { call, put }) {
            const value = jsonToFormData(payload);
            const response = yield call(queryWarninglist, value);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
                let res = {
                    list: response.data.list,
                    pagination: response.data.pagination,
                };
                yield put({
                    type: 'save',
                    payload: res,
                });
                if (callback) callback(res);
            } else if (
                isNotBlank(response) &&
                response.success == '0' &&
                isNotBlank(response.msg)
            ) {
                message.warning(response.mag);
            } else {
                message.error('查询数据错误');
            }
        },

        *warning_List({ payload, callback }, { call, put, select }) {
            const value = jsonToFormData(payload);
            const {
                warningList: { list },
            } = yield select(state => state.warning);
            Toast.loading('Loading...', 0);
            const response = yield call(queryWarninglist, value);
            let dataMSG = {};
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                response.success == '1' &&
                isNotBlank(response.data.list)
            ) {
                Toast.hide();
                let arrayList = [];
                if (!isNotBlank(payload.current) || payload.current <= 1) {
                    arrayList = [...response.data.list];
                } else {
                    let diffarr = array_diff(list, response.data.list )
                    arrayList = [...diffarr, ...response.data.list];
                }
                dataMSG = {
                    list: arrayList,
                    pagination: response.data.pagination,
                };
            } else {
                Toast.hide();
                dataMSG = {
                    list: [],
                    pagination: {},
                };
            }
            yield put({
                type: 'warningList',
                payload: dataMSG,
            });
            if (callback) callback(response.data);
        },
        *update_warning({ payload }, { put, select }) {
            const {
                warningList: { list, pagination },
            } = yield select(state => state.warning);
            if (isNotBlank(payload) && isNotBlank(payload.newItem) && isNotBlank(payload.index)) {
                const newList = list.slice();
                newList.splice(parseInt(payload.index, 10), 1, payload.newItem);
                yield put({
                    type: 'warningList',
                    payload: {
                        list: newList,
                        pagination,
                    },
                });
            }
        },
        *addwarninglist({ payload, callback }, { call, put }) {
            // 新增异常
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(addWarninglist, addData);
            if (isNotBlank(response) && response.success === '1') {
                message.success('新增成功');
                yield put(routerRedux.push('/Warning'));
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('新增失败');
            }
        },
        *add_wxWarning({ payload, callback }, { call }) {
            // 新增异常
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(addWarninglist, addData);
            if (isNotBlank(response) && response.success === '1') {
                message.success(response.msg ? response.msg : '新增成功');
                if (callback) callback();
            } else if (
                isNotBlank(response) &&
                (response.success === '0' || response.success === 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            }
        },

        *delectwarningone({ payload, callback }, { call, put }) {
            // 删除一条
            payload = jsonToFormData(payload);
            const response = yield call(delectWarninglist, payload);
            if (isNotBlank(response) && response.success == '1') {
                message.success('删除成功');
            } else if (
                isNotBlank(response) &&
                (response.success == '0' || response.success == 0) &&
                isNotBlank(response.msg)
            ) {
                message.error(response.msg);
            } else {
                message.error('删除失败');
            }
            if (callback) callback();
        },
        *findoneofId({ payload, callback }, { call, put }) {
            // 查找一条
            payload = jsonToFormData(payload);
            const response = yield call(getWarningofSingle, payload);
            if (isNotBlank(response) && isNotBlank(response.data)) {
                yield put({
                    type: 'saveone',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            }
        },

        *handleChangeOrderStatus({ payload, callback }, { call, put }) {
            payload = jsonToFormData(payload);
            const response = yield call(handleChangeOrderStatus, payload);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == 1) {
                if (callback) callback(response.data);
            }
        },

        *recordOnecomm({ payload, callback }, { call, put }) {
            // 新增一条沟通
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(postCommunicationInfo, addData);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == 1) {
                message.success('沟通记录新增成功');
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                ((isNotBlank(response.data) && response.success == 0) || response.success == '0')
            ) {
                message.error(response.msg);
            }
        },
        *batch_recordOnecomm({ payload, callback }, { call, put }) {
            // 批量处理
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(postCommunicationInfo, addData);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == 1) {
                message.success('批量处理成功');
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                ((isNotBlank(response.data) && response.success == 0) || response.success == '0')
            ) {
                message.error(response.msg);
            }
        },
        *exceptionclose({ payload, callback }, { call, put }) {
            // 关闭异常
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(postCommunicationInfo, addData);
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                (response.success == 1 || response.success == '1')
            ) {
                message.success('异常关闭成功');
                if (callback) callback(response.data);
            } else {
                message.error('异常关闭失败');
            }
        },
        *exception_wxClose({ payload, callback }, { call, put }) {
            // 关闭异常
            const addData = new FormData();
            if (payload.file != null && payload.file !== 'undefined') {
                payload.file.forEach(file => {
                    addData.append('file', file);
                });
            }
            for (const item in payload) {
                if (Object.prototype.hasOwnProperty.call(payload, item)) {
                    if (item !== 'file') {
                        addData.append(item, payload[item]);
                    }
                }
            }
            const response = yield call(postCommunicationInfo, addData);
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                (response.success == 1 || response.success == '1')
            ) {
                message.success('异常关闭成功');
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                ((isNotBlank(response.data) && response.success == 0) || response.success == '0')
            ) {
                message.error(response.msg);
            }
        },
        *batchexception({ payload, callback }, { call, put }) {
            // 批量处理
            payload = jsonToFormData(payload);
            const response = yield call(postCommunicationInfo, payload);
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                (response.success == 1 || response.success == '1')
            ) {
                message.success('异常关闭成功');
                yield put(routerRedux.push('/Warning'));
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                ((isNotBlank(response.data) && response.success == 0) || response.success == '0')
            ) {
                message.error(response.msg);
            }
        },
        *queryExceptionOrderList({ payload, callback }, { call, put }) {
            // 异常订单查询
            payload = jsonToFormData(payload);
            const response = yield call(queryExceptionOrderList, payload);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
                yield put({
                    type: 'saveorderDateil',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                response.success == '0' &&
                isNotBlank(response.msg)
            ) {
                message.warning(response.mag);
            }
        },

        *queryExceptionOrderList_wx({ payload, callback }, { call, put, select }) {
            // 异常订单查询 手机端
            let payloadData = jsonToFormData(payload);
            const {
                queryExceptionOrderList_wx: { list },
            } = yield select(state => state.warning);
            Toast.loading('Loading...', 0);
            const response = yield call(queryExceptionOrderList, payloadData);
            let dataMSG = {};
            if (
                isNotBlank(response) &&
                isNotBlank(response.data) &&
                isNotBlank(response.data[0].totalCount) &&
                response.data[0].totalCount !== '0' &&
                response.success == '1'
            ) {
                Toast.hide();
                let arrayList = [];
                if (!isNotBlank(payload.Page1) || payload.Page1 <= 1) {
                    arrayList = [...response.data[0].listOrder];
                } else {
                    arrayList = [...list, ...response.data[0].listOrder];
                }
                dataMSG = {
                    list: arrayList,
                    totalCount: response.data[0].totalCount,
                };
                yield put({
                    type: 'saveorderDateil_wx',
                    payload: dataMSG,
                });
                if (callback) callback();
            } else if (parseInt(response.data[0].totalCount) == 0) {
                Toast.hide();
                dataMSG = {
                    list: [],
                    totalCount: 0,
                };
                yield put({
                    type: 'saveorderDateil_wx',
                    payload: dataMSG,
                });
                if (callback) callback();
                message.warning(response.msg ? response.msg : '未查询到数据');
            }
            if (isNotBlank(response) && response.success == '0' && isNotBlank(response.msg)) {
                Toast.hide();
                message.warning(response.mag);
            }
            if (isNotBlank(response) && response.success == '1' && isNotBlank(response.msg)) {
                Toast.hide();
                message.warning(response.mag);
            }
        },

        *getOrderExceptionDateil({ payload, callback }, { call, put }) {
            // 异常订单查询
            payload = jsonToFormData(payload);
            const response = yield call(getOrderExceptionDateil, payload);
            if (isNotBlank(response) && isNotBlank(response.data) && response.success == '1') {
                yield put({
                    type: 'saveException',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } else if (
                isNotBlank(response) &&
                response.success == '0' &&
                isNotBlank(response.msg)
            ) {
                message.warning('查询失败!');
            }
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
        *get_wx_config({ payload, callback }, { call, put }) {
            const response = yield call(GetwxConfig, payload);
            if (response.success == 1) {
                if (callback) callback(response.data);
            } else {
                message.error(response.msg);
            }
        },
        *findoneofIdBaygegiter({ payload, callback }, { call, put }) {
            // 查找一条
            payload = jsonToFormData(payload);
            const response = yield call(findoneofIdBaygegiter, payload);
            if (isNotBlank(response) && isNotBlank(response.data)) {
                yield put({
                    type: 'saveonefindoneofIdBaygegiter',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            }
        },
        *SearchTofind_wccnum({ payload, callback }, { call, put }) {
            // 扫码查询
            payload = jsonToFormData(payload);
            const response = yield call(SearchTofind_wccnum, payload);
            if (isNotBlank(response) && isNotBlank(response.data)) {
                yield put({
                    type: 'SearchTofind_wccnum',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            }
        },
        *wx_forward({ payload, callback }, { call, put }) {
            // 微信转发
            payload = jsonToFormData(payload);
            Toast.loading('Loading...', 0);
            const response = yield call(findmeneyofIdfor_wx_forward, payload);
            if (isNotBlank(response) && response.success == '1' && isNotBlank(response.data)) {
                Toast.hide();
                yield put({
                    type: 'save_findmeneyofIdfor_wx_forward',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } else {
                Toast.hide();
            }
        },
        *pc_forward({ payload, callback }, { call, put }) {
            // pc转发
            payload = jsonToFormData(payload);
            const response = yield call(findmeneyofIdfor_wx_forward, payload);
            if (isNotBlank(response) && response.success == '1' && isNotBlank(response.data)) {
                yield put({
                    type: 'save_findmeneyofIdfor_pc_forward',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } else {
            }
        },
        *batchExport({ payload, callback }, { call, put }) {
            // 批量导出
            payload = jsonToFormData(payload);
            const response = yield call(batchExport_warning, payload);
            console.log('response',response)
            if (isNotBlank(response) && response.success == '1' && isNotBlank(response.data)) {
                yield put({
                    type: 'save_findmeneyofIdfor_pc_forward',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } 
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                Graydata: action.payload,
            };
        },
        saveone(state, action) {
            return {
                ...state,
                getSingleofId: action.payload,
            };
        },
        saveonefindoneofIdBaygegiter(state, action) {
            return {
                ...state,
                findoneofIdBaygegiter: action.payload,
            };
        },
        clear_onefindoneofIdBaygegiter(state, action) {
            return {
                ...state,
                findoneofIdBaygegiter: {},
            };
        },
        warningList(state, action) {
            return {
                ...state,
                warningList: action.payload,
            };
        },
        saveorderDateil(state, action) {
            return {
                ...state,
                orderDateilqueryList: action.payload,
            };
        },
        saveorderDateil_wx(state, action) {
            // 微信端订单查询
            return {
                ...state,
                queryExceptionOrderList_wx: action.payload,
            };
        },
        warning_search_value(state, action) {
            return {
                ...state,
                warning_search_value: action.payload,
            };
        },
        cearl_warning_search_value(state, action) {
            return {
                ...state,
                warning_search_value: {},
            };
        },
        saveException(state, action) {
            return {
                ...state,
                getOrderExceptionDateil: action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload || {},
            };
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
        orderlist_pc(state, action) {
            // 订单查询  - 登记
            return {
                ...state,
                orderlist_pc: action.payload,
            };
        },
        addItem_register_wx(state, action) {
            return {
                ...state,
                addItem_register_wx: action.payload,
            };
        },
        save_findmeneyofIdfor_wx_forward(state, action) {
            return {
                ...state,
                wx_forwardList: action.payload,
            };
        },
        save_findmeneyofIdfor_pc_forward(state, action) {
            return {
                ...state,
                pc_forwardList: action.payload,
            };
        },
        add_search_value_orderlist(state, action) {
            return {
                ...state,
                add_search_value_orderlistobj: action.payload,
            };
        },
        save_srcolltop(state, action) {
            return {
                ...state,
                srcolltop_current: action.payload,
            };
        },
        clear_save_srcolltop(state, action) {
            return {
                ...state,
                srcolltop_current: {
                    srcolltop: 0,
                    current: 1,
                    pageSize: 5,
                },
            };
        },
        save_formvalues(state, action) {
            return {
                ...state,
                formvalues_warning: action.payload,
            };
        },
        save_formvaluesduty(state, action) {
            return {
                ...state,
                formvalues_duty: action.payload,
            };
        },
        clear_formvaluesduty(state, action) {
            return {
                ...state,
                formvalues_duty: {
                    formvalues: {},
                    current: 0,
                    pageSize: 0,
                },
            };
        },

        clear_formvalues(state, action) {
            return {
                ...state,
                formvalues_warning: {
                    formvalues: {},
                    current: 0,
                    pageSize: 0,
                },
            };
        },
        clear_add_search_value_orderlist(state) {
            return {
                ...state,
                add_search_value_orderlistobj: {},
            };
        },
        clearItem(state) {
            return {
                ...state,
                warningDateil: {},
            };
        },
        clearSingleofId(state) {
            return {
                ...state,
                getSingleofId: {},
            };
        },
        clear_queryExceptionOrderList_wx(state) {
            return {
                ...state,
                queryExceptionOrderList_wx: {
                    // 订单查询 手机端
                    list: [],
                    totalCount: '',
                },
            };
        },
        clear_saveonefindoneofIdBaygegiter(state) {
            return {
                ...state,
                findoneofIdBaygegiter: {},
            };
        },
    },
};

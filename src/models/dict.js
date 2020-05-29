// // import { message } from 'antd';
// import { isNotBlank } from '@/utils/utils';

// import { listOfficeType, } from '../services/api';

// export default {
//   namespace: 'dict',

//   state: {
//     officeTypeList: [],
//   },

//   effects: {
//     *dict_OfficeType({ payload }, { call, put }) {
//       const response = yield call(listOfficeType, payload);
//       let dataMSG = {};
//       if (isNotBlank(response)) {
//         dataMSG = response;
//       } else {
//         dataMSG = [];
//       }
//       yield put({
//         type: 'officeTypeList',
//         payload: dataMSG,
//       });
//     },
//   },
//   reducers: {
//     officeTypeList(state, action) {
//       return {
//         ...state,
//         officeTypeList: action.payload,
//       };
//     },
//     clear() {
//       return {
//         officeTypeList: [],
//       }
//     }
//   },
// };
// import { message } from 'antd';
import { isNotBlank ,jsonToFormData} from '@/utils/utils';

import { listDict } from '../services/api';

export default {
  namespace: 'dict',

  state: {
    dictList: [],
  },

  effects: {
    *dict({ payload,callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listDict, value);
      let dataMSG = {};
      if (isNotBlank(response)) {
        dataMSG = response;
      } else {
        dataMSG = [];
      }
      if (callback) callback(dataMSG);
      yield put({
        type: 'dictList',
        payload: dataMSG,
      });
    },
  },
  reducers: {
    dictList(state, action) {
      return {
        ...state,
        dictList: action.payload,
      };
    },
    clear() {
      return {
        dictList: [],
      }
    }
  },
};
import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
    uploadimg
} from '../services/api';

export default {
  namespace: 'upload',

  state: {
    userdetail:{}
  },

  effects: {
    *upload_img({ payload ,callback }, { call, put ,select}) {
      const value = jsonToFormData(payload);
        const response = yield call(uploadimg, value);
        if (isNotBlank(response) && response.success === '1') {
            message.success("上传成功");
            if (callback) callback(response.data);
          } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
            message.error(response.msg);
          } else {
            message.error("上传失败");
          }
    },
  },
  reducers: {
    userlist(state, action) {
      return {
        ...state,
        userlist: action.payload,
      };
    },
    clear() {
      return {
        userlist: {
          list: [],
          pagination: {},
        },
        userdetail: {}
      }
    }
  },
};

import request from '@/utils/request';
import { getCurrentUser } from './mock/user';
import { async } from 'q';
import { stringify } from 'qs';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/Api/sys/user/getUser');
}

export async function GetwxConfig(params){
  return request(`/api/Api/sys/user/getSign?url=http://${encodeURIComponent(params.url)}/`,{
    method:"POST"
  })
}
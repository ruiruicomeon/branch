import { stringify } from 'qs';
import request from '@/utils/request';
// import { login } from './mock/user';
import { usePromise } from './mock/config';
import getFakeChartData from './mock/chart';
import { async } from 'q';

// export async function login(params) {
//   return request('/api/Mem/token', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function login(params) {
   // Agriculture/
   return request('/api/Api/login', {
      method: 'POST',
      body: params,
   });
}

// 退出登录  (无权限)
export async function logout() {
   return request('/api/Api/logout');
}

export async function getToken(params) {
   return request('/api/Api/sys/user/info', {
      method: 'POST',
      body: params,
   });
}

// start
// 上传图片
export async function uploadimg(params) {
   return request('/api/Api/sys/user/UploadFolder', {
      method: 'POST',
      body: params,
   });
}

// 查看人员菜单     （sys:area:view）
export async function queryMemSysArea(params) {
   return request('/api/Api/sys/role/form', {
      method: 'POST',
      body: params,
   });
}

export async function queryMemSysRole(params) {
   return request('/api/Api/sys/role/listData', {
      method: 'POST',
      body: params,
   });
}
// 新增修改角色
export async function addMemSysRole(params) {
   return request('/api/Api/sys/role/save', {
      method: 'POST',
      body: params,
   });
}

// 查询所有层级
export async function queryOffice(params) {
   return request('/api/Api/sys/area/areaList', {
      method: 'POST',
      body: params,
   });
}
// 新增层级
export async function addOffice(params) {
   return request('/api/Api/sys/area/save', {
      method: 'POST',
      body: params,
   });
}

// 删除层级
export async function deleteOffice(params) {
   return request('/api/Api/sys/area/delete', {
      method: 'POST',
      body: params,
   });
}
// 树状图查询
export async function queryOfficelist(params) {
   return request('/api/Api/sys/area/listData', {
      method: 'POST',
      body: params,
   });
}

// 新增部门
export async function adddept(params) {
   return request('/api/Api/sys/dept/save', {
      method: 'POST',
      body: params,
   });
}

// 删除层级
export async function deletedept(params) {
   return request('/api/Api/sys/dept/delete', {
      method: 'POST',
      body: params,
   });
}
// 树状图查询
export async function querydeptlist(params) {
   return request('/api/Api/sys/dept/listData', {
      method: 'POST',
      body: params,
   });
}

// 新增公司
export async function addcompany(params) {
   return request('/api/Api/sys/office/postCpCompany', {
      method: 'POST',
      body: params,
   });
}

// 删除公司
export async function delcompany(params) {
   return request('/api/Api/sys/office/delete', {
      method: 'POST',
      body: params,
   });
}
// 公司树状图查询
export async function querycompanylist(params) {
   return request('/api/Api/sys/office/listData', {
      // return request('/api/Api/beauty/cpCompany/getCpCompanyList', {
      method: 'POST',
      body: params,
   });
}
// 公司详情
export async function companydetail(params) {
   return request('/api/Api/sys/office/getOffice', {
      method: 'POST',
      body: params,
   });
}
// 获取用户详情
export async function getuserdetail(params) {
   return request('/api/Api/sys/user/infoData', {
      method: 'POST',
      body: params,
   });
}
// 新增修改菜单
export async function addEditmenu(params) {
   return request('/api/Api/sys/menu/save', {
      method: 'POST',
      body: params,
   });
}
// 删除菜单
export async function deletemenu(params) {
   return request('/api/Api/sys/menu/delete', {
      method: 'POST',
      body: params,
   });
}

// 新增人员公司
export async function addusercompany(params) {
   return request('/api/Api/beauty/cpUserCompany/postCpUserCompany', {
      method: 'POST',
      body: params,
   });
}
// 查看人员公司分配
export async function queryusercompany(params) {
   return request('/api/Api/beauty/cpUserCompany/getCpUserCompanyList', {
      method: 'POST',
      body: params,
   });
}
// 删除菜单
export async function deleteusercompanyu(params) {
   return request('/api/Api/beauty/cpUserCompany/deleteCpUserCompany', {
      method: 'POST',
      body: params,
   });
}
// //
// export async function exportUserAll(params) {
//   return request('/api/Api/sys/user/export', {
//     method: 'POST',
//     body: params,
//   });
// }
/**
 *
 * @param { type:string,current:?number,pageSzie:?number } params
 *  type: 'failure'  查询责任分类
 *  type: 'duty'     查询责任部门
 */
export async function dictlist(params) {
   return request('/api/Api/sys/dict/list', {
      method: 'POST',
      body: params,
   });
}
// 新增字典
export async function adddict(params) {
   return request('/api/Api/sys/dict/save', {
      method: 'POST',
      body: params,
   });
}
// 删除字典
export async function deldict(params) {
   return request('/api/Api/sys/dict/delete', {
      method: 'POST',
      body: params,
   });
}

// 业务委托单撤销
export async function assemblyRevocation(params) {
   return request('/api/Api/beauty/cpBusinessOrder/revocation', {
      method: 'POST',
      body: params,
   });
}

// 意向单撤销
export async function undoBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/revocation', {
      method: 'POST',
      body: params,
   });
}

export async function listCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/getCpBusinessIntentionList', {
      method: 'POST',
      body: params,
   });
}

export async function addCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/postCpBusinessIntention', {
      method: 'POST',
      body: params,
   });
}

export async function updateCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/updateCpBusinessIntention', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/getCpBusinessIntentionListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/deleteCpBusinessIntention', {
      method: 'POST',
      body: params,
   });
}

export async function getCpBusinessIntention(params) {
   return request('/api/Api/beauty/cpBusinessIntention/getCpBusinessIntention', {
      method: 'POST',
      body: params,
   });
}

export async function listCpBusinessIntentionTreeData(params) {
   return request('/api/Api/beauty/cpBusinessIntention/treeData', {
      method: 'POST',
      body: params,
   });
}
//
export async function listCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/getCpAssemblyFormList', {
      method: 'POST',
      body: params,
   });
}

export async function addCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/postCpAssemblyForm', {
      method: 'POST',
      body: params,
   });
}

export async function updateCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/updateCpAssemblyForm', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/getCpAssemblyFormListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/deleteCpAssemblyForm', {
      method: 'POST',
      body: params,
   });
}

export async function getCpAssemblyForm(params) {
   return request('/api/Api/beauty/cpAssemblyForm/getCpAssemblyForm', {
      method: 'POST',
      body: params,
   });
}

export async function listCpAssemblyFormTreeData(params) {
   return request('/api/Api/beauty/cpAssemblyForm/treeData', {
      method: 'POST',
      body: params,
   });
}
// 添加查询列表
export async function getCpClientLine(params) {
   return request('/api/Api/beauty/cpClient/getCpClientLine', {
      method: 'POST',
      body: params,
   });
}

// 客户
export async function listCpClient(params) {
   return request(`/api/Api/beauty/cpClient/getCpClientList`, {
      method: 'POST',
      body: params,
   });
}

export async function addCpClient(params) {
   return request('/api/Api/beauty/cpClient/postCpClient', {
      method: 'POST',
      body: params,
   });
}

export async function updateCpClient(params) {
   return request('/api/Api/beauty/cpClient/updateCpClient', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageCpClient(params) {
   return request('/api/Api/beauty/cpClient/getCpClientListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteCpClient(params) {
   return request('/api/Api/beauty/cpClient/deleteCpClient', {
      method: 'POST',
      body: params,
   });
}

export async function getCpClient(params) {
   return request('/api/Api/beauty/cpClient/getCpClient', {
      method: 'POST',
      body: params,
   });
}

export async function listCpClientTreeData(params) {
   return request('/api/Api/beauty/cpClient/treeData', {
      method: 'POST',
      body: params,
   });
}

// 整车

export async function listCpCarloadConstructionForm(params) {
   return request(`/api/Api/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormList`, {
      method: 'POST',
      body: params,
   });
}

export async function addCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/postCpCarloadConstructionForm', {
      method: 'POST',
      body: params,
   });
}

export async function updateCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/updateCpCarloadConstructionForm', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/deleteCpCarloadConstructionForm', {
      method: 'POST',
      body: params,
   });
}

export async function getCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/getCpCarloadConstructionForm', {
      method: 'POST',
      body: params,
   });
}
// 撤销整车施工单
export async function revocationCpCarloadConstructionForm(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/revocation', {
      method: 'POST',
      body: params,
   });
}

export async function listCpCarloadConstructionFormTreeData(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/treeData', {
      method: 'POST',
      body: params,
   });
}

// 待完工清单列表  （整车待完工清单 ，总成待完工清单） 1是ZC 2是AT
export async function listWaitinCompletion(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/getToFinished', {
      method: 'POST',
      body: params,
   });
}

// 清单点击完工  （整车待完工清单 ，总成待完工清单） 1是ZC 2是AT
export async function updateCompletion(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/completion', {
      method: 'POST',
      body: params,
   });
}

export async function listReleaseOrder(params) {
   return request(`/api/Api/beauty/cpDischargedForm/getCpDischargedFormList`, {
      method: 'POST',
      body: params,
   });
}

export async function updateReleaseOrder(params) {
   return request('/api/Api/beauty/cpDischargedForm/postCpDischargedForm', {
      method: 'POST',
      body: params,
   });
}

export async function deleteReleaseOrder(params) {
   return request('/api/Api/beauty/cpDischargedForm/deleteCpDischargedForm', {
      method: 'POST',
      body: params,
   });
}

export async function getReleaseOrder(params) {
   return request('/api/Api/beauty/cpDischargedForm/getCpDischargedForm', {
      method: 'POST',
      body: params,
   });
}

export async function getReleaseOrderLine(params) {
   return request('/api/Api/beauty/cpDischargedForm/getCpDischargedFormLine', {
      method: 'POST',
      body: params,
   });
}

export async function listSearchCpLient(params) {
   return request('/api/Api/beauty/cpClient/getCpClientLine', {
      method: 'POST',
      body: params,
   });
}

export async function listSearchCpBusinessIntentionLine(params) {
   return request('/api/Api/beauty/cpBusinessIntention/getCpBusinessIntentionLine', {
      method: 'POST',
      body: params,
   });
}

export async function listSearchCpAssemblyLine(params) {
   return request('/api/Api/beauty/cpAssemblyForm/getCpAssemblyFormLine', {
      method: 'POST',
      body: params,
   });
}

export async function listSearchCpBusinessOrderLine(params) {
   return request('/api/Api/beauty/cpBusinessOrder/getCpBusinessOrderLine', {
      method: 'POST',
      body: params,
   });
}

export async function listSearchCpCarloadConstructionLine(params) {
   return request('/api/Api/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormLine', {
      method: 'POST',
      body: params,
   });
}

export async function listCpAssemblyBuild(params) {
   return request(`/api/Api/beauty/cpAssemblyBuild/getCpAssemblyBuildList`, {
      method: 'POST',
      body: params,
   });
}

// 新增或修改
export async function addCpAssemblyBuild(params) {
   return request('/api/Api/beauty/cpAssemblyBuild/postCpAssemblyBuild', {
      method: 'POST',
      body: params,
   });
}

// 单个删除
export async function deleteCpAssemblyBuild(params) {
   return request('/api/Api/beauty/cpAssemblyBuild/deleteCpAssemblyBuild', {
      method: 'POST',
      body: params,
   });
}

// 获取详情
export async function getCpAssemblyBuild(params) {
   return request('/api/Api/beauty/cpAssemblyBuild/getCpAssemblyBuild', {
      method: 'POST',
      body: params,
   });
}

// 获取列详情
export async function getCpAssemblyBuildLine(params) {
   return request('/api/Api/beauty/cpAssemblyBuild/getCpAssemblyBuildLine', {
      method: 'POST',
      body: params,
   });
}
// 集采
// 分页查询
export async function listCpCollecClient(params) {
   return request(`/api/Api/beauty/cpCollecClient/getCpCollecClientList`, {
      method: 'POST',
      body: params,
   });
}

// 新增或修改
export async function addCpCollecClient(params) {
   return request('/api/Api/beauty/cpCollecClient/postCpCollecClient', {
      method: 'POST',
      body: params,
   });
}

// 单个删除
export async function deleteCpCollecClient(params) {
   return request('/api/Api/beauty/cpCollecClient/deleteCpCollecClient', {
      method: 'POST',
      body: params,
   });
}

// 获取详情
export async function getCpCollecClient(params) {
   return request('/api/Api/beauty/cpCollecClient/getCpCollecClient', {
      method: 'POST',
      body: params,
   });
}

// 获取列详情
export async function getCpCollecClientLine(params) {
   return request('/api/Api/beauty/cpCollecClient/getCpCollecClientLine', {
      method: 'POST',
      body: params,
   });
}

///

export async function listTestOffice(params) {
   return request('/api/Api/test/testOffice/getTestOfficeList', {
      method: 'POST',
      body: params,
   });
}

export async function addTestOffice(params) {
   return request('/api/Api/test/testOffice/postTestOffice', {
      method: 'POST',
      body: params,
   });
}

export async function updateTestOffice(params) {
   return request('/api/Api/test/testOffice/updateTestOffice', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageTestOffice(params) {
   return request('/api/Api/test/testOffice/getTestOfficeListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteTestOffice(params) {
   return request('/api/Api/test/testOffice/deleteTestOffice', {
      method: 'POST',
      body: params,
   });
}

export async function getTestOffice(params) {
   return request('/api/Api/test/testOffice/getTestOffice', {
      method: 'POST',
      body: params,
   });
}

export async function listTestOfficeTreeData(params) {
   return request('/api/Api/test/testOffice/treeData', {
      method: 'POST',
      body: params,
   });
}

export async function listDict(params) {
   return request('/api/Api/sys/dict/listData', {
      method: 'POST',
      body: params,
   });
}

// 意向订单
export async function listCpBusinessOrder(params) {
   return request(`/api/Api/beauty/cpBusinessOrder/getCpBusinessOrderList`, {
      method: 'POST',
      body: params,
   });
}

export async function addCpBusinessOrder(params) {
   return request('/api/Api/beauty/cpBusinessOrder/postCpBusinessOrder', {
      method: 'POST',
      body: params,
   });
}

export async function updateCpBusinessOrder(params) {
   return request('/api/Api/beauty/cpBusinessOrder/updateCpBusinessOrder', {
      method: 'POST',
      body: params,
   });
}

export async function listNotPageCpBusinessOrder(params) {
   return request('/api/Api/beauty/cpBusinessOrder/getCpBusinessOrderListNoPage', {
      method: 'POST',
      body: params,
   });
}

export async function deleteCpBusinessOrder(params) {
   return request('/api/Api/beauty/cpBusinessOrder/deleteCpBusinessOrder', {
      method: 'POST',
      body: params,
   });
}

export async function getCpBusinessOrder(params) {
   return request('/api/Api/beauty/cpBusinessOrder/getCpBusinessOrder', {
      method: 'POST',
      body: params,
   });
}

export async function listCpBusinessOrderTreeData(params) {
   return request('/api/Api/beauty/cpBusinessOrder/treeData', {
      method: 'POST',
      body: params,
   });
}

/////////

export async function queryProjectNotice() {
   return request('/api/project/notice');
}

export async function queryActivities() {
   return request('/api/activities');
}

export async function queryRule(params) {
   return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
   return request('/api/rule', {
      method: 'POST',
      data: {
         ...params,
         method: 'delete',
      },
   });
}

export async function addRule(params) {
   return request('/api/rule', {
      method: 'POST',
      data: {
         ...params,
         method: 'post',
      },
   });
}

export async function updateRule(params = {}) {
   return request(`/api/rule?${stringify(params.query)}`, {
      method: 'POST',
      data: {
         ...params.body,
         method: 'update',
      },
   });
}

export async function fakeSubmitForm(params) {
   return request('/api/forms', {
      method: 'POST',
      data: params,
   });
}

export async function fakeChartData() {
   if (usePromise) {
      return new Promise(resolve => {
         setTimeout(() => {
            resolve(getFakeChartData);
         }, 1200);
      });
   }
   return request('/api/fake_chart_data');
}

export async function queryTags() {
   return request('/api/tags');
}

export async function queryBasicProfile(id) {
   return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
   return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
   return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
   const { count = 5, ...restParams } = params;
   return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      data: {
         ...restParams,
         method: 'delete',
      },
   });
}

export async function addFakeList(params) {
   const { count = 5, ...restParams } = params;
   return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      data: {
         ...restParams,
         method: 'post',
      },
   });
}

export async function updateFakeList(params) {
   const { count = 5, ...restParams } = params;
   return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      data: {
         ...restParams,
         method: 'update',
      },
   });
}

export async function fakeAccountLogin(params) {
   if (usePromise) {
      return new Promise(resolve => {
         setTimeout(() => {
            resolve(login(params));
         }, 1200);
      });
   }
   return request('/api/login/account', {
      method: 'POST',
      data: params,
   });
}

export async function fakeRegister(params) {
   return request('/api/register', {
      method: 'POST',
      data: params,
   });
}

export async function queryNotices(params = {}) {
   return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
   return request(`/api/captcha?mobile=${mobile}`);
}

export async function queryMemSysDept(params) {
   return request(`/api/Api/sys/dept/listData?${stringify(params)}`);
}

export async function queryMemSysDeptList(params) {
   return request(`/api/Api/sys/dept/list?${stringify(params)}`);
}

export async function removeMemSysDept(params) {
   return request(`/api/Api/sys/dept/delete?${stringify(params)}`);
}

export async function addMemSysDept(params) {
   return request(`/api/Api/sys/dept/save?${stringify(params)}`);
}

export async function getDeptMain(params) {
   return request(`/api/Api/sys/dept/getDeptMain?${stringify(params)}`);
}

export async function queryMemSysArealist(params) {
   return request(`/api/Api/sys/area/listData?${stringify(params)}`);
}

export async function removeMemSysArea(params) {
   return request(`/api/Api/sys/area/delete?${stringify(params)}`);
}

export async function addMemSysArea(params) {
   return request(`/api/Api/sys/area/save?${stringify(params)}`);
}

export async function queryDicts(params) {
   return request(`/api/Api/sys/dict/listData?${stringify(params)}`);
}

/**
 *
 * @param { current:number,pageSize:number } params
 * 获取用户列表
 */
export async function queryMemSysUser(params) {
   return request(`/api/Api/sys/user/listData`, {
      method: 'POST',
      body: params,
   });
}
//  删除用户   (sys:user:edit)
export async function removeMemSysUser(params) {
   return request(`/api/Api/sys/user/delete?${stringify(params)}`);
}

//  添加用户   (sys:user:edit)
export async function addMemSysUser(params) {
   // return request(`/api/Mem/sys/user/save?${stringify(params)}`);
   return request('/api/Api/sys/user/save', {
      method: 'POST',
      body: params,
   });
}

// 获取单个用户信息   (sys:user:view)
export async function formMemSysUser(params) {
   return request(`/api/Api/sys/user/form?${stringify(params)}`);
}

// 根据英文角色名获取一类用户  (sys:user:view)
export async function getEnNameUser(params) {
   return request(`/api/Api/sys/user/getEnNameUser?${stringify(params)}`);
}

// 获取人员绩效主页信息 (无权限)
export async function getUserMain(params) {
   return request(`/api/Api/sys/user/getUserMain?${stringify(params)}`);
}

// 获取设备类别区分图表信息 (无权限)
export async function getMainDeptRepair(params) {
   return request(`/api/Api/sys/user/getMainDeptRepair?${stringify(params)}`);
}

// // 查看部门信息   (sys:office:view)
export async function queryMemSysOffice(params) {
   return request(`/api/Api/sys/office/listData?${stringify(params)}`);
}

// 删除部门     （sys:office:edit）
export async function removeMemSysOffice(params) {
   return request(`/api/Api/sys/office/delete?${stringify(params)}`);
}

// 添加部门  （sys:office:edit）
export async function addMemSysOffice(params) {
   return request(`/api/Api/sys/office/save?${stringify(params)}`);
}

// 删除角色   (sys:role:edit)
export async function removeMemSysRole(params) {
   return request(`/api/Api/sys/role/delete?${stringify(params)}`);
}

// 管理员操作权限申请   无权限
export async function applyRoleSave(params) {
   return request(`/api/Api/oa/repair/applyRoleType?${stringify(params)}`);
}

// 查看权限申请记录    无权限
export async function applyRoleForm(params) {
   return request(`/api/Api/oa/repair/applyRoleForm?${stringify(params)}`);
}
// 查看权限申请列表  (无权限)
export async function applyRoleList(params) {
   return request(`/api/Api/oa/repair/applyRoleList?${stringify(params)}`);
}
// 提交申请权限   （无权限）
export async function roleApplySave(params) {
   return request(`/api/Api/oa/repair/roleSave?${stringify(params)}`);
}

// 获取全部角色列表   (无权限)
export async function queryMemSysRoleAll(params) {
   return request(`/api/Api/sys/role/listAllData?${stringify(params)}`);
}

// 查看单个角色信息   (sys:role:view)
export async function formMemSysRole(params) {
   return request(`/api/Api/sys/role/form?${stringify(params)}`);
}

// 获取角色列表  (sys:role:view)
export async function queryMemSysRoleApo(params) {
   return request('/api/Api/sys/role/listData', {
      method: 'POST',
      body: params,
   });
}

// 新增修改角色
export async function addMemSysRoleApo(params) {
   return request('/api/Api/sys/role/save', {
      method: 'POST',
      body: params,
   });
}

// 同步数据
export async function querysynchroData(params) {
   return request(`/api/Api/sys/user/sync?${stringify(params)}`);
}

/// 添加人员到基地管理中
export async function AddPersonnelToBase(params) {
   return request('/api/Api/sys/user/updateOfficeUser', {
      method: 'POST',
      body: params,
   });
}

/// 异常订单查询 分页
export async function queryWarninglist(params) {
   return request('/api/Api/op/orderException/getOrderExceptionList', {
      method: 'POST',
      body: params,
   });
}

/// 异常订单查询   不分页
export async function queryWarningAlllist(params) {
   return request('/api/Api/op/orderException/getOrderExceptionListNoPage', {
      method: 'POST',
      body: params,
   });
}

/// 异常订单 获取单条详情
export async function getWarningofSingle(params) {
   return request('/api/Api/op/orderException/getOrderException', {
      method: 'POST',
      body: params,
   });
}
///  登记页面  oid  获取异常值
export async function findoneofIdBaygegiter(params) {
   return request('/api/Api/op/orderException/getOrder', {
      method: 'POST',
      body: params,
   });
}

/// 更新接口
export async function updataWarninglist(params) {
   return request('/api/Api/op/orderException/updateOrderException', {
      method: 'POST',
      body: params,
   });
}

// 新增接口
export async function addWarninglist(params) {
   return request('/api/Api/op/orderException/postOrderException', {
      method: 'POST',
      body: params,
   });
}

// 删除接口
export async function delectWarninglist(params) {
   return request('/api/Api/op/orderException/deleteOrderException', {
      method: 'POST',
      body: params,
   });
}

/// 改变订单状态  已关注/ or  未关注
export async function handleChangeOrderStatus(params) {
   return request('/api/Api/op/orderException/watchOrderException', {
      method: 'POST',
      body: params,
   });
}

/// 异常回复  沟通记录
export async function getCommunicationInfoList(params) {
   return request('/api/Api/op/communicationInfo/getCommunicationInfoListNoPage', {
      method: 'POST',
      body: params,
   });
}

/// 异常沟通  添加一条评论
export async function postCommunicationInfo(params) {
   //postCommunicationInfo
   return request('/api/Api/op/communicationInfo/postCommunicationInfo', {
      method: 'POST',
      body: params,
   });
}
/// 待办事项
export async function getTodoMatterinfo(params) {
   //postCommunicationInfo
   return request('/api/Api/op/orderException/todo', {
      method: 'POST',
      body: params,
   });
}

/// 已办事项
export async function getCompletedMatterinfo(params) {
   //postCommunicationInfo
   return request('/api/Api/op/orderException/completed', {
      method: 'POST',
      body: params,
   });
}

/// 异常订单详情
export async function getOrderExceptionDateil(params) {
   return request(`/api/Api/op/order/getOrderDetail`, {
      method: 'POST',
      body: params,
   });
}

// 异常订单查询
export async function queryExceptionOrderList(params) {
   return request(`/api/Api/op/order/getOrderList`, {
      method: 'POST',
      body: params,
   });
}
// 话术管理 新增
export async function addSpeakList(params) {
   return request(`/api/Api/op/communicationTemplate/postCommunicationTemplate`, {
      method: 'POST',
      body: params,
   });
}

// 话术管理  get  list
export async function getSpeakList(params) {
   return request(`/api/Api/op/communicationTemplate/getCommunicationTemplateList`, {
      method: 'POST',
      body: params,
   });
}

// 修改
export async function updateSpeakList(params) {
   return request(`/api/Api/op/communicationTemplate/updateCommunicationTemplate`, {
      method: 'POST',
      body: params,
   });
}

// 删除
export async function deleteSpeakList(params) {
   return request(`/api/Api/op/communicationTemplate/deleteCommunicationTemplate`, {
      method: 'POST',
      body: params,
   });
}

// 查找所有品类
/**
 * @param
 */
export async function getbuNamelist(params) {
   return request(`/api/Api/sys/office/getBuCodeByUser`, {
      method: 'POST',
      body: params,
   });
}

// 根据品类查找二级品类
/**
 *
 * @param {buCode:string } params
 */
export async function getScondNameList(params) {
   return request('/api/Api/sys/office/getSCByUser', {
      method: 'POST',
      body: params,
   });
}

/**
 * @params {SiteCode=2 & BuCode=10}
 *  根据基地获取一下车间  根据条件
 */
export async function getWorkShopList(params) {
   return request('/api/Api/sys/office/getDeptByUser', {
      method: 'POST',
      body: params,
   });
}
/**
 * @params {
 *
 *
 * 基地
 */
export async function getAllNewBaseList(params) {
   return request('/api/Api/sys/office/getSiteCodeByUser', {
      method: 'POST',
      body: params,
   });
}

// 权限管理撤销
export async function cancelOfficeUser(params) {
   return request('/api/Api/sys/user/cancelOfficeUser', {
      method: 'POST',
      body: params,
   });
}
// 批量处理   获取话术
export async function batchgetCommunicationByUser(params) {
   return request('/api/Api/op/communicationTemplate/getCommunicationTemplateListByUser', {
      method: 'POST',
      body: params,
   });
}
// 批量处理  责任分类
export async function batchgetFailureByUser(params) {
   return request('/api/Api/sys/dict/getFailureByUser', {
      method: 'POST',
      body: params,
   });
}

// wx 转发
export async function findmeneyofIdfor_wx_forward(params) {
   return request('/api/Api/op/orderException/getOrder', {
      method: 'POST',
      body: params,
   });
}

// 微信扫描  /op/order/getOrderByCode
export async function SearchTofind_wccnum(params) {
   return request('/api/Api/op/order/getOrderByCode', {
      method: 'POST',
      body: params,
   });
}

// http://iojh.tunnel.jumbo-soft.com/Api/op/orderException/GetDeptStatistics
// 列表统计
export async function formStatisticeList(params) {
   return request('/api/Api/op/orderException/GetDeptStatistics', {
      method: 'POST',
      body: params,
   });
}

/**
 *
 * @param {object} params
 * 批量导出
 */
export async function batchExport_warning(params) {
   return request('/api/Api/op/orderException/export', {
      method: 'POST',
      body: params,
   });
}

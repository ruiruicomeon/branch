/**
 * 异常登记
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
   Form,
   Input,
   Select,
   Button,
   Card,
   InputNumber,
   Radio,
   message,
   Icon,
   Upload,
   Modal,
   TreeSelect,
   DatePicker,
   Row,
   Col,
   List,
   Avatar,
   Descriptions,
   Tree,
   Divider,
   Mentions,
   Breadcrumb,
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import className from 'classnames';
import { getStorage } from '../../utils/localStorageUtils';
import { SelectPersonnel } from './department';
import iconstyle from './icon_type_folder.less';
import moment from 'moment';
import styles from './abnormal.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const { getMentions } = Mentions; // 提及
const { Search } = Input;
const CreateFormcj = Form.create()(props => {
   const { handleModalVisiblecj, getScondNameListercj, modalVisiblecj, selectcustomer, ischecked, zrdatacj, handleScondNameClickcj, handleAddcj } = props;

   const handleClick = scondname => {
      handleScondNameClickcj(scondname);
   };

   const okHandle = () => {
      handleAddcj();
   };
   return (
      <Modal
         title="选择车间"
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         visible={modalVisiblecj}
         // onOk={okHandle}
         footer={null}
         onCancel={() => handleModalVisiblecj()}
         width="50%"
      >
         <div className={styles.flex_item_style}>
            {isNotBlank(getScondNameListercj) &&
               getScondNameListercj.length > 0 &&
               getScondNameListercj.map(scondname => {
                  return (
                     <span
                        key={scondname.id}
                        className={styles.Flex_item}
                        style={
                           isNotBlank(zrdatacj) && zrdatacj.length > 0 && zrdatacj.some(item => item.id == scondname.id)
                              ? // scondname.id == scondnameData.id
                                {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.label}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});

const CreateFormerji = Form.create()(props => {
   const { handleModalVisibleerji, getScondNameListerji, modalVisibleerji, selectcustomererji, ischecked, zrdataerji, handleScondNameClickerji, handleAdderji } = props;

   const handleClick = scondname => {
      handleScondNameClickerji(scondname);
   };
   const okHandle = () => {
      handleAdderji();
   };
   return (
      <Modal
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择二级品类"
         visible={modalVisibleerji}
         onOk={okHandle}
         onCancel={() => handleModalVisibleerji()}
         width="50%"
         footer={null}
      >
         <div className={styles.flex_item_style}>
            {isNotBlank(getScondNameListerji) &&
               getScondNameListerji.length > 0 &&
               getScondNameListerji.map(scondname => {
                  return (
                     <span
                        className={styles.Flex_item}
                        key={scondname.id}
                        style={
                           isNotBlank(zrdataerji) && zrdataerji.length > 0 && zrdataerji.some(item => item.id == scondname.id)
                              ? {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.name}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});

const CreateForm = Form.create()(props => {
   const { handleModalVisible, departmentFailure, modalVisible, selectcustomer, ischecked, zrdata, handleScondNameClick, handleAdd } = props;

   const handleClick = scondname => {
      handleScondNameClick(scondname);
   };
   const okHandle = () => {
      handleAdd();
   };
   return (
      <Modal
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择责任分类"
         visible={modalVisible}
         onOk={okHandle}
         onCancel={() => handleModalVisible()}
         width="50%"
      >
         <div className={styles.flex_item_style}>
            {isNotBlank(departmentFailure) &&
               isNotBlank(departmentFailure.list) &&
               departmentFailure.list.length > 0 &&
               departmentFailure.list.map(scondname => {
                  return (
                     <span
                        className={styles.Flex_item}
                        key={scondname.id}
                        style={
                           isNotBlank(zrdata) && zrdata.length > 0 && zrdata.some(item => item.id == scondname.id)
                              ? // scondname.id == scondnameData.id
                                {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.value}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});

const CreateFormzr = Form.create()(props => {
   const { handleModalVisiblezr, departmentList, modalVisiblezr, selectcustomer, ischecked, zrdatazr, handleScondNameClickzr, handleAddzr, onDutySearch } = props;

   const handleClick = scondname => {
      handleScondNameClickzr(scondname);
   };

   const okHandle = () => {
      handleAddzr();
   };
   return (
      <Modal
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择责任部门"
         visible={modalVisiblezr}
         onOk={okHandle}
         onCancel={() => handleModalVisiblezr()}
         width="50%"
      >
         <div style={{ marginBottom: '10px' }}>
            <Search loading size="default" placeholder="请输入部门名称" onSearch={onDutySearch} enterButton allowClear />
         </div>
         <div className={styles.flex_item_style}>
            {isNotBlank(departmentList) &&
               isNotBlank(departmentList.list) &&
               departmentList.list.length > 0 &&
               departmentList.list.map(scondname => {
                  return (
                     <span
                        className={styles.Flex_item}
                        key={scondname.id}
                        style={
                           isNotBlank(zrdatazr) && zrdatazr.length > 0 && zrdatazr.some(item => item.id == scondname.id)
                              ? // scondname.id == scondnameData.id
                                {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.value}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});

const CreateFormgj = Form.create()(props => {
   const { handleModalVisiblegj, departmentList, modalVisiblegj, selectcustomer, ischecked, zrdatagj, handleScondNameClickgj, handleAddgj, onDutySearch } = props;

   const handleClick = scondname => {
      handleScondNameClickgj(scondname);
   };

   const okHandle = () => {
      handleAddgj();
   };
   return (
      <Modal
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择跟进部门"
         visible={modalVisiblegj}
         onOk={okHandle}
         onCancel={() => handleModalVisiblegj()}
         width="50%"
      >
         <div style={{ marginBottom: '10px' }}>
            <Search loading size="default" placeholder="请输入部门名称" onSearch={onDutySearch} enterButton allowClear />
         </div>
         <div className={styles.flex_item_style}>
            {isNotBlank(departmentList) &&
               isNotBlank(departmentList.list) &&
               departmentList.list.length > 0 &&
               departmentList.list.map(scondname => {
                  return (
                     <span
                        className={styles.Flex_item}
                        key={scondname.id}
                        style={
                           isNotBlank(zrdatagj) && zrdatagj.length > 0 && zrdatagj.some(item => item.id == scondname.id)
                              ? // scondname.id == scondnameData.id
                                {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   marginBottom: '8px',
                                   display: 'inline-block',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.value}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});
const CreateFormhs = Form.create()(props => {
   const { handleModalVisiblehs, getCommList, modalVisiblehs, selectcustomer, ischecked, zrdatahs, handleScondNameClickhs, handleAddhs, allzrdatahs } = props;

   const handleClick = scondname => {
      handleScondNameClickhs(scondname);
   };
   const okHandle = () => {
      handleAddhs();
   };
   return (
      <Modal
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择话术"
         visible={modalVisiblehs}
         // onOk={okHandle}
         footer={null}
         onCancel={() => handleModalVisiblehs()}
         width="50%"
      >
         <div className={styles.flex_item_style}>
            {isNotBlank(getCommList) &&
               isNotBlank(getCommList.list) &&
               getCommList.list.length > 0 &&
               getCommList.list.map(scondname => {
                  return (
                     <span
                        className={styles.Flex_item}
                        key={scondname.id}
                        style={
                           isNotBlank(allzrdatahs) && JSON.stringify(allzrdatahs) !== '{}' && allzrdatahs.id == scondname.id
                              ? {
                                   backgroundColor: '#40a9ff',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                   color: '#fff',
                                }
                              : {
                                   backgroundColor: '#F1F2F6',
                                   padding: '5px 8px',
                                   marginLeft: '6px',
                                }
                        }
                        onClick={() => {
                           handleClick(scondname);
                        }}
                     >
                        {scondname.label}
                     </span>
                  );
               })}
         </div>
      </Modal>
   );
});

@connect(({ dictionaryL, loading, sysdeptList, sysoffice, warning, sysuser, communication, speaklist, user }) => ({
   ...dictionaryL,
   ...communication,
   sysdeptList,
   sysoffice,
   ...sysuser,
   ...warning,
   ...speaklist,
   ...user,
   userloading: loading.models.sysuser,
   submitting: loading.effects['warning/add_wxWarning'],
}))
@Form.create()
class Abnormal_form extends PureComponent {
   state = {
      location: getLocation(),
      previewVisible: false,
      previewImage: {},
      addfileList: [], // 所需要的上传的文件的数组
      fileList: [], // 用于显示上传之后的文件
      facevisible: false, // 选择人员弹框
      departmentFailure: [], // 责任部门
      SelectPersonnelRows: [], // 弹框人员
      showimgsrc: [], // 显示的图片路径
      initDutydept: [], // 选择责任人之后默认显示的部门
      getMentions: '', // 登记中@到的人员
      mentionsNameArray: [],
      mentionsIdArray: [],
      speakValue: '', // 话术
      SiteCode: '',
      SiteName: '',
      ischecked: styles.on_select,
      modalVisible: false,
      zrdata: [],
      modalVisiblezr: false,
      zrdatazr: [],
      modalVisiblegj: false,
      zrdatagj: [],
      modalVisiblehs: false,
      zrdatahs: [],
      allzrdatahs: {},
      selectzr: [],
      selectzrbm: [],
      selectgjbm: [],
      addallzrdatahs: [],

      modalVisibleerji: false, // 二级
      zrdataerji: [],
      selecterji: [],
      modalVisiblecj: false, // 二级
      zrdatacj: [],
      begindate: '', // 预计完成时间
      getfenlei: [],
      selectget: [],
      selectzrgj: [],
      orderlist_pc: {},
   };

   componentDidMount() {
      const { dispatch, orderlist_pc } = this.props;
      const { location } = this.state;
      dispatch({
         // 用户选择
         type: 'sysuser/fetch',
         payload: { current: 1, pageSize: 6000 },
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
      dispatch({
         // 责任部门
         type: 'dictionaryL/fetch',
         payload: { type: 'duty', pageSize: 5000 },
      });

      dispatch({
         type: `user/fetchCurrent_myself`,
         callback: data => {
            if (isNotBlank(data)) {
               let defaultPerson = [{ uid: data.id, name: data.name, url: data.photo, qqID: data.qqId }];
               if (!Object.values(defaultPerson[0]).some(item => item == undefined)) {
                  this.setState({
                     showimgsrc: [...defaultPerson],
                  });
               } else {
                  this.setState({
                     showimgsrc: [],
                  });
               }
            }
         },
      });

      if (isNotBlank(orderlist_pc) && JSON.stringify(orderlist_pc) !== '{}') {
         this.setState({
            orderlist_pc: orderlist_pc,
         });
         dispatch({
            // 二级品类
            type: 'communication/fetch_secondname_wx',
            payload: {
               BuCode: orderlist_pc.buCode,
               current: 1,
               pageSize: 500,
            },
         });
         dispatch({
            //  车间
            type: 'communication/fetch_workshop_wx',
            payload: { BuCode: orderlist_pc.buCode, current: 1, pageSize: 500 },
            callback: data => {
               if (data.length == 1) {
                  let newarr = [];
                  newarr.push({
                     id: data[0].id,
                     code: data[0].code,
                     name: data[0].name,
                     siteName: data[0].siteName ? data[0].siteName : '',
                     siteCode: data[0].siteCode ? data[0].siteCode : '',
                  });
                  this.setState({ zrdatacj: newarr });
               }
            },
         });
         dispatch({
            // 获取话术
            type: 'speaklist/fetch',
            payload: {
               current: 1,
               pageSize: 5000,
               buName: orderlist_pc.buName,
            },
         });
         dispatch({
            // 责任分类
            type: 'dictionaryL/fetch',
            payload: {
               type: 'failure',
               label: orderlist_pc.buCode,
               current: 1,
               pageSize: 500,
            },
            callback: data => {
               this.setState({
                  departmentFailure: data,
               });
            },
         });
      }

      //  oid
      if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
         dispatch({
            type: 'warning/findoneofIdBaygegiter',
            payload: { oid: location.query.id },
            callback: data => {
               dispatch({
                  // 二级品类
                  type: 'communication/fetch_secondname_wx',
                  payload: {
                     BuCode: data.buCode,
                     current: 1,
                     pageSize: 500,
                  },
               });
               dispatch({
                  // 车间
                  type: 'communication/fetch_workshop_wx',
                  payload: { BuCode: data.buCode, current: 1, pageSize: 500 },
                  callback: data => {
                     if (data.length == 1) {
                        let newarr = [];
                        newarr.push({
                           id: data[0].id,
                           code: data[0].code,
                           name: data[0].name,
                           siteName: data[0].siteName ? data[0].siteName : '',
                           siteCode: data[0].siteCode ? data[0].siteCode : '',
                        });
                        this.setState({ zrdatacj: newarr });
                     }
                  },
               });
               dispatch({
                  // 责任分类
                  type: 'dictionaryL/fetch',
                  payload: {
                     type: 'failure',
                     label: data.buCode,
                     current: 1,
                     pageSize: 500,
                  },
                  callback: data => {
                     this.setState({
                        departmentFailure: data,
                     });
                  },
               });
               dispatch({
                  // 获取话术
                  type: 'speaklist/fetch',
                  payload: {
                     current: 1,
                     pageSize: 5000,
                     buName: data.buName,
                  },
               });
            },
         });
      }
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('wxwork') !== -1) {
         // 微信端
         dispatch({
            type: 'user/get_wx_config',
            payload: { url: window.location.host },
            callback: data => {
               window.wx.config({
                  beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: data.appId, // 必填，企业微信的corpID
                  timestamp: data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: data.nonceStr, // 必填，生成签名的随机串
                  signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                  jsApiList: ['selectEnterpriseContact'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
               });
               this.setState({
                  Wx_config_data: data,
               });
            },
         });
      }
   }

   // 关闭页面清除数据
   componentWillUnmount() {
      const { dispatch, form } = this.props;
      form.resetFields();
      dispatch({
         type: 'warning/clear_onefindoneofIdBaygegiter',
      });
   }

   onCancelCancel = () => {
      router.goBack();
   };

   onFaceCance() {
      // 人员选择取消
      this.setState({ facevisible: false });
   }

   onSelectUser = () => {
      const { showimgsrc } = this.state;
      window.wx.invoke(
         'selectEnterpriseContact',
         {
            fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
            mode: 'multi', // 必填，选择模式，single表示单选，multi表示多选
            type: ['department', 'user'], // 必填，选择限制类型，指定department、user中的一个或者多个
            selectedDepartmentIds: [], // 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            selectedUserIds: [], // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
         },
         res => {
            if (res.err_msg === 'selectEnterpriseContact:ok') {
               if (typeof res.result === 'string') {
                  res.result = JSON.parse(res.result); // 由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
               }
               const selectedDepartmentList = res.result.departmentList; // 已选的部门列表
               for (let i = 0; i < selectedDepartmentList.length; i++) {
                  const department = selectedDepartmentList[i];
                  const departmentId = department.id; // 已选的单个部门ID
                  const departemntName = department.name; // 已选的单个部门名称
               }
               const selectedUserList = res.result.userList; // 已选的成员列表
               const imgsrc = [];
               for (let i = 0; i < selectedUserList.length; i += 1) {
                  const user = selectedUserList[i];
                  const userId = user.id; // 已选的单个成员ID
                  const userName = user.name; // 已选的单个成员名称
                  const userAvatar = user.avatar; // 已选的单个成员头像
                  imgsrc.push({ uid: userId, url: userAvatar, name: userName, qqID: userId });
               }
               if (showimgsrc.length > 0) {
                  this.setState({
                     showimgsrc: [...showimgsrc, ...imgsrc],
                     facevisible: false,
                  });
               } else {
                  this.setState({
                     showimgsrc: isNotBlank(imgsrc) && imgsrc,
                     facevisible: false,
                  });
               }
            }
         }
      );
   };
   array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
         for (var j = 0; j < a.length; j++) {
            if (a[j].uid == b[i].uid) {
               a.splice(j, 1);
               j = j - 1;
            }
         }
      }
      return a;
   }
   onFaceOK() {
      const { dispatch } = this.props;
      const { SelectPersonnelRows, showimgsrc } = this.state;
      if (isNotBlank(SelectPersonnelRows) && SelectPersonnelRows.length > 0) {
         let imgsrc = [];
         let temparr = [];
         SelectPersonnelRows.forEach((item, index) => {
            imgsrc.push({ uid: item.id, url: item.photo, name: item.name, qqID: item.qqId });
         });
         if (showimgsrc.length > 0) {
            let newarr = this.array_diff(imgsrc, showimgsrc);
            this.setState({
               showimgsrc: [...newarr, ...showimgsrc],
               facevisible: false,
            });
         } else {
            this.setState({
               showimgsrc: imgsrc,
               facevisible: false,
            });
         }
      }
   }

   select_person(e) {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('wxwork') !== -1) {
         this.onSelectUser();
      } else {
         this.setState({ facevisible: true });
      }
   }

   handleSubmit = e => {
      const { dispatch, form, location } = this.props;
      const { addfileList, mentionsNameArray, mentionsIdArray, zrdataerji, zrdatacj, begindate, selectzrbm, selectgjbm, selectzr, selectget, selectzrgj } = this.state;
      e.preventDefault();
      form.validateFieldsAndScroll((err, val) => {
         if (!err) {
            const value = { ...val };
            if (isNotBlank(addfileList) && addfileList.length > 0) {
               value.file = addfileList;
            }
            value.estiCompTime = moment(value.estiCompTime).format('YYYY-MM-DD');
            if (zrdataerji.length == 0) {
               message.warning('二级品类必填');
               return;
            } else if (zrdataerji.length > 0) {
               value.secondCategoryCode = zrdataerji[0].code;
               value.secondCategoryName = zrdataerji[0].name;
            }
            if (zrdatacj.length == 0) {
               message.warning('车间信息必填');
               return;
            } else if (zrdatacj.length > 0) {
               value.deptCode = zrdatacj[0].code;
               value.deptName = zrdatacj[0].name;
               value.siteName = zrdatacj[0].siteName;
               value.siteCode = zrdatacj[0].siteCode;
            }
            if (selectzr.length == 0) {
               message.warning('责任分类必填');
               return;
            } else {
               value.respType = isNotBlank(selectzr) && selectzr.length > 0 ? selectzr.map(item => item.value).join(',') : '';
            }
            if (selectzrbm.length == 0 && selectget.length == 0) {
               message.warning('责任部门必填');
               return;
            } else {
               value.respDept =
                  isNotBlank(selectzrbm) && selectzrbm.length > 0 ? selectzrbm.map(item => item.value).join(',') : isNotBlank(selectget) && selectget.length > 0 ? selectget.join(',') : '';
            }

            if (selectgjbm.length == 0 && selectzrgj.length == 0 && selectget.length == 0) {
               message.warning('跟进部门必填!');
               return;
            } else {
               value.followDept =
                  isNotBlank(selectgjbm) && selectgjbm.length > 0
                     ? selectgjbm.map(item => item.value).join(',')
                     : isNotBlank(selectzrgj) && selectzrgj.length > 0
                     ? selectzrgj.map(item => item.value).join(',')
                     : isNotBlank(selectget) && selectget.length > 0
                     ? selectget.join(',')
                     : '';
            }

            let respUserStr = isNotBlank(this.state.showimgsrc) && this.state.showimgsrc.map(item => item.qqID).join(',');
            if (isNotBlank(respUserStr)) {
               respUserStr = `,${respUserStr},`;
            }

            let mentionsIdArr = [];
            if (isNotBlank(value) && isNotBlank(value.exceptionInfo) && isNotBlank(mentionsIdArray) && mentionsIdArray.length > 0) {
               for (let i = 0; mentionsNameArray.length > 0 && i < mentionsNameArray.length; i += 1) {
                  if (isNotBlank(mentionsNameArray[i]) && value.exceptionInfo.indexOf(mentionsNameArray[i]) > -1) {
                     mentionsIdArr = [...mentionsIdArr, mentionsIdArray[i]];
                  }
               }
            }

            if (isNotBlank(mentionsIdArr) && mentionsIdArr.length > 0) {
               const ids = mentionsIdArr.map(item => item).join(',');
               value.mentions = ids;
            }

            value.respUserQ = respUserStr || '';

            const values = { ...value };

            values.resvStr2 = '1';
            dispatch({
               type: 'warning/add_wxWarning',
               payload: { ...values },
               callback: () => {
                  router.goBack();
               },
            });
         }
      });
   };

   handleCancel = () => this.setState({ previewVisible: false });

   handleImage = url => {
      this.setState({
         previewImage: url,
         previewVisible: true,
      });
   };

   handleUploadChange = info => {
      const isLt10M = info.file.size / 1024 / 1024 <= 10;
      if (isLt10M) {
         this.setState({ fileList: info.fileList });
      }
   };

   handlebeforeUpload = file => {
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
         message.error('文件大小需为10M以内');
      }
      if (isLt10M) {
         if (this.state.addfileList == null || this.state.addfileList === 'undefined' || this.state.addfileList.length <= 0) {
            this.setState({
               addfileList: [file],
            });
         } else {
            this.setState(({ addfileList }) => ({
               addfileList: [...addfileList, file],
            }));
         }
      }
      return false;
   };

   handleRemove = file => {
      const { dispatch } = this.props;
      const { data } = this.state;
      this.setState(({ fileList, addfileList }) => {
         const index = fileList.indexOf(file);
         const newFileList = fileList.slice();
         newFileList.splice(index, 1);

         const newaddfileList = addfileList.slice();
         newaddfileList.splice(index, 1);

         return {
            fileList: newFileList,
            addfileList: newaddfileList,
         };
      });
   };

   handlePreview = file => {
      // 预览点击
      this.setState({
         previewImage: file.url || file.thumbUrl,
         previewVisible: true,
      });
   };

   handleshowImgchange({ fileList }) {
      // 删除照片的回调
      this.setState({
         showimgsrc: fileList,
      });
   }

   handlePersonnelSelectRows(selectedRows) {
      // selectedRows.map(item => console.log(selectedRows))
      // 二级弹框的表格选择事件
      this.setState({
         SelectPersonnelRows: selectedRows,
      });
   }

   // checkMention = (value, callback) => {
   //     const mentions = getMentions(value);
   //     mentions.map(item => item.value)
   //     this.setState({ getMentions: mentions.map(item => item.value) })
   //     callback();
   // };
   speakSelectChange(value) {
      // 话术选择回调
      this.setState({
         speakValue: value,
      });
   }
   onMentionsSelect = option => {
      const { mentionsNameArray, mentionsIdArray } = this.state;
      this.setState({
         mentionsNameArray: [...mentionsNameArray, `@${option.value}`],
         mentionsIdArray: [...mentionsIdArray, option.id],
      });
   };

   showMhs = () => {
      this.setState({
         modalVisiblehs: true,
      });
   };
   handleModalVisibleerji = flag => {
      const { selecterji } = this.state;
      let newobj = this.deepCopy(selecterji);
      this.setState({
         modalVisibleerji: !!flag,
         zrdataerji: newobj,
      });
   };
   handleModalVisible = flag => {
      const { selectzr, getfenlei } = this.state;
      let newobj = this.deepCopy(selectzr);
      let newfenlei = this.deepCopy(getfenlei);
      this.setState({
         modalVisible: !!flag,
         zrdata: newobj,
         getfenlei: newfenlei,
      });
   };
   handleBaseClick(speak) {
      const { dispatch } = this.props;

      this.setState({
         checkedData: speak,
      });
   }
   handleModalVisiblezr = flag => {
      const { selectzrbm } = this.state;
      let newobj = this.deepCopy(selectzrbm);
      this.setState({
         modalVisiblezr: !!flag,
         zrdatazr: newobj,
      });
   };

   handleScondNameClick = scondname => {
      const { zrdata, getfenlei } = this.state;
      let newarr = zrdata;
      let getarr = this.deepCopy(getfenlei);
      if (newarr.length == 0) {
         newarr.push({ id: scondname.id, remarks: scondname.remarks, value: scondname.value });
         getarr.push(scondname.remarks);
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr.push({
               id: scondname.id,
               remarks: scondname.remarks,
               value: scondname.value,
            });
            getarr.push(scondname.remarks);
         } else {
            newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
            getarr.splice(getarr.indexOf(scondname.remarks), 1);
         }
      }

      this.setState({
         zrdata: newarr,
         getfenlei: getarr,
      });
      this.forceUpdate();
   };
   handleModalVisiblehs = flag => {
      const { addallzrdatahs } = this.state;
      let newobj = this.deepCopy(addallzrdatahs);
      this.setState({
         modalVisiblehs: !!flag,
         allzrdatahs: newobj,
      });
   };
   showMgj = () => {
      this.setState({
         modalVisiblegj: true,
      });
   };
   showMzr = () => {
      this.setState({
         modalVisiblezr: true,
      });
   };
   showM = () => {
      this.setState({
         modalVisible: true,
      });
   };
   showerji = () => {
      // ereji
      this.setState({
         modalVisibleerji: true,
      });
   };
   showMcj = () => {
      this.setState({
         modalVisiblecj: true,
      });
   };
   handleAddercj = () => {
      const { zrdatacj } = this.state;
      let newobj = this.deepCopy(zrdatacj);
      this.setState({
         modalVisiblecj: false,
         selectercj: newobj,
      });
   };
   // handleModalVisibleerji() {

   // }
   handleModalVisiblecj = flag => {
      this.setState({
         modalVisiblecj: false,
      });
   };

   handleScondNameClickcj(scondname) {
      const { zrdatacj } = this.state;
      let newarr = zrdatacj;
      if (newarr.length == 0) {
         newarr.push({
            id: scondname.id,
            code: scondname.code,
            name: scondname.name,
            siteName: scondname.siteName ? scondname.siteName : '',
            siteCode: scondname.siteCode ? scondname.siteCode : '',
         });
         this.setState({
            modalVisiblecj: true,
         });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr = [];
            newarr.push({
               id: scondname.id,
               code: scondname.code,
               name: scondname.name,
               siteName: scondname.siteName ? scondname.siteName : '',
               siteCode: scondname.siteCode ? scondname.siteCode : '',
            });
         } else {
            newarr = [];
         }
      }
      this.setState({
         zrdatacj: newarr,
         selectercj: newarr,
         modalVisiblecj: false,
      });
      this.forceUpdate();
   }

   handleModalVisiblegj = flag => {
      const { selectgjbm } = this.state;
      let newobj = this.deepCopy(selectgjbm);
      this.setState({
         modalVisiblegj: !!flag,
         zrdatagj: newobj,
      });
   };

   deepcopytwo(obj) {
      var newobj = obj.constructor === Array ? [] : {};
      if (typeof obj !== 'object') {
         return;
      }
      for (var i in obj) {
         newobj[i] = typeof obj[i] === 'object' ? this.deepcopytwo(obj[i]) : obj[i];
      }
      return newobj;
   }
   deepCopy = obj => {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
         if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
               result[key] = this.deepCopy(obj[key]); //递归复制
            } else {
               result[key] = obj[key];
            }
         }
      }
      return result;
   };
   handleScondNameClickgj = scondname => {
      const { zrdatagj } = this.state;
      let newarr = zrdatagj;
      if (newarr.length == 0) {
         newarr.push({ id: scondname.id, value: scondname.value });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr.push({ id: scondname.id, value: scondname.value });
         } else {
            newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
         }
      }
      this.setState({
         zrdatagj: newarr,
      });
      this.forceUpdate();
   };
   handleScondNameClickhs = scondname => {
      const { zrdatahs, allzrdatahs } = this.state;
      const { form } = this.props;
      if (isNotBlank(allzrdatahs) && isNotBlank(allzrdatahs.id) && allzrdatahs.id == scondname.id) {
         this.setState({
            allzrdatahs: {},
            modalVisiblehs: false,
            speakValue: '',
         });
         form.setFieldsValue({ exceptionInfo: '' });
      } else {
         this.setState({
            allzrdatahs: scondname,
            modalVisiblehs: false,
            speakValue: scondname.value,
         });
         form.setFieldsValue({ exceptionInfo: scondname.value });
      }
   };
   handleAdd = () => {
      const { zrdata, getfenlei } = this.state;
      let newobj = this.deepcopytwo(zrdata);
      let newfenlei = this.deepCopy(getfenlei);
      this.setState({
         modalVisible: false,
         selectzr: newobj,
         selectget: newfenlei,
      });
      // this.forceUpdate();
   };
   handleAddgj = () => {
      const { zrdatagj } = this.state;
      let newobj = this.deepcopytwo(zrdatagj);
      this.setState({
         modalVisiblegj: false,
         selectgjbm: newobj,
      });
      // this.forceUpdate();
   };
   handleAddzr = () => {
      const { zrdatazr } = this.state;
      let newobj = this.deepcopytwo(zrdatazr);
      this.setState({
         modalVisiblezr: false,
         selectzrbm: newobj,
         selectzrgj: newobj,
      });
      // this.forceUpdate();
   };
   handleScondNameClickzr = scondname => {
      const { zrdatazr } = this.state;
      let newarr = zrdatazr;
      if (newarr.length == 0) {
         newarr.push({ id: scondname.id, value: scondname.value });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr.push({ id: scondname.id, value: scondname.value });
         } else {
            newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
         }
      }
      this.setState({
         zrdatazr: newarr,
      });
      this.forceUpdate();
   };

   //--erji--
   handleAdderji = () => {
      const { zrdataerji } = this.state;
      let newobj = this.deepCopy(zrdataerji);
      this.setState({
         modalVisibleerji: false,
         selecterji: newobj,
      });
   };

   handleScondNameClickerji(scondname) {
      const { zrdataerji } = this.state;
      let newarr = zrdataerji;
      if (newarr.length == 0) {
         newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         this.setState({
            modalVisibleerji: true,
         });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr = [];
            newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         } else {
            newarr = [];
         }
      }

      this.setState({
         zrdataerji: newarr,
         selecterji: newarr,
         modalVisibleerji: false,
      });
      this.forceUpdate();
   }

   //--erji--
   handleAdderji = () => {
      const { zrdataerji } = this.state;
      let newobj = this.deepCopy(zrdataerji);
      this.setState({
         modalVisibleerji: false,
         selecterji: newobj,
      });
   };

   handleScondNameClickerji(scondname) {
      const { zrdataerji } = this.state;
      let newarr = zrdataerji;
      if (newarr.length == 0) {
         newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         this.setState({
            modalVisibleerji: true,
         });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr = [];
            newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         } else {
            newarr = [];
         }
      }

      this.setState({
         zrdataerji: newarr,
         selecterji: newarr,
         modalVisibleerji: false,
      });
      this.forceUpdate();
   }

   showerji = () => {
      this.setState({
         modalVisibleerji: true,
      });
   };

   handleModalVisibleerji = flag => {
      const { selecterji } = this.state;
      let newobj = this.deepCopy(selecterji);
      this.setState({
         modalVisibleerji: !!flag,
         zrdataerji: newobj,
      });
   };
   onDutySearch(value) {
      const { dispatch } = this.props;
      dispatch({
         // 责任部门
         type: 'dictionaryL/fetch',
         payload: { type: 'duty', current: 1, value: value },
      });
   }
   render() {
      const {
         fileList,
         previewVisible,
         previewImage,
         facevisible,
         departmentFailure,
         location,
         speakValue,
         ischecked,
         orderlist_pc,
         checkedData,
         checkedDataList,
         modalVisible,
         zrdata,
         selectzr,
         modalVisiblezr,
         zrdatazr,
         selectzrbm,
         modalVisiblegj,
         zrdatagj,
         selectgjbm,
         modalVisiblehs,
         zrdatahs,
         allzrdatahs,
         modalVisibleerji, // 二级
         zrdataerji,
         selecterji,
         modalVisibleercj, // 二级
         zrdatacj,
         modalVisiblecj,
         selectget,
         selectzrgj,
         selectercj,
      } = this.state;
      const {
         submitting,
         cpAssemblyFormGet,
         sysdeptList,
         departmentList,
         sysoffice: { data },
         warningDateil, //
         getSingleofId,
         getWorkShopList,
         getCommList, // 话术选择
         getScondNameList,
         findoneofIdBaygegiter,
      } = this.props;

      const sysdeptdataTree = sysdeptList.data.list; // 品类
      const {
         form: { getFieldDecorator },
      } = this.props;

      const createdFaceModalProps = {
         selectpersonnelvisible: facevisible,
         handleSelectPersonnelOk: this.onFaceOK.bind(this),
         handleSelectPersonnelCancel: this.onFaceCance.bind(this),
         selectedRows: this.state.SelectPersonnelRows,
         handleSelectRows: this.handlePersonnelSelectRows.bind(this),
      };
      const formItemLayout = {
         labelCol: {
            xs: { span: 0 },
            sm: { span: 5 },
         },
         wrapperCol: {
            xs: { span: 24 },
            sm: { span: 10 },
         },
      };
      const submitFormLayout = {
         wrapperCol: {
            xs: { span: 10, offset: 0 },
            sm: { span: 10, offset: 7 },
         },
      };
      const uploadButton = (
         <div>
            <Button className="ant-upload-text" type="primary" size="large">
               上传附件
               <Icon type="arrow-up" />
            </Button>
         </div>
      );

      const handleFileList = fileData => {
         this.setState({
            importFileList: fileData,
         });
      };

      const parentMethodserji = {
         handleAdderji: this.handleAdderji,
         handleModalVisibleerji: this.handleModalVisibleerji,
         getScondNameListerji: getScondNameList,
         modalVisibleerji,
         ischecked,
         zrdataerji,
         handleScondNameClickerji: this.handleScondNameClickerji.bind(this),
      };

      const parentMethodsgj = {
         handleAddgj: this.handleAddgj,
         handleModalVisiblegj: this.handleModalVisiblegj,
         departmentList,
         modalVisiblegj,
         ischecked,
         zrdatagj,
         handleScondNameClickgj: this.handleScondNameClickgj,
         onDutySearch: value => this.onDutySearch(value),
      };

      const parentMethodsercj = {
         handleAddercj: this.handleAddercj,
         handleModalVisiblecj: this.handleModalVisiblecj,
         getScondNameListercj: getWorkShopList, //
         modalVisiblecj,
         ischecked,
         zrdatacj,
         handleScondNameClickcj: this.handleScondNameClickcj.bind(this),
      };

      const parentMethods = {
         handleAdd: this.handleAdd,
         handleModalVisible: this.handleModalVisible,
         departmentFailure,
         modalVisible,
         ischecked,
         zrdata,
         handleScondNameClick: this.handleScondNameClick,
      };
      const parentMethodszr = {
         handleAddzr: this.handleAddzr,
         handleModalVisiblezr: this.handleModalVisiblezr,
         departmentList,
         modalVisiblezr,
         ischecked,
         zrdatazr,
         handleScondNameClickzr: this.handleScondNameClickzr,
         onDutySearch: value => this.onDutySearch(value),
      };

      const parentMethodshs = {
         handleAddhs: this.handleAddhs,
         handleModalVisiblehs: this.handleModalVisiblehs,
         getCommList,
         modalVisiblehs,
         ischecked,
         zrdatahs,
         allzrdatahs,
         handleScondNameClickhs: this.handleScondNameClickhs,
      };

      return (
         <PageHeaderWrapper
            content={
               <>
                  <Breadcrumb>
                     <Breadcrumb.Item style={{ fontWeight: 'blod', color: '#000' }}>
                        {isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.orderSelfNum)
                           ? findoneofIdBaygegiter.orderSelfNum
                           : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.orderSelfNum)
                           ? orderlist_pc.orderSelfNum
                           : ''}
                     </Breadcrumb.Item>
                     <Breadcrumb.Item style={{ fontWeight: 'blod', color: '#000' }}>
                        {isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.deptName) ? findoneofIdBaygegiter.deptName : ''}
                     </Breadcrumb.Item>
                  </Breadcrumb>
               </>
            }
         >
            <Card bordered={false}>
               <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }} layout="horizontal">
                  <FormItem label="订单Guid" style={{ display: 'none' }}>
                     {getFieldDecorator('oid', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.oid)
                              ? findoneofIdBaygegiter.oid
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.oid)
                              ? orderlist_pc.oid
                              : '',
                        rules: [
                           {
                              required: true,
                              message: '此字段为必填字段',
                           },
                        ],
                     })(<Input placeholder="请输入订单编号" disabled />)}
                  </FormItem>
                  <FormItem label="订单自编号" style={{ display: 'none' }}>
                     {getFieldDecorator('orderSelfNum', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.orderSelfNum)
                              ? findoneofIdBaygegiter.orderSelfNum
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.orderSelfNum)
                              ? orderlist_pc.orderSelfNum
                              : '',
                        rules: [
                           {
                              required: true,
                              message: '此字段为必填字段',
                           },
                        ],
                     })(<Input placeholder="请输入订单编号" disabled />)}
                  </FormItem>
                  <FormItem label="Wcc编号" style={{ display: 'none' }}>
                     {getFieldDecorator('wccNum', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.wccNum)
                              ? findoneofIdBaygegiter.wccNum
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.wccNum)
                              ? orderlist_pc.wccNum
                              : '',
                        rules: [
                           {
                              required: true,
                              message: '此字段为必填字段',
                           },
                        ],
                     })(<Input placeholder="请输入订单编号" disabled />)}
                  </FormItem>
                  <FormItem label="品类名称" style={{ display: 'none' }}>
                     {getFieldDecorator('buName', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.buName)
                              ? findoneofIdBaygegiter.buName
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.buName)
                              ? orderlist_pc.buName
                              : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类名称" />)}
                  </FormItem>
                  <FormItem label="品类编码" style={{ display: 'none' }}>
                     {getFieldDecorator('buCode', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.buCode)
                              ? findoneofIdBaygegiter.buCode
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.buCode)
                              ? orderlist_pc.buCode
                              : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类编码" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="二级品类">
                     <Input value={isNotBlank(zrdataerji) && zrdataerji.length > 0 ? zrdataerji[0].name : []} onClick={this.showerji} />
                  </FormItem>
                  <FormItem {...formItemLayout} label="车间">
                     <Input value={isNotBlank(zrdatacj) && zrdatacj.length > 0 ? zrdatacj[0].name : []} onClick={this.showMcj} />
                  </FormItem>

                  <Button className={styles.button_person} type="primary" size="large" onClick={e => this.showMhs(e)} style={{ marginBottom: '20px', marginLeft: '230px' }}>
                     选择话术
                  </Button>

                  <FormItem label="品类名称" {...formItemLayout} style={{ display: 'none' }}>
                     {getFieldDecorator('buName', {
                        initialValue: isNotBlank(getSingleofId) && isNotBlank(getSingleofId.buName) ? getSingleofId.buName : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类名称" />)}
                  </FormItem>
                  <FormItem label="品类编码" {...formItemLayout} style={{ display: 'none' }}>
                     {getFieldDecorator('buCode', {
                        initialValue: isNotBlank(getSingleofId) && isNotBlank(getSingleofId.buCode) ? getSingleofId.buCode : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类编码" />)}
                  </FormItem>

                  <FormItem label="品类名称" style={{ display: 'none' }}>
                     {getFieldDecorator('buName', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.buName)
                              ? findoneofIdBaygegiter.buName
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.buName)
                              ? orderlist_pc.buName
                              : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类名称" />)}
                  </FormItem>
                  <FormItem label="品类编码" style={{ display: 'none' }}>
                     {getFieldDecorator('buCode', {
                        initialValue:
                           isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.buCode)
                              ? findoneofIdBaygegiter.buCode
                              : isNotBlank(orderlist_pc) && isNotBlank(orderlist_pc.buCode)
                              ? orderlist_pc.buCode
                              : '',
                        rules: [
                           {
                              required: false,
                              message: '',
                           },
                        ],
                     })(<Input placeholder="请输入品类编码" />)}
                  </FormItem>

                  <FormItem label="基地名称" {...formItemLayout} style={{ display: 'none' }}>
                     {getFieldDecorator('siteName', {
                        initialValue: isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.siteName) ? findoneofIdBaygegiter.siteName : '',
                     })(<Input placeholder="请输入基地名称" />)}
                  </FormItem>
                  <FormItem label="基地编码" {...formItemLayout} style={{ display: 'none' }}>
                     {getFieldDecorator('siteCode', {
                        initialValue: isNotBlank(findoneofIdBaygegiter) && isNotBlank(findoneofIdBaygegiter.siteCode) ? findoneofIdBaygegiter.siteCode : '',
                     })(<Input placeholder="请输入基地编码" />)}
                  </FormItem>

                  {isNotBlank(location.query) && isNotBlank(location.query.msg) && location.query.msg == 'colse' ? (
                     <FormItem {...formItemLayout} label="关闭备注">
                        {getFieldDecorator('exceptionInfo', {
                           initialValue: '',
                           rules: [
                              {
                                 required: true, // 是否必填
                                 message: '请输入信息',
                                 max: 64,
                              },
                           ],
                        })(<TextArea style={{ minHeight: 32 }} placeholder="请输入关闭备注" rows={6} />)}
                     </FormItem>
                  ) : (
                     <div>
                        <FormItem {...formItemLayout} label="请录入信息">
                           {getFieldDecorator('exceptionInfo', {
                              initialValue: '',
                              rules: [
                                 {
                                    required: true, // 是否必填
                                    message: '字节不超过2000位',
                                    max: 2000,
                                 },
                              ],
                           })(
                              <Mentions rows="6" onSelect={this.onMentionsSelect} placeholder="请输入信息,使用@圈出人员用于提醒" prefix={['@']}>
                                 {isNotBlank(this.state.tableData) &&
                                    isNotBlank(this.state.tableData.list) &&
                                    this.state.tableData.list.map(item => (
                                       <Option value={`${item.name}(${item.mobile})`} key={item.id} id={item.id}>
                                          {`${item.name}(${item.mobile})`}
                                       </Option>
                                    ))}
                              </Mentions>
                           )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="预计完成时间">
                           {getFieldDecorator('estiCompTime', {
                              initialValue: moment(new Date(new Date().valueOf() + 1 * 24 * 60 * 60 * 1000), 'YYYY/MM/DD'),
                              rules: [],
                           })(<DatePicker placeholder="请选择凭证日期" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                        </FormItem>
                     </div>
                  )}

                  <FormItem label="责任分类" {...formItemLayout}>
                     <Select
                        open={false}
                        dropdownClassName={styles.select_none}
                        dropdownMatchSelectWidth={false}
                        mode="multiple"
                        allowClear={false}
                        removeIcon={function() {
                           return '';
                        }}
                        value={isNotBlank(selectzr) && selectzr.length > 0 ? selectzr.map(res => res.id) : []}
                        onDropdownVisibleChange={this.showM}
                     >
                        {isNotBlank(departmentFailure) &&
                           isNotBlank(departmentFailure.list) &&
                           departmentFailure.list.map(item => {
                              return (
                                 <Option key={item.id} value={item.id} label={item.value}>
                                    {item.value}
                                 </Option>
                              );
                           })}
                     </Select>
                  </FormItem>
                  <FormItem label="责任部门" {...formItemLayout}>
                     <Select
                        open={false}
                        dropdownClassName={styles.select_none}
                        dropdownMatchSelectWidth={false}
                        value={isNotBlank(selectzrbm) && selectzrbm.length > 0 ? selectzrbm.map(res => res.id) : isNotBlank(selectget) && selectget.length > 0 ? selectget : []}
                        mode="multiple"
                        allowClear={false}
                        removeIcon={function() {
                           return '';
                        }}
                        onDropdownVisibleChange={this.showMzr}
                     >
                        {departmentList &&
                           departmentList.list &&
                           departmentList.list.map((item, index) => {
                              return (
                                 <Option key={item.id} value={item.id} label={item.value}>
                                    {item.value}
                                 </Option>
                              );
                           })}
                     </Select>
                  </FormItem>
                  <FormItem label="跟进部门" {...formItemLayout}>
                     <Select
                        open={false}
                        dropdownClassName={styles.select_none}
                        dropdownMatchSelectWidth={false}
                        value={
                           isNotBlank(selectgjbm) && selectgjbm.length > 0
                              ? selectgjbm.map(res => res.id)
                              : isNotBlank(selectzrgj) && selectzrgj.length > 0
                              ? selectzrgj.map(res => res.id)
                              : isNotBlank(selectget) && selectget.length > 0
                              ? selectget
                              : []
                        }
                        mode="multiple"
                        allowClear={false}
                        removeIcon={function() {
                           return '';
                        }}
                        onDropdownVisibleChange={this.showMgj}
                     >
                        {departmentList &&
                           departmentList.list &&
                           departmentList.list.map((item, index) => {
                              return (
                                 <Option key={item.id} value={item.id} label={item.value}>
                                    {item.value}
                                 </Option>
                              );
                           })}
                     </Select>
                  </FormItem>
                  <FormItem>
                     <Divider />
                     <Row>
                        <Col offset={3} span={24}>
                           <Button
                              type="primary"
                              size="large"
                              onClick={e => {
                                 this.select_person(e);
                              }}
                           >
                              选择跟进人
                           </Button>
                        </Col>
                        <Col offset={3} span={24}>
                           <Upload
                              fileList={this.state.showimgsrc.length > 0 ? this.state.showimgsrc : []}
                              listType="picture-card"
                              onChange={fileList => {
                                 this.handleshowImgchange(fileList);
                              }}
                           />
                        </Col>
                     </Row>
                  </FormItem>
                  <FormItem>
                     <Divider />
                     <Row>
                        <Col offset={3} span={24}>
                           <Upload
                              accept=".xls,.xlsx,.xlsm"
                              onChange={this.handleUploadChange}
                              onRemove={this.handleRemove}
                              beforeUpload={this.handlebeforeUpload}
                              fileList={this.state.fileList}
                              listType="text"
                              // onPreview={this.handlePreview}
                           >
                              {uploadButton}
                           </Upload>
                        </Col>
                     </Row>
                     <Divider />
                  </FormItem>
                  <Row>
                     <Col offset={10}>
                        <Button type="primary" loading={submitting} size="large" htmlType="submit">
                           提交
                        </Button>
                     </Col>
                  </Row>
               </Form>
            </Card>

            <SelectPersonnel {...createdFaceModalProps} />

            <CreateFormcj {...parentMethodsercj} modalVisiblecj={modalVisiblecj} />
            <CreateFormerji {...parentMethodserji} modalVisibleerji={modalVisibleerji} />
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
            <CreateFormzr {...parentMethodszr} modalVisiblezr={modalVisiblezr} />
            <CreateFormgj {...parentMethodsgj} modalVisiblegj={modalVisiblegj} />
            <CreateFormhs {...parentMethodshs} modalVisiblehs={modalVisiblehs} />
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
               <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
         </PageHeaderWrapper>
      );
   }
}

export default Abnormal_form;

/**
 *  批量处理
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Card, InputNumber, Radio, message, Icon, Upload, Modal, TreeSelect, DatePicker, Row, Col, List, Avatar, Descriptions, Tree, Divider, Mentions, Breadcrumb } from 'antd';
import classnames from 'classnames';
import router from 'umi/router';
import { isNotBlank, getFullUrl, getLocation, encode, ObjTostr } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import className from 'classnames';
import { getStorage } from '../../utils/localStorageUtils';
import { SelectPersonnel } from './department';
import iconstyle from './icon_type_folder.less';
import moment from 'moment';
import styles from './ErrorCommunication.less';
import { stringify } from 'qs';
const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const { getMentions } = Mentions; // 提及

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
         bodyStyle={{
            padding: '24px',
            fontSize: '14px',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            maxHeight: '300px',
            overflowY: 'scroll',
         }}
         title="选择车间"
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
                        className={styles.Flex_item}
                        key={scondname.id}
                        className={isNotBlank(zrdatacj) && isNotBlank(zrdatacj.id) && zrdatacj.some(item => item.id == scondname.id) ? classnames(styles.Flex_item, ischecked) : classnames(styles.Flex_item)}
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
         maxHeight="300px"
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
               departmentFailure.length > 0 &&
               departmentFailure.map(scondname => {
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
         title="选择话术"
         visible={modalVisiblehs}
         // onOk={okHandle}
         footer={null}
         onCancel={() => handleModalVisiblehs()}
         width="50%"
      >
         <div className={styles.flex_item_style}>
            {isNotBlank(getCommList) &&
               isNotBlank(getCommList) &&
               getCommList.length > 0 &&
               getCommList.map(scondname => {
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

@connect(({ dictionaryL, loading, sysdeptList, sysoffice, warning, sysuser, communication, speaklist }) => ({
   ...dictionaryL,
   ...communication,
   sysdeptList,
   sysoffice,
   ...sysuser,
   ...warning,
   ...speaklist,
   userloading: loading.models.sysuser,
   submitting: loading.effects['warning/addwarninglist'],
}))
@Form.create()
class BatchDisposeForm extends PureComponent {
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
      getfenlei: [],
      selectget: [],
      selectzrgj: [],
   };

   componentDidMount() {
      const { dispatch } = this.props;
      const { location } = this.state;
      dispatch({
         // 责任部门
         type: 'dictionaryL/fetch',
         payload: { type: 'duty', current: 1, pageSize: 500 },
      });
      dispatch({
         // 获取话术
         type: 'communication/batchgetCommunicationByUser',
         payload: { current: 1, pageSize: 500 },
      });
      dispatch({
         // 责任分类
         type: 'communication/batchgetFailureByUser',
         payload: { current: 1, pageSize: 500 },
         callback: data => {
            this.setState({
               departmentFailure: data,
            });
         },
      });
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
   }

   // 关闭页面清除数据
   componentWillUnmount() {
      const { dispatch, form } = this.props;
      const { location } = this.state;

      form.resetFields();
   }

   onCancelCancel = () => {
      router.goBack();
   };

   onFaceCance() {
      // 人员选择取消
      this.setState({ facevisible: false });
   }

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

   handleSubmit = e => {
      const { dispatch, form, add_selectdata_comm, add_selectdata_obj } = this.props;
      console.log('add_selectdata_obj', add_selectdata_obj);
      console.log('add_selectdata_comm', add_selectdata_comm);
      const { addfileList, location, mentionsNameArray, mentionsIdArray, selectget, selectzr, selectzrbm, selectgjbm, selectzrgj } = this.state;
      e.preventDefault();
      form.validateFieldsAndScroll((err, val) => {
         if (!err) {
            const value = { ...val };
            if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
               value.file = addfileList;
            }
            // if (
            //     isNotBlank(value.deptName) &&
            //     isNotBlank(value.deptName.value) &&
            //     isNotBlank(value.deptName.label)
            // ) {
            //     value.deptCode = value.deptName.value;
            //     value.deptName = value.deptName.label;
            // } else {
            //     value.deptName = '';
            //     value.deptCode = ''
            // }

            // if (
            //     isNotBlank(value.secondCategoryName) &&
            //     isNotBlank(value.secondCategoryName.value) &&
            //     isNotBlank(value.secondCategoryName.label)
            // ) {
            //     value.secondCategoryCode = value.secondCategoryName.value;
            //     value.secondCategoryName = value.secondCategoryName.label;
            // } else {
            //     value.secondCategoryName = '';
            // }
            if (value.estiCompTime) {
               value.estiCompTime = moment(value.estiCompTime).format('YYYY-MM-DD');
            }
            if (value.compTime) {
               value.compTime = moment(value.compTime).format('YYYY-MM-DD');
            }

            let mentionsIdArr = [];
            if (isNotBlank(value) && isNotBlank(value.commInfo) && isNotBlank(mentionsIdArray) && mentionsIdArray.length > 0) {
               for (let i = 0; mentionsNameArray.length > 0 && i < mentionsNameArray.length; i += 1) {
                  if (isNotBlank(mentionsNameArray[i]) && value.commInfo.indexOf(mentionsNameArray[i]) > -1) {
                     mentionsIdArr = [...mentionsIdArr, mentionsIdArray[i]];
                  }
               }
            }
            if (isNotBlank(mentionsIdArr) && mentionsIdArr.length > 0) {
               const ids = mentionsIdArr.map(item => item).join(',');
               value.mentions = ids;
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
               value.respDept = isNotBlank(selectzrbm) && selectzrbm.length > 0 ? selectzrbm.map(item => item.value).join(',') : isNotBlank(selectget) && selectget.length > 0 ? selectget.join(',') : '';
            }
            if (selectgjbm.length == 0 && selectzrgj.length == 0 && selectget.length == 0) {
               message.warning('跟进部门必填!');
               return;
            } else {
               value.followDept =
                  isNotBlank(selectgjbm) && selectgjbm.length > 0 ? selectgjbm.map(item => item.value).join(',') : isNotBlank(selectzrgj) && selectzrgj.length > 0 ? selectzrgj.map(item => item.value).join(',') : isNotBlank(selectget) && selectget.length > 0 ? selectget.join(',') : '';
            }

            const values = { ...value };

            if (isNotBlank(location.query) && location.query.msg === 'comm') {
               if (JSON.stringify(add_selectdata_obj) !== '{}' && add_selectdata_obj.isCheckAllSearch == true && add_selectdata_obj.formValues !== '{}') {
                  values.resvStr4 = 1; // 全选
                  values.resvStr3 = encode(JSON.stringify(ObjTostr(add_selectdata_obj.formValues))); // 转为base64

                  dispatch({
                     type: 'warning/batch_recordOnecomm',
                     payload: { ...values },
                     callback: () => {
                        router.goBack();
                     },
                  });
               } else {
                  values.exceptionId = isNotBlank(add_selectdata_comm) && add_selectdata_comm.length > 0 ? add_selectdata_comm.join(',') : '';
                  dispatch({
                     type: 'warning/batch_recordOnecomm',
                     payload: { ...values },
                     callback: () => {
                        router.goBack();
                     },
                  });
               }
            } else if (isNotBlank(location.query) && location.query.msg === 'close') {
               if (JSON.stringify(add_selectdata_obj) !== '{}' && add_selectdata_obj.isCheckAllSearch == true && add_selectdata_obj.formValues !== '{}') {
                  values.resvStr4 = 1; // 全选
                  values.resvStr3 = encode(JSON.stringify(ObjTostr(add_selectdata_obj.formValues))); // 转为base64
                  values.status = 1;
                  dispatch({
                     type: 'warning/exceptionclose',
                     payload: { ...values },
                     callback: () => {
                        router.push('/Warning');
                     },
                  });
               } else {
                  values.exceptionId = isNotBlank(add_selectdata_comm) && add_selectdata_comm.length > 0 ? add_selectdata_comm.join(',') : '';

                  values.status = 1;
                  dispatch({
                     type: 'warning/exceptionclose',
                     payload: { ...values },
                     callback: () => {
                        router.push('/Warning');
                     },
                  });
               }
            }
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
      // 二级弹框的表格选择事件
      this.setState({
         SelectPersonnelRows: selectedRows,
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
   handleModalVisiblegj = flag => {
      const { selectgjbm } = this.state;
      let newobj = this.deepCopy(selectgjbm);
      this.setState({
         modalVisiblegj: !!flag,
         zrdatagj: newobj,
      });
   };

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
         form.setFieldsValue({ commInfo: '' });
      } else {
         this.setState({
            allzrdatahs: scondname,
            modalVisiblehs: false,
            speakValue: scondname.value,
         });
         form.setFieldsValue({ commInfo: scondname.value });
      }
   };
   handleAdd = () => {
      const { zrdata, getfenlei } = this.state;
      let newobj = this.deepCopy(zrdata);
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
      let newobj = this.deepCopy(zrdatagj);
      this.setState({
         modalVisiblegj: false,
         selectgjbm: newobj,
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
   handleAddzr = () => {
      const { zrdatazr } = this.state;
      let newobj = this.deepCopy(zrdatazr);
      this.setState({
         modalVisiblezr: false,
         selectzrbm: newobj,
         selectzrgj: newobj,
      });
      // this.forceUpdate();
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
   // handleModalVisibleerji() {

   // }
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

         // }
         // newarr.splice(newarr.indexOf(scondname.id),1)
      }
      // if (!newarr.some((item,index,arr)=> arr.indexOf(item.id))) {}
      //     newarr.push({id:scondname.id,code:scondname.code } )
      this.setState({
         zrdataerji: newarr,
         selecterji: newarr,
         modalVisibleerji: false,
      });
      this.forceUpdate();
   }

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
         newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         this.setState({
            modalVisiblecj: true,
         });
      } else {
         if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
            newarr = [];
            newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
         } else {
            newarr = [];
         }
         // }
         // newarr.splice(newarr.indexOf(scondname.id),1)
      }
      // if (!newarr.some((item,index,arr)=> arr.indexOf(item.id))) {}
      //     newarr.push({id:scondname.id,code:scondname.code } )
      this.setState({
         zrdatacj: newarr,
         selectercj: newarr,
         modalVisiblecj: false,
      });
      this.forceUpdate();
   }
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
         tableData, // 责任人
         speakValue,
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
         selecterji, // 选中
         ischecked,
         modalVisiblecj, // 二级
         zrdatacj,
         selectcj,
         selectget,
         selectzrgj,
      } = this.state;
      const {
         submitting,
         cpAssemblyFormGet,
         sysdeptList,
         departmentList,
         getFailureByUser,
         sysoffice: { data },
         warningDateil,
         AddOnerecord, // 沟通传递的值
         getSingleofId,
         getWorkShopList, // 车间
         getCommunicationByUser,
         getScondNameList,
         add_selectdata_comm,
         add_selectdata_obj,
      } = this.props;
      const sysdeptdataTree = sysdeptList.data.list; // 品类

      const {
         form: { getFieldDecorator },
      } = this.props;

      const createdFaceModalProps = {
         selectpersonnelvisible: facevisible,
         handleSelectPersonnelOk: this.onFaceOK.bind(this),
         handleSelectPersonnelCancel: this.onFaceCance.bind(this),
         loading: this.props.userloading,
         selectedRows: this.state.SelectPersonnelRows,
         data: this.state.tableData ? this.state.tableData : { list: [] },
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

      const parentMethods = {
         handleAdd: this.handleAdd,
         handleModalVisible: this.handleModalVisible,
         departmentFailure: getFailureByUser,
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

      const parentMethodshs = {
         handleAddhs: this.handleAddhs,
         handleModalVisiblehs: this.handleModalVisiblehs,
         getCommList: getCommunicationByUser,
         modalVisiblehs,
         ischecked,
         zrdatahs,
         allzrdatahs,
         handleScondNameClickhs: this.handleScondNameClickhs,
      };

      const parentMethodsercj = {
         handleAddercj: this.handleAddercj,
         handleModalVisiblecj: this.handleModalVisiblecj,
         getScondNameListercj: getWorkShopList,
         modalVisiblecj,
         ischecked,
         zrdatacj,
         handleScondNameClickcj: this.handleScondNameClickcj.bind(this),
      };

      return (
         <PageHeaderWrapper>
            <Card bordered={false}>
               <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }} layout="horizontal">
                  {/* <FormItem label="订单Guid" {...formItemLayout} style={{ display: 'none' }}>
                            {getFieldDecorator('oid', {
                                initialValue:
                                    isNotBlank(warningDateil) && isNotBlank(warningDateil.oid)
                                        ? warningDateil.oid
                                        : isNotBlank(AddOnerecord) && isNotBlank(AddOnerecord.oid)
                                            ? AddOnerecord.oid
                                            : isNotBlank(getSingleofId) && isNotBlank(getSingleofId.oid)
                                                ? getSingleofId.oid
                                                : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="订单Guid" disabled />)}
                        </FormItem>
                        <FormItem
                            label="订单自编号"
                            {...formItemLayout}
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('orderSelfNum', {
                                initialValue: isNotBlank(getSingleofId) &&
                                    isNotBlank(getSingleofId.orderSelfNum)
                                    ? getSingleofId.orderSelfNum
                                    : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                        </FormItem>
                        <FormItem label="Wcc编号" {...formItemLayout} style={{ display: 'none' }}>
                            {getFieldDecorator('wccNum', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.wccNum)
                                        ? getSingleofId.wccNum
                                        : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                            <FormItem label="二级品类" style={{ display: 'none' }}>
                                {getFieldDecorator('secondCategoryName', {
                                    initialValue:
                                        isNotBlank(getSingleofId) &&
                                            isNotBlank(getSingleofId.secondCategoryName) &&
                                            isNotBlank(getSingleofId.secondCategoryCode)
                                            ? {
                                                value: getSingleofId.secondCategoryCode,
                                                label: getSingleofId.secondCategoryName,
                                            }
                                            : {},
                                    rules: [{ required: true, message: '二级品类为必选字段' }],
                                })(
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        labelInValue
                                        allowClear
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        // treeData={getScondNameList}
                                        placeholder="选择品类"
                                        treeDefaultExpandAll
                                    />
                                )}
                            </FormItem>
                        </FormItem>
                        <FormItem {...formItemLayout} label="车间" style={{ display: 'none' }}>
                            {getFieldDecorator('deptName', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.deptName) &&
                                        isNotBlank(getSingleofId.deptCode)
                                        ? {
                                            value: getSingleofId.deptCode,
                                            label: getSingleofId.deptName,
                                        }
                                        : { value: '', label: '' },
                                rules: [{ required: true, message: '车间为必选字段' }],
                            })(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    labelInValue
                                    allowClear
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    // treeData={getWorkShopList}
                                    placeholder="请选择车间"
                                    treeDefaultExpandAll
                                />
                            )}
                        </FormItem>
                        <FormItem label="品类名称" {...formItemLayout} style={{ display: 'none' }}>
                            {getFieldDecorator('buName', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.buName)
                                        ? getSingleofId.buName
                                        : '',
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
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.buCode)
                                        ? getSingleofId.buCode
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
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.siteName)
                                        ? getSingleofId.siteName
                                        : '',
                            })(<Input placeholder="请输入基地名称" />)}
                        </FormItem>
                        <FormItem label="基地编码" {...formItemLayout} style={{ display: 'none' }}>
                            {getFieldDecorator('siteCode', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                        isNotBlank(getSingleofId.siteCode)
                                        ? getSingleofId.siteCode : '',
                            })(<Input placeholder="请输入基地编码" />)}
                        </FormItem> */}

                  <Button className={styles.button_person} type="primary" size="large" onClick={e => this.showMhs(e)} style={{ marginBottom: '8px', marginLeft: '230px' }}>
                     选择话术
                  </Button>
                  {isNotBlank(location.query) && isNotBlank(location.query.msg) && location.query.msg == 'close' ? (
                     <div>
                        <FormItem {...formItemLayout} label="关闭备注">
                           {getFieldDecorator('commInfo', {
                              initialValue: isNotBlank(getSingleofId) && isNotBlank(getSingleofId.commInfo) ? getSingleofId.commInfo : '',
                              rules: [
                                 {
                                    required: true, // 是否必填
                                    message: '请输入信息',
                                    max: 64,
                                 },
                              ],
                           })(<TextArea style={{ minHeight: 32 }} placeholder="请输入关闭备注" rows={6} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="实际完成时间">
                           {getFieldDecorator('compTime', {
                              initialValue: moment(new Date(new Date().valueOf() + 1 * 24 * 60 * 60 * 1000), 'YYYY/MM/DD'),
                              rules: [],
                           })(<DatePicker placeholder="请选择凭证日期" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                        </FormItem>
                     </div>
                  ) : (
                     <div>
                        <FormItem {...formItemLayout} label="请录入信息">
                           {getFieldDecorator('commInfo', {
                              initialValue: '',
                              rules: [
                                 {
                                    required: true, // 是否必填
                                    message: '字节不超过2000位',
                                    max: 2000,
                                 },
                              ],
                           })(
                              <Mentions rows="3" onSelect={this.onMentionsSelect} placeholder="请输入信息,使用@圈出人员用于提醒">
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

                  <FormItem {...formItemLayout} label="责任分类">
                     <Select
                        open={false}
                        dropdownClassName={styles.select_none}
                        dropdownMatchSelectWidth={false}
                        mode="multiple"
                        allowClear={false}
                        removeIcon={function() {
                           return '';
                        }}
                        value={isNotBlank(selectzr) && selectzr.length > 0 ? selectzr.map(res => res.id) : isNotBlank(getSingleofId) && isNotBlank(getSingleofId.respType) ? getSingleofId.respType.split(',') : []}
                        onDropdownVisibleChange={this.showM}
                     >
                        {isNotBlank(getFailureByUser) &&
                           isNotBlank(getFailureByUser.length > 0) &&
                           getFailureByUser.map(item => {
                              return (
                                 <Option key={item.id} value={item.id} label={item.label}>
                                    {item.value}
                                 </Option>
                              );
                           })}
                     </Select>
                  </FormItem>

                  <FormItem {...formItemLayout} label="责任部门">
                     <Select
                        dropdownClassName={styles.select_none}
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
                  <FormItem {...formItemLayout} label="跟进部门">
                     <Select
                        dropdownClassName={styles.select_none}
                        value={isNotBlank(selectgjbm) && selectgjbm.length > 0 ? selectgjbm.map(res => res.id) : isNotBlank(selectzrgj) && selectzrgj.length > 0 ? selectzrgj.map(res => res.id) : isNotBlank(selectget) && selectget.length > 0 ? selectget : []}
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
                  <FormItem style={{ display: 'none' }}>
                     <Divider />
                     <Row>
                        <Col offset={3} span={24}>
                           {isNotBlank(location.query) && isNotBlank(location.query.msg) && location.query.msg == 'close' ? (
                              ' '
                           ) : (
                              <Button
                                 type="dashed"
                                 size="large"
                                 type="primary"
                                 onClick={e => {
                                    this.setState({ facevisible: true });
                                 }}
                              >
                                 选择跟进人
                              </Button>
                           )}
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

            <SelectPersonnel {...createdFaceModalProps} isModifier={false} />

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

export default BatchDisposeForm;

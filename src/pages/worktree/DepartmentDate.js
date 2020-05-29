/**
 *  权限管理  人员调整
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import { Link } from 'dva/router';
import { Row, Col, Form, Input, Button, Modal, message, Layout, Tree, TreeSelect, DatePicker, Switch, Upload, Icon, Select, Tag, InputNumber } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DepartmentDate.less';
import { Flex } from 'antd-mobile';

const { Content, Sider } = Layout;
const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
   Object.keys(obj)
      .map(key => obj[key])
      .join(',');

@connect(sysuser => {
   return {
      sysuser,
   };
})
@Form.create()
export class UpdateForm extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         selectedRows: [],
         formValues: {},
      };
   }
   componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
         type: 'sysuser/fetch',
      });
   }
   handleNext = () => {
      // 弹出层的确定点击事件
      const { form, handleStaffAdd, facilityId, status } = this.props;
      const { selectedRows } = this.state;
      if (isNotBlank(selectedRows) && selectedRows.length > 0 && isNotBlank(facilityId)) {
         const value = {
            officeIds: selectedRows.map(row => row.id).join(','),
            'office.id': facilityId,
         };

         handleStaffAdd(value);
      } else {
         message.error('请先选择所需要添加到对应工作区的人员');
      }
   };

   disabledEndDate = endValue => {
      const startValue = moment().startOf('day');
      if (!endValue || !startValue) {
         return false;
      }
      return endValue.valueOf() < startValue.valueOf();
   };

   renderFooter = () => {
      const { handleModalStaffVisible, confirmStaffLoading, values, equiName, form } = this.props;
      return (
         <>
            <Button style={{ marginTop: 8 }} size="small" key="cancel" onClick={() => handleModalStaffVisible(false, values)}>
               取消
            </Button>
            <Button size="small" key="forward" type="primary" loading={confirmStaffLoading} onClick={() => this.handleNext()}>
               确定
            </Button>
         </>
      );
   };
   handleSelectRows = rows => {
      this.setState({
         selectedRows: rows,
      });
   };
   handleSearch = e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      form.validateFields((err, fieldsValue) => {
         if (err) return;
         const values = {
            ...fieldsValue,
         };
         this.setState({
            formValues: values,
         });

         dispatch({
            type: 'sysuser/fetch',
            payload: values,
         });
      });
   };

   handleStandardTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const { formValues } = this.state;
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
         const newObj = { ...obj };
         newObj[key] = getValue(filtersArg[key]);
         return newObj;
      }, {});

      const params = {
         current: pagination.current,
         pageSize: pagination.pageSize,
         ...formValues,
         ...filters,
      };
      if (sorter.field) {
         params.sorter = `${sorter.field}_${sorter.order}`;
      }
      dispatch({
         type: 'sysuser/fetch',
         payload: { ...params },
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
      // dispatch({
      //     type: 'staff/staff_List',
      //     payload: { ...params },
      // });
   };

   handleFormReset = () => {
      const { form, dispatch } = this.props;
      form.resetFields();
      this.setState({
         formValues: {},
      });
      dispatch({
         type: 'sysuser/fetch',
      });
   };

   render() {
      const {
         confirmStaffLoading,
         updateModalVisible,
         form: { getFieldDecorator },
         handleModalStaffVisible,
         staffList,
         deptNotPageList,
         sysuser,
         loading,
      } = this.props;
      const { selectedRows } = this.state;
      const tableData = sysuser.sysuser.data;

      const columns = [
         {
            title: '姓名',
            dataIndex: 'name',
            width: 150,
         },
         {
            title: '性别',
            dataIndex: 'sex',
            width: 150,
            render: text => {
               if (isNotBlank(text)) {
                  return <span>{text}</span>;
               }
               return '';
            },
         },
         {
            title: '电话',
            dataIndex: 'mobile',
            width: 150,
         },

         {
            title: '所属基地',
            dataIndex: '',
            width: 150,
         },
      ];
      return (
         <Modal width={860} bodyStyle={{ padding: '10px' }} destroyOnClose title="增加基地授权" visible={updateModalVisible} confirmLoading={confirmStaffLoading} footer={this.renderFooter()} onCancel={() => handleModalStaffVisible(false)} afterClose={() => handleModalStaffVisible()}>
            <Form onSubmit={this.handleSearch} layout="inline">
               <Row gutter={8}>
                  <Col md={6} sm={24}>
                     <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="电话" size="small" style={{ width: '100%' }}>
                        {getFieldDecorator('mobile', {
                           initialValue: '',
                        })(<Input placeholder="请输入电话" size="small" />)}
                     </FormItem>
                  </Col>
                  <Col md={4} sm={24}>
                     <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="名称" size="small">
                        {getFieldDecorator('name', {
                           initialValue: '',
                        })(<Input size="small" placeholder="请输入人员名称" />)}
                     </FormItem>
                  </Col>
                  <Col md={4} sm={24}>
                     <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="性别" size="sex">
                        {getFieldDecorator('sex', {
                           initialValue: '',
                        })(
                           <Select style={{ width: '100%' }} placeholder="请选择性别">
                              <Option key="" value="">
                                 全部
                              </Option>
                              <Option key="男" value="男">
                                 男
                              </Option>
                              <Option key="女" value="女">
                                 女
                              </Option>
                           </Select>
                        )}
                     </FormItem>
                  </Col>

                  <Col md={6} sm={24} style={{ marginTop: 8 }}>
                     <span>
                        <Button type="primary" size="small" htmlType="submit">
                           查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} size="small" onClick={this.handleFormReset}>
                           重置
                        </Button>
                     </span>
                  </Col>
               </Row>
            </Form>

            <StandardTable loading={loading} bordered rowKey="id" size="small" scroll={{ x: 960 }} selectedRows={selectedRows} data={tableData ? tableData : []} pageSizeFalse="true" columns={columns} onSelectRow={this.handleSelectRows} onChange={this.handleStandardTableChange} />
         </Modal>
      );
   }
}

const CreateForm = Form.create()(props => {
   const { modalVisible, form, handleAdd, handleModalVisible, modalRecord, confirmLoading, fileList, handleUploadChange, handleRemove, handlebeforeUpload, handlePreview, facilityId } = props;
   const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
         if (err) return;
         form.resetFields();
         let values = {};
         if (isNotBlank(modalRecord) && isNotBlank(modalRecord.facilityId)) {
            values = { ...fieldsValue, id: modalRecord.facilityId, uid: modalRecord.userId };
            handleAdd(values);
         } else {
            message.error('设备信息为空');
         }
      });
   };

   const uploadButton = (
      <div>
         <Icon type="plus" />
         <div className="ant-upload-text">上传新照片</div>
      </div>
   );
   return (
      <Modal width={660} destroyOnClose title="修改设备照片" confirmLoading={confirmLoading} visible={modalVisible} onOk={okHandle} onCancel={() => handleModalVisible()}>
         <Row gutter={16}>
            <Col lg={10} sm={24}>
               <Form.Item label="人员照片" className={styles.fromItem}>
                  {form.getFieldDecorator('Base64', {
                     initialValue: '',
                     rules: [{ required: true, message: '请上传人员新照片' }],
                  })(
                     <div className="clearfix">
                        <Upload accept="image/*" onChange={handleUploadChange} onRemove={handleRemove} beforeUpload={handlebeforeUpload} fileList={fileList} listType="picture-card" onPreview={handlePreview} className={styles.uploadPhotoCSS}>
                           {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                     </div>
                  )}
               </Form.Item>
            </Col>
            <Col lg={4} sm={24}>
               <span style={{ lineHeight: '180px' }}>
                  <Icon type="swap-right" style={{ fontSize: '35px' }} />
               </span>
            </Col>
            <Col lg={10} sm={24}>
               {isNotBlank(modalRecord) && isNotBlank(modalRecord.equiPhoto) ? <img style={{ height: 150 }} alt="example" src={modalRecord.equiPhoto} /> : '无设备人员照片'}
               <div style={{ marginLeft: '20px', color: '#444', fontSize: 16 }}>设备人员照片</div>
            </Col>
         </Row>
      </Modal>
   );
});

/* eslint react/no-multi-comp:0 */
@connect(({ sysdeptList, loading, sysareaonly, sysoffice, sysuser, synchroData }) => {
   return {
      ...synchroData,
      sysuser,
      sysdeptList,
      areaList: sysareaonly.data,
      loading: loading.models.sysuser,
      sysoffice,
   };
})
@Form.create()
class DepartmentDate extends PureComponent {
   state = {
      modalStaffVisible: false, // 控制弹框
      confirmStaffLoading: false,
      modalStaffRecord: {},
      selectedRows: [],
      formValues: {},
      previewVisible: false,
      previewImage: '',
      status: '',
      facilityId: '', // 树形框选择id
      equiName: '',
      modalVisible: false,
      confirmLoading: false,
      modalRecord: {},
      fileList: [],
      addfileList: [],
      impowerList: [],
      selectedKeys: [], // 树形选择菜单
      checkedKeys: [], //树形框选
      tableData: [], // 表格数据
   };

   componentDidMount() {
      const { dispatch } = this.props;
      // const { sysdeptList: { data }, loading, areaList } = this.props;
      dispatch({
         type: 'sysdeptList/list',
         callback: data => {
            this.setState({
               impowerList: data,
            });
         },
      });
      dispatch({
         type: 'sysoffice/fetch',
      });
      dispatch({
         type: 'sysareaonly/fetch',
      });
      dispatch({
         type: 'sysuser/fetch',
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
   }

   handleStandardTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const { formValues, facilityId, status } = this.state;

      const filters = Object.keys(filtersArg).reduce((obj, key) => {
         const newObj = { ...obj };
         newObj[key] = getValue(filtersArg[key]);
         return newObj;
      }, {});

      const params = {
         current: pagination.current,
         pageSize: pagination.pageSize,
         ...formValues,
         ...filters,
      };
      if (sorter.field) {
         params.sorter = `${sorter.field}_${sorter.order}`;
      }
      dispatch({
         type: 'sysuser/fetch',
         payload: { ...params },
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
      // dispatch({
      //     type: 'impower/impower_List',
      //     payload: { ...params, facilityId, status, reserved: 2 },
      // });
   };

   handleFormReset = () => {
      const { form, dispatch } = this.props;
      const { facilityId, status } = this.state;

      form.resetFields();
      this.setState({
         formValues: {},
      });

      dispatch({
         type: 'sysuser/fetch',
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
   };

   handleSelectRows = rows => {
      this.setState({
         selectedRows: rows,
      });
   };

   handleSearch = e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      const { facilityId } = this.state;
      form.validateFields((err, fieldsValue) => {
         if (err) return;
         const values = {
            ...fieldsValue,
         };
         this.setState({
            formValues: values,
         });
      });
   };

   handleModalStaffVisible = flag => {
      const { dispatch } = this.props;
      const { facilityId } = this.state;
      if (isNotBlank(facilityId)) {
         let modalStaffRecord = {};
         if (flag === true) {
            modalStaffRecord = { facilityId };

            dispatch({
               type: 'sysuser/fetch',
               payload: {
                  office: facilityId,
               },
               callback: data => {
                  this.setState({
                     tableData: data,
                  });
               },
            });
         } else {
            dispatch({
               type: 'sysuser/fetch',
               payload: {
                  office: facilityId,
               },
               callback: data => {
                  this.setState({
                     tableData: data,
                  });
               },
            });
         }
         this.setState({
            modalStaffVisible: !!flag,
            confirmStaffLoading: false,
            modalStaffRecord,
         });
      } else {
         message.error('请选择基地');
      }
   };

   handleUpdateModalVisible = (flag, record) => {
      const { dispatch } = this.props;
      if (isNotBlank(record) && isNotBlank(record.facilityId)) {
         if (isNotBlank(record.userId)) {
            dispatch({
               type: 'impower/impower_getPhoto',
               payload: { uid: record.userId, id: record.facilityId },
               callback: data => {
                  if (isNotBlank(data)) {
                     const equiPhoto = `data:image/jpg;base64,${data}`;
                     this.setState({
                        modalVisible: !!flag,
                        confirmLoading: false,
                        modalRecord: { ...record, equiPhoto },
                     });
                  }
               },
            });
         }
      } else {
         this.setState({
            modalVisible: !!flag,
            confirmLoading: false,
            modalRecord: {},
            fileList: [],
            addfileList: [],
         });
      }
   };

   handleAdd = fields => {
      const { dispatch } = this.props;
      const { addfileList } = this.state;
      if (isNotBlank(fields)) {
         const value = { ...fields };
         if (isNotBlank(addfileList) && addfileList.length > 0) {
            const file = addfileList[0];
            const reader = new FileReader();
            if (isNotBlank(file)) {
               reader.readAsDataURL(file);
               reader.onload = e => {
                  if (isNotBlank(e.target.result)) {
                     value.Base64 = encodeURIComponent(e.target.result);
                     this.setState({
                        confirmLoading: true,
                     });
                     dispatch({
                        type: 'impower/impower_setPhoto',
                        payload: value,
                        callback: () => {
                           this.setState({
                              modalVisible: false,
                              confirmLoading: false,
                              modalRecord: {},
                              fileList: [],
                              addfileList: [],
                           });
                        },
                     });
                  } else if (!isNotBlank(e.target.result)) {
                     message.error('图片转码失败');
                  }
               };
            }
         } else {
            message.error('图片上传失败');
         }
      } else {
         message.error('授权信息不存在');
      }
   };

   handleStaffAdd = fields => {
      // 确定添加回调事件
      const { dispatch } = this.props;
      const { facilityId, status } = this.state;
      if (isNotBlank(fields)) {
         this.setState({
            confirmStaffLoading: true,
         });
         dispatch({
            // 新增人员到基地
            type: 'sysuser/add_personnel_tobase',
            payload: {
               ...fields,
            },
            callback: () => {
               this.handleModalStaffVisible();
            },
         });
      } else {
         message.error('请重新选择');
      }
   };

   handleCancel = () => this.setState({ previewVisible: false });

   handlePreview = file => {
      this.setState({
         previewImage: file.url || file.thumbUrl,
         previewVisible: true,
      });
   };

   handleImage = url => {
      this.setState({
         previewImage: url,
         previewVisible: true,
      });
   };

   handleRemove = file => {
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

   handlebeforeUpload = file => {
      const { addfileList } = this.state;
      const isimg = file.type.indexOf('image') >= 0;
      if (!isimg) {
         message.error('请选择图片文件!');
      }
      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
         message.error('文件大小需为10M以内');
      }
      if (isimg && isLt10M) {
         if (isNotBlank(addfileList) || addfileList.length <= 0) {
            this.setState({
               addfileList: [file],
            });
         } else {
            this.setState({
               addfileList: [...addfileList, file],
            });
         }
      }
      return isLt10M && isimg;
   };

   handleUploadChange = info => {
      const isimg = info.file.type.indexOf('image') >= 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 10;
      if (info.file.status === 'done') {
         if (isLt10M && isimg) {
            this.setState({ fileList: info.fileList });
         }
      } else {
         this.setState({ fileList: info.fileList });
      }
   };

   onDeleteClick = () => {
      const { selectedRows, facilityId } = this.state;
      if (selectedRows.length === 0) return;
      if (!isNotBlank(facilityId)) {
         message.error('请先选择车间');
         return;
      }
      Modal.confirm({
         title: '撤销授权',
         content: '确定撤销已选择的授权人员吗？',
         okText: '确认',
         okType: 'danger',
         cancelText: '取消',
         onOk: () => this.onDelete(0),
      });
   };

   onDeleteAllClick = () => {
      Modal.confirm({
         title: '撤销授权',
         content: '确定撤销全部人员吗？',
         okText: '确认',
         okType: 'danger',
         cancelText: '取消',
         onOk: () => this.onDelete(1),
      });
   };

   onDelete = num => {
      const { selectedRows, facilityId, status } = this.state;
      const { dispatch } = this.props;

      dispatch({
         type: 'sysuser/cancel_office_user',
         payload: {
            officeIds: selectedRows.map(row => row.id).join(','),
            office: facilityId,
         },
         callback: () => {
            dispatch({
               type: 'sysuser/fetch',
               payload: {
                  office: facilityId,
               },
               callback: data => {
                  this.setState({
                     tableData: data,
                  });
               },
            });
         },
      });

      // dispatch({
      //     type: 'impower/impower_Delete',
      //     payload: {
      //         ids: selectedRows.map(row => row).join(','),
      //         isFa: 2,
      //         id: facilityId,
      //         type: num,
      //         status,
      //     },
      //     callback: () => {
      //         this.setState({
      //             selectedRows: [],
      //         });
      //         dispatch({
      //             type: 'impower/impower_List',
      //             payload: {
      //                 pageSize: 10,
      //                 reserved: 2,
      //                 facilityId,
      //                 status,
      //             },
      //         });
      //     },
      // });
   };

   // 树形选择事件
   onImpowerEquiSelect = (selectedKeys, e) => {
      const { dispatch } = this.props;
      const { formValues, impowerList, facilityId } = this.state;
      if (isNotBlank(selectedKeys) && selectedKeys.length > 0 && isNotBlank(selectedKeys[0])) {
         let facilityIdofNode = '';
         if (selectedKeys[0] === '-1') {
            facilityIdofNode = '';
         } else if (isNotBlank(e.selectedNodes) && isNotBlank(e.selectedNodes.length > 0) && isNotBlank(e.selectedNodes[0].props) && isNotBlank(e.selectedNodes[0].props.dataRef)) {
            facilityIdofNode = e.selectedNodes[0].props.dataRef.id;
         }
         let obj = { office: selectedKeys[0] };
         this.setState({
            facilityId: selectedKeys[0],
            selectedKeys,
            formValues: obj,
         });
         dispatch({
            type: 'sysuser/fetch',
            payload: { office: selectedKeys[0] },
            callback: data => {
               this.setState({
                  tableData: data,
               });
            },
         });
      }
   };
   renderTreeNodes = data =>
      data.map((item, index) => {
         if (item.children) {
            return (
               <TreeNode title={isNotBlank(item) ? `${item.name}` : `${item.name}`} key={`${item.id}`} dataRef={item}>
                  {this.renderTreeNodes(item.children)}
               </TreeNode>
            );
         }
         return <TreeNode title={isNotBlank(item) ? `${item.name}` : `${item.name}`} key={`${item.id}`} dataRef={item} />;
      });

   synchroData() {
      /// 同步数据
      const { dispatch } = this.props;
      dispatch({
         type: 'synchroData/fetch',
      });
   }

   renderSimpleForm() {
      const {
         form: { getFieldDecorator },
      } = this.props;
      return (
         <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
               <Col md={6} sm={24}>
                  <FormItem label="权限组名称">
                     {getFieldDecorator('jurisdiction', {
                        initialValue: '',
                     })(<Input placeholder="请输入权限组名称" />)}
                  </FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <FormItem label="基地">
                     {getFieldDecorator('base', {
                        initialValue: '',
                     })(<Input placeholder="请输入人员名称" />)}
                  </FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="品类" size="sex">
                     {getFieldDecorator('category', {
                        initialValue: '',
                     })(
                        <Select style={{ width: '100%' }} placeholder="请选择性别">
                           <Option key="" value="">
                              全部
                           </Option>
                           <Option key="男" value="男">
                              橱柜
                           </Option>
                           <Option key="女" value="女">
                              家具
                           </Option>
                        </Select>
                     )}
                  </FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <span className={styles.submitButtons}>
                     <Button type="primary" htmlType="submit">
                        查询
                     </Button>
                     <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                     </Button>
                  </span>
               </Col>
            </Row>
         </Form>
      );
   }

   renderForm() {
      return this.renderSimpleForm();
   }

   handleSearch1 = () => {
      // e.preventDefault();
      const { dispatch, form } = this.props;
      const { facilityId } = this.state;
      form.validateFields((err, fieldsValue) => {
         if (err) return;
         const values = {
            ...fieldsValue,
         };
         dispatch({
            type: 'sysuser/fetch',
            payload: {
               ...values,
               // office:facilityId
            },
            callback: data => {
               this.setState({
                  tableData: data,
               });
            },
         });
         this.setState({
            formValues: values,
         });
      });
   };

   handleFormReset1 = () => {
      const { dispatch, form } = this.props;
      const { facilityId } = this.state;
      form.resetFields();
      this.setState({
         facilityId: '',
      });
      dispatch({
         type: 'sysuser/fetch',
         callback: data => {
            this.setState({
               tableData: data,
               checkedKeys: [],
            });
         },
      });
   };

   renderSimpleForm() {
      const { areaList } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
         <Form onSubmit={this.handleSearch1} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
               <Col md={6} sm={24}>
                  <FormItem label="姓名">{getFieldDecorator('name', { initialValue: '' })(<Input placeholder="请输入姓名" />)}</FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <FormItem label="电话">
                     {getFieldDecorator('mobile', {
                        initialValue: '',
                     })(<InputNumber style={{ width: '100%' }} placeholder="电话" />)}
                  </FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="性别" size="sex">
                     {getFieldDecorator('sex', {
                        initialValue: '',
                     })(
                        <Select style={{ width: '100%' }} placeholder="请选择性别">
                           <Option key="" value="">
                              全部
                           </Option>
                           <Option key="男" value="男">
                              男
                           </Option>
                           <Option key="女" value="女">
                              女
                           </Option>
                        </Select>
                     )}
                  </FormItem>
               </Col>
               <Col md={6} sm={24}>
                  <span className={styles.submitButtons}>
                     <Button type="primary" htmlType="submit">
                        查询
                     </Button>
                     <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset1}>
                        重置
                     </Button>
                     {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a> */}
                  </span>
               </Col>
            </Row>
         </Form>
      );
   }

   render() {
      const {
         //   impowerList,
         impowerEquiList,
         staffList,
         deptNotPageList,
         dispatch,
      } = this.props;
      const {
         fileList,
         selectedRows,
         modalStaffRecord,
         confirmStaffLoading,
         previewVisible,
         previewImage,
         modalStaffVisible,
         facilityId, // 选择的树形选择框的id
         status,
         equiName,
         modalVisible,
         modalRecord,
         confirmLoading,
         impowerList,
         tableData, // 表格数据
         checkedKeys,
      } = this.state;

      const parentMethods = {
         handleAdd: this.handleAdd,
         handleModalVisible: this.handleUpdateModalVisible,
         handleUploadChange: this.handleUploadChange,
         handleRemove: this.handleRemove,
         handlebeforeUpload: this.handlebeforeUpload,
         handlePreview: this.handlebeforeUpload,
         modalRecord,
         confirmLoading,
         fileList,
      };

      const {
         loading,
         areaList,
         sysoffice: { data },
         sysuser,
      } = this.props;
      // const impowerList = data
      const dataTree = data.list; // 树形菜单

      function findName(arr, data, id) {
         data.forEach(element => {
            if (element.id == id) {
               arr.push(element.name);
            }
            if (element.chilrden) {
               findName(arr, element.chilrden, id);
            }
         });
         return arr;
      }

      // data要遍历查询的数据， ids:要查找的id数组
      function findMyName(data, ids) {
         let arr = [];
         ids.forEach(item => {
            findName(arr, data, item);
         });
         return arr;
      }

      const columns = [
         {
            title: '姓名',
            dataIndex: 'name',
            width: 150,
         },
         {
            title: '性别',
            dataIndex: 'sex',
            width: 150,
            render: text => {
               if (isNotBlank(text)) {
                  return <span>{text}</span>;
               }
               return '';
            },
         },
         {
            title: '电话',
            dataIndex: 'mobile',
            width: 150,
         },

         {
            title: '所属基地',
            dataIndex: 'officeIds',
            width: 150,
            render: text => {
               if (isNotBlank(text)) {
                  let ids = text.split(',');
                  if (Array.isArray(ids)) {
                     ids = ids.filter(item => item !== '' || null);
                  }
                  return <>{findMyName(dataTree, [...ids])}</>;
               } else {
                  return <span style={{ color: 'red' }}>{''}</span>;
               }
            },
         },

         {
            title: '操作',
            width: 150,
            render: record => {
               return (
                  <Fragment>
                     <Link to={`/baseconfiguration/sys-user/form?id=${record.id}`}>修改</Link>
                  </Fragment>
               );
            },
         },
      ];

      const parentStaffMethods = {
         handleStaffAdd: this.handleStaffAdd,
         handleModalStaffVisible: this.handleModalStaffVisible,
         facilityId,
         status,
         modalStaffRecord,
         confirmStaffLoading,
         tableData, // 表格数据
         loading: loading,
         // dispatch
         //   deptNotPageList,
         //   staffList,
         //   equiName,
      };
      return (
         <PageHeaderWrapper>
            <Layout>
               <Sider className={styles.siders} width={256} style={{ background: '#fff', border: '1px solid #eee', overflow: 'hidden' }}>
                  <div className={styles.titleName}>组织信息</div>
                  <Tree defaultExpandAll blockNode onSelect={this.onImpowerEquiSelect} checkedKeys={checkedKeys} draggable>
                     {this.renderTreeNodes(dataTree)}
                  </Tree>
               </Sider>
               <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 320 }}>
                  <div className={styles.tableList}>
                     <div className={styles.tableListOperator}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalStaffVisible(true)}>
                           人员调整
                        </Button>
                        {/* <span>
                                    <Button icon="delete" onClick={() => this.onDeleteAllClick()}>
                                        撤销全部
                                    </Button>
                                </span> */}
                        {/* <Button
                                    type="primary"
                                    onClick={() => {
                                        this.synchroData();
                                    }}
                                >
                                    同步数据
                                </Button> */}
                        {selectedRows.length > 0 && (
                           <span>
                              <Button icon="delete" onClick={() => this.onDeleteClick()}>
                                 撤销授权
                              </Button>
                           </span>
                        )}
                     </div>
                     <StandardTable bordered rowKey="id" scroll={{ x: 1230 }} selectedRows={selectedRows} loading={loading} data={tableData} columns={columns} onSelectRow={this.handleSelectRows} onChange={this.handleStandardTableChange} />
                  </div>
               </Content>
            </Layout>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
               <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
            {isNotBlank(facilityId) && modalStaffVisible === true ? <UpdateForm {...parentStaffMethods} updateModalVisible={modalStaffVisible} /> : null}
         </PageHeaderWrapper>
      );
   }
}

export default DepartmentDate;

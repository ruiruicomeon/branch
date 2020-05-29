import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, message, Icon, Checkbox, TreeSelect, Card, Upload, Modal } from 'antd';
import { isNotBlank, getLocation } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { routerRedux } from 'dva/router';
// import Moment from 'moment

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ loading, sysuser, sysdeptList, sysoffice, sysroleList }) => ({
   submitting: loading.effects['sysuser/add'],
   formData: sysuser.formData,
   dictsData: sysuser.dicts,
   sysoffice,
   officeList: sysoffice.data.list,
   roleList: sysroleList.data.list,
   deptList: sysdeptList.data.list,
   sysdeptList,
}))
@Form.create()
class SysUserForm extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         data: {},
         id: '',
         previewVisible: false,
         fileList: [],
         addfileList: [],
         photo: '',
         selectTreevalue: [],
         location: getLocation(),
      };
   }

   componentDidMount() {
      const { location } = this.state;
      const { dispatch, form } = this.props;
      if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
         dispatch({
            type: 'sysuser/form_data',
            payload: { id: location.query.id },
            callback: response => {
               if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.id) && isNotBlank(response.data.url)) {
                  this.setState({
                     fileList: [
                        {
                           id: response.data.id,
                           uid: response.data.id,
                           url: response.data.url,
                           name: response.data.url,
                        },
                     ],
                     photo: response.data.photo,
                  });
               }
            },
         });
      }
      // 用户类型
      dispatch({
         type: 'sysuser/dicts',
         payload: { type: 'sys_user_type' },
      });

      dispatch({
         // 基地
         type: 'sysoffice/fetch',
      });

      dispatch({
         // 角色
         type: 'sysroleList/fetch',
      });

      dispatch({
         type: 'sysdeptList/fetch',
      });
   }

   // 关闭页面清除数据
   componentWillUnmount() {
      const { dispatch, form } = this.props;
      form.resetFields();
      dispatch({
         type: 'sysuser/clear',
      });
   }

   handleCancel = () => this.setState({ previewVisible: false });

   handlePreview = file => {
      this.setState({
         previewImage: file.url || file.thumbUrl,
         previewVisible: true,
      });
   };

   handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
         if (!err) {
            const value = { ...values, id: this.state.location.query.id };
            // const addfileList={...this.state.addfileList}

            // if (this.state.addfileList.length > 0) {
            //     value.addfileList = this.state.addfileList;
            // }
            // if (value.loginName != null) {
            //     // value.oldLoginName = encodeURIComponent(value.loginName);
            //
            // } else {
            //     delete value.loginName;
            // }
            let office = values.office && Array.isArray(values.office) ? values.office.join(',') : null;
            value.officeIds = office;
            this.props.dispatch({
               type: 'sysuser/add',
               payload: value,
            });
            // 清除from数据
            setTimeout(
               this.setState(() => {
                  this.props.form.resetFields();
                  return {
                     fileList: [],
                     addfileList: [],
                     photo: '',
                  };
               }),
               2000
            );
         }
      });
   };

   compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('newPassword')) {
         callback('输入的两次密码不一致');
      } else {
         callback();
      }
   };

   validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
         form.validateFields(['confirmNewPassword'], { force: true });
      }
      callback();
   };

   handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
   };

   renderBase = data =>
      data.map((item, index) => {
         if (item.children) {
            return item.name;
         }
         return item.name;
      });

   onChange = selectTreevalue => {
      this.setState({ selectTreevalue });
   };

   renderTreeNodes = data =>
      data.map((item, index) => {
         if (item.children) {
            return (
               <TreeNode title={isNotBlank(item) ? `${item.name}` : `${item.name}`} key={`${item.id ? item.id : index}`} value={isNotBlank(item) ? item.id : ''}>
                  {this.renderTreeNodes(item.children)}
               </TreeNode>
            );
         }
         return <TreeNode title={isNotBlank(item) ? `${item.name}` : `${item.name}`} key={`${item.id ? item.id : index}`} value={isNotBlank(item) ? item.id : ''} />;
      });

   render() {
      const {
         submitting,
         dispatch,
         officeList,
         formData,
         dictsData,
         roleList,
         deptList,
         sysdeptList: { data },
      } = this.props;

      const { getFieldDecorator } = this.props.form;
      const { previewVisible, previewImage } = this.state;
      const formItemLayout = {
         labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
         },
         wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 },
         },
      };

      const submitFormLayout = {
         wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 10, offset: 7 },
         },
      };

      const props = {
         onRemove: file => {
            this.setState(({ fileList, addfileList }) => {
               const index = fileList.indexOf(file);
               const newFileList = fileList.slice();
               newFileList.splice(index, 1);

               if (file.id == null) {
                  const newaddfileList = addfileList.slice();
                  newaddfileList.splice(index, 1);
                  return {
                     fileList: newFileList,
                     addfileList: newaddfileList,
                  };
               }
               return {
                  photo: '',
                  fileList: newFileList,
               };
            });
         },
         beforeUpload: file => {
            const isimg = file.type.indexOf('image') >= 0;
            if (!isimg) {
               message.error('请选择图片文件!');
            }
            const isLt10M = file.size / 1024 / 1024 <= 10;
            if (!isLt10M) {
               message.error('文件大小需为10M以内');
            }

            if (isimg && isLt10M) {
               this.setState(({ addfileList }) => ({
                  addfileList: [...addfileList, file],
               }));
            }
            return isimg && isLt10M;
         },
         onChange: info => {
            const isimg = info.file.type.indexOf('image') >= 0;
            const isLt10M = info.file.size / 1024 / 1024 <= 10;
            if (isimg && isLt10M) {
               this.setState({ fileList: info.fileList });
            }
         },
      };

      const onCancelCancel = () => {
         // dispatch(routerRedux.push('/baseconfiguration/sys-user/form'));
         dispatch(routerRedux.goBack());
      };

      const prefixSelector = getFieldDecorator('prefix', {
         initialValue: '86',
      })(
         <Select style={{ width: 70 }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
         </Select>
      );

      const uploadButton = (
         <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传头像</div>
         </div>
      );

      const isOffice = val => {
         if (isNotBlank(val) && isNotBlank(val.officeIds)) {
            let officeIdslist = val.officeIds.split(',');
            return (officeIdslist = officeIdslist.filter(item => item && item !== ''));
         }
         return '';
      };

      const isDept = val => {
         if (isNotBlank(val) && isNotBlank(val.dept) && isNotBlank(val.dept.id)) {
            return val.dept.id;
         }
         if (isNotBlank(deptList) && deptList.length > 0 && isNotBlank(deptList[0]) && isNotBlank(deptList[0].id)) {
            return deptList[0].id;
         }
         return '';
      };

      const isUserType = val => {
         if (isNotBlank(val) && isNotBlank(val.userType)) {
            return val.userType;
         }
         if (isNotBlank(dictsData) && dictsData.length > 0 && isNotBlank(dictsData[0]) && isNotBlank(dictsData[0].value)) {
            return dictsData[0].value;
         }
         return null;
      };

      return (
         <PageHeaderWrapper>
            <Card bordered={false}>
               <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
                  <FormItem {...formItemLayout} label="所属基地">
                     {getFieldDecorator('office', {
                        initialValue: isOffice(formData) ? isOffice(formData) : [],
                        rules: [
                           {
                              required: true,
                              message: '所属基地',
                           },
                        ],
                     })(
                        <TreeSelect
                           style={{ width: '100%' }}
                           allowClear
                           searchPlaceholder="请选择"
                           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                           placeholder="选择基地"
                           treeDefaultExpandAll
                           showSearch
                           showCheckedStrategy={TreeSelect.SHOW_ALL}
                           treeCheckable={true}
                           onChange={values => {
                              this.onChange(values);
                           }}
                           // treeData={officeList}
                        >
                           {this.renderTreeNodes(officeList)}
                        </TreeSelect>
                     )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="工号">
                     {getFieldDecorator('no', {
                        initialValue: formData != null && formData !== 'undefined' && formData.no != null && formData.no !== 'undefined' ? formData.no : '',
                        // 必填字段输入提示
                        rules: [
                           {
                              required: true,
                              message: '请输入工号',
                           },
                        ],
                     })(<Input placeholder="请输入工号" autoComplete="off" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="姓名">
                     {getFieldDecorator('name', {
                        initialValue: formData != null && formData !== 'undefined' && formData.name != null && formData.name !== 'undefined' ? formData.name : '',
                        // 必填字段输入提示
                        rules: [
                           {
                              required: false,
                              message: '请输入姓名',
                           },
                        ],
                     })(<Input placeholder="请输入姓名" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="手机">
                     {getFieldDecorator('mobile', {
                        initialValue: formData != null && formData !== 'undefined' && formData.mobile != null && formData.mobile !== 'undefined' ? formData.mobile : '',
                     })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="是否允许登录" help="“是”代表此账号允许登录，“否”则表示此账号不允许登录">
                     {getFieldDecorator('loginFlag', {
                        initialValue: formData != null && formData !== 'undefined' && formData.loginFlag != null && formData.loginFlag !== 'undefined' ? formData.loginFlag : '1',
                        rules: [
                           {
                              required: false,
                              message: '请选择是否允许登录',
                           },
                        ],
                     })(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                           <Option value="1">是</Option>
                           <Option value="0">否</Option>
                        </Select>
                     )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="用户类型">
                     {getFieldDecorator('userType', {
                        initialValue: isUserType(formData),
                        rules: [
                           {
                              required: false,
                              message: '请选择用户类型',
                           },
                        ],
                     })(
                        <Select showSearch style={{ width: '100%' }} placeholder="请选择区域类型" optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                           {typeof dictsData !== 'undefined' &&
                              dictsData !== 'undefined' &&
                              dictsData.length > 0 &&
                              dictsData.map(item => (
                                 <Option key={item.id} value={item.value}>
                                    {item.label}
                                 </Option>
                              ))}
                        </Select>
                     )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="用户角色">
                     {getFieldDecorator('roleIdList', {
                        initialValue: formData != null && formData !== 'undefined' && formData.roleIdList != null && formData.roleIdList !== 'undefined' ? formData.roleIdList : ['1'],
                        rules: [
                           {
                              required: false,
                              message: '请选择用户角色',
                           },
                        ],
                     })(
                        <Checkbox.Group>
                           {typeof roleList !== 'undefined' &&
                              roleList !== 'undefined' &&
                              roleList.length > 0 &&
                              roleList.map(item => (
                                 <Checkbox key={item.id} value={item.id}>
                                    {item.name}
                                 </Checkbox>
                              ))}
                        </Checkbox.Group>
                     )}
                  </FormItem>
                  <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                     <Button type="primary" htmlType="submit" loading={submitting}>
                        提交
                     </Button>
                     <Button onClick={onCancelCancel} style={{ marginLeft: 8 }}>
                        取消
                     </Button>
                  </FormItem>
               </Form>
            </Card>
         </PageHeaderWrapper>
      );
   }
}
export default SysUserForm;

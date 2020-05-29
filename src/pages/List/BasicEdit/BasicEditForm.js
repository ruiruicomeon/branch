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
} from 'antd';
import router from 'umi/router';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicEditForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ testOffice, dict, loading }) => ({
  ...testOffice,
  ...dict,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicEditForm extends PureComponent {

  state = {
    previewVisible: false,
    previewImage: {},
    addfileList: [],
  }

  componentDidMount() {
    console.log('componentDidMount')
    const { dispatch, location } = this.props;
    if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'testOffice/testOffice_Get',
        payload: {
          id: location.query.id,
        }
      });
    }
    dispatch({
      type: 'testOffice/testOffice_TreeData',
    });
    dispatch({
      type: 'dict/dict_OfficeType',
      payload: {
        type: 'sys_office_type',
      }
    });
  }

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }


  // 关闭页面清除数据
  componentWillUnmount() {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'testOffice/clear',
    });
  }

  handleSubmit = e => {
    const { dispatch, location, form } = this.props;
    // const { addfileList } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values };
        // if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
        //   let photo = [];
        //   let list = [];
        //   for (let i = 0; i < addfileList.length; i += 1) {
        //     if (isNotBlank(addfileList[i].id)) {
        //       photo = [...photo, addfileList[i].url];
        //     } else {
        //       list = [...list, addfileList[i]];
        //     }
        //   }
        //   if (isNotBlank(photo) && photo.length > 0) {
        //     value.photo = photo.map(row => row).join('|');
        //   } else {
        //     value.photo = '';
        //   }
        //   value.file = list;
        // } else {
        //   value.photo = '';
        // }

        dispatch({
          type: isNotBlank(location.query) && isNotBlank(location.query.id) ? 'testOffice/testOffice_Update' : 'testOffice/testOffice_Add',
          payload: { ...value },
          callback: () => {
            this.setState({
              addfileList: [],
              fileList: [],
            });
            router.goBack();
          }
        })
      }
    });
  };

  onCancelCancel = () => {
    router.goBack();
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
      if (!isNotBlank(addfileList) || addfileList.length <= 0) {
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

  render() {
    const { fileList, previewVisible, previewImage } = this.state;
    const { submitting, officeTypeList, testOfficeTreeDataList, testOfficeGet } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

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

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="机构照片">
              {getFieldDecorator('path', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.path) ? testOfficeGet.path : '',
              })(
                <Upload
                  accept="image/*"
                  onChange={this.handleUploadChange}
                  onRemove={this.handleRemove}
                  beforeUpload={this.handlebeforeUpload}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={this.handlePreview}
                >
                  {isNotBlank(fileList) && fileList.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='机构名称'>
              {getFieldDecorator('name', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.name) ? testOfficeGet.name : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
                rules: [               // 默认值 日期时间为null 多选下拉框为[] 日期区间为[] 其余基本为'' 不排除还有特殊处理
                  {
                    required: true,   // 是否必填
                    message: '请输入机构名称',
                  },
                ],
              })(<Input placeholder='请输入机构名称' />)}
            </FormItem>
            <FormItem {...formItemLayout} label='上级机构'>
              {getFieldDecorator('parent', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.parent) && isNotBlank(testOfficeGet.parent.id) && testOfficeGet.parent.id !== '0' ? testOfficeGet.parent.id : '',      // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
                rules: [               // 默认值 日期时间为null 多选下拉框为[] 日期区间为[] 其余基本为'' 不排除还有特殊处理
                  {
                    required: true,   // 是否必填
                    message: '请输入上级机构',
                  },
                ],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={testOfficeTreeDataList}
                  treeNodeFilterProp="label"
                  placeholder="选择上级区域"
                  treeDefaultExpandAll
                  showSearch
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='机构类型'>
              {getFieldDecorator('type', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.type) ? testOfficeGet.type : '',    // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
                rules: [
                  {
                    required: true,
                    message: '请选择机构类型',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder='请选择机构类型'
                >
                  {
                    isNotBlank(officeTypeList) && officeTypeList.length > 0 && officeTypeList.map((item) => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排序'>
              {getFieldDecorator('sort', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.sort) ? testOfficeGet.sort : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
                rules: [
                  {
                    required: true,
                    message: '请输入排序字段',
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='请输入排序字段'
                  min={0}
                  max={100000}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              {getFieldDecorator('address', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.address) ? testOfficeGet.address : '',     // 默认值  此参数必须 如无默认值的话根据组件来实行空默认值  否则会出现undefined的问题
                rules: [
                  {
                    required: true,
                    message: '请输入地址信息',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder='请输入地址信息'
                  rows={2}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='是否启用'>
              {getFieldDecorator('useable', {
                initialValue: isNotBlank(testOfficeGet) && isNotBlank(testOfficeGet.useable) ? testOfficeGet.useable : '1',     // 默认值
                rules: [
                  {
                    required: true,
                    message: '请选择是否启用',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="1">
                    启用
                  </Radio>
                  <Radio value="2">
                    不启用
                  </Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.onCancelCancel()}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicEditForm;

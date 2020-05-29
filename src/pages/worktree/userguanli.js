import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Upload,
  Icon,
  Select,
  Cascader,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import { stringify } from 'qs';
import styles from '../ERP/SysUserList.less';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ImportFile = Form.create()(props => {
  const {
    modalImportVisible,
    handleImportVisible,
    UploadFileVisible,
    fileL,
    handleFileList,
  } = props;

  const Stoken = { token: getStorage('token') };

  const propsUpload = {
    name: 'file',
    accept: '.xls,.xlsx,.xlsm',
    fileList: fileL,
    headers: Stoken,
    action: '/api/Api/sys/user/import',
    // data: { source: getStorage('userId'), sourceName: getStorage('userName') ,tag:9999},
    beforeUpload(file) {
      const isimg = file.type.indexOf('image') < 0;
      if (!isimg) {
        message.error('请选择Execl文件上传');
      }
      const isLt10M = file.size / 1024 / 1024 <= 100;
      if (!isLt10M) {
        message.error('文件大小需为100M以内');
      }
      return isimg && isLt10M;
    },
    onChange(info) {
      const isimg = info.file.type.indexOf('image') < 0;
      const isLt10M = info.file.size / 1024 / 1024 <= 100;
      let fileList = info.fileList.slice(-1);

      fileList = fileList.filter(file => {
        if (file.response) {
          if (file.response.success === '1') {
            message.success(file.response.data);
            UploadFileVisible();
          } else if (
            isNotBlank(file) &&
            isNotBlank(file.response) &&
            isNotBlank(file.response.msg)
          ) {
            message.error(file.response.data);
          }
          return file.response.success === '1';
        }
        return true;
      });
      // UploadPhotosVisible();
      if (isimg && isLt10M) {
        handleFileList(fileList);
      }
    },
  };

  return (
    <Modal
      title="导入用户表格"
      visible={modalImportVisible}
      destroyOnClose
      footer={null}
      onCancel={() => handleImportVisible()}
    >
      <Row>
        <Col span={6} offset={4}>
          <Upload {...propsUpload}>
            <Button>
              <Icon type="upload" /> 上传导入用户信息
            </Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  );
});


@connect(({ sysuser, loading, sysoffice }) => ({
  sysuser,
  officeList: sysoffice.data,
  loading: loading.models.sysuser,
}))
@Form.create()
class SysUserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalImportVisible: false,
    importFileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/fetch',
    });
    dispatch({
      type: 'sysoffice/fetch',
    });
  }

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
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'sysuser/remove',
      payload: {
        id: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'sysuser/fetch',
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

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10,
      };
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
        values.no = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
        values.name = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.office.id)) {
        values.office.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      } else {
        values.dept = values.dept[values.dept.length - 1];
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm = () => {
    const { levellist, levellist2, newdeptlist, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('no')(<Input placeholder="请输入编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属大区">
              {getFieldDecorator('area.id', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属大区" allowClear>
                  {isNotBlank(levellist) &&
                    isNotBlank(levellist.list) &&
                    levellist.list.length > 0 &&
                    levellist.list.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('office.id', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属分公司" allowClear>
                  {isNotBlank(levellist2) &&
                    isNotBlank(levellist2.list) &&
                    levellist2.list.length > 0 &&
                    levellist2.list.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属部门">
              {getFieldDecorator('dept', {
                initialValue: '',
              })(
                <Cascader
                  options={newdeptlist}
                  placeholder="请选择所属部门"
                  style={{ width: '100%' }}
                  allowClear
                  fieldNames={{ label: 'name', value: 'id' }}
                />
              )}
            </FormItem>
          </Col>
          <div>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  };

  renderForm = () => {
    return this.renderSimpleForm();
  };

  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  handleUpldExportClick = type => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Api/sys/user/export?${stringify(userid)}`);
  };

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      router.push(`/basic/sys-user/form?id=${record.id}`);
    }
  };

  
  render() {
    // const { userlist, loading } = this.props;
    const { selectedRows, importFileList, modalImportVisible } = this.state;
    const { sysuser: { data }, loading, dispatch ,officeList} = this.props;
 
    const columns = [
      {
        title: '工号',
        dataIndex: 'no',
        width: 150,
        render: (text, record) => <a onClick={() => this.handleModalChange(record)}>{text}</a>,
      },
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
             return <span>{ text }</span>
          }
          return '';
        },
      },
      {
        title: '电话',
        dataIndex: 'phone',
        width: 150,
      },
      
      {
        title: '所属基地',
        dataIndex: 'office.id',
        width: 150,
      },
      
      {
        title: '操作',
        width: 150,
        render: record => {
          return (
            <Fragment>
                  <Link
            to={`/baseconfiguration/sys-user/form?id=${record.id}`}
          >
            修改
          </Link>
          </Fragment>
          )
        }
         
        
      },
    ];

    const onValidateForm = () => {
      router.push(`/baseconfiguration/sys-user/form`);
    };

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.tableListOperator}>
          <Button icon="cloud-upload" onClick={() => this.handleImportVisible(true)}>
            导入用户
          </Button>
          {/* <Button icon="cloud-download" onClick={() => this.handleUpldExportClick()}> */}
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(0)}>
            导出模板
          </Button>
          <Button icon="cloud-download" onClick={() => this.handleUpldExportClick(1)}>
            导出数据
          </Button>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={onValidateForm}>
                新建
              </Button>          
            </div>
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ImportFile {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default SysUserList;

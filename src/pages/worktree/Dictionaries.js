import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './Dictionaries.less';

const FormItem = Form.Item;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, modalRecord } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let values = {};
      if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
        values = { ...fieldsValue, id: modalRecord.id };
      } else {
        values = { ...fieldsValue };
      }
      handleAdd(values);
    });
  };

  return (
    <Modal
      title={isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改字典' : '新增字典'
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签名">
        {form.getFieldDecorator('label', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.label) ? modalRecord.label : '',
          rules: [{ required: true, message: '请输入标签名' }],
        })(<Input placeholder="请输入标签名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('type', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.type) ? modalRecord.type : '',
          rules: [{ required: true, message: '请输入类型' }],
        })(<Input placeholder="请输入类型" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.description) ? modalRecord.description : '',
          rules: [{ required: true, message: '请输入描述' }],
        })(<Input placeholder="请输入描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据值">
        {form.getFieldDecorator('value', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.value) ? modalRecord.value : '',
          rules: [{ required: true, message: '请输入数据值' }],
        })(<Input placeholder="请输入数据值" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('sort', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.sort) ? modalRecord.sort : '',
        })(<Input placeholder="请输入排序" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码规则">
        {form.getFieldDecorator('remarks', {
          initialValue: isNotBlank(modalRecord) && isNotBlank(modalRecord.remark) ? modalRecord.remark : '',
        })(<Input placeholder="请输入编码规则" />)}
      </FormItem>
    </Modal>
  );
});


@connect(({ loading, dictionaryL
  // , sysoffice 
}) => ({
  ...dictionaryL,
  // officeList: sysoffice.data,
  loading: loading.models.sysuser,
}))
@Form.create()
class DictionaryList extends PureComponent {

  constructor(props) {
    super(props);
    if (props.location.data != null && typeof props.location.data !== 'undefined') {
      this.setState({
        data: props.location.data
      })
    }
  }

  state = {
    data: {},
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    modalRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dictionaryL/fetch',
      payload: {
        current: 1,
        pageSize: 10
      }
      // if (this.state.data != null && this.state.data !== 'undefined'){
      // }
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
      type: 'dictionaryL/fetch',
      payload: params,
    });
  };


  handleAdd = fields => {
    const { dispatch } = this.props
    const that = this
    dispatch({
      type: 'dictionaryL/add_dict',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'dictionaryL/fetch',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
        that.setState({
          modalVisible: false,
        });
      }
    });

  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dictionaryL/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'dictionaryL/del_dict',
      payload: {
        ids: selectedRows.map(rows=>rows.id).join(","),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'dictionaryL/fetch',
          payload: {
            current: 1,
            pageSize: 10
          }
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
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if (!isNotBlank(fieldsValue.type)) {
        values.type = ''
      }
      if (!isNotBlank(fieldsValue.label)) {
        values.label = ''
      }
      if (!isNotBlank(fieldsValue.description)) {
        values.description = ''
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dictionaryL/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm = () => {
    const { form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(<Input placeholder="请输入类型" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签名">
              {getFieldDecorator('label')(<Input placeholder="请输入标签名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="描述">
              {getFieldDecorator('description')(<Input placeholder="请输入描述" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = () => {
    return this.renderSimpleForm();
  }


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalRecord: {},
    });
  };

  editdict = record => {
    this.setState({
      modalVisible: true,
      modalRecord: record,
    });
  };

  render() {
    const { loading, listdict } = this.props;
    const { selectedRows, modalVisible, modalRecord } = this.state;
  
    const columns = [
      {
        title: '标签名',
        dataIndex: 'label',
        width: 150,
      },
      {
        title: '类型',  
        dataIndex: 'type',
        width: 150,
      },    
      {
        title: '描述',
        dataIndex: 'description',
        width: 150,
      },
      {
        title: '数据值',
        dataIndex: 'value',
        width: 150,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 150,
      },
      {
        title: '编码规则',
        dataIndex: 'remarks',
        width: 150,
      },
      {
        title: '操作',
        width: 150,
        render: record => (
          <Fragment>
            <a
              // to={{
              //   pathname: '/system/sys-user/form',
              //   data: { id: record.id },
              //   state: { fromDashboard: true },
              // }}
              onClick={() => { this.editdict(record) }}
            >
              修改
            </a>
            {/* <Divider type="vertical" />
            <Link
              to={{
                pathname: '/system/sys-user/form',
                data: { id: record.id },
                state: { fromDashboard: true },
              }}
            >
              查看
            </Link> */}
          </Fragment>
        ),
      },
    ];

    // const onValidateForm = () => {
    //   dispatch(routerRedux.push('/system/sys-user/form'));
    // };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      // list:
      //   data != null && data !== 'undefined' && data.list != null && data.list.length > 0
      //     ? data.list
      //     : [],
      // arealist:
      //   areaList != null &&
      //   areaList !== 'undefined' &&
      //   areaList.list != null &&
      //   areaList.list.length > 0
      //     ? areaList.list
      //     : [],
      modalRecord,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {/* {localStorage.getItem('roles') != null &&
                  typeof localStorage.getItem('roles') !== 'undefined' &&
                  localStorage.getItem('roles') !== '' &&
                  (localStorage.getItem('roles').indexOf('admin') >= 0 ||
                    localStorage.getItem('roles').indexOf('general_manager') >= 0) ? ( */}
                  <Button onClick={() => this.removeClick()}>删除</Button>
                  {/* ): null} */}
                </span>
              )}
            </div>
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={listdict}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default DictionaryList;

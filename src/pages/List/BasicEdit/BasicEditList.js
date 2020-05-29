import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button, Input, InputNumber, Form, Card, Popconfirm, Icon, Row, Col, Select, DatePicker, Divider, Tag, Avatar, message, Modal
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import moment from 'moment';
import styles from './BasicEditList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


// 数据源  list  是否加载判断loading
@connect(({ testOffice, dict, loading }) => ({
  ...testOffice,
  ...dict,
  loading: loading.models.testOffice,
}))
@Form.create()
class BasicEditList extends PureComponent {

  // 初始化值
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'testOffice/testOffice_List',
      payload: {
        pageSize: 10,
      }
    });
    dispatch({
      type: 'dict/dict_OfficeType',
      payload: {
        type: 'sys_office_type',
      }
    });
  }

  gotoForm = () => {
    router.push(`/list/basic_edit_form`);
  }

  gotoUpdateForm = (id) => {
    router.push(`/list/basic_edit_form?id=${id}`);
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
      type: 'testOffice/testOffice_List',
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
      type: 'testOffice/testOffice_List',
      payload: {
        pageSize: 10,
        current: 1,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  editAndDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除数据',
      content: '确定删除已选择的数据吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.handleDeleteClick(),
    });
  };

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    let ids = '';
    // 删除单个
    if (isNotBlank(id)) {
      ids = id;
    } else {
      if (selectedRows.length === 0) {
        message.error('未选择需要删除的数据');
        return;
      }
      ids = selectedRows.map(row => row).join(',');
    }
    if (isNotBlank(ids)) {
      dispatch({
        type: 'testOffice/testOffice_Delete',
        payload: {
          id: ids
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          this.setState({
            selectedRows: []
          })
          dispatch({
            type: 'testOffice/testOffice_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'rule/fetch',
        payload: {
          ...values,
          pageSize: 10,
          current: 1,
        },
      });
    });
  };

  // 点击保存返回的id与修改的数据
  onSaveData = (key, row) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    const value = { ...row };
    // 时间需要进行moment处理  转为string 否则后台不识别
    // 如有多选数据  当前获取到的数据则为一个数组 需要转换成','拼接字符串
    if (isNotBlank(value)) {
      if (isNotBlank(value.updateDate)) {
        value.updateDate = moment(value.updateDate).format('YYYY-MM-DD HH:mm');
      }
      dispatch({
        type: 'testOffice/testOffice_Update',
        payload: {
          id: key,
          ...value
        },
        callback: () => {
          // 成功之后需要刷新列表数据
          // 并且添加当前搜索字段  页数归0
          dispatch({
            type: 'testOffice/testOffice_List',
            payload: {
              pageSize: 10,
              ...formValues,
            }
          });
        }
      });
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name', {
                initialValue: ''
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number', {
                initialValue: ''
              })(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date', {
                initialValue: null
              })(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { selectedRows } = this.state;
    const { loading, testOfficeList, officeTypeList } = this.props;

    // 可编辑列表 需要固定操作参数   【编辑，保存，取消】
    const columns = [
      {
        title: '照片',
        dataIndex: 'photo',
        width: 100,
        render: value => {
          if (isNotBlank(value)) {
            return (
              <div className={styles.avatarWrapper}>
                <Avatar src={getFullUrl(value)} size="large" />
              </div>
            )
          }
          return (
            <div className={styles.avatarWrapper}>
              <Avatar size="large">暂无</Avatar>
            </div>
          )
        },
      },
      {
        title: '名称',        // 必填显示  
        dataIndex: 'name',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },
      {
        title: '机构类型',         // 必填显示  
        inputinfo: officeTypeList,  // 选填 选择的数据源   不能
        dataIndex: 'type',    // 必填 参数名
        inputType: 'select',  // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,           // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,       // 选填  是否可编辑
        render: (text) => {
          // 循环 防止存在多个状态    现在编辑匹配的字段是 value  lable  考虑需要动态匹配字段
          if (isNotBlank(text) && isNotBlank(officeTypeList) && officeTypeList.length > 0) {
            return officeTypeList.map((item) => {
              if (isNotBlank(item) && isNotBlank(item.value) && `${text}`.indexOf(item.value) > -1) {
                return <Tag color="#108ee9" key={item.value}>{item.label}</Tag>
              }
              return '';
            })
          }
          return ''
        },
      },
      {
        title: '排序',        // 必填显示  
        dataIndex: 'sort',   // 必填 参数名
        inputType: 'number',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
        sorter: true,   // 是否排序
      },
      {
        title: '地址',        // 必填显示  
        dataIndex: 'address',   // 必填 参数名
        inputType: 'text',   // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
        width: 100,          // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
        editable: true,      // 选填  是否可编辑
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        editable: true,
        inputType: 'dateTime',
        width: 100,
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '基础操作',
        width: 100,
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="是否确认删除本行?" onConfirm={() => this.handleDeleteClick(record.id)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.gotoUpdateForm(record.id)}>详情</a>
          </Fragment>
        ),
      }
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.gotoForm()}>
                  新建
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                    <Button icon="delete" onClick={(e) => this.editAndDelete(e)}> 批量删除</Button>
                  </span>
                )}
              </div>
              <StandardEditTable
                scroll={{ x: 700 }}
                selectedRows={selectedRows}
                loading={loading}
                data={testOfficeList}
                bordered
                columns={columns}
                onSaveData={this.onSaveData}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BasicEditList;

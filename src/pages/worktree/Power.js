import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, TreeSelect, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './backlogList.less';

const FormItem = Form.Item;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ sysrole, loading
  // , sysoffice
}) => ({
  ...sysrole,
  dicts: sysrole.dicts,
  // officeList: sysoffice.data,
  loading: loading.models.sysrole,
}))
@Form.create()
class SysRoleList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/fetch',
      payload: {
        current: 1,
        pageSize: 10
      }
    });
    // dispatch({
    //   type: 'sysoffice/fetch',
    // });
    // dispatch({
    //   type: 'sysrole/dicts',
    //   payload: { type: 'sys_data_scope' },
    // });
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
      type: 'sysrole/fetch',
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
      type: 'sysrole/fetch',
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
      type: 'sysrole/remove',
      payload: {
        ids: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'sysrole/fetch',
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysrole/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { officeList,form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="归属部门">
              {getFieldDecorator('office')(
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={officeList.list}
                  treeNodeFilterProp="label"
                  placeholder="选择归属区域"
                  treeDefaultExpandAll
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限名称">
              {getFieldDecorator('enname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <div>
            <span style={{ float: 'right', marginBottom: 24 }}>
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
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { rolelist, loading, dispatch } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        width: 150,
        // render: (text, record) => (
        //   <Link
        //     to={{
        //       pathname: '/system/sys-role/form',
        //       data: { id: record.id },

        //       state: { fromDashboard: true },
        //     }}
        //   >
        //     {text}
        //   </Link>
        // ),
      },
      // {
      //   title: '权限名称',
      //   dataIndex: 'enname',
      //   width: 150,
      // },
      {
        title: '操作',
        width: 150,
        render: record => (
          <Fragment>
            <Link
              to={`/baseconfiguration/Modification_power?id=${record.id}`}
              >
              修改
            </Link>
          </Fragment>
        ),
      },
    ];

    const onValidateForm = () => {
      dispatch(routerRedux.push('/baseconfiguration/Modification_power'));
    };
    // <div className={styles.tableListForm}>{this.renderForm()}</div>
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={onValidateForm}>
                新建
              </Button>
            </div>
            <StandardTable
              bordered
              scroll={{ x: 750 }}
              selectedRows={selectedRows}
              loading={loading}
              defaultExpandAllRows
              data={rolelist}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default SysRoleList;

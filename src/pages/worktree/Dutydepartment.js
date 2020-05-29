import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, List, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './Dictionaries.less';

const FormItem = Form.Item;
const { Option } = Select;
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
            values = { ...values };
            if (isNotBlank(modalRecord) && isNotBlank(modalRecord.id)) {
                values = { ...fieldsValue, id: modalRecord.id };
            } else {
                values = { ...fieldsValue };
            }
            values = { ...values, description: 'description', sort: 12 };

            handleAdd(values);
        });
    };

    return (
        <Modal
            title={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.id)
                    ? '修改责任部门'
                    : '新增责任部门'
            }
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门编号">
                {form.getFieldDecorator('label', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.label)
                            ? modalRecord.label
                            : '',
                    rules: [{ required: true, message: '请输入部门编号' }],
                })(<Input placeholder="请输入部门编号" />)}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="类型"
                style={{ display: 'none' }}
            >
                {form.getFieldDecorator('type', {
                    initialValue: 'duty',
                    rules: [{ required: true, message: '请输入类型' }],
                })(<Input placeholder="请输入类型" disabled />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="责任部门">
                {form.getFieldDecorator('value', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.value)
                            ? modalRecord.value
                            : '',
                    rules: [{ required: true, message: '请输入责任部门' }],
                })(<Input placeholder="请输入责任部门" />)}
            </FormItem>
      
        </Modal>
    );
});

@connect(({ loading, dictionaryL }) => ({
    // , sysoffice
    ...dictionaryL,
    // officeList: sysoffice.data,
    loading: loading.models.dictionaryL,
}))
@Form.create()
class DutyDepartment extends PureComponent {
    constructor(props) {
        super(props);
        if (props.location.data != null && typeof props.location.data !== 'undefined') {
            this.setState({
                data: props.location.data,
            });
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
                pageSize: 10,
                type: 'duty',
            },
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
            payload: { type: 'duty', ...params },
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        const that = this;
        dispatch({
            type: 'dictionaryL/add_dict',
            payload: fields,
            callback: () => {
                dispatch({
                    type: 'dictionaryL/fetch',
                    payload: {
                        current: 1,
                        pageSize: 10,
                        type: 'duty',
                    },
                });
                that.setState({
                    modalVisible: false,
                });
            },
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
            payload: { type: 'duty' },
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
            type: 'dictionaryL/del_dict',
            payload: {
                ids: selectedRows.map(rows => rows.id).join(','),
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                });
                dispatch({
                    type: 'dictionaryL/fetch',
                    payload: {
                        current: 1,
                        pageSize: 10,
                        type: 'duty',
                    },
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

            if (!isNotBlank(fieldsValue.label)) {
                values.label = '';
            }
            if (!isNotBlank(fieldsValue.value)) {
                values.value = '';
            }

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'dictionaryL/fetch',
                payload: { type: 'duty', ...values },
            });
        });
    };  

    renderSimpleForm = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="部门名称">
                            {getFieldDecorator('value')(<Input placeholder="请输入部门类型" />)}
                        </FormItem>
                    </Col>
                    {/* <Col md={8} sm={24}>
                        <FormItem label="部门编号">
                            {getFieldDecorator('label')(<Input placeholder="请输入故障原因" />)}
                        </FormItem>
                    </Col> */}
                    {/* <Col md={8} sm={24}>
            <FormItem label="原因描述">
              {getFieldDecorator('description')(<Input placeholder="请输入原因描述" />)}
            </FormItem>
          </Col> */}
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
    };

    renderForm = () => {
        return this.renderSimpleForm();
    };

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
        const { loading, listdict, departmentList } = this.props;
        const { selectedRows, modalVisible, modalRecord } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            modalRecord,
        };
        const columns = [
            {
                title: '责任部门',
                dataIndex: 'value',
                width: 150,
            },
            {
                title: '部门编号',
                dataIndex: 'label',
                width: 150,
            },
            {
                title: '操作',
                width: 150,
                render: record => (
                    <Fragment>
                        <a
                            onClick={() => {
                                this.editdict(record);
                            }}
                        >
                            修改
                        </a>
                    </Fragment>
                ),
            },
        ];

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => this.handleModalVisible(true)}
                            >
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
                            data={departmentList}
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
export default DutyDepartment;

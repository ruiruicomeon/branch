import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, List, Avatar, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './Dictionaries.less';
import logo from '../../assets/logo.jpg';
import TextArea from 'antd/lib/input/TextArea';
// import InfiniteScroll from 'react-infinite-scroller';
const FormItem = Form.Item;
// const { Option } = Select;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

const CreateForm = Form.create()(props => {
    const {
        modalVisible,
        form,
        handleAdd,
        handleModalVisible,
        modalRecord,
        departmentList,
        BUnameList,
    } = props;

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
            values = { ...values, sort: 12 };

            handleAdd(values);
        });
    };
    return (
        <Modal
            title={
                isNotBlank(modalRecord) && isNotBlank(modalRecord.id)
                    ? '修改责任分类'
                    : '新增责任分类'
            }
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="责任分类">
                {form.getFieldDecorator('value', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.value)
                            ? modalRecord.value
                            : '',
                    rules: [{ required: true, message: '请输入责任分类' }],
                })(<Input placeholder="请输入责任分类" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="责任编码">
                {form.getFieldDecorator('code', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.code)
                            ? modalRecord.code
                            : '',
                    rules: [{ required: true, message: '请输入责任编码' }],
                })(<Input placeholder="请输入责任编码" />)}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="类型"
                style={{ display: 'none' }}
            >
                {form.getFieldDecorator('type', {
                    initialValue: 'failure',
                    rules: [{ required: true, message: '请输入类型' }],
                })(<Input placeholder="请输入类型" disabled />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                {form.getFieldDecorator('description', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.description)
                            ? modalRecord.description
                            : '',
                    rules: [{ required: true, message: '请输入描述' }],
                })(<TextArea rows={6} placeholder="请输入描述" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属事业线">
                {form.getFieldDecorator('label', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.label)
                            ? modalRecord.label
                            : '',
                    rules: [{ required: true, message: '请输入事业线' }],
                })(
                    <Select style={{ width: 300 }}>
                        {isNotBlank(BUnameList) &&
                            BUnameList.length > 0 &&
                            BUnameList.map((item, index) => (
                                <Option key={index} value={item.code}>
                                    {item.name}
                                </Option>
                            ))}
                    </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="责任部门">
                {form.getFieldDecorator('remarks', {
                    initialValue:
                        isNotBlank(modalRecord) && isNotBlank(modalRecord.remarks)
                            ? modalRecord.remarks
                            : '',
                })(
                    <Select style={{ width: 300 }}>
                        {isNotBlank(departmentList) &&
                            isNotBlank(departmentList.list) &&
                            departmentList.list.length > 0 &&
                            departmentList.list.map((item, index) => (
                                <Option key={index} value={item.value}>
                                    {item.value}
                                </Option>
                            ))}
                    </Select>
                )}
            </FormItem>
        </Modal>
    );
});

@connect(({ loading, dictionaryL }) => ({
    // , sysoffice
    dictionaryL,
    // officeList: sysoffice.data,
    loading: loading.models.dictionaryL,
}))
@Form.create()
class CauseClassComponent extends PureComponent {
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
                type: 'failure',
            },
        });
        dispatch({
            type: 'dictionaryL/fetch',
            payload: {
                type: 'duty',
                pageSize: 5000,
            },
        });
        dispatch({
            // 品类
            type: 'communication/fetch_buname_wx',
            callback: data => {
                this.setState({
                    BUnameList: data,
                });
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
            payload: {
                type: 'failure',
                ...params
            },
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
                        type: 'failure',
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
            payload: { type: 'failure' },
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
                        type: 'failure',
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
            };
            if (!isNotBlank(fieldsValue.label)) {
                values.label = '';
            }
            if (!isNotBlank(fieldsValue.remarks)) {
                values.remarks = '';
            }
            if (!isNotBlank(fieldsValue.value)) {
                values.value = '';
            }
            if (!isNotBlank(fieldsValue.description)) {
                values.description = '';
            }
            if (!isNotBlank(fieldsValue.type)) {
                values.type = '';
            }
            if (!isNotBlank(fieldsValue.description)) {
                values.description = '';
            }
            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'dictionaryL/fetch',
                payload: { type: 'failure', ...values },
            });
        });
    };

    renderSimpleForm = () => {
        const {
            form,
            dictionaryL: { departmentList },
        } = this.props;
        const { BUnameList } = this.state;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <FormItem label="类型" style={{ display: 'none' }}>
                        {getFieldDecorator('type', {
                            initialValue: 'failure',
                        })(<Input placeholder="请输入类型" />)}
                    </FormItem>

                    <Col md={6} sm={24}>
                        <FormItem label="责任分类">
                            {getFieldDecorator('value')(<Input placeholder="请输入责任分类" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="描述">
                            {getFieldDecorator('description')(<Input placeholder="请输入描述" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="所属事业线">
                            {getFieldDecorator('label')(
                                <Select allowClear={true}>
                                    {isNotBlank(BUnameList) &&
                                        BUnameList.length > 0 &&
                                        BUnameList.map((item, index) => (
                                            <Option key={index} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="责任部门">
                            {getFieldDecorator('remarks')(
                                <Select allowClear={true}>
                                    {isNotBlank(departmentList) &&
                                        isNotBlank(departmentList.list) &&
                                        departmentList.list.length > 0 &&
                                        departmentList.list.map((item, index) => (
                                            <Option key={index} value={item.value}>
                                                {item.value}
                                            </Option>
                                        ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
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
        const {
            loading,
            dictionaryL: { listdict, departmentList, departmentFailure },
        } = this.props;
        const { selectedRows, modalVisible, modalRecord, BUnameList } = this.state;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            modalRecord,
            departmentList,
            BUnameList,
        };
        const columns = [
            {
                title: '责任分类',
                dataIndex: 'value',
                width: 150,
            },
            {
                title: '责任编码',
                dataIndex: 'code',
                width: 150,
            },
            {
                title: '描述',
                dataIndex: 'description',
                width: 150,
            },
            {
                title: '所属事业线',
                dataIndex: 'label',
                width: 150,
                render: text => {
                    return (
                        BUnameList &&
                        BUnameList.length > 0 &&
                        BUnameList.map(item => {
                            if (item.code == text) {
                                return item.label;
                            }
                        })
                    );
                },
            },
            {
                title: '责任部门',
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
                            onClick={() => {
                                this.editdict(record);
                            }}
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
                                    <Button onClick={() => this.removeClick()}>删除</Button>
                                </span>
                            )}
                        </div>

                        <StandardTable
                            bordered
                            scroll={{ x: 1050 }}
                            selectedRows={selectedRows}
                            loading={loading}
                            defaultExpandAllRows
                            data={departmentFailure}
                            columns={columns}
                            pagination={true}
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
export default CauseClassComponent;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, List, Avatar, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import styles from './Dictionaries.less';
import logo from '../../assets/logo.jpg';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

@Form.create()
class CreateForm extends PureComponent {
    state = {
        bucode: [],
    };
    handleSelectChange(value) {
        const { getbuNamelist } = this.props;
        let selCode = [];
        selCode = getbuNamelist.filter(item => {
            if (item.name == value) {
                return item.code;
            }
        });
        this.setState({
            bucode: selCode,
        });
    }
    render() {
        const {
            modalVisible,
            form,
            handleAdd,
            handleModalVisible,
            modalRecord,
            getbuNamelist, // 品类 bucode 列表
        } = this.props;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                let values = {};
                values = { ...fieldsValue };
                if (modalRecord.id) {
                    values.id = modalRecord.id;
                }
                values.buCode = this.state.bucode.length > 0 ? this.state.bucode[0].code : '';
                handleAdd(values);
                form.resetFields();
            });
        };

        return (
            <Modal
                title={
                    isNotBlank(modalRecord) && isNotBlank(modalRecord.id) ? '修改话术' : '新增话术'
                }
                visible={modalVisible}
                onOk={okHandle}
                onCancel={() => handleModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类名">
                    {form.getFieldDecorator('buName', {
                        initialValue:
                            isNotBlank(modalRecord) && isNotBlank(modalRecord.buName)
                                ? modalRecord.buName
                                : '',
                        rules: [{ required: true, message: '请输入品类名' }],
                    })(
                        <Select
                            placeholder="请选择品类名称"
                            style={{ width: '100%' }}
                            onChange={e => {
                                this.handleSelectChange(e);
                            }}
                        >
                            {isNotBlank(getbuNamelist) &&
                                getbuNamelist.map(item => {
                                    return (
                                        <Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    )}
                </FormItem>
                {/* <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="品类编码"
                    style={{ display: 'none' }}
                >
                    {form.getFieldDecorator('buCode', {
                        initialValue:
                            isNotBlank(modalRecord) && isNotBlank(modalRecord.buCode)
                                ? modalRecord.buCode
                                : '',
                        rules: [{ required: true, message: '' }],
                    })(
                        <Select placeholder="请选择品类编码" style={{ width: '100%' }}>
                            {isNotBlank(this.state.bucode) &&
                                this.state.bucode.map(item => {
                                    return (
                                        <Option key={item.id} value={item.code}>
                                            {item.code}
                                        </Option>
                                    );
                                })}
                        </Select>
                    )}
                </FormItem> */}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
                    {form.getFieldDecorator('label', {
                        initialValue:
                            isNotBlank(modalRecord) && isNotBlank(modalRecord.label)
                                ? modalRecord.label
                                : '',
                        rules: [{ required: true, message: '请输入标签' }],
                    })(<Input placeholder="请输入标签" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="话术内容">
                    {form.getFieldDecorator('value', {
                        initialValue:
                            isNotBlank(modalRecord) && isNotBlank(modalRecord.value)
                                ? modalRecord.value
                                : '',
                        rules: [{ required: true, message: '话术内容必填', max: 2000 }],
                    })(<TextArea rows={6} placeholder="请输入话术内容" />)}
                </FormItem>
            </Modal>
        );
    }
}

@connect(({ loading, sysdeptList, speaklist }) => ({
    sysdeptList,
    ...speaklist,
    loading: loading.models.speaklist,
}))
@Form.create()
class SpeakSleightList extends PureComponent {
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
        isupdata: false,
        bucode:''   //品类编码
    };

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch({
            // 品类管理
            type: 'sysdeptList/getbuNamelist',
            payload: {
                grade: '1',
            },
        });

        dispatch({
            // 获取
            type: 'speaklist/fetch',
            payload: {
                current: 1,
                pageSize: 10,
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
            type: 'speaklist/fetch',
            payload: params,
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        const { isupdata } = this.state;
        const that = this;
        if (isupdata) {
            dispatch({
                type: 'speaklist/updateSpeakList',
                payload: fields,
                callback: () => {
                    dispatch({
                        type: 'speaklist/fetch',
                        payload: {
                            current: 1,
                            pageSize: 20,
                        },
                    });
                    that.setState({
                        modalVisible: false,
                    });
                },
            });
        } else {
            dispatch({
                type: 'speaklist/addSpeakList',
                payload: fields,
                callback: () => {
                    dispatch({
                        type: 'speaklist/fetch',
                        payload: {
                            current: 1,
                            pageSize: 20,
                        },
                    });
                    that.setState({
                        modalVisible: false,
                    });
                },
            });
        }
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
            bucode:''
        });
        dispatch({
            type: 'speaklist/fetch',
            payload: {
                current: 1,
                pageSize: 20,
            },
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
            type: 'speaklist/deleteSpeakList',
            payload: {
                id: selectedRows.map(rows => rows.id).join(','),
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                });
                dispatch({
                    type: 'speaklist/fetch',
                    payload: {
                        current: 1,
                        pageSize: 20,
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
        const { bucode } = this.state
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
            };
            if (!values.buName) {
                values.buName = '';
            }
            if (!values.buCode) {
                values.buCode = bucode ? bucode : '';
            }
            if (!values.lable) {
                values.lable = '';
            }
            if (!values.value) {
                values.value = '';
            }

            dispatch({
                type: 'speaklist/fetch',
                payload: {
                    current: 1,
                    pageSize: 20,
                    ...values,
                },
            });

            this.setState({
                formValues: values,
            });
        });
    };
    handleSelectChange(value) {
        const { sysdeptList: { getbuNamelist }  } = this.props
        let selCode = [];
        selCode = getbuNamelist.filter(item => {
            if (item.name == value) {
                return item.code;
            }
        });
        this.setState({
            bucode: selCode.length > 0 ? selCode[0].code : '' ,
        });
    }

    renderSimpleForm = () => {
        const {
            form,
            sysdeptList: { getbuNamelist },
        } = this.props;

        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="品类名称">
                            {getFieldDecorator('buName')(
                                <Select
                                    placeholder="请选择品类名称"
                                    style={{ width: '100%' }}
                                    onChange={e => {
                                        this.handleSelectChange(e);
                                    }}
                                >
                                    {isNotBlank(getbuNamelist) &&
                                        getbuNamelist.map(item => {
                                            return (
                                                <Option key={item.id} value={item.name}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {/* <Col md={8} sm={24}>
                        <FormItem label="品类编码">
                            {getFieldDecorator('buCode')(
                                <Select placeholder="请选择品类名称" style={{ width: '100%' }}>
                                    {isNotBlank(getbuNamelist) &&
                                        getbuNamelist.map(item => {
                                            return (
                                                <Option key={item.id} value={item.code}>
                                                    {item.code}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </FormItem>
                    </Col> */}
                    {/* <Col md={8} sm={24}>
                        <FormItem label="标签">
                            {getFieldDecorator('lable')(<Input placeholder="请输入标签" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="话术内容 ">
                            {getFieldDecorator('value')(
                                <TextArea rows={3} placeholder="请输入话术内容" />
                            )}
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
            isupdata: true,
        });
    };

    render() {
        const {
            loading,
            sysdeptList: { getbuNamelist }, // 品类管理
            getCommList,
        } = this.props;

        const { selectedRows, modalVisible, modalRecord } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            modalRecord,
            getbuNamelist, // 品类
        };

        const columns = [
            {
                title: '品类名',
                dataIndex: 'buName',
                width: 150,
            },
            // {
            //     title: '品类编码',
            //     dataIndex: 'buCode',
            //     width: 150,
            // },
            {
                title: '标签',
                dataIndex: 'label',
                width: 150,
            },
            {
                title: '话术内容',
                dataIndex: 'value',
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
        ]; //

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()} </div>
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
                            data={getCommList ? getCommList : { list: [] }}
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
export default SpeakSleightList;

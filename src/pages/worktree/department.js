/**
 *  默认受理人配置
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Modal,
    TreeSelect,
    Icon,
    Button,
    Divider,
    Tag,
    message,
    Avatar,
    Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'dva/router';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import styles from './MemEquiInfoList.less';
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const { Option } = Select;
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
        list,
        modalRecord,
        arealist,
        HandleAddpeopelToDuty,
        ASpersonnelName,
        JDpersonnelName,
        perONevisb,
        peiTWOvisb,
        sysdeptList, //
        handleResetSelect, // 重新选择人员
    } = props;

    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            let values = {};
            let zipcodeObj = {};

            if (fieldsValue.primaryPerson == '') {
                fieldsValue.primaryPerson =
                    ASpersonnelName.who == 'as' ? ASpersonnelName.nameid : '';
            }
            if (fieldsValue.deputyPerson == '') {
                fieldsValue.deputyPerson =
                    JDpersonnelName.who == 'jd' ? JDpersonnelName.nameid : '';
            }

            if (fieldsValue.zipcode && fieldsValue.zipcode.length == 1) {
                fieldsValue.zipcode.map(item => {
                    zipcodeObj.address = item.label;
                    zipcodeObj.zipcode = item.value;
                });
            }
            if (
                modalRecord != null &&
                modalRecord !== 'undefined' &&
                modalRecord.id != null &&
                modalRecord.id !== 'undefined'
            ) {
                values = { ...fieldsValue, id: modalRecord.id };
            } else {
                values = { ...fieldsValue, ...zipcodeObj };
            }

            if (isNotBlank(modalRecord) && isNotBlank(modalRecord.parentId)) {
                values.parent = modalRecord.parentId;
            }

            handleAdd(values);
        });
    };

    const renderTreeNodes = data =>
        data &&
        data.map((item, index) => {
            if (item.children) {
                return (
                    <TreeNode
                        title={isNotBlank(item) && `${item.name}`}
                        key={`${item.id}`}
                        value={isNotBlank(item) ? item.master : ''}
                    >
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    title={isNotBlank(item) && `${item.name}`}
                    key={`${item.id}`}
                    value={isNotBlank(item) ? item.master : ''}
                />
            );
        });

    return (
        <Modal
            title={
                modalRecord != null &&
                modalRecord !== 'undefined' &&
                modalRecord.id != null &&
                modalRecord.id !== 'undefined'
                    ? '修改组织信息'
                    : '新建组织'
            }
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="受理人">
                {form.getFieldDecorator('parent', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.parentId != null &&
                        typeof modalRecord.parentId !== 'undefined' &&
                        // modalRecord.parentId !== '0'
                        isNotBlank(modalRecord.name)
                            ? // ? modalRecord.parentId
                              modalRecord.name
                            : [],
                })(
                    <TreeSelect
                        disabled
                        style={{ width: '100%' }}
                        allowClear
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={list}
                        treeNodeLabelProp="name"
                        treeNodeFilterProp="parentId"
                        placeholder="选择父级名"
                        treeDefaultExpandAll
                        showSearch
                    ></TreeSelect>
                )}
            </FormItem>
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组织名称">
                {form.getFieldDecorator('name', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.name != null &&
                        typeof modalRecord.name !== 'undefined'
                            ? modalRecord.name
                            : '',
                    rules: [{ required: false, message: '请输入组织名称' }],
                })(<Input placeholder="请输入组织名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组织编码">
                {form.getFieldDecorator('code', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.code != null &&
                        typeof modalRecord.code !== 'undefined'
                            ? modalRecord.code
                            : '',
                    rules: [{ required: false, message: '请输入组织编码' }],
                })(<Input placeholder="请输入组织编码" />)}
            </FormItem> */}
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类">
                {form.getFieldDecorator('zipcode', {
                    initialValue:
                        modalRecord != null &&
                        typeof zipcode !== 'undefined' &&
                        modalRecord.zipcode != null &&
                        typeof modalRecord.zipcode !== 'undefined' &&
                        modalRecord.zipcode !== '0'
                            ? modalRecord.zipcode
                            : [],
                })(
                    <TreeSelect
                        style={{ width: '100%' }}
                        allowClear
                        labelInValue
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeNodeFilterProp="name"
                        treeCheckable={true}
                        placeholder=""
                        treeDefaultExpandAll
                        showSearch
                    >
                        {renderTreeNodes(sysdeptList)}
                    </TreeSelect>
                )}
            </FormItem> */}
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="负责人(AS)">
                {form.getFieldDecorator('primaryPerson', {
                    initialValue: '',
                })(
                    <>
                        {isNotBlank(ASpersonnelName) && ASpersonnelName.who == 'as' && (
                            <div>
                                {isNotBlank(ASpersonnelName.src) && (
                                    <Avatar
                                        src={ASpersonnelName.src ? ASpersonnelName.src : ''}
                                        shape="square"
                                        size="default"
                                    />
                                )}
                                <Tag color="cyan" style={{ marginLeft: 10 }}>
                                    {isNotBlank(modalRecord) &&
                                    isNotBlank(modalRecord.primaryPerson) &&
                                    isNotBlank(modalRecord.primaryPerson.name)
                                        ? modalRecord.primaryPerson.name
                                        : ASpersonnelName.name}
                                </Tag>
                                <Button
                                    type="dashed"
                                    size="small"
                                    onClick={() => {
                                        handleResetSelect('as');
                                    }}
                                >
                                    重新选择
                                    <Icon type="close" />
                                </Button>
                            </div>
                        )}
                        <Button
                            size="small"
                            type="primary"
                            style={{
                                display:
                                    ASpersonnelName.name ||
                                    (isNotBlank(modalRecord) &&
                                        isNotBlank(modalRecord.primaryPerson) &&
                                        isNotBlank(modalRecord.primaryPerson.name))
                                        ? 'none'
                                        : '',
                            }}
                            onClick={() => {
                                HandleAddpeopelToDuty('as');
                            }}
                        >
                            <Icon type="arrow-up" />
                            选择人员
                        </Button>
                    </>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="负责人(进度员)">
                {form.getFieldDecorator('deputyPerson', {
                    initialValue: '',
                })(
                    <>
                        {JDpersonnelName && JDpersonnelName.who == 'jd' && (
                            <div>
                                {isNotBlank(JDpersonnelName.src) && (
                                    <Avatar
                                        src={JDpersonnelName.src ? JDpersonnelName.src : ''}
                                        shape="square"
                                        size="default"
                                    />
                                )}
                                <Tag color="cyan" style={{ marginLeft: 10 }}>
                                    {isNotBlank(modalRecord) &&
                                    isNotBlank(modalRecord.deputyPerson) &&
                                    isNotBlank(modalRecord.deputyPerson.name)
                                        ? modalRecord.deputyPerson.name
                                        : JDpersonnelName.name}
                                </Tag>
                                <Button
                                    type="default"
                                    size="small"
                                    onClick={() => {
                                        handleResetSelect('jd');
                                    }}
                                >
                                    重新选择
                                    <Icon type="close" />
                                </Button>
                            </div>
                        )}
                        <Button
                            size="small"
                            type="primary"
                            style={{
                                display:
                                    JDpersonnelName.name ||
                                    (isNotBlank(modalRecord) &&
                                        isNotBlank(modalRecord.deputyPerson) &&
                                        isNotBlank(modalRecord.deputyPerson.name))
                                        ? 'none'
                                        : '',
                            }}
                            onClick={() => {
                                HandleAddpeopelToDuty('jd');
                            }}
                        >
                            <Icon type="arrow-up" />
                            选择人员
                        </Button>
                    </>
                )}
            </FormItem>
        </Modal>
    );
});

const CreateFormRy = Form.create()(props => {
    const {
        handleModalVisibleRy,
        cpAssemblyFormList,
        selectRyflag,
        handleSelecModelOk,
        selectpersonnelvisible,
        handleSelectPersonnelOk,
        handleModalVisiblekh,
        handleSelectPersonnelCancel,
        data,
        handleSearch1,
        handleFormReset1,
        selectkRyflag,
        tableData,
        form,
        handleStandardTableChange,
    } = props;
    const { getFieldDecorator } = form;

    const searchmodel = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            handleSearch1(values);
        });
    };

    const handleFormResetin = () => {
        form.resetFields();
        handleFormReset1();
    };

    const columnskh = [
        {
            title: '操作',
            width: 150,
            render: record => (
                <Fragment>
                    <a onClick={() => handleSelecModelOk(record)}>选择</a>
                </Fragment>
            ),
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
    ];

    return (
        <Modal
            title="选择人员"
            visible={selectkRyflag}
            // onOk={okHandle}
            onCancel={() => handleModalVisiblekh()}
            width="80%"
        >
            <Form onSubmit={searchmodel} layout="inline">
                <Row gutter={8}>
                    <Col md={6} sm={24}>
                        <FormItem
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                            label="电话"
                            size="small"
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator('mobile', {
                                initialValue: '',
                            })(<Input placeholder="请输入电话" size="small" />)}
                        </FormItem>
                    </Col>
                    {/* <Col md={4} sm={24}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                label="编号"
                                size="small"
                            >
                                {getFieldDecorator('no', {
                                    initialValue: '',
                                })(<Input size="small" placeholder="请输入人员编号" />)}
                            </FormItem>
                        </Col> */}
                    <Col md={4} sm={24}>
                        <FormItem
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                            label="名称"
                            size="small"
                        >
                            {getFieldDecorator('name', {
                                initialValue: '',
                            })(<Input size="small" placeholder="请输入人员名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                            label="性别"
                            size="sex"
                        >
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
                            <Button
                                style={{ marginLeft: 8 }}
                                size="small"
                                onClick={handleFormResetin}
                            >
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
            <StandardTable
                //  rowSelection = {rowSelection}
                scroll={{ x: 950 }}
                //  selectedRows={selectedRows}
                //  loading={loading}
                defaultExpandAllRows
                data={tableData}
                columns={columnskh}
                 pagination={true}
                //  onSelectRow={handleSelectRows}
                onChange={handleStandardTableChange}
            />
        </Modal>
    );
});

@connect(({ sysuser, loading }) => {
    return {
        ...sysuser,
        loading: loading.models.sysuser,
    };
})
@Form.create()
export class SelectPersonnel extends PureComponent {
    state = {
        tableData: [],
    };
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 30 },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    }
    handleSearch = e => {
        e.preventDefault();
        const that = this;
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                current: 1,
                pageSize: 30,
            };
            that.setState({
                formValues: values,
            });

            dispatch({
                type: 'sysuser/fetch',
                payload: {
                    ...values,
                },
                callback: data => {
                    that.setState({
                        tableData: data,
                    });
                },
            });
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
            payload: { current: 1, pageSize: 30 },
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
    };

    clearCheck = () => {
        // 处理勾选数据后清空勾选
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        const {
            selectpersonnelvisible,
            handleSelectPersonnelOk,
            handleSelectPersonnelCancel,
            loading,
            selectedRows,
            selectedRowKeys,
            data,
            handleSelectRows,
            form: { getFieldDecorator },
            isModifier,
            modelclose,
        } = this.props;
        const { tableData } = this.state;
        const rowSelection = {
            selectedRowKeys, //这里是起作用的关键
            onChange: selectedRowKeys => {
                this.setState({
                    selectedRowKeys,
                });
            },
        };

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
        ];
        const columnsNoModifier = [
            {
                title: '姓名',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                width: 150,
            },
            {
                title: '电话',
                dataIndex: 'mobile',
                width: 150,
            },
        ];
        return (
            <Modal
                title="选择人员"
                visible={selectpersonnelvisible}
                onOk={() => {
                    handleSelectPersonnelOk();
                }}
                onCancel={() => {
                    handleSelectPersonnelCancel();
                }}
                width={1000}
            >
                <Form onSubmit={this.handleSearch} layout="inline">
                    <Row gutter={8}>
                        <Col md={6} sm={24}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                label="电话"
                                size="small"
                                style={{ width: '100%' }}
                            >
                                {getFieldDecorator('mobile', {
                                    initialValue: '',
                                })(<Input placeholder="请输入电话" size="small" />)}
                            </FormItem>
                        </Col>
                        <Col md={4} sm={24}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                label="名称"
                                size="small"
                            >
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                })(<Input size="small" placeholder="请输入人员名称" />)}
                            </FormItem>
                        </Col>
                        <Col md={4} sm={24}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                label="性别"
                                size="sex"
                            >
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
                                <Button
                                    style={{ marginLeft: 8 }}
                                    size="small"
                                    onClick={this.handleFormReset}
                                >
                                    重置
                                </Button>
                            </span>
                        </Col>
                    </Row>
                </Form>
                <StandardTable
                    rowSelection={rowSelection}
                    scroll={{ x: 950 }}
                    selectedRows={selectedRows}
                    loading={loading}
                    defaultExpandAllRows
                    data={tableData ? tableData : { list: [] }}
                    columns={isModifier ? columns : columnsNoModifier}
                    pagination={true}
                    onSelectRow={handleSelectRows}
                    onChange={this.handleStandardTableChange}
                />
            </Modal>
        );
    }
}

@connect(({ sysoffice, loading, sysarea, user, sysuser, sysdeptList }) => ({
    sysoffice,
    user,
    sysuser,
    areaList: sysarea.data,
    sysdeptList,
    loading: loading.models.sysoffice,
}))
@Form.create()
class sysofficeList extends PureComponent {
    state = {
        expandForm: false,
        selectedRows: [],
        modalVisible: false,
        formValues: {},
        personvalues: {},
        modalRecord: {},
        selectpersonnelvisible: false, // 二级弹框的显示隐藏
        SelectPersonnelRows: [], // 二级弹框的selectrows
        ASpersonnelName: {}, //选择的人员的名字
        JDpersonnelName: {},
        whoSelect: '',
    };

    componentDidMount() {
        const { dispatch } = this.props;
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
        dispatch({
            type: 'sysdeptList/list',
        });
    }

    HandleAddpeopelToDuty = msg => {
        this.setState({
            selectkRyflag: true,
            whoSelect: msg,
        });
    };

  
    handleResetSelect = msg => {
        if (msg == 'as') {
            const data = Object.assign({}, this.state.modalRecord, { primaryPerson: {} });
            this.setState({
                ASpersonnelName: {},
                modalRecord: data,
            });
        } else if (msg == 'jd') {
            const data = Object.assign({}, this.state.modalRecord, { deputyPerson: {} });
            this.setState({
                JDpersonnelName: {},
                modalRecord: data,
            });
        }
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
            type: 'sysoffice/fetch',
            payload: params,
            callback,
        });
    };

    modelclose = () => {
        this.clearCheck();
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'sysoffice/fetch',
            payload: {},
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    };

    handleFormReset1 = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'sysuser/fetch',
            payload: {},
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    };

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    };

    removeClick = () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        if (!selectedRows) return;
        dispatch({
            type: 'sysoffice/remove',
            payload: {
                id: selectedRows.map(row => row.id).join(','),
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                });
                dispatch({
                    type: 'sysoffice/fetch',
                });
            },
        });
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
            modalRecord: {},
        });
    };

    handleAdd = fields => {
        this.props.dispatch({
            type: 'sysoffice/add',
            payload: fields,
        });

        this.setState({
            modalVisible: false,
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
                type: 'sysoffice/fetch',
                payload: values,
            });
        });
    };

    handleModalChange = record => {
        if (
            record != null &&
            record !== 'undefined' &&
            record.id != null &&
            record.id !== 'undefined'
        ) {
            this.setState({
                modalRecord: record,
                modalVisible: true,
                ASpersonnelName:
                    isNotBlank(record.primaryPerson) && isNotBlank(record.primaryPerson.name)
                        ? {
                              who: 'as',
                          }
                        : {},
                JDpersonnelName:
                    isNotBlank(record.deputyPerson) && isNotBlank(record.deputyPerson.name)
                        ? {
                              who: 'jd',
                          }
                        : {},
            });
        }
    };

    lowerModalChange = record => {
        if (
            record != null &&
            record !== 'undefined' &&
            record.id != null &&
            record.id !== 'undefined'
        ) {
            this.setState({
                modalRecord: { parentId: record.id, area: record.area },
                modalVisible: true,
            });
        }
    };

    renderSimpleForm() {
        const { areaList } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="基地名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入基地名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="所属负责人">
                            {getFieldDecorator('area')(
                                // <TreeSelect
                                //     style={{ width: '100%' }}
                                //     allowClear
                                //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                //     treeData={areaList.list}
                                //     treeNodeFilterProp="label"
                                //     placeholder="选择归属区域"
                                //     treeDefaultExpandAll
                                //     showSearch
                                // />
                                <Input placeholder="请输入负责人姓名" />
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
                            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a> */}
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { areaList } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="基地名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="归属区域">
                            {getFieldDecorator('area')(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    allowClear
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={areaList.list}
                                    treeNodeFilterProp="label"
                                    placeholder="选择归属区域"
                                    treeDefaultExpandAll
                                    showSearch
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="基地负责人">
                            {getFieldDecorator('master')(<Input placeholder="请输入..." />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="部门电话">
                            {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <div style={{ overflow: 'hidden' }}>
                            <span style={{ float: 'right', marginBottom: 24 }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                    重置
                                </Button>
                                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                    收起 <Icon type="up" />
                                </a>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    handleSelectPersonnelCancel() {
        // 二级弹框取消事件
        this.setState({
            selectpersonnelvisible: false,
        });
    }

    handleSelectPersonnelOk() {
        // 二级弹框确定事件
        const { SelectPersonnelRows, whoSelect } = this.state;
        if (!isNotBlank(SelectPersonnelRows) || SelectPersonnelRows.length == 0) {
            message.error('请选择人员');
            return;
        } else if (SelectPersonnelRows.length > 1) {
            message.error('最多只能选择一个人！');
            return;
        } else {
            if (whoSelect && whoSelect == 'as') {
                this.setState({
                    selectpersonnelvisible: false,
                    ASpersonnelName: {
                        name: SelectPersonnelRows[0].name,
                        src: SelectPersonnelRows[0].photo,
                        who: whoSelect,
                        nameid: SelectPersonnelRows[0].id,
                    },
                });
            }
            if (whoSelect && whoSelect == 'jd') {
                this.setState({
                    selectpersonnelvisible: false,
                    JDpersonnelName: {
                        name: SelectPersonnelRows[0].name,
                        src: SelectPersonnelRows[0].photo,
                        who: whoSelect,
                        nameid: SelectPersonnelRows[0].id,
                    },
                });
                this.setState({});
            }
        }
    }

    handlePersonnelSelectRows(selectedRows) {
        // 二级弹框的表格选择事件
        this.setState({
            SelectPersonnelRows: selectedRows,
        });
    }

    //    handleSearch = (val) => {
    //     const { dispatch, form } = this.props;
    //         dispatch({
    //             type: 'sysuser/fetch',
    //             payload: val
    //         });
    //     };

    handleSearch1 = val => {
        const { dispatch, form } = this.props;
        this.setState({ personvalues: val });
        dispatch({
            type: 'sysuser/fetch',
            payload: { ...val, current: 1, pageSize: 10 },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    };

    handleSelecModelOk = res => {
        // 二级弹框确定事件
        const that = this;
        const { whoSelect } = this.state;
        if (whoSelect && whoSelect == 'as') {
            that.setState({
                selectkRyflag: false,
                ASpersonnelName: {
                    name: res.name,
                    src: res.photo,
                    who: whoSelect,
                    nameid: res.id,
                },
            });
        }
        if (whoSelect && whoSelect == 'jd') {
            that.setState({
                selectkRyflag: false,
                JDpersonnelName: {
                    name: res.name,
                    src: res.photo,
                    who: whoSelect,
                    nameid: res.id,
                },
            });
        }
    };

    handleModalVisiblekh = () => {
        this.setState({
            selectkRyflag: false,
        });
    };
    handleStandardTableChangeRy = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { personvalues } = this.state;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});
        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...personvalues,
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
    };
    render() {
        const {
            sysoffice: { data },
            sysdeptList,
            loading,
            areaList,
            form,
        } = this.props;
        const {
            selectedRows,
            modalVisible,
            selectpersonnelvisible,
            ASpersonnelName,
            JDpersonnelName,
            selectedRowKeys,
            selectkRyflag,
            tableData,
        } = this.state;

        const columns = [
            {
                title: '组织管理',
                dataIndex: 'name',
                width: 350,
                render: (text, record) => (
                    <a onClick={() => this.handleModalChange(record)}>{text}</a>
                ),
            },
            {
                title: '组织编码',
                dataIndex: 'code',
                width: 150,
            },
            {
                title: '负责人(AS)',
                dataIndex: 'primaryPerson.name',
                width: 150,
            },
            {
                title: '负责人(进度员)',
                dataIndex: 'deputyPerson.name',
                width: 150,
            },

            {
                title: '操作',
                width: 150,
                render: record => {
                    return (
                        <Fragment>
                            <a onClick={() => this.handleModalChange(record)}>修改</a>
                            <Divider type="vertical" />
                            {/* <a onClick={() => this.lowerModalChange(record)}>添加下级</a> */}
                        </Fragment>
                    );
                },
            },
        ];

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            list:
                data != null && data !== 'undefined' && data.list != null && data.list.length > 0
                    ? data.list
                    : [],
            modalRecord: this.state.modalRecord, // 用于回显数据
            sysdeptList:
                isNotBlank(sysdeptList) &&
                isNotBlank(sysdeptList.data) &&
                isNotBlank(sysdeptList.data.list)
                    ? sysdeptList.data.list
                    : [],
            HandleAddpeopelToDuty: this.HandleAddpeopelToDuty,
            handleResetSelect: this.handleResetSelect,
            ASpersonnelName,
            JDpersonnelName,
        };

        const SelectPersonnelprops = {
            handleSelectPersonnelOk: this.handleSelectPersonnelOk.bind(this),
            handleSelectPersonnelCancel: this.handleSelectPersonnelCancel.bind(this),
            modelclose: this.modelclose,
            handleSelectRows: this.handlePersonnelSelectRows.bind(this),
            selectedRows: this.state.SelectPersonnelRows,
            selectedRowKeys,
        };

        const parentMethodsRy = {
            handleSearch1: this.handleSearch1,
            handleFormReset1: this.handleFormReset1,
            form,
            handleSelecModelOk: this.handleSelecModelOk,
            selectkRyflag,
            handleModalVisiblekh: this.handleModalVisiblekh,
            tableData,
            handleStandardTableChange: (pagination, filtersArg, sorter) =>
                this.handleStandardTableChangeRy(pagination, filtersArg, sorter),
        };

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
                        {/* <div className={styles.tableListOperator}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => this.handleModalVisible(true)}
                            >
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <Button onClick={() => this.removeClick()}>删除</Button>
                            )}
                        </div> */}
                        <StandardTable
                            scroll={{ x: 950 }}
                            // selectedRows={selectedRows}
                            loading={loading}
                            defaultExpandAllRows
                            data={data}
                            columns={columns}
                            pagination={true}
                            // onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm {...parentMethods} modalVisible={modalVisible} />

                <CreateFormRy {...parentMethodsRy} />
                <SelectPersonnel
                    selectpersonnelvisible={selectpersonnelvisible}
                    {...SelectPersonnelprops}
                />
            </PageHeaderWrapper>
        );
    }
}
export default sysofficeList;

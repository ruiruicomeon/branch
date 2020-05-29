import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Modal, TreeSelect, Icon, Button, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MemEquiInfoList.less';

const FormItem = Form.Item;

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
        onChangepl
    } = props;

    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            let values = {};
            if (
                modalRecord != null &&
                modalRecord !== 'undefined' &&
                modalRecord.id != null &&
                modalRecord.id !== 'undefined'
            ) {
                values = { ...fieldsValue, id: modalRecord.id };
            } else {
                values = { ...fieldsValue };
            }
            handleAdd(values);
        });
    };
    

    return (
        <Modal
            title={
                modalRecord != null &&
                modalRecord !== 'undefined' &&
                modalRecord.id != null &&
                modalRecord.id !== 'undefined'
                    ? '修改品类'
                    : '新增品类'
            }   
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级品类" >
                {form.getFieldDecorator('parent', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.parentId != null &&
                        typeof modalRecord.parentId !== 'undefined' &&
                        modalRecord.parentId !== '0'
                            ? modalRecord.parentId
                            : [],
                    })(
                    <TreeSelect               
                        style={{ width: '100%' }}
                        allowClear
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={list}
                        treeNodeLabelProp="name"
                        treeNodeFilterProp="parentId"
                        // treeNodeFilterProp="label"
                        onSelect={onChangepl()}
                        placeholder="选择父级品类"
                        treeDefaultExpandAll  //默认展开所有节点
                        showSearch
                    />
                 )} 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类名称">
                {form.getFieldDecorator('name', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.name != null &&
                        typeof modalRecord.name !== 'undefined'
                            ? modalRecord.name
                            : '',
                    rules: [{ required: true, message: '请输入品类名称' }],
                })(<Input placeholder="请输入品类名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类编码">
                {form.getFieldDecorator('code', {
                    initialValue:
                        modalRecord != null &&
                        typeof modalRecord !== 'undefined' &&
                        modalRecord.code != null &&
                        typeof modalRecord.code !== 'undefined'
                            ? modalRecord.code
                            : '',
                    rules: [{ required: true, message: '请输入品类编码' }],
                })(<Input placeholder="请输入品类编码" />)}
            </FormItem>
        </Modal>
    );
});

@connect(({ sysdeptList, loading, sysareaonly }) => ({
    sysdeptList,
    areaList: sysareaonly.list,
    sysareaonly,
    loading: loading.models.sysareaonly,
}))
@Form.create()
class CategoryManage extends PureComponent {
    state = {
        expandForm: false,
        selectedRows: [],
        modalVisible: false,
        formValues: {},
        modalRecord: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sysdeptList/list',
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

        // dispatch({
        //   type: 'sysdeptList/list',
        //   payload: params,
        // });

        dispatch({
            type: 'sysdeptList/fetch',
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
            type: 'sysdeptList/fetch',
            payload: {},
        });
        // dispatch({
        //   type: 'sysdeptList/list',
        //   payload: {},
        // });
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
            type: 'sysdeptList/remove',
            payload: {
                id: selectedRows.map(row => row.id).join(','),
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                });
                dispatch({
                    type: 'sysdeptList/list',
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
            type: 'sysdeptList/add',
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
                type: 'sysdeptList/fetch',
                payload: values,
            });

            //   dispatch({
            //     type: 'sysdeptList/list',
            //     payload: values,
            //   });
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
                        <FormItem label="品类名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="品类编号">
                            {getFieldDecorator('master')(
                                // <TreeSelect
                                //     style={{ width: '100%' }}
                                //     allowClear
                                //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                //     treeData={areaList}
                                //     treeNodeFilterProp="label"
                                //     placeholder="选择归属区域"
                                //     treeDefaultExpandAll
                                //     showSearch
                                // />
                                <Input  placeholder="请输入品类编号"/>
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
                        <FormItem label="品类名称">
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
                                    treeData={areaList && areaList.list}
                                    treeNodeFilterProp="label"
                                    placeholder="选择归属区域"
                                    treeDefaultExpandAll
                                    showSearch
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="科室负责人">
                            {getFieldDecorator('master')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="科室电话">
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

    onChangepl=(a,b,c)=>{
        console.log(123)
        console.log(a,b,c)
    }

    render() {
        const {
            sysdeptList: { data },
            loading,
            areaList,
        } = this.props;
        const { selectedRows, modalVisible } = this.state;

        let list = [];
        const columns = [
            {
                title: '品类名称',
                dataIndex: 'name',
                width: 350,
                // render: (text, record) => (
                //     <Link
                //         to={{
                //             pathname: '/dashboard/dept-main',
                //             data: {
                //                 id:
                //                     record != null &&
                //                     typeof record !== 'undefined' &&
                //                     record.id != null &&
                //                     typeof record.id !== 'undefined'
                //                         ? record.id
                //                         : '',
                //             },

                //             state: { fromDashboard: true },
                //         }}
                //     >
                //         {text != null && text !== 'undefined' && text !== '' ? text : ''}
                //     </Link>
                // ),
            },
            {
                title: '品类编号',
                dataIndex: 'code',
                width: 150,
            },
            // {
            //     title: '操作',
            //     width: 150,
            //     render: record => (
            //         <Fragment>
            //             <a onClick={() => this.handleModalChange(record)}>修改</a>
            //             <Divider type="vertical" />
            //             {/* <a onClick={() => this.lowerModalChange(record)}>添加下级</a> */}
            //         </Fragment>
            //     ),
            // },
        ];

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            list:
                data != null && data !== 'undefined' && data.list != null && data.list.length > 0
                    ? data.list
                    : [],
            arealist:
                areaList != null &&
                areaList !== 'undefined' &&
                areaList.list != null &&
                areaList.list.length > 0
                    ? areaList.list
                    : [],
            modalRecord: this.state.modalRecord,
            onChangepl:this.onChangepl
        };

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => this.handleModalVisible(true)}
                            >
                                新建
                            </Button>
                            {selectedRows.length > 0 ? (
                                <Button onClick={() => this.removeClick()}>删除</Button>
                            ) : (
                                ''
                            )
                            //   && (
                            //     <span>
                            //       {localStorage.getItem('roles') != null &&
                            //       typeof localStorage.getItem('roles') !== 'undefined' &&
                            //       localStorage.getItem('roles') !== '' &&
                            //       (localStorage.getItem('roles').indexOf('admin') >= 0 ||
                            //         localStorage.getItem('roles').indexOf('general_manager') >= 0) ? (
                            //           <Button onClick={() => this.removeClick()}>删除</Button>
                            //       ) : null}
                            //     </span>
                            //   )
                            }
                        </div> */}
                        <StandardTable
                            scroll={{ x: 950 }}
                            // selectedRows={selectedRows}
                            loading={loading}
                            defaultExpandAllRows
                            data={data}
                            columns={columns}
                            pagination={false}
                            // onSelectRow={this.handleSelectRows}
                            // onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm {...parentMethods} modalVisible={modalVisible} />
            </PageHeaderWrapper>
        );
    }
}
export default CategoryManage;

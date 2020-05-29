/**
 * 待办事项
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Button,
    Input,
    InputNumber,
    Form,
    Card,
    Popconfirm,
    Icon,
    Row,
    Col,
    Select,
    DatePicker,
    Divider,
    Tag,
    Avatar,
    message,
    Modal,
    Table,
    Spin,
} from 'antd';
import router from 'umi/router';
import { Link } from 'dva/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, proccessObject  } from '@/utils/utils';
import moment from 'moment';
import styles from './backlogList.less';
import { getStorage } from '@/utils/localStorageUtils';
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

@connect(({ communication, loading, sysuser }) => ({
    ...communication,
    sysuser,
    loading: loading.models.communication,
    userloading: loading.effects['sysuser/fetch'],
}))
@Form.create()
class GetTodoMatterinfo extends PureComponent {
    state = {
        expandForm: false,
        selectedRows: [],
        formValues: {},
        visible: false,
        personIds: [],
        pageSize: 10,
    };

    componentDidMount() {
        const { dispatch } = this.props;
        let pageSize_cookie = getStorage('pageSize');
        if (isNotBlank(pageSize_cookie)) {
            this.setState({ pageSize: Number(pageSize_cookie) });
        }
        dispatch({
            type: 'communication/getTodoMatterinfo',
            payload: {
                current: 1,
                pageSize: Number(pageSize_cookie) ? Number(pageSize_cookie) : this.state.pageSize,
            },
        });
        dispatch({
            // 用户选择
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 50 },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
        dispatch({
            //  车间
            type: 'communication/fetch_workshop_wx',
            payload: {
                current: 1,
                pageSize: 5000,
            },
        });
    }
    componentWillUnmount() {
        const { pageSize } = this.state;
      
    }

    gotoForm = () => {
        router.push(`/worktree/listdone/dateil`);
    };

    gotoUpdateForm = (id, msg) => {
        router.push(`/worktree/Communication?id=${id}&msg=${msg}`);
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        this.setState({ current: pagination.current, pageSize: pagination.pageSize });
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        let sort = {};
        if (isNotBlank(sorter) && isNotBlank(sorter.field)) {
            if (sorter.order === 'ascend') {
                sort = {
                    'page.orderBy': `${sorter.field} asc`,
                };
            } else if (sorter.order === 'descend') {
                sort = {
                    'page.orderBy': `${sorter.field} desc`,
                };
            }
        }

        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...sort,
            ...formValues,
            ...filters,
        };
        dispatch({
            type: 'communication/getTodoMatterinfo',
            payload: { ...params },
        });
    };

    handleFormReset = () => {
        // 重置
        const { formValues } = this.state;
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({
            type: 'communication/getTodoMatterinfo',
            payload:{current:1,pageSize:this.state.pageSize}
        });
        this.setState({ formValues: {} });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
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
        const { personIds } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let values = {
                ...fieldsValue,
            };
            if (values.createDate && values.createDate.length > 0) {
                values.beginCreateDate = values.createDate[0];
                values.endCreateDate = values.createDate[1];
                delete values.createDate;
            } else {
                delete values.createDate;
            }
          
            Object.keys(values).map(item => {
                if (values[item] instanceof moment) {
                    values[item] = values[item].format('YYYY-MM-DD');
                }
                return item;
            });
            values.orderSelfNum = values.orderSelfNum
                ? values.orderSelfNum
                      .split('\n')
                      .filter(Boolean)
                      .join(',')
                : '';
            values = proccessObject(values);
            this.setState({
                formValues: values,
            });
            dispatch({
                type: 'communication/getTodoMatterinfo',
                payload: { ...values },
            });
        });
    };

    // 点击保存返回的id与修改的数据
    onSaveData = (key, row) => {
        const { formValues } = this.state;
        const { dispatch } = this.props;
        const value = { ...row };
        if (isNotBlank(value)) {
            Object.keys(value).map(item => {
                if (value[item] instanceof moment) {
                    value[item] = value[item].format('YYYY-MM-DD');
                }
                return item;
            });
        }
    };
    onSelectPersonSearch(value) {
        const { dispatch } = this.props;
        dispatch({
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 30, name: value },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    }

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
            getWorkShopList,
            userloading,
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                    <Col md={8} sm={24} span={8}>
                        <FormItem label="订单自编号">
                            {getFieldDecorator('orderSelfNum', {
                                initialValue: '',
                            })(<TextArea placeholder="请输入订单自编号" rows={4} />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="异常类型" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('warringType', {
                                initialValue: '',
                            })(
                                <Select>
                                    <Option key={1} value={1}>
                                        推迟
                                    </Option>
                                    <Option key={2} value={2}>
                                        预警
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="批次号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('batchNum', {
                                initialValue: '',
                            })(<Input placeholder="请输入批次号" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem
                            className={styles.formicon}
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="异常创建时间"
                            style={{ padding: 0 }}
                        >
                            {getFieldDecorator('createDate', {
                                initialValue: '',
                            })(<RangePicker size="default" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col md={8} sm={24}>
                        <FormItem
                            className={styles.formicon}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="异常创建人"
                            style={{ padding: 0 }}
                        >
                            {getFieldDecorator('createBy', {
                                initialValue: [],
                            })(
                                <Select
                                    onSearch={value => this.onSelectPersonSearch(value)}
                                    mode="multiple"
                                    placeholder="请选择创建人"
                                    optionLabelProp="lable"
                                    style={{ width: '100%' }}
                                    notFoundContent={userloading ? <Spin size="small" /> : null}
                                >
                                    {isNotBlank(this.state.tableData) &&
                                        isNotBlank(this.state.tableData.list) &&
                                        this.state.tableData.list.length > 0 &&
                                        this.state.tableData.list.map(item => {
                                            return (
                                                <Option
                                                    key={item.id}
                                                    value={item.id}
                                                    lable={item.name}
                                                >
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="车间">
                            {getFieldDecorator('deptCode', {
                                initialValue: [],
                            })(
                                <Select
                                    mode="multiple"
                                    placeholder="请选择车间名称"
                                    style={{ width: '100%' }}
                                >
                                    {isNotBlank(getWorkShopList) &&
                                        getWorkShopList.map(item => {
                                            return (
                                                <Option key={item.id} value={item.code}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }
    selectPersonChange(value, Option) {
        const { dispatch } = this.props;
        if (Option.length > 0) {
            let selectIdsArr = [];
            selectIdsArr = Option.map(item => item.key);
            this.setState({ personIds: selectIdsArr });
        }
    }
    handleBatch() {
        const { selectedRows } = this.state;
        const { dispatch } = this.props;
        if (selectedRows.length == 0) {
            message.warning('请先至少选择一条异常');
        } else {
            Modal.confirm({
                title: '批量处理',
                content: '请选择异常处理或者关闭异常',
                okText: '异常处理',
                cancelText: '关闭异常',
                onOk() {
                    router.push(`/worktree/Batch_dispose?msg=comm`);
                    dispatch({
                        type: 'communication/add_selectdata_comm',
                        payload: { selectdata: selectedRows },
                    });
                },
                onCancel() {
                    router.push(`/worktree/Batch_dispose?msg=close`);
                    dispatch({
                        type: 'communication/add_selectdata_comm',
                        payload: { selectdata: selectedRows },
                    });
                },
            });
        }
    }
    render() {
        const { selectedRows } = this.state;
        const { loading, TodoMatterinfoList, saveCompletedMatter, sysuser } = this.props;

        const sysuserList = sysuser.data.list;
        const columns = [
            {
                title: '订单自编号', // 必填显示
                dataIndex: 'orderSelfNum', // 必填 参数名
                inputType: 'text', // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
                width: 200, // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
                editable: true, // 选填  是否可编辑
                render: (text, record) => (
                    <Link to={`/worktree/exception?id=${record.oid}`}>{record.orderSelfNum}</Link>
                ),
            },
            {
                title: '预警类型', // 必填显示
                dataIndex: 'warringType', // 必填 参数名
                inputType: 'text', // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
                width: 100, // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
                editable: true, // 选填  是否可编辑
                render: text => {
                    if (text == '1') {
                        return <Tag color="#FFBA00">推迟</Tag>;
                    }
                    if (text == '2') {
                        return <Tag color="#f50">预警</Tag>;
                    }
                },
            },
            {
                title: '二级品类', // 必填显示
                dataIndex: 'secondCategoryName', // 必填 参数名
                inputType: 'text', // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
                width: 100, // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
                editable: true, // 选填  是否可编辑
            },
            {
                title: '车间', // 必填显示
                dataIndex: 'deptName', // 必填 参数名
                inputType: 'text', // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
                width: 200, // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
                editable: true, // 选填  是否可编辑
            },
            {
                title: '责任人', // 必填显示
                dataIndex: 'respUser', // 必填 参数名
                inputType: 'text', // 选填  编辑类型  text文本  number 数字  select单选   selectMultiple 多选
                width: 100, // 选填  宽度  百分比或者数字  如设置数字需要在Table设置scroll
                editable: true, // 选填  是否可编辑
                render: (text, record) => {
                    const list = [];
                    isNotBlank(record.respList) &&
                        record.respList.map(user => {
                            list.push(user.name);
                        });
                    return list.join(',');
                },
            },

            {
                title: '操作',
                width: 100,
                render: (text, record) => (
                    <Fragment>
                        <Divider type="vertical" />
                        <a onClick={() => this.gotoUpdateForm(record.id, 'undone')}>处理</a>
                    </Fragment>
                ),
            },
        ];

        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div className={styles.tableListOperator}>
                                {selectedRows.length > 0 ? (
                                    <span style={{ marginLeft: '10px' }}>
                                        <Button onClick={e => this.handleBatch(e)}>批量处理</Button>
                                    </span>
                                ) : (
                                    <span style={{ marginLeft: '10px' }}>
                                        <Button disabled onClick={e => this.handleBatch(e)}>
                                            批量处理
                                        </Button>
                                    </span>
                                )}
                            </div>
                            <StandardEditTable
                                scroll={{ x: 800 }}
                                selectedRows={selectedRows}
                                loading={loading}
                                data={TodoMatterinfoList}
                                bordered
                                columns={columns}
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
export default GetTodoMatterinfo;

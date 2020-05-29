import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Button,
    Input,
    Form,
    Card,
    Icon,
    Row,
    Col,
    DatePicker,
    message,
    Modal,
    Empty,
    Switch,
    Select,
    InputNumber,
    Popconfirm,
    Divider,
    Tag,
    Avatar,
    List,
    Radio,
    Collapse,
    Transfer,
    Table,
    Badge,
    Menu,
    Dropdown,
    Pagination,
    Checkbox,
    Spin,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, deepCopy, proccessObject  } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import { homeUrl } from '../../../config/baseConfig';
import styles from './Dutyjudge.less';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { stringify, parse } from 'qs';
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

import notattention from '../../assets/notattention.png'; // Icon
import attention from '../../assets/attention.png';
import warning from '../../assets/Warning.png';
import warningone from '../../assets/warningone.png';
import warningtwo from '../../assets/waring_new_two.png';
import wraningnewone from '../../assets/wraning_new_one.png';

const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
export const RenderModel = Form.create()(props => {
    const {
        form: { getFieldDecorator },
        form,
        previewVisible,
        handleCancel,
        handleSubmit,
    } = props;

    const ResetForm = () => {
        form.resetFields();
    };
    const inquire = () => {
        // 查询按钮
        form.validateFields((error, fieldsValue) => {
            if (!error) {
                handleSubmit(fieldsValue);
            }
        });
    };

    return (
        <Modal
            width={1000}
            visible={previewVisible}
            closeIcon={<Icon type="close" onClick={() => handleCancel()} />}
            footer={
                <>
                    <Button type="primary" onClick={inquire}>
                        查询
                    </Button>
                    <Button type="primary" onClick={ResetForm}>
                        重置
                    </Button>
                    <Button onClick={() => handleCancel()}>取消</Button>
                </>
            }
        >
            <Row>
                <Col span={12}>
                    <FormItem label="基地" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('siteName', {
                            initialValue: '',
                        })(<Input placeholder="请输入基地" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
                        {form.getFieldDecorator('ScheduleBeginDate', {
                            initialValue: '',
                        })(<RangePicker />)}
                    </FormItem>
                </Col>

                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
                        {form.getFieldDecorator('deptName', {
                            initialValue: '',
                        })(<Input placeholder="请输入车间" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级排产时间">
                        {getFieldDecorator('schedulingtime', {
                            initialValue: '',
                        })(<RangePicker style={{ width: '100%' }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类">
                        {form.getFieldDecorator('buName', {
                            initialValue: '',
                        })(<Input placeholder="请输入品类" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="订单自编号">
                        {form.getFieldDecorator('orderSelfNum', {
                            initialValue: '',
                        })(<TextArea placeholder="批量查询单击分隔" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="二级品类">
                        {form.getFieldDecorator('secondCategoryName', {
                            initialValue: '',
                        })(<Input placeholder="请输入二级品类" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="MSCS订单号">
                        {form.getFieldDecorator('wccNum', {
                            initialValue: '',
                        })(<TextArea placeholder="批量查询  分隔" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="批次号">
                        {form.getFieldDecorator('batchNum', {
                            initialValue: '',
                        })(<Input placeholder="请输入批次号" />)}
                    </FormItem>
                </Col>
            </Row>
        </Modal>
    );
});

@connect(({ warning, loading, sysdeptList, sysoffice, communication, dictionaryL, sysuser }) => ({
    ...warning,
    ...sysoffice,
    ...sysdeptList,
    ...communication,
    ...dictionaryL,
    ...sysuser,
    loading: loading.models.warning,
    userloading: loading.effects['sysuser/fetch'],
}))
@Form.create()
class DutyJudgePageList extends PureComponent {
    state = {
        selectedRows: [],
        isWatch: Boolean,
        formValues: {},
        buttonloading: false,
        expandForm: false, // 渲染from组件
        selectArray: [],
        pageSize: 10, // 每页显示多少条数
        previewVisible: false, // 显示弹窗
        checkedList: [], // 多选框
        current: 1, // 当前页码
        Graydata: {
            list: [],
            pagination: {},
        },
        siteCode: '', // 基地code
        sitename: '', // 基地名称
        buname: '', // 品类name
        selfNumArr: [], // 多个自定义id
        wccNumArr: [],

        isCheckAll: '', // 多选
        selectdata: [],
        selectflag: {},
        zfflag: true,
        zfflag1: true,
        isCheckAllSearch: '',
        personIds: [], // 选择异常创建人
        currentUserData: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
        if (isNotBlank(getStorage('token'))) {
            let pageSize_cookie = getStorage('pageSize');
            if (isNotBlank(pageSize_cookie)) {
                this.setState({ pageSize: Number(pageSize_cookie) });
            }
            if (isNotBlank(localStorage.getItem('dutyjudge'))) {
                const setItemValue = parse(localStorage.getItem('dutyjudge'));
                if (isNotBlank(setItemValue.formValues)) {
                    dispatch({
                        type: 'warning/fetch',
                        payload: {
                            current: setItemValue.current,
                            pageSize: setItemValue.pageSize,
                            ...setItemValue.formValues,
                        },
                        callback: data => {
                            if (setItemValue.expandForm === 'true') {
                                this.setState({
                                    expandForm: true,
                                });
                            } else {
                                this.setState({
                                    expandForm: false,
                                });
                            }
                            this.setState({
                                Graydata: data,
                                formValues: setItemValue.formValues,
                                current: setItemValue.current,
                                pageSize: setItemValue.pageSize,
                            });
                            localStorage.removeItem('dutyjudge');
                        },
                    });
                } else {
                    dispatch({
                        type: 'warning/fetch',
                        payload: {
                            current: setItemValue.current,
                            pageSize: setItemValue.pageSize,
                        },
                        callback: data => {
                            if (setItemValue.expandForm === 'true') {
                                this.setState({
                                    expandForm: true,
                                });
                            } else {
                                this.setState({
                                    expandForm: false,
                                });
                            }
                            this.setState({
                                Graydata: data,
                                current: setItemValue.current,
                                pageSize: setItemValue.pageSize,
                            });
                            localStorage.removeItem('dutyjudge');
                        },
                    });
                }
            } else {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: 1,
                        pageSize: isNotBlank(Number(pageSize_cookie))
                            ? Number(pageSize_cookie)
                            : this.state.pageSize,
                    },
                    callback: data => {
                        this.setState({
                            Graydata: data,
                        });
                    },
                });
            }

            dispatch({
                // 品类
                type: 'communication/fetch_buname_wx',
                payload: { grade: 1 },
                callback: data => {
                    this.setState({
                        BUnameList: data,
                    });
                },
            });
            dispatch({
                // 基地
                type: 'communication/fetch_basenamelist',
                payload: { grade: 1, type: 1 },
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
                type: `user/fetchCurrent_myself`,
                callback: data => {
                    if (isNotBlank(data)) {
                        this.setState({ currentUserData: data });
                    }
                },
            });
        }
    }

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };
    componentWillUnmount() {
        const { dispatch } = this.props;
        const { formValues, current, pageSize, expandForm } = this.state;
        let setItemValue = {};
        setItemValue.formValues = formValues;
        setItemValue.current = current;
        setItemValue.pageSize = pageSize;
        setItemValue.expandForm = expandForm;
        localStorage.setItem('dutyjudge', stringify(setItemValue));
       
    }
    handleSearch(e) {
        // 查询
        const { form, dispatch } = this.props;
        const {
            location,
            checkedKeys,
            checkedList,
            selfNumArr,
            wccNumArr,
            buname,
            sitename,
            personIds,
        } = this.state;
        e.preventDefault();

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let value = { ...values };

                if (value.schedulingtime && value.schedulingtime.length > 0) {
                    // 一级排产时间
                    value.beginFirstScheduleTime = value.schedulingtime[0];
                    value.endFirstScheduleTime = value.schedulingtime[1];
                    delete value.schedulingtime;
                } else {
                    delete value.schedulingtime;
                }
                if (value.dueDateFactoy && value.dueDateFactoy.length > 0) {
                    // 工厂交期
                    value.beginDueDate = value.dueDateFactoy[0];
                    value.endDueDate = value.dueDateFactoy[1];
                    delete value.dueDateFactoy;
                } else {
                    delete value.dueDateFactoy;
                }
                if (value.createDate && value.createDate.length > 0) {
                    // 异常创建时间
                    value.beginCreateDate = value.createDate[0];
                    value.endCreateDate = value.createDate[1];
                    delete value.createDate;
                } else {
                    delete value.createDate;
                }
                if (value.finishTime && value.finishTime.length > 0) {
                    // 异常关闭时间
                    value.beginFinishTime = value.finishTime[0];
                    value.endFinishTime = value.finishTime[1];
                    delete value.finishTime;
                } else {
                    delete value.finishTime;
                }

                Object.keys(value).map(item => {
                    if (value[item] instanceof moment) {
                        value[item] = value[item].format('YYYY-MM-DD');
                    }
                    return item;
                });
                value.orderSelfNum = value.orderSelfNum
                    ? value.orderSelfNum
                          .split('\n')
                          .filter(Boolean)
                          .join(',')
                    : '';
                value = proccessObject(value);
                this.setState({
                    formValues: value,
                });
                dispatch({
                    type: 'warning/fetch',
                    payload: { ...value, pageSize: this.state.pageSize, current: 1 },
                    callback: data => {
                        this.setState({
                            Graydata: data,
                            // expandForm: false
                        });
                    },
                });
            }
        });
    }
    selectBunameChange(value, Option) {
        const { dispatch } = this.props;
        const { siteCode } = this.state;
        if (value.length == 0) {
            dispatch({
                type: 'communication/clear_fetch_secondname_wx',
            });
        } else {
            dispatch({
                // 根据品类来筛选二级品类
                type: 'communication/fetch_secondname_wx',
                payload: { buCode: value.join(',') },
            });
            dispatch({
                // 根据基地和品类来筛选 车间
                type: 'communication/fetch_workshop_wx',
                payload: {
                    siteCode: siteCode && siteCode.length > 0 ? siteCode.join(',') : '',
                    buCode: value.join(','),
                },
            });
        }
    }
    selectSiteNameChange(value, Option) {
        const { dispatch } = this.props;
        if (value.length == 0) {
            dispatch({
                type: 'communication/clear_fetch_workshop_wx',
            });
        } else {
            dispatch({
                // 根据基地来筛选 车间
                type: 'communication/fetch_workshop_wx',
                payload: {
                    SiteCode: value.join(','),
                },
            });
        }
        this.setState({ siteCode: value });
    }

    selectPersonChange(value, Option) {
        const { dispatch } = this.props;
        if (Option.length > 0) {
            let selectIdsArr = [];
            selectIdsArr = Option.map(item => item.key);
            this.setState({ personIds: selectIdsArr });
        }
    }
    handleFormReset() {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({ type: 'warning/clear_formvaluesduty' });
        dispatch({
            type: 'warning/fetch',
            payload: {
                current: 1,
                pageSize: this.state.pageSize,
            },
            callback: data => { 
                this.setState({
                    Graydata: data,
                });
            },
        });
    }
    onSelectPersonSearch(value) {
        const { dispatch } = this.props;
        dispatch({
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 20, name: value },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
    }
    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
            getScondNameList,
            getAllBaseNameList,
            getWorkShopList,
            getbuNamelist,
            userloading,
        } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 8, offset: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <div className={styles.warning_form}>
                <Form
                    onSubmit={e => {
                        this.handleSearch(e);
                    }}
                    layout="inline"
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                        <Col md={8} sm={24} span={8}>
                            <FormItem label="订单自编号" {...formItemLayout}>
                                {getFieldDecorator('orderSelfNum', {
                                    initialValue: '',
                                })(<TextArea placeholder="请输入订单自编号" rows={4} />)}
                            </FormItem>
                        </Col>

                        <Col md={16} sm={24} span={16}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={10} sm={24} span={10}>
                                    <FormItem label="批次号" {...formItemLayout}>
                                        {getFieldDecorator('batchNum', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入批次号" />)}
                                    </FormItem>
                                </Col>
                                <Col md={14} sm={24} span={14}>
                                    <FormItem
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 15 }}
                                        label="一级排产时间"
                                    >
                                        {getFieldDecorator('schedulingtime', {
                                            initialValue: '',
                                        })(<RangePicker style={{ width: '100%' }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={10} sm={24} span={10}>
                                    <FormItem label="异常类型" {...formItemLayout}>
                                        {getFieldDecorator('warringType', {
                                            initialValue: '',
                                        })(
                                            <Select
                                                placeholder="请选择异常类型"
                                                style={{ width: '100%' }}
                                            >
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
                                <Col md={14} sm={24} span={14}>
                                    <FormItem label="异常状态" {...formItemLayout}>
                                        {getFieldDecorator('status', {
                                            initialValue: '',
                                        })(
                                            <Select
                                                placeholder="请选择异常状态"
                                                style={{ width: '100%' }}
                                            >
                                                <Option key={1} value={0}>
                                                    开启
                                                </Option>
                                                <Option key={2} value={1}>
                                                    关闭
                                                </Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={10} sm={24} span={10}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="跟进人"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('updateBy', {
                                            initialValue: [],
                                        })(
                                            <Select
                                                onChange={(value, option) =>
                                                    this.selectPersonChange(value, option)
                                                }
                                                onSearch={value => this.onSelectPersonSearch(value)}
                                                mode="multiple"
                                                notFoundContent={
                                                    userloading ? <Spin size="small" /> : null
                                                }
                                                placeholder="请选择跟进人"
                                                optionLabelProp="lable"
                                                style={{ width: '100%' }}
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
                                <Col md={14} sm={24} span={14} {...formItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        onClick={() => this.handleFormReset()}
                                    >
                                        重置
                                    </Button>
                                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                        高级筛选 <Icon type="down" />
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
            getScondNameList,
            getAllBaseNameList,
            getWorkShopList,
            getbuNamelist,
            departmentList,
            userloading,
        } = this.props;
        const { departmentFailure } = this.state;

        return (
            <Form
                onSubmit={e => {
                    this.handleSearch(e);
                }}
                layout="inline"
            >
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                    <Col md={8} sm={24} span={8}>
                        <FormItem label="订单自编号">
                            {getFieldDecorator('orderSelfNum', {
                                initialValue: '',
                            })(<TextArea placeholder="请输入订单自编号" rows={10} />)}
                        </FormItem>
                    </Col>

                    <Col md={16} sm={24} span={16}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem label="批次号">
                                    {getFieldDecorator('batchNum', {
                                        initialValue: '',
                                    })(<Input placeholder="请输入批次号" />)}
                                </FormItem>
                            </Col>
                            <Col md={14} sm={24} span={14}>
                                <FormItem
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 15 }}
                                    label="一级排产时间"
                                >
                                    {getFieldDecorator('schedulingtime', {
                                        initialValue: '',
                                    })(<RangePicker style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="异常关闭时间"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('finishTime', {
                                        initialValue: '',
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                            <Col md={14} sm={24} span={14}>
                                <FormItem
                                    className={styles.formicon}
                                    labelcol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="工厂交期"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('dueDateFactoy', {
                                        initialValue: [],
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="关闭人"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('updateBy', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            optionLabelProp="lable"
                                            onSearch={value => this.onSelectPersonSearch(value)}
                                            mode="multiple"
                                            notFoundContent={
                                                userloading ? <Spin size="small" /> : null
                                            }
                                            placeholder="请选择关闭人"
                                            style={{ width: '100%' }}
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
                            <Col md={14} sm={24} span={14}>
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
                                            optionLabelProp="lable"
                                            onSearch={value => this.onSelectPersonSearch(value)}
                                            mode="multiple"
                                            notFoundContent={
                                                userloading ? <Spin size="small" /> : null
                                            }
                                            placeholder="请选择异常创建人"
                                            style={{ width: '100%' }}
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem label="异常类型">
                                    {getFieldDecorator('warringType', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            placeholder="请选择异常类型"
                                            style={{ width: '100%' }}
                                        >
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
                            <Col md={14} sm={24} span={14}>
                                <FormItem label="异常状态">
                                    {getFieldDecorator('status', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            placeholder="请选择异常状态"
                                            style={{ width: '100%' }}
                                        >
                                            <Option key={1} value={0}>
                                                开启
                                            </Option>
                                            <Option key={2} value={1}>
                                                关闭
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem label="基地">
                                    {getFieldDecorator('siteCode', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择基地名称"
                                            style={{ width: '100%' }}
                                            onChange={(value, Option) =>
                                                this.selectSiteNameChange(value, Option)
                                            }
                                        >
                                            {isNotBlank(getAllBaseNameList) &&
                                                getAllBaseNameList.map(item => {
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
                            <Col md={14} sm={24} span={14}>
                                <FormItem label="品类">
                                    {getFieldDecorator('buCode', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择品类名称"
                                            style={{ width: '100%' }}
                                            onChange={(value, option) =>
                                                this.selectBunameChange(value, option)
                                            }
                                        >
                                            {isNotBlank(getbuNamelist) &&
                                                getbuNamelist.map(item => {
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
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

                            <Col md={14} sm={24} span={14}>
                                <FormItem label="二级品类">
                                    {getFieldDecorator('secondCategoryCode', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择二级品类名称"
                                            style={{ width: '100%' }}
                                        >
                                            {isNotBlank(getScondNameList) &&
                                                getScondNameList.map(item => {
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
                        {/* <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="责任分类"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('respType', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择责任分类"
                                            style={{ width: '100%' }}
                                        >
                                            {isNotBlank(departmentFailure) &&
                                                departmentFailure.length > 0 &&
                                                departmentFailure.map(item => {
                                                    return (
                                                        <Option
                                                            key={item.id}
                                                            value={item.id}
                                                            label={item.value}
                                                        >
                                                            {item.value}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={14} sm={24} span={14}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="责任部门"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('respDept', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择责任部门"
                                            style={{ width: '100%' }}
                                        >
                                            {isNotBlank(departmentList) &&
                                                isNotBlank(departmentList.list) &&
                                                departmentList.list.length > 0 &&
                                                departmentList.list.map(item => {
                                                    return (
                                                        <Option
                                                            key={item.id}
                                                            value={item.id}
                                                            label={item.value}
                                                        >
                                                            {item.value}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row> */}
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="异常创建时间"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('createDate', {
                                        initialValue: '',
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                            <Col md={14} sm={24} span={14}>
                                {/* <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="跟进人"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('updateBy', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            optionLabelProp="lable"
                                            onSearch={value => this.onSelectPersonSearch(value)}
                                            mode="multiple"
                                            notFoundContent={
                                                userloading ? <Spin size="small" /> : null
                                            }
                                            placeholder="请选择负责人"
                                            style={{ width: '100%' }}
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
                                </FormItem> */}
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={14} sm={24} span={14} offset={5}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => {
                                        this.handleSearch;
                                    }}
                                >
                                    查询
                                </Button>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    onClick={() => this.handleFormReset()}
                                >
                                    重置
                                </Button>
                                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                    收起 <Icon type="up" />
                                </a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }
    onCheckboxParnodeChange(e, item, index) {
        // id
        const { Graydata } = this.props;
        const { selectdata, selectflag } = this.state;
        if (
            !isNotBlank(selectflag) ||
            (isNotBlank(selectflag) && JSON.stringify(selectflag) == '{}')
        ) {
            var obj = {};
            obj['i' + index] = true;
            var newdata = selectdata;
            for (var i = 0; i < item.exceptionList.length; i++) {
                if (newdata.indexOf(item.exceptionList[i]) == -1) {
                    newdata.push(item.exceptionList[i].id);
                }
            }
            this.setState({
                selectdata: newdata,
                selectflag: obj,
            });
        } else {
            if (isNotBlank(selectflag['i' + index])) {
                var obj = selectflag;
                var newdata = selectdata;
                obj['i' + index] = !obj['i' + index];
                if (obj['i' + index] == false) {
                    obj['z' + index] = {};
                    for (var i = 0; i < item.exceptionList.length; i++) {
                        obj['z' + index]['y' + i] = false;
                        if (newdata.indexOf(item.exceptionList[i].id) > -1) {
                            newdata.splice(newdata.indexOf(item.exceptionList[i].id), 1);
                        }
                    }
                } else {
                    for (var i = 0; i < item.exceptionList.length; i++) {
                        if (newdata.indexOf(item.exceptionList[i].id) == -1) {
                            newdata.push(item.exceptionList[i].id);
                        }
                    }
                }
                this.setState({
                    selectdata: newdata,
                    selectflag: obj,
                });
                this.forceUpdate();
            } else {
                var obj = selectflag;
                var newdata = selectdata;
                obj['i' + index] = true;
                for (var i = 0; i < item.exceptionList.length; i++) {
                    if (newdata.indexOf(item.exceptionList[i].id) == -1) {
                        newdata.push(item.exceptionList[i].id);
                    }
                }
                this.setState({
                    selectdata: newdata,
                    selectflag: obj,
                });
                this.forceUpdate();
            }

            if (selectdata.length > 0) {
                this.setState({
                    zfflag1: false,
                });
            } else {
                this.setState({
                    zfflag1: true,
                });
            }

            let checkflag = true;
            for (var z = 0; z < Graydata.length; z++) {
                if (
                    !isNotBlank(this.state.selectflag['z' + index]) ||
                    this.state.selectflag['z' + index] == false
                ) {
                    checkflag = false;
                }
            }
            this.setState({
                isCheckAll: !checkflag,
            });
        }
        this.forceUpdate();
    }
    onCheckboxItemChange(e, item, items, index, indexs) {
        const { selectdata, selectflag } = this.state;
        const { Graydata } = this.props;
        if (
            !isNotBlank(selectflag) ||
            (isNotBlank(selectflag) && JSON.stringify(selectflag) == '{}')
        ) {
            var obj = {};
            obj['z' + index] = {};
            obj['z' + index]['y' + indexs] = true;
            var newdata = selectdata;
            newdata.push(item.id);
            this.setState({
                selectdata: newdata,
                selectflag: obj,
            });
            this.forceUpdate();
            if (items.exceptionList.length == 1) {
                obj['i' + index] = true;
            }
        } else {
            if (
                isNotBlank(selectflag['z' + index]) &&
                JSON.stringify(selectflag['z' + index]) != '{}'
            ) {
                var obj = selectflag;
                // this.deepClone(selectflag,obj)
                var newdata = selectdata;
                var flag = true;
                // obj['z'+index] = {}
                obj['z' + index]['y' + indexs] = !obj['z' + index]['y' + indexs];
                if (obj['z' + index]['y' + indexs] == false) {
                    obj['i' + index] = false;
                    newdata.splice(newdata.indexOf(item.id), 1);
                } else {
                    if (newdata.indexOf(item.id) == -1) {
                        newdata.push(item.id);
                    }
                }

                for (var i = 0; i < items.exceptionList.length; i++) {
                    if (
                        !isNotBlank(obj['z' + index]['y' + i]) ||
                        obj['z' + index]['y' + i] == false
                    ) {
                        flag = false;
                    }
                }
                if (flag) {
                    obj['i' + index] = true;
                } else {
                    obj['i' + index] = false;
                }
                this.setState({
                    selectflag: obj,
                    selectdata: newdata,
                });
                this.forceUpdate();
            } else {
                // this.deepClone(selectflag,obj)
                var obj = selectflag;
                var newdata = selectdata;
                obj['z' + index] = {};
                obj['z' + index]['y' + indexs] = true;
                if (newdata.indexOf(item.id) == -1) {
                    newdata.push(item.id);
                }
                if (items.exceptionList.length == 1) {
                    obj['i' + index] = true;
                }
                this.setState({
                    selectflag: obj,
                    selectdata: newdata,
                });
            }
        }

        if (selectdata.length > 0) {
            this.setState({
                zfflag1: false,
            });
        } else {
            this.setState({
                zfflag1: true,
            });
        }

        let checkflag = true;
        for (var z = 0; z < Graydata.length; z++) {
            if (
                !isNotBlank(this.state.selectflag['z' + index]) ||
                this.state.selectflag['z' + index] == false
            ) {
                checkflag = false;
            }
        }
        this.setState({
            isCheckAll: !checkflag,
        });
        this.forceUpdate();
    }

    isCheckAllfn(e) {
        // 是否全选
        const { Graydata } = this.props;
        const { isCheckAll } = this.state;
        if (e.target.checked) {
            let newdata = [];
            let obj = {};
            for (var i = 0; i < Graydata.list.length; i++) {
                if (
                    isNotBlank(Graydata.list[i].exceptionList) &&
                    Graydata.list[i].exceptionList.length > 0
                ) {
                    for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                        newdata.push(Graydata.list[i].exceptionList[j].id);
                        obj['i' + i] = true;
                        if (!isNotBlank(obj['z' + i])) {
                            obj['z' + i] = {};
                        }
                        obj['z' + i]['y' + j] = true;
                    }
                }
            }
            this.setState({
                isCheckAll: true,
                selectdata: newdata,
                selectflag: obj,
            });
        } else {
            let obj = {};
            for (var i = 0; i < Graydata.list.length; i++) {
                if (
                    isNotBlank(Graydata.list[i].exceptionList) &&
                    Graydata.list[i].exceptionList.length > 0
                ) {
                    for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                        obj['i' + i] = false;
                        if (!isNotBlank(obj['z' + i])) {
                            obj['z' + i] = {};
                        }
                        obj['z' + i]['y' + j] = false;
                    }
                }
            }
            this.setState({
                isCheckAll: false,
                selectdata: [],
                selectflag: obj,
            });
        }
    }
    isCheckAllSearchfn(e) {
        const { Graydata } = this.props;
        if (e.target.checked) {
            this.isCheckAllfn(e);
            this.setState({ isCheckAllSearch: true });
        } else {
            let obj = {};
            for (var i = 0; i < Graydata.list.length; i++) {
                if (
                    isNotBlank(Graydata.list[i].exceptionList) &&
                    Graydata.list[i].exceptionList.length > 0
                ) {
                    for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                        obj['i' + i] = false;
                        if (!isNotBlank(obj['z' + i])) {
                            obj['z' + i] = {};
                        }
                        obj['z' + i]['y' + j] = false;
                    }
                }
            }
            this.setState({
                isCheckAll: false,
                selectdata: [],
                selectflag: obj,
                isCheckAllSearch: false,
            });
        }
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderSimpleForm() : this.renderAdvancedForm();
    }

    handleCancel() {
        // 取消
        this.setState({
            previewVisible: false,
        });
    }

    handleFieldChange(selectArray) {
        // 选择框回调触发事件
        let { Graydata } = this.state;
        let data = [];
        if (selectArray && selectArray.length > 0) {
            data = Graydata.filter(item => {
                return item.content == selectArray[0];
            });
            this.setState({
                Graydata: data,
            });
        }
    }

    onPaginationChange(pagenumber, pageSize) {
        // 分页
        const { dispatch } = this.props;
        this.setState({ current: pagenumber, pageSize: pageSize }, () => {
            const { current } = this.state;
            const { formValues } = this.state;
            if (JSON.stringify(formValues) !== '{}') {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: current,
                        pageSize: pageSize,
                        ...formValues,
                    },
                    callback: data => {
                        this.setState({
                            Graydata: data,
                        });
                    },
                });
            } else {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: current,
                        pageSize: pageSize,
                    },
                    callback: data => {
                        this.setState({
                            Graydata: data,
                        });
                    },
                });
            }
        });
    }

    onChange = e => {
        // 选择框回调
        let ischecked = e.target.checked;
        let checkedvalue = e.target.value;
        if (ischecked) {
            this.setState(({ checkedList }) => {
                return {
                    checkedList: [...checkedList, ...checkedvalue],
                };
            });
        } else {
            const { checkedList } = this.state;
            if (checkedList.indexOf(checkedvalue[0]) > -1) {
                let index = checkedList.indexOf(checkedvalue[0]);

                checkedList.splice(index, 1);
                this.setState({
                    checkedList: [...checkedList],
                });
            }
        }
    };

    handlewarning() {
        router.push(`/worktree/abnormal`);
    }

    handleReload() {
        // 未搜索到数据重新加载
        const { dispatch } = this.props;
        this.setState({ buttonloading: true });
        dispatch({ type: 'warning/clear_formvaluesduty' });
        dispatch({
            type: 'warning/fetch',
            payload: {
                current: 1,
                pageSize: this.state.pageSize,
            },
            callback: data => {
                this.setState({
                    Graydata: data,
                    buttonloading: false,
                });
            },
        });
    }

    handleWatchOrder(checked, e) {
        // 点击显示关注的订单
        const { dispatch } = this.props;
        const { formValues } = this.state;
        if (checked) {
            if (JSON.stringify(formValues) !== '{}') {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        watch: true,
                        pageSize: this.state.pageSize,
                        ...formValues,
                    },
                    callback: data => {
                        this.setState({ Graydata: data });
                    },
                });
            } else {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        watch: true,
                        pageSize: this.state.pageSize,
                    },
                    callback: data => {
                        this.setState({ Graydata: data });
                    },
                });
            }
        } else if (!checked) {
            if (fJSON.stringify(formValues) !== '{}') {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        watch: false,
                        pageSize: this.state.pageSize,
                        ...formValues,
                    },
                    callback: data => {
                        this.setState({ Graydata: data });
                    },
                });
            } else {
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        watch: false,
                        pageSize: this.state.pageSize,
                    },
                    callback: data => {
                        this.setState({ Graydata: data });
                    },
                });
            }
        }
    }

    handleHasWatchTono(item) {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        dispatch({
            type: 'warning/handleChangeOrderStatus',
            payload: {
                watch: !item.watch,
                oid: item.oid,
            },
            callback: data => {
                this.setState({
                    isWatch: data.watch,
                });
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: this.state.current,
                        pageSize: this.state.pageSize,
                        ...formValues,
                    },
                });
            },
        });
    }

    handleUnderWatchToyes(item) {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        dispatch({
            type: 'warning/handleChangeOrderStatus',
            payload: {
                watch: !item.watch,
                oid: item.oid,
            },
            callback: data => {
                this.setState({
                    isWatch: data.watch,
                });
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: this.state.current,
                        pageSize: this.state.pageSize,
                        ...formValues,
                    },
                });
            },
        });
    }

    handleBatch() {
        const { selectdata, formValues, isCheckAllSearch } = this.state;
        const { dispatch } = this.props;
        if (selectdata.length == 0) {
            message.warning('请先至少选择一条异常');
        } else if (isCheckAllSearch && JSON.stringify(formValues) == '{}') {
            message.warning('筛选条件不能为空');
        } else {
            confirm({
                title: '批量处理',
                content: '请选择异常处理或者关闭异常',
                okText: '异常处理',
                cancelText: '关闭异常',
                onOk() {
                    if (!isCheckAllSearch) {
                        router.push(`/worktree/Batch_dispose?msg=comm`);
                        dispatch({
                            type: 'communication/add_selectdata_comm',
                            payload: { selectdata: selectdata },
                        });
                    } else {
                        router.push(`/worktree/Batch_dispose?msg=comm`);
                        dispatch({
                            type: 'communication/add_selectdata_obj',
                            payload: { formValues, isCheckAllSearch },
                        });
                    }
                },
                onCancel() {
                    if (!isCheckAllSearch) {
                        router.push(`/worktree/Batch_dispose?msg=close`);
                        dispatch({
                            type: 'communication/add_selectdata_comm',
                            payload: { selectdata: selectdata },
                        });
                    } else {
                        router.push(`/worktree/Batch_dispose?msg=close`);
                        dispatch({
                            type: 'communication/add_selectdata_obj',
                            payload: { formValues, isCheckAllSearch },
                        });
                    }
                },
            });
        }
    }
    unusual(e, item) {
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/additem',
            payload: item,
        });
        router.push(`/worktree/abnormal?id=${item.oid}`);
    }

    batchExport() {
        const { formValues, currentUserData } = this.state;
        let exportValue = deepCopy(formValues);
        const { dispatch } = this.props;
        if (JSON.stringify(exportValue) !== '{}' && JSON.stringify(currentUserData) !== '{}') {
            exportValue.createBy = currentUserData.id;
            Object.keys(exportValue).forEach(ele => {
                if (Array.isArray(exportValue[ele])) {
                    exportValue[ele] = exportValue[ele].join(',');
                }
            });
            let formElement = document.createElement('form');
            formElement.style.display = 'display:none;';
            formElement.method = 'post';
            formElement.action = `${homeUrl}/Api/op/orderException/export`;
            formElement.target = 'callBackTarget';
            for (var key in exportValue) {
                let inputElement = document.createElement('input');
                inputElement.type = 'hidden';
                inputElement.name = key;
                inputElement.value = exportValue[key];
                formElement.appendChild(inputElement);
            }
            document.body.appendChild(formElement);
            formElement.submit();
            document.body.removeChild(formElement);
        } else {
            message.warning('请先选择筛选条件!');
        }
    }

    onShowSizeChange(current, pageSize_fy) {
        // 页数变化
        const { pageSize, formValues } = this.state;
        const { dispatch } = this.props;
        this.setState({ pageSize: pageSize_fy });

        dispatch({
            type: 'warning/fetch',
            payload: {
                current: current,
                pageSize: pageSize_fy,
                ...formValues,
            },
            callback: data => {
                this.setState({
                    Graydata: data,
                });
            },
        });
    }

    render() {
        const {
            selectedRows,
            todoListState,
            selectArray,
            previewVisible,
            current,
            isWatch,
            pageSize,
        } = this.state;

        const { loading, Graydata } = this.props;
        let defaultActiveKey = [];
        if (isNotBlank(Graydata) && isNotBlank(Graydata.list)) {
            defaultActiveKey = Graydata.list.map(item => item.oid);
        }
        const total =
            isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.total;

        const currentGrad =
            isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.current;
        const pageSizeGrad =
            isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.pageSize;

        const totalExceptionCount =
            isNotBlank(Graydata) &&
            isNotBlank(Graydata.pagination) &&
            Graydata.pagination.exceptionCount;
        const renderModelList = {
            handleCancel: () => {
                this.handleCancel();
            },
            handleSubmit: fieldsValue => {
                this.handleSubmit(fieldsValue);
            },
        };
        const WorningListComponentprops = {
            onChange: this.onChange.bind(this),
            onPaginationChange: this.onPaginationChange.bind(this),
            handleHasWatchTono: this.handleHasWatchTono.bind(this),
            handleUnderWatchToyes: this.handleUnderWatchToyes.bind(this),
            unusual: this.unusual.bind(this),
            current: currentGrad,
            loading,
            pageSize: pageSizeGrad, //每页条数
            isWatch, // 是否关注
            isCheckAllfn: e => this.isCheckAllfn(e),
            onCheckboxParnodeChange: (e, item, index) =>
                this.onCheckboxParnodeChange(e, item, index),
            onCheckboxItemChange: (e, item, items, index, indexs) =>
                this.onCheckboxItemChange(e, item, items, index, indexs),
            isCheckAllSearchfn: e => this.isCheckAllSearchfn(e),
            selectdata: this.state.selectdata,
            selectflag: this.state.selectflag,
            defaultActiveKey: defaultActiveKey,
            zfflag: this.state.zfflag,
            zfflag1: this.state.zfflag1,
            isCheckAll: this.state.isCheckAll,
            isCheckAllSearch: this.state.isCheckAllSearch,
            onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
        };
        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div className={styles.tableListOperator}>
                                {selectedRows.length > 0 && (
                                    <span>
                                        <Button icon="delete" onClick={e => this.editAndDelete(e)}>
                                            批量删除
                                        </Button>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            {/* <Switch
                                style={{ width: '80px', height: '23px' }}
                                type="primary"
                                onClick={(checked, e) => {
                                    this.handleWatchOrder(checked, e);
                                }}
                                checkedChildren="已关注"
                                unCheckedChildren="所有"
                                defaultChecked={false}
                            >
                                我关注的订单
                            </Switch> */}
                            <Button
                                type="primary"
                                style={{ marginLeft: '30px' }}
                                onClick={() => {
                                    this.handleBatch();
                                }}
                            >
                                批量处理
                            </Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: '30px' }}
                                onClick={() => {
                                    this.batchExport();
                                }}
                            >
                                批量导出
                            </Button>
                        </div>
                    </Card>
                </div>
                {(isNotBlank(Graydata) && isNotBlank(Graydata.list) && Graydata.list.length == 0) ||
                !isNotBlank(Graydata.list) ? (
                    <Empty description="抱歉！暂无数据">
                        <Button
                            type="primary"
                            onClick={() => {
                                this.handleReload();
                            }}
                            loading={this.state.buttonloading}
                        >
                            点我重新加载
                        </Button>
                    </Empty>
                ) : (
                    <WorningListComponent
                        Graydata={Graydata}
                        total={total} // 总共多少条数据
                        totalExceptionCount={totalExceptionCount}
                        defaultCurrent={this.state.current} // 默人选中第几个
                        isDisabled={false} // 面板是否禁用
                        defaultActiveKey={defaultActiveKey} // 默认展开的所有面板
                        {...WorningListComponentprops}
                    />
                )}
                <RenderModel previewVisible={previewVisible} {...renderModelList} />
            </PageHeaderWrapper>
        );
    }
}

export default DutyJudgePageList;

@connect(({ communication, loading }) => ({
    ...communication,
    communicationLoading: loading.models.communication,
}))
class WorningListComponent extends React.Component {
    state = {
        isCheckAll: '',
        selectdata: [],
        selectflag: {},
        zfflag: true,
        zfflag1: true,
    };
    showTotal(total) {
        if (isNotBlank(total)) {
            return `总共${total}条记录,当前${this.props.current}页`;
        }
    }

    warningDateil(e, idself) {
        // 跳转详情
        e.preventDefault();
        router.push(`/worktree/exception?id=${idself}`);
    }

    watchAll(item) {
        const { dispatch } = this.props;
        dispatch({
            type: 'communication/AddOnerecord',
            payload: { AddOnerecord: item },
        });
        router.push(`/worktree/Communication?id=${item.id}`);
    }

    warningDispose() {}

    warningBatch() {
        const { selectdata } = this.state;
        if (selectdata && selectdata.length == 0) {
            message.warning('请至少选择一条异常信息');
        } else {
        }
    }

    render() {
        const {
            Graydata,
            onPaginationChange,
            total,
            totalExceptionCount,
            isDisabled,
            defaultCurrent,
            defaultActiveKey,
            onChange,
            current,
            loading,
            pageSize,
            handleHasWatchTono,
            handleUnderWatchToyes,
            isWatch,
            unusual,
            selectdata,
            selectflag,
            zfflag,
            zfflag1,
            isCheckAll,
            isCheckAllfn,
            onCheckboxParnodeChange,
            onCheckboxItemChange,
            isCheckAllSearchfn,
            isCheckAllSearch,
            onShowSizeChange,
        } = this.props;

        return (
            <Spin size="large" spinning={loading} className={styles.worningList}>
                <Card>
                    <div className={styles.allselect}>
                        <div data-show="true" className="ant-alert ant-alert-info">
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                <Checkbox checked={isCheckAll} onChange={e => isCheckAllfn(e)} />
                                &nbsp;&nbsp;选择本页
                            </span>
                            <span style={{ display: 'inline-block', marginLeft: '10px' }}>
                                <Checkbox
                                    checked={isCheckAllSearch}
                                    onChange={e => isCheckAllSearchfn(e)}
                                />
                                &nbsp;&nbsp;选择所有查询结果
                            </span>
                            <span className="ant-alert-message" style={{ marginLeft: '12px' }}>
                                已选择{' '}
                                <a style={{ fontWeight: 600 }}>
                                    {isCheckAllSearch
                                        ? '全部查询结果'
                                        : `${selectdata.length}条异常`}
                                </a>
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="ant-alert-description"></span>
                            <span className="ant-alert-message">
                                共<a style={{ fontWeight: 600 }}>{total}</a> 条订单/
                                <a style={{ fontWeight: 600 }}>{totalExceptionCount}</a>
                                条异常&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            <span className="ant-alert-description"></span>
                        </div>
                    </div>
                    <Collapse
                        defaultActiveKey={defaultActiveKey}
                        activeKey={defaultActiveKey}
                        className={styles.rowstyle1}
                    >
                        {isNotBlank(Graydata) &&
                            isNotBlank(Graydata.list) &&
                            Graydata.list.map((item, index) => {
                                return (
                                    <Panel
                                        disabled={isDisabled}
                                        showArrow={false}
                                        key={item.oid}
                                        header={
                                            <Row>
                                                <Col
                                                    span={1}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={
                                                            isCheckAll || selectflag['i' + index]
                                                        }
                                                        className={styles.checkbox_style}
                                                        style={{ marginLeft: '4px' }}
                                                        key={item.oid}
                                                        onChange={e =>
                                                            onCheckboxParnodeChange(e, item, index)
                                                        }
                                                        disabled={!isNotBlank(item.exceptionList)}
                                                    />
                                                </Col>
                                                <Col span={4} className={styles.yiguanz}>
                                                    {item.watch == true ? ( // 已关注
                                                        <div>
                                                            <img
                                                                src={attention}
                                                                style={{ marginBottom: '4px' }}
                                                            />
                                                            <a
                                                                style={{
                                                                    textDecoration: 'underline',
                                                                    color: '#333',
                                                                }}
                                                                onClick={() => {
                                                                    handleHasWatchTono(item);
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        marginLeft: '5px',
                                                                        marginBottom: '2px',
                                                                    }}
                                                                >
                                                                    已关注
                                                                </span>
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <img
                                                                src={notattention}
                                                                style={{ marginBottom: '4px' }}
                                                            />
                                                            <a
                                                                style={{
                                                                    textDecoration: 'underline',
                                                                    color: 'bule',
                                                                    marginLeft: '5px',
                                                                }}
                                                                onClick={() => {
                                                                    handleUnderWatchToyes(item);
                                                                }}
                                                            >
                                                                未关注
                                                            </a>
                                                        </div>
                                                    )}
                                                </Col>
                                                <Col
                                                    span={12}
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: 16,
                                                        textDecoration: 'underline',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        color: '#40a9ff',
                                                    }}
                                                >
                                                    <a
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: 16,
                                                            textDecoration: 'underline',
                                                        }}
                                                        onClick={e => {
                                                            this.warningDateil(e, item.oid);
                                                        }}
                                                    >
                                                        {item.orderSelfNum}
                                                    </a>
                                                </Col>
                                                <Col span={5}></Col>
                                                <Col span={2}>
                                                    {isNotBlank(item.exceptionList) &&
                                                    item.exceptionList.length > 0 ? (
                                                        <span
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                                display: 'inline-block',
                                                                borderRadius: '50%',
                                                                border: '1px  solid  red',
                                                                lineHeight: '16px',
                                                                textAlign: 'center',
                                                                color: 'red',
                                                                marginRight: '14px',
                                                            }}
                                                        >
                                                            {item.exceptionList
                                                                ? item.exceptionList.length
                                                                : ''}
                                                        </span>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        }
                                    >
                                        {isNotBlank(item.exceptionList) &&
                                            item.exceptionList.length > 0 &&
                                            item.exceptionList.map((items, indexs) => {
                                                return (
                                                    <Row
                                                        justify="space-between"
                                                        type="flex"
                                                        gutter={[{ xs: 8, sm: 16, md: 24 }, 16]}
                                                        key={items.id}
                                                        style={{
                                                            height: '60px',
                                                            borderBottom: '1px solid #ccc',
                                                            lineHeight: '60px',
                                                        }}
                                                    >
                                                        <Col
                                                            span={1}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    isCheckAll ||
                                                                    ((isNotBlank(
                                                                        selectflag['i' + index]
                                                                    ) &&
                                                                        selectflag['i' + index]) ||
                                                                        (isNotBlank(
                                                                            selectflag['z' + index]
                                                                        ) &&
                                                                            isNotBlank(
                                                                                selectflag[
                                                                                    'z' + index
                                                                                ]['y' + indexs]
                                                                            ) &&
                                                                            selectflag['z' + index][
                                                                                'y' + indexs
                                                                            ]))
                                                                }
                                                                className={styles.checkbox_scond}
                                                                key={items.id}
                                                                onChange={e =>
                                                                    onCheckboxItemChange(
                                                                        e,
                                                                        items,
                                                                        item,
                                                                        index,
                                                                        indexs
                                                                    )
                                                                }
                                                            />
                                                        </Col>
                                                        <Col
                                                            span={1}
                                                            style={{
                                                                padding: '5px 12px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            {isNotBlank(items.warringType) &&
                                                            (items.warringType === 1 ||
                                                                items.warringType === '1') ? (
                                                                <img
                                                                    src={wraningnewone}
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                    }}
                                                                />
                                                            ) : null}
                                                            {isNotBlank(items.warringType) &&
                                                            (items.warringType === 2 ||
                                                                items.warringType === '2') ? (
                                                                <img
                                                                    src={warningtwo}
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                    }}
                                                                />
                                                            ) : null}
                                                        </Col>
                                                        <Col
                                                            span={3}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            {items.secondCategoryName}
                                                        </Col>
                                                        <Col
                                                            span={4}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            {items.deptName}
                                                        </Col>
                                                        <Col
                                                            span={4}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            预计进仓：
                                                            {items.planBinTime
                                                                ? moment(items.planBinTime).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''}
                                                        </Col>
                                                        <Col
                                                            span={4}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            工厂交期：{' '}
                                                            {items.dueDate
                                                                ? moment(items.dueDate).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''}
                                                        </Col>
                                                        <Col
                                                            span={5}
                                                            style={{
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            <div>
                                                                <p
                                                                    style={{
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        maxWidth: '160px',
                                                                        marginBottom: 0,
                                                                        display: 'inline-block',
                                                                    }}
                                                                >
                                                                    评论：{items.updateInfo}
                                                                </p>

                                                                <a
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        verticalAlign: 'top',
                                                                        marginLeft: '5px',
                                                                    }}
                                                                    onClick={() => {
                                                                        this.watchAll(items);
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    >>{items.commentCount}
                                                                </a>
                                                            </div>
                                                        </Col>
                                                        <Col
                                                            span={2}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                height: '60px',
                                                                lineHeight: '60px',
                                                            }}
                                                        >
                                                            <a
                                                                style={{
                                                                    textDecoration: 'underline',
                                                                }}
                                                                onClick={() => {
                                                                    this.watchAll(items);
                                                                }}
                                                            >
                                                                异常处理
                                                            </a>
                                                        </Col>
                                                    </Row>
                                                );
                                            })}
                                    </Panel>
                                );
                            })}
                    </Collapse>
                    <Pagination // 分页
                        style={{ padding: '10px 0 0 50px ' }}
                        showQuickJumper
                        defaultCurrent={defaultCurrent} // 默认选中
                        total={total} //总共页数
                        current={current} // 当前页
                        pageSize={pageSize}
                        onChange={(pagenumber, pageSize) => {
                            onPaginationChange(pagenumber, pageSize);
                        }}
                        showSizeChanger
                        onShowSizeChange={(current, pageSize) =>
                            onShowSizeChange(current, pageSize)
                        }
                        showTotal={this.showTotal.bind(this)}
                        pageSizeOptions={['10', '50', '100', '200', '500']}
                    />
                </Card>
            </Spin>
        );
    }
}

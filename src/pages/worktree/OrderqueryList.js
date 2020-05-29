/**
 * 异常订单查询
 */
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
    Popconfirm,
    Tag,
    Select,
} from 'antd';
import router from 'umi/router';
import { Link } from 'dva/router';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getLocation } from '@/utils/utils';
import styles from './OrderqueryList.less';
import moment from 'moment';
import { getStorage } from '@/utils/localStorageUtils';
import notattention from '../../assets/notattention.png'; // Icon
import attention from '../../assets/attention.png';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
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
        //  ScheduleBeginDate=2019-11-01&ScheduleEndDate
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
                    <Row>
                        <Col span={15}>
                            <FormItem
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 12 }}
                                label="一级排产时间"
                            >
                                {form.getFieldDecorator('ScheduleBeginDate', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入一级排产时间' }],
                                })(<DatePicker size="default" />)}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 17 }}
                                label={<span style={{ paddingRight: '10px' }}>至</span>}
                            >
                                {form.getFieldDecorator('ScheduleEndDate', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入一级排产时间' }],
                                })(<DatePicker size="default" />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Col>

                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
                        {form.getFieldDecorator('deptName', {
                            initialValue: '',
                        })(<Input placeholder="请输入车间" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <Row>
                        <Col span={15}>
                            <FormItem
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 12 }}
                                label="工厂交货时间"
                            >
                                {form.getFieldDecorator('beginDueDate', {
                                    initialValue: '',
                                })(<DatePicker size="default" />)}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 17 }}
                                label={<span style={{ paddingRight: '10px' }}>至</span>}
                            >
                                {form.getFieldDecorator('endDueDate', {
                                    initialValue: '',
                                })(<DatePicker size="default" />)}
                            </FormItem>
                        </Col>
                    </Row>
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
                        })(<TextArea placeholder="批量查询  单击分隔" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="批次号">
                        {form.getFieldDecorator('batchNum', {
                            initialValue: '',
                        })(<Input placeholder="请选择" />)}
                    </FormItem>
                </Col>
            </Row>
        </Modal>
    );
});

@connect(({ warning, loading, communication }) => ({
    ...warning,
    ...communication,
    loading: loading.models.warning,
    submiting: loading.effects['warning/queryExceptionOrderList'],
}))
@Form.create()
class OrderQueryList extends PureComponent {
    state = {
        selectedRows: [],
        isWatch: Boolean,
        formValues: {},
        buttonloading: false,
        expandForm: false, // 渲染from组件
        selectArray: [],
        pageSize: 50, // 每页显示多少条数
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
        fromvalue: {},
        threeMonthAgo: {},
        selectedRows: [],
        pageSize_order: '',
    };

    componentDidMount() {
        const { dispatch } = this.props;
        const threeMonthAgo = {
            ScheduleBeginDate: moment()
                .subtract(3, 'months')
                .format('YYYY-MM-DD'),
            ScheduleEndDate: moment().format('YYYY-MM-DD'),
        };
        this.setState({ threeMonthAgo });
        let pageSize_cookie = getStorage('pageSize')
        if(isNotBlank(pageSize_cookie)){
            this.setState({ pageSize: Number(pageSize_cookie) })
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
    }

  componentWillUnmount(){
      const { pageSize } = this.state
    
  }

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    Advanced = () => {
        // 高级筛选
        this.setState({ previewVisible: true });
    };

    handleFormReset() {
        const { form, dispatch } = this.props;
        const { threeMonthAgo } = this.state;
        form.resetFields();
        this.setState({
            formValues: {},
        });
    }

    handleSearch(e) {
        // 查询
        const { form, dispatch } = this.props;
        const { location, checkedKeys, checkedList, wccNumArr } = this.state;
        e.preventDefault();

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const value = { ...values };
                let pageSize_order = '';
                if (value.schedulingtime && value.schedulingtime.length > 0) {
                    value.ScheduleBeginDate = value.schedulingtime[0];
                    value.ScheduleEndDate = value.schedulingtime[1];
                    delete value.schedulingtime;
                } else {
                    delete value.schedulingtime;
                }
                if (value.dueDateFactoy && value.dueDateFactoy.length > 0) {
                    value.dueBeginDate = value.dueDateFactoy[0];
                    value.dueEndDate = value.dueDateFactoy[1];
                    delete value.dueDateFactoy;
                } else {
                    delete value.dueDateFactoy;
                }
                if (isNotBlank(value.planBinTime) && value.planBinTime.length > 0) {
                    value.PlanBinBeginDate = value.planBinTime[0];
                    value.PlanBinEndDate = value.planBinTime[1];
                    delete value.planBinTime;
                } else {
                    delete value.planBinTime;
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
                if (value.orderSelfNum) {
                    pageSize_order = value.orderSelfNum.split(',')
                        ? value.orderSelfNum.split(',').length
                        : '';
                }
                if (
                    isNotBlank(value.orderSelfNum) ||
                    (isNotBlank(value.ScheduleBeginDate) && isNotBlank(value.ScheduleEndDate)) ||
                    (isNotBlank(value.dueBeginDate) && isNotBlank(value.dueEndDate)) ||
                    (isNotBlank(value.PlanBinBeginDate) && isNotBlank(value.PlanBinEndDate)) ||
                    isNotBlank(value.wccNum)
                ) {
                    this.setState({
                        formValues: value,
                    });
                    dispatch({
                        type: 'warning/queryExceptionOrderList',
                        payload: {
                            ...value,
                            PageCount: pageSize_order ? pageSize_order : this.state.pageSize,
                            Page1: 1,
                        },
                        callback: data => {
                            this.setState({
                                Graydata: data,
                                pageSize_order,
                                // expandForm: false
                            });
                        },
                    });
                } else {
                    message.warning(
                        '订单自编号、以及排产时间、工厂交期、预计进仓时间、MSCS订单号、必选其一'
                    );
                }
            }
        });
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
    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
            getScondNameList,
            getAllBaseNameList,
            getWorkShopList,
            getbuNamelist,
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
                                <Col md={12} sm={24} span={12}>
                                    <FormItem label="批次号" {...formItemLayout}>
                                        {getFieldDecorator('batchNum', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入批次号" />)}
                                    </FormItem>
                                </Col>
                                <Col md={12} sm={24} span={12}>
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
                                <Col md={12} sm={24} span={12}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="客户姓名"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('cusName', {
                                            initialValue: '',
                                        })(
                                            <Input
                                                size="default"
                                                style={{ width: '100%' }}
                                                placeholder="请输入客户姓名"
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={12} sm={24} span={12}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="商场名称"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('dealerName', {
                                            initialValue: '',
                                        })(
                                            <Input
                                                size="default"
                                                style={{ width: '100%' }}
                                                placeholder="请输入商场名称"
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={12} sm={24} span={12}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="工厂交期"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('dueDateFactoy', {
                                            initialValue: '',
                                        })(
                                            <RangePicker size="default" style={{ width: '100%' }} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={12} sm={24} span={12}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelcol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="MSCS订单号"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('wccNum', {
                                            initialValue: '',
                                        })(<Input size="default" style={{ width: '100%' }} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={12} sm={24} span={12}>
                                    <FormItem
                                        className={styles.formicon}
                                        labelcol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="预计进仓时间"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('planBinTime', {
                                            initialValue: [],
                                        })(
                                            <RangePicker size="default" style={{ width: '100%' }} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={12} sm={24} span={12}>
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
        } = this.props;
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
                                <FormItem label="车间">
                                    {getFieldDecorator('WorkShopCode', {
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
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
                            <Col md={14} sm={24} span={14}>
                                <FormItem label="二级品类">
                                    {getFieldDecorator('secondCategoryCode', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择品类名称"
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="客户姓名"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('cusName', {
                                        initialValue: '',
                                    })(
                                        <Input
                                            size="default"
                                            style={{ width: '100%' }}
                                            placeholder="请输入客户姓名"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={24} span={12}>
                                <FormItem
                                    // className={styles.formicon}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="商场名称"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('dealerName', {
                                        initialValue: '',
                                    })(
                                        <Input
                                            size="default"
                                            style={{ width: '100%' }}
                                            placeholder="请输入商场名称"
                                        />
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
                                    label="工厂交期"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('dueDateFactoy', {
                                        initialValue: '',
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={24} span={12}>
                                <FormItem
                                    className={styles.formicon}
                                    labelcol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="MSCS订单号"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('wccNum', {
                                        initialValue: '',
                                    })(<Input size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} sm={24} span={12}>
                                <FormItem
                                    className={styles.formicon}
                                    labelcol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="预计进仓时间"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('planBinTime', {
                                        initialValue: [],
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                            <Col md={10} sm={24} span={10}>
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

    onPressEnterAndSelfnum(value) {
        const { selfNumArr } = this.state;
        this.setState({
            selfNumArr: value,
        });
    }
    onPressEnterAndwccNum(value) {
        const { wccNumArr } = this.state;
        this.setState({
            wccNumArr: value,
        });
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

    handlewarning() {
        router.push(`/worktree/abnormal`);
    }

    unusual(e, item) {
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/orderlist_pc',
            payload: item,
        });
        router.push(`/worktree/abnormal`);
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        // 表格分页的回调
        const { dispatch } = this.props;
        const { formValues, pageSize_order } = this.state;
        if (JSON.stringify(formValues) == '{}') {
            message.warning('请重新输入查询条件');
        } else {
            const filters = Object.keys(filtersArg).reduce((obj, key) => {
                const newObj = { ...obj };
                newObj[key] = getValue(filtersArg[key]);
                return newObj;
            }, {});
            this.setState({
                current: pagination.current,
                pageSize: pageSize_order ? pageSize_order : pagination.pageSize,
            });
            const params = {
                Page1: pagination.current,
                PageCount: pageSize_order ? pageSize_order : pagination.pageSize,
                ...formValues,
                ...filters,
            };
            if (sorter.field) {
                params.sorter = `${sorter.field}_${sorter.order}`;
            }
            dispatch({
                type: 'warning/queryExceptionOrderList',
                payload: params,
            });
        }
    };

    handleHasWatchTono(item) {
        const { dispatch } = this.props;
        const { formValues, threeMonthAgo } = this.state;
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
                // 查询后回显
                const { formValues, threeMonthAgo } = this.state;
                const { location, form, dispatch } = this.props;
                let searchValue = JSON.stringify(formValues) !== '{}' ? formValues : threeMonthAgo;

                Object.keys(searchValue).map(item => {
                    //
                    if (searchValue[item] instanceof moment) {
                        searchValue[item] = searchValue[item].format('YYYY-MM-DD');
                    }
                    return item;
                });
                dispatch({
                    type: 'warning/queryExceptionOrderList',
                    payload: {
                        Page1: 1,
                        PageCount: this.state.pageSize,
                        ...searchValue,
                    },
                });
            },
        });
    }

    handleUnderWatchToyes(item) {
        const { dispatch } = this.props;
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
                const { formValues, threeMonthAgo } = this.state;
                const { location, form, dispatch } = this.props;
                let searchValue = JSON.stringify(formValues) !== '{}' ? formValues : threeMonthAgo;

                Object.keys(searchValue).map(item => {
                    if (searchValue[item] instanceof moment) {
                        searchValue[item] = searchValue[item].format('YYYY-MM-DD');
                    }
                    return item;
                });
                dispatch({
                    type: 'warning/queryExceptionOrderList',
                    payload: {
                        Page1: 1,
                        PageCount: this.state.pageSize,
                        ...searchValue,
                    },
                });
            },
        });
    }

    handleWatchOrder(checked, e) {
        // 点击显示关注的订单
        const { dispatch } = this.props;
        const { formValues, threeMonthAgo } = this.state;
        const paramsvalue = JSON.stringify(formValues) !== '{}' ? formValues : threeMonthAgo;

        if (checked) {
            dispatch({
                type: 'warning/queryExceptionOrderList',
                payload: {
                    watch: true,
                    Page1: 1,
                    PageCount: this.state.pageSize,
                    ...paramsvalue,
                },
            });
        } else if (!checked) {
            dispatch({
                type: 'warning/queryExceptionOrderList',
                payload: {
                    watch: false,
                    Page1: 1,
                    PageCount: this.state.pageSize,
                    ...paramsvalue,
                },
            });
        }
    }
    editAndDelete(e) {
        e.stopPropagation();
        const { selectedRows } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'communication/add_selectdata_batchregist',
            payload: { selectdata: selectedRows },
        });
        let ids = selectedRows.map(item => item.oid);
        router.push(`/worktree/BatchRegist?id=${ids}`);
    }

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    goxq = id => {
        router.push(`/worktree/exception?id=${id}`);
    };

    render() {
        const {
            selectedRows,
            todoListState,
            selectArray,
            previewVisible,
            current,
            isWatch,
            pageSize,
            baseNameList,
            BUnameList,
        } = this.state;

        const { loading, orderDateilqueryList } = this.props;
        const orderDateilList =
            isNotBlank(orderDateilqueryList[0]) && isNotBlank(orderDateilqueryList[0].listOrder)
                ? orderDateilqueryList[0].listOrder
                : [];
        const total =
            isNotBlank(orderDateilqueryList[0]) && isNotBlank(orderDateilqueryList[0].totalCount)
                ? orderDateilqueryList[0].totalCount
                : '';
        const renderModelList = {
            handleCancel: () => {
                this.handleCancel();
            },
            handleSubmit: fieldsValue => {
                this.handleSubmit(fieldsValue);
            },
        };
        let pagination = {
            total: Number(total),
            current: this.state.current,
            pageSize: this.state.pageSize,
            exceptionCount: Number(total),
            showQuickJumper: true,
            showSizeChanger: true,
        };

        const columns = [
            // {
            //     title: '是否关注',
            //     dataIndex: 'watch',
            //     width: 80,
            //     render: (text, record) => {
            //         if (isNotBlank(text)) {
            //             return (
            //                 <>
            //                     {text == true ? ( // 已关注
            //                         <div>
            //                             <img src={attention} style={{ marginBottom: '4px' }} />
            //                             <a
            //                                 style={{ textDecoration: 'underline', color: '#333' }}
            //                                 onClick={() => {
            //                                     this.handleHasWatchTono(record);
            //                                 }}
            //                             >
            //                                 已关注
            //                             </a>
            //                         </div>
            //                     ) : (
            //                             <div>
            //                                 <img src={notattention} style={{ marginBottom: '4px' }} />
            //                                 <a
            //                                     style={{ textDecoration: 'underline', color: 'bule' }}
            //                                     onClick={() => {
            //                                         this.handleUnderWatchToyes(record);
            //                                     }}
            //                                 >
            //                                     关注
            //                             </a>
            //                             </div>
            //                         )}
            //                 </>
            //             );
            //         }
            //         return '';
            //     },
            // },
            {
                title: '订单自编号',
                dataIndex: 'orderSelfNum',
                width: 200,
                render: (text, record) => (
                    <a
                        onClick={() => {
                            router.push(`/worktree/exception?id=${record.oid}`);
                        }}
                    >
                        {text}
                    </a>
                ),
            },
            {
                title: '车间',
                dataIndex: 'winfo',
                width: 240,
                render: textarr => {
                    if (isNotBlank(textarr) && textarr.length > 0) {
                        let textlist = textarr.map(item => item.wname);
                        if (textlist && textlist.length > 0) {
                            return textlist.join('、 ');
                        }
                    }
                },
            },
            {
                title: '有异常/正常',
                dataIndex: 'warningCount',
                width: 80,
                render: (warningCount, record) => {
                    if (isNotBlank(record) && JSON.stringify(record) !== '{}') {
                        if (!record.orderException) {
                            return <Tag color="#40a9ff">正常</Tag>;
                        }
                        if (
                            record.orderException &&
                            record.orderException.number &&
                            record.orderException.number !== '0'
                        ) {
                            return (
                                <>
                                    <Tag color="#f50">有异常</Tag>
                                    <span
                                        style={{
                                            background: 'red',
                                            borderRadius: '50%',
                                            height: '20px',
                                            width: '20px',
                                            display: 'inline-block',
                                            textAlign: 'center',
                                            color: '#fff',
                                            lineHeight: '20px',
                                        }}
                                    >
                                        {parseInt(record.orderException.number)}
                                    </span>
                                </>
                            );
                        }
                        if (record.orderException && record.orderException.number == '0') {
                            return (
                                <>
                                    <Tag color="#40a9ff">正常</Tag>
                                </>
                            );
                        }
                    }
                },
            },

            {
                title: '操作',
                width: 100,
                render: record => {
                    return (
                        <>
                            <span
                                onClick={e => {
                                    this.unusual(e, record);
                                }}
                                className={styles.my_button_reg}
                            >
                                异常登记
                            </span>
                            <span
                                className={styles.my_button_date}
                                onClick={() => this.goxq(record.oid)}
                            >
                                查看详情
                            </span>
                        </>
                    );
                },
            },
        ];

        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div className={styles.tableListOperator}></div>
                        </div>
                        {selectedRows.length > 0 ? (
                            <span style={{ marginLeft: '10px' }}>
                                <Button onClick={e => this.editAndDelete(e)}>批量登记</Button>
                            </span>
                        ) : (
                            <span style={{ marginLeft: '10px' }}>
                                <Button disabled onClick={e => this.editAndDelete(e)}>
                                    批量登记
                                </Button>
                            </span>
                        )}
                    </Card>
                </div>
                <Card>
                    <StandardTable
                        bordered
                        scroll={{ x: 1050 }}
                        selectedRows={selectedRows}
                        loading={loading}
                        data={{ list: orderDateilList, pagination: pagination }}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </Card>

                <RenderModel previewVisible={previewVisible} {...renderModelList} />
            </PageHeaderWrapper>
        );
    }
}

export default OrderQueryList;

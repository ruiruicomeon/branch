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
    Spin,
    Checkbox,
    Pagination,
    List,
    Radio,
    Collapse,
    Transfer,
    Table,
    Badge,
    Menu,
    Dropdown,
} from 'antd';
import monment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getLocation, getFullUrl, filterKeywordData } from '@/utils/utils';
import { getStorage } from '@/utils/localStorageUtils';
import { homeUrl } from '../../../config/baseConfig';
import moment from 'moment';
import { stringify } from 'qs';
import { styles } from './ForwardPage.less';
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
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

@connect(({ warning, loading, sysdeptList, sysoffice, communication, user }) => ({
    ...warning,
    ...sysoffice,
    ...sysdeptList,
    ...user,
    ...communication,
    loading: loading.models.warning,
}))
@Form.create()
class ForwardPageList extends PureComponent {
    state = {
        location: getLocation(),
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
        Pc_forwardList: {
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
        id: '',
        obj_filterList: [],
    };

    componentDidMount() {
        const { dispatch } = this.props;
        const { location } = this.state;
        if (isNotBlank(getStorage('token'))) {
            if (location.query && location.query.id) {
                let ids = location.query.id;
                this.setState({ id: ids });
                dispatch({
                    type: 'warning/pc_forward',
                    payload: {
                        current: 1,
                        pageSize: 10,
                        id: ids,
                    },
                    callback: pc_forwardList => {
                        let obj_filterList = filterKeywordData(
                            'orderSelfNum',
                            'watch',
                            'orderSelfNum',
                            pc_forwardList
                        );
                        this.setState({ obj_filterList });
                    },
                });
            }

            // dispatch({
            //     type: 'warning/fetch',
            //     payload: {
            //         current: 1,
            //         pageSize: this.state.pageSize,
            //     },
            //     callback: data => {
            //         this.setState({
            //             Pc_forwardList: data,
            //         });
            //     },
            // });

            // dispatch({
            //     // 品类
            //     type: 'communication/fetch_buname_wx',
            //     payload: { grade: 1 },
            //     callback: data => {
            //         this.setState({
            //             BUnameList: data,
            //         });
            //     },
            // });
            // dispatch({
            //     // 基地
            //     type: 'communication/fetch_basenamelist',
            //     payload: { grade: 1, type: 1 },
            // });
            // dispatch({
            //     // 用户选择
            //     type: 'sysuser/fetch',
            //     payload: { current: 1, pageSize: 6000 },
            //     callback: data => {
            //         this.setState({
            //             tableData: data,
            //         });
            //     },
            // });

            // dispatch({
            //     type: 'user/get_wx_config',
            //     payload: { url: window.location.host },
            //     callback: data => {
            //         window.wx.config({
            //             beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            //             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //             appId: data.appId, // 必填，企业微信的corpID
            //             timestamp: data.timestamp, // 必填，生成签名的时间戳
            //             nonceStr: data.nonceStr, // 必填，生成签名的随机串
            //             signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            //             jsApiList: [
            //                 'selectEnterpriseContact',
            //                 'checkJsApi',
            //                 'scanQRCode',
            //                 'shareAppMessage',
            //             ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            //         });
            //         this.setState({
            //             Wx_config_data: data,
            //         });
            //     },
            // });
            // wx.ready(function() {
            //     //配置文件加载完成之后会自动调用ready中的模块
            //     wx.checkJsApi({
            //         jsApiList: ['scanQRCode'],
            //         success: function(res) {},
            //     });
            // });
            // wx.error(function(res) {
            //     Toast.info(res.errMsg, 1);
            // });
        }
    }

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

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
                const value = { ...values };

                if (isNotBlank(value.schedulingtime) && value.schedulingtime.length > 0) {
                    value.beginFirstScheduleTime = value.schedulingtime[0];
                    value.endFirstScheduleTime = value.schedulingtime[1];
                    delete value.schedulingtime;
                } else {
                    delete value.schedulingtime;
                }
                if (isNotBlank(value.dueDateFactoy) && value.dueDateFactoy.length > 0) {
                    value.beginDueDate = value.dueDateFactoy[0];
                    value.endDueDate = value.dueDateFactoy[1];
                    delete value.dueDateFactoy;
                } else {
                    delete value.dueDateFactoy;
                }
                if (isNotBlank(value.createDate) && value.createDate.length > 0) {
                    value.beginCreateDate = value.createDate[0];
                    value.endCreateDate = value.createDate[1];
                    delete value.createDate;
                } else {
                    delete value.createDate;
                }

                if (isNotBlank(value.createBy) && value.createBy.length > 0) {
                    value['createBy.id'] = personIds.join(',');
                    delete value.createBy;
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

                this.setState({
                    formValues: value,
                });
                dispatch({
                    type: 'warning/fetch',
                    payload: { ...value, pageSize: this.state.pageSize, current: 1 },
                    callback: data => {
                        this.setState({
                            Pc_forwardList: data,
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
        dispatch({
            type: 'warning/fetch',
            payload: {
                current: 1,
                pageSize: this.state.pageSize,
            },
            callback: data => {
                this.setState({
                    Pc_forwardList: data,
                });
            },
        });
    }

    postForward = () => {
        const { selectdata } = this.state;
        let ids = selectdata.join(',');
        router.push(`/Warning/ForwardPage?id=${ids}`);
        const ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            wx.invoke(
                'shareAppMessage',
                {
                    title: '订单协同平台', // 分享标题
                    desc: '', // 分享描述
                    link: `/Warning/ForwardPage?id=${ids}`, // 分享链接
                    imgUrl: '', // 分享封面
                },
                function(res) {
                    if (res.err_msg == 'shareAppMessage:ok') {
                        //  router.push(`/wx/Forward?id=${ids}`)
                        message.success('转发成功!');
                    }
                }
            );
        } else {
            message.warning('请在微信浏览器使用此功能！');
        }
    };
    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
            getScondNameList,
            getAllBaseNameList,
            getWorkShopList,
            getbuNamelist,
        } = this.props;

        const formItemLayout = {
            labelcol: {
                xs: { span: 5 },
                sm: { span: 8, offset: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <div>
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
                                        labelcol={{ span: 5 }}
                                        wrapperCol={{ span: 15 }}
                                        label="一级排产时间"
                                    >
                                        {getFieldDecorator('schedulingtime', {
                                            initialValue: [],
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
                                    <FormItem
                                        labelcol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        label="工厂交期"
                                        style={{ padding: 0 }}
                                    >
                                        {getFieldDecorator('dueDateFactoy', {
                                            initialValue: [],
                                        })(
                                            <RangePicker size="default" style={{ width: '100%' }} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                                <Col md={10} sm={24} span={10}>
                                    <FormItem
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
                                    labelcol={{ span: 5 }}
                                    wrapperCol={{ span: 15 }}
                                    label="一级排产时间"
                                >
                                    {getFieldDecorator('schedulingtime', {
                                        initialValue: [],
                                    })(<RangePicker style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
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

                            <Col md={14} sm={24} span={14}>
                                <FormItem
                                    className={styles.formicon}
                                    labelcol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="异常创建时间"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('createDate', {
                                        initialValue: [],
                                    })(<RangePicker size="default" style={{ width: '100%' }} />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                            <Col md={10} sm={24} span={10}>
                                <FormItem
                                    className={styles.formicon}
                                    labelcol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="异常创建人"
                                    style={{ padding: 0 }}
                                >
                                    {getFieldDecorator('createBy', {
                                        initialValue: [],
                                    })(
                                        <Select
                                            onChange={(value, option) =>
                                                this.selectPersonChange(value, option)
                                            }
                                            mode="multiple"
                                            placeholder="请选择创建人"
                                            style={{ width: '100%' }}
                                        >
                                            {isNotBlank(this.state.tableData) &&
                                                isNotBlank(this.state.tableData.list) &&
                                                this.state.tableData.list.length > 0 &&
                                                this.state.tableData.list.map(item => {
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
                            <Col md={14} sm={24} span={14}>
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
        const { Pc_forwardList } = this.props;
        const { selectdata, selectflag, obj_filterList } = this.state;
        if (
            !isNotBlank(selectflag) ||
            (isNotBlank(selectflag) &&
                JSON.stringify(selectflag) == '{}' &&
                item &&
                item.exceptionList)
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
            if (isNotBlank(selectflag['i' + index] && item && item.exceptionList)) {
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
            for (var z = 0; z < obj_filterList.length; z++) {
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
        const { selectdata, selectflag, obj_filterList } = this.state;
        const { Pc_forwardList } = this.props;
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
        for (var z = 0; z < obj_filterList.length; z++) {
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
        const { Pc_forwardList } = this.props;
        const { isCheckAll, obj_filterList } = this.state;
        if (e.target.checked) {
            let newdata = [];
            let obj = {};
            for (var i = 0; i < obj_filterList.length; i++) {
                if (obj_filterList[i].exceptionList.length > 0) {
                    for (var j = 0; j < obj_filterList[i].exceptionList.length; j++) {
                        newdata.push(obj_filterList[i].exceptionList[j].id);
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
            for (var i = 0; i < obj_filterList.length; i++) {
                if (obj_filterList[i].exceptionList.length > 0) {
                    for (var j = 0; j < obj_filterList[i].exceptionList.length; j++) {
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
        const { Pc_forwardList } = this.props;
        const { obj_filterList } = this.state;
        if (e.target.checked) {
            this.isCheckAllfn(e);
            this.setState({ isCheckAllSearch: true });
        } else {
            let obj = {};
            for (var i = 0; i < obj_filterList.length; i++) {
                if (obj_filterList[i].exceptionList.length > 0) {
                    for (var j = 0; j < obj_filterList[i].exceptionList.length; j++) {
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

    handleFieldChange(selectArray) {
        // 选择框回调触发事件
        let { Pc_forwardList } = this.state;
        let data = [];
        if (selectArray && selectArray.length > 0) {
            data = Pc_forwardList.filter(item => {
                return item.content == selectArray[0];
            });
            this.setState({
                Pc_forwardList: data,
            });
        }
    }

    onPaginationChange(pagenumber, pageSize) {
        // 分页
        const { dispatch } = this.props;
        this.setState({ current: pagenumber }, () => {
            const { current } = this.state;
            const { formValues } = this.state;
            dispatch({
                type: 'warning/fetch',
                payload: {
                    current: current,
                    pageSize: pageSize,
                    ...formValues,
                },
                callback: data => {
                    this.setState({
                        Pc_forwardList: data,
                    });
                },
            });
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
        const { id } = this.state;
        this.setState({ buttonloading: true });
        dispatch({
            type: 'warning/pc_forward',
            payload: {
                current: 1,
                pageSize: this.state.pageSize,
                id: id,
            },
            callback: data => {
                this.setState({
                    buttonloading: false,
                });
            },
        });
    }

    handleWatchOrder(checked, e) {
        // 点击显示关注的订单
        const { dispatch } = this.props;
        if (checked) {
            dispatch({
                type: 'warning/fetch',
                payload: {
                    watch: true,
                    pageSize: this.state.pageSize,
                },
                callback: data => {
                    this.setState({ Pc_forwardList: data });
                },
            });
        } else if (!checked) {
            dispatch({
                type: 'warning/fetch',
                payload: {
                    watch: false,
                    pageSize: this.state.pageSize,
                },
                callback: data => {
                    this.setState({ Pc_forwardList: data });
                },
            });
        }
    }

    handleHasWatchTono(item) {
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
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: this.state.current,
                        pageSize: this.state.pageSize,
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
                dispatch({
                    type: 'warning/fetch',
                    payload: {
                        current: this.state.current,
                        pageSize: this.state.pageSize,
                    },
                });
            },
        });
    }

    handleBatch() {
        this.setState({ showConfim: true });
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
    onShowSizeChange(current, pageSize_fy) {
        const { pageSize, formValues } = this.state;
        const { dispatch } = this.props;
        this.setState({ pageSize: pageSize_fy });

        dispatch({
            type: 'warning/pc_forward',
            payload: {
                current: current,
                pageSize: pageSize_fy,
                ...formValues,
            },
            callback: data => {
                this.setState({
                    Pc_forwardList: data,
                });
            },
        });
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
        const { formValues } = this.state;
        Object.keys(formValues).forEach(ele => {
            if (Array.isArray(formValues[ele])) {
                formValues[ele] = formValues[ele].join(',');
            }
        });
        window.open(`${homeUrl}/Api/op/orderException/export?${stringify(formValues)}`);
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
            obj_filterList,
        } = this.state;

        const { loading, pc_forwardList } = this.props;

        // let obj_filterList =  filterKeywordData('orderSelfNum','watch','orderSelfNum',pc_forwardList)

        let defaultActiveKey = [];
        if (isNotBlank(obj_filterList) && obj_filterList.length > 0) {
            defaultActiveKey = obj_filterList.map(item => item.orderSelfNum);
        }
        const total =
            isNotBlank(obj_filterList) && obj_filterList.length > 0 && obj_filterList.length;

        const totalExceptionCount =
            isNotBlank(pc_forwardList) && pc_forwardList.length > 0 && pc_forwardList.length;

        const WorningListComponentprops = {
            onChange: this.onChange.bind(this),
            onPaginationChange: this.onPaginationChange.bind(this),
            handleHasWatchTono: this.handleHasWatchTono.bind(this),
            handleUnderWatchToyes: this.handleUnderWatchToyes.bind(this),
            unusual: this.unusual.bind(this),
            current,
            loading,
            pageSize, //每页条数
            isWatch, // 是否关注
            isCheckAllfn: e => this.isCheckAllfn(e),
            onCheckboxParnodeChange: (e, item, index) =>
                this.onCheckboxParnodeChange(e, item, index),
            onCheckboxItemChange: (e, item, items, index, indexs) =>
                this.onCheckboxItemChange(e, item, items, index, indexs),
            selectdata: this.state.selectdata,
            selectflag: this.state.selectflag,
            zfflag: this.state.zfflag,
            zfflag1: this.state.zfflag1,
            isCheckAll: this.state.isCheckAll,
            isCheckAllSearchfn: e => this.isCheckAllSearchfn(e),
            isCheckAllSearch: this.state.isCheckAllSearch,
            onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
        };
        return (
            <PageHeaderWrapper>
                <div>
                    {/* <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div className={styles.tableListOperator}>
                               
                            </div>
                        </div>

                        <div>
                            <Switch
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
                            </Switch>
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
                                onClick={() => {}}
                            >
                                批量导入
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
                            <Button
                                type="primary"
                                style={{ marginLeft: '30px' }}
                                onClick={() => this.postForward()}
                            >
                                转发
                            </Button>
                        </div>
                    </Card> */}
                </div>
                {(isNotBlank(pc_forwardList) && pc_forwardList.length == 0) ||
                !isNotBlank(pc_forwardList) ? (
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
                        pc_forwardList={obj_filterList}
                        total={total} // 总共多少条数据
                        totalExceptionCount={totalExceptionCount}
                        defaultCurrent={this.state.current} // 默人选中第几个
                        isDisabled={false} // 面板是否禁用
                        defaultActiveKey={defaultActiveKey} // 默认展开的所有面板
                        {...WorningListComponentprops}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default ForwardPageList;

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

    componentWillUnmount() {}

    render() {
        const {
            pc_forwardList,
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
            isCheckAllSearch,
            isCheckAllSearchfn,
            onShowSizeChange,
        } = this.props;
        // const { selectdata, selectflag, zfflag, zfflag1, isCheckAll } = this.state;

        return (
            <Spin size="large" spinning={loading}>
                <Card>
                    <div >
                        <div data-show="true" className="ant-alert ant-alert-info">
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                <Checkbox checked={isCheckAll} onChange={e => isCheckAllfn(e)} />
                                &nbsp;&nbsp;全选
                            </span>
                            <span className="ant-alert-message" style={{ marginLeft: '12px' }}>
                                已选择{' '}
                                <a style={{ fontWeight: 600 }}>{`${selectdata.length}条异常`}</a>
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
                    <Collapse activeKey={defaultActiveKey}>
                        {isNotBlank(pc_forwardList) &&
                            pc_forwardList.length > 0 &&
                            pc_forwardList.map((item, index) => {
                                return (
                                    <Panel
                                        disabled={isDisabled}
                                        showArrow={false}
                                        key={item.orderSelfNum}
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
                                                        style={{ marginLeft: '4px' }}
                                                        key={item.oid}
                                                        onChange={e =>
                                                            onCheckboxParnodeChange(e, item, index)
                                                        }
                                                    />
                                                </Col>
                                                <Col span={4}>
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
                                                <Col span={2} style={{ textAlign: 'center' }}>
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
                                                                ? monment(items.planBinTime).format(
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
                                                                ? monment(items.dueDate).format(
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
                                                                textAlign: 'center',
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
                        // showSizeChanger
                        // onShowSizeChange={(current, pageSize) =>
                        //     onShowSizeChange(current, pageSize)
                        // }
                        showTotal={this.showTotal.bind(this)}
                    />
                </Card>
            </Spin>
        );
    }
}

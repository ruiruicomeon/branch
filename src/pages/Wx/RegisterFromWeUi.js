import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { NavBar, Flex, DatePicker } from 'antd-mobile';
import router from 'umi/router';
import {
    Form,
    Input,
    Select,
    Button,
    message,
    Icon,
    Upload,
    TreeSelect,
    Row,
    Col,
    Divider,
    Mentions,
    Modal,
    Breadcrumb,
} from 'antd';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import classnames from 'classnames';
import iconstyle from './icon_type_folder.less';
import styles from './RegisterFromWeUi.less';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const moreAnd = require('../../assets/genduo.png');

const CreateFormcj = Form.create()(props => {
    const {
        handleModalVisiblecj,
        getScondNameListercj,
        modalVisiblecj,
        selectcustomer,
        ischecked,
        zrdatacj,
        handleScondNameClickcj,
        handleAddcj,
    } = props;

    const handleClick = scondname => {
        handleScondNameClickcj(scondname);
    };

    const okHandle = () => {
        handleAddcj();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择车间"
            visible={modalVisiblecj}
            // onOk={okHandle}
            footer={null}
            onCancel={() => handleModalVisiblecj()}
            width="80%"
        >
            <div className={styles.flex_item_chejian}>
                <Flex justify="center" wrap="wrap">
                    {isNotBlank(getScondNameListercj) &&
                        getScondNameListercj.length > 0 &&
                        getScondNameListercj.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        // zrdatacj.findIndex((item, index, arr) => item.id == scondname.id) !== -1
                                        isNotBlank(zrdatacj) &&
                                        isNotBlank(zrdatacj.length > 0) &&
                                        zrdatacj.some(item => item.id == scondname.id)
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.label}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

const CreateFormerji = Form.create()(props => {
    const {
        handleModalVisibleerji,
        getScondNameListerji,
        modalVisibleerji,
        selectcustomererji,
        ischecked,
        zrdataerji,
        handleScondNameClickerji,
        handleAdderji,
    } = props;

    const handleClick = scondname => {
        handleScondNameClickerji(scondname);
    };
    const okHandle = () => {
        handleAdderji();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择二级品类"
            visible={modalVisibleerji}
            onOk={okHandle}
            onCancel={() => handleModalVisibleerji()}
            width="80%"
            footer={null}
            maxHeight="300px"
        >
            <div className={styles.flex_item_style}>
                <Flex justify="center" type="flex" wrap="wrap">
                    {isNotBlank(getScondNameListerji) &&
                        getScondNameListerji.length > 0 &&
                        getScondNameListerji.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        isNotBlank(zrdataerji) &&
                                        zrdataerji.length > 0 &&
                                        zrdataerji.some(item => item.id == scondname.id)
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.name}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

const CreateForm = Form.create()(props => {
    const {
        handleModalVisible,
        departmentFailure,
        modalVisible,
        selectcustomer,
        ischecked,
        zrdata,
        handleScondNameClick,
        handleAdd,
    } = props;

    const handleClick = scondname => {
        handleScondNameClick(scondname);
    };
    const okHandle = () => {
        handleAdd();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择责任分类"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            width="80%"
        >
            <div className={styles.flex_item_style}>
                <Flex justify="center" type="flex" wrap="wrap">
                    {isNotBlank(departmentFailure) &&
                        isNotBlank(departmentFailure.list) &&
                        departmentFailure.list.length > 0 &&
                        departmentFailure.list.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        isNotBlank(zrdata) &&
                                        zrdata.length > 0 &&
                                        zrdata.findIndex(
                                            (item, index, arr) => item.id == scondname.id
                                        ) !== -1
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.value}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

const CreateFormzr = Form.create()(props => {
    const {
        handleModalVisiblezr,
        departmentList,
        modalVisiblezr,
        selectcustomer,
        ischecked,
        zrdatazr,
        handleScondNameClickzr,
        handleAddzr,
        onDutySearch,
    } = props;

    const handleClick = scondname => {
        handleScondNameClickzr(scondname);
    };

    const okHandle = () => {
        handleAddzr();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择责任部门"
            visible={modalVisiblezr}
            onOk={okHandle}
            onCancel={() => handleModalVisiblezr()}
            width="80%"
        >
            <div style={{ marginBottom: '10px' }}>
                <Search
                    size="default"
                    placeholder="请输入部门名称"
                    onSearch={onDutySearch}
                    enterButton
                    allowClear
                />
            </div>
            <div className={styles.flex_item_style}>
                <Flex justify="center" wrap="wrap">
                    {isNotBlank(departmentList) &&
                        isNotBlank(departmentList.list) &&
                        departmentList.list.length > 0 &&
                        departmentList.list.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        isNotBlank(zrdatazr) &&
                                        zrdatazr.length > 0 &&
                                        zrdatazr.findIndex(
                                            (item, index, arr) => item.id == scondname.id
                                        ) !== -1
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.value}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

const CreateFormgj = Form.create()(props => {
    const {
        handleModalVisiblegj,
        departmentList,
        modalVisiblegj,
        selectcustomer,
        ischecked,
        zrdatagj,
        handleScondNameClickgj,
        handleAddgj,
        onDutySearch,
    } = props;

    const handleClick = scondname => {
        handleScondNameClickgj(scondname);
    };

    const okHandle = () => {
        handleAddgj();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择跟进部门"
            visible={modalVisiblegj}
            onOk={okHandle}
            onCancel={() => handleModalVisiblegj()}
            width="80%"
        >
            <div style={{ marginBottom: '10px' }}>
                <Search
                    size="default"
                    placeholder="请输入部门名称"
                    onSearch={onDutySearch}
                    enterButton
                    allowClear
                />
            </div>
            <div className={styles.flex_item_style}>
                <Flex justify="center" wrap="wrap">
                    {isNotBlank(departmentList) &&
                        isNotBlank(departmentList.list) &&
                        departmentList.list.length > 0 &&
                        departmentList.list.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        isNotBlank(zrdatagj) &&
                                        zrdatagj.length > 0 &&
                                        zrdatagj.findIndex(
                                            (item, index, arr) => item.id == scondname.id
                                        ) !== -1
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.value}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

const CreateFormhs = Form.create()(props => {
    const {
        handleModalVisiblehs,
        getCommList,
        modalVisiblehs,
        selectcustomer,
        ischecked,
        zrdatahs,
        handleScondNameClickhs,
        handleAddhs,
        allzrdatahs,
    } = props;

    const handleClick = scondname => {
        handleScondNameClickhs(scondname);
    };

    const okHandle = () => {
        handleAddhs();
    };
    return (
        <Modal
            style={{ top: 10 }}
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            title="选择话术"
            visible={modalVisiblehs}
            // onOk={okHandle}
            footer={null}
            onCancel={() => handleModalVisiblehs()}
            width="80%"
        >
            <div className={styles.flex_item_style}>
                <Flex justify="center" wrap="wrap">
                    {isNotBlank(getCommList) &&
                        isNotBlank(getCommList.list) &&
                        getCommList.list.length > 0 &&
                        getCommList.list.map(scondname => {
                            return (
                                <Flex.Item
                                    key={scondname.id}
                                    className={
                                        isNotBlank(allzrdatahs) &&
                                        isNotBlank(allzrdatahs.id) &&
                                        allzrdatahs.id == scondname.id
                                            ? // scondname.id == scondnameData.id
                                              classnames(styles.Flex_item, ischecked)
                                            : classnames(styles.Flex_item)
                                    }
                                    onClick={() => {
                                        handleClick(scondname);
                                    }}
                                >
                                    {scondname.label}
                                </Flex.Item>
                            );
                        })}
                </Flex>
            </div>
        </Modal>
    );
});

@connect(
    ({
        dictionaryL,
        loading,
        sysdeptList,
        sysoffice,
        warning,
        sysuser,
        communication,
        speaklist,
        user,
    }) => ({
        ...dictionaryL,
        ...communication,
        sysdeptList,
        sysoffice,
        ...user,
        ...sysuser,
        ...warning,
        ...speaklist,
        userloading: loading.models.sysuser,
        submitting: loading.effects['warning/add_wxWarning'],
    })
)
@Form.create()
class RegisterFromWeUi extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: {},
            addfileList: [], // 所需要的上传的文件的数组
            fileList: [], // 用于显示上传之后的文件
            departmentFailure: [], // 责任部门
            SelectPersonnelRows: [], // 弹框人员
            showimgsrc: [], // 显示的图片路径
            initDutydept: [], // 选择责任人之后默认显示的部门
            getMentions: '', // 登记中@到的人员
            mentionsNameArray: [],
            mentionsIdArray: [],
            Wx_config_data: {},
            orderlist_wx: {}, // 订单查询携带参数
            speakValue: '', // 话术
            SiteCode: '',
            SiteName: '',
            ischecked: styles.on_select,
            modalVisible: false,
            zrdata: [],
            modalVisiblezr: false,
            zrdatazr: [],
            modalVisiblegj: false,
            zrdatagj: [],
            modalVisiblehs: false,
            zrdatahs: [],
            allzrdatahs: [],
            selectzr: [],
            selectzrbm: [],
            selectgjbm: [],
            addallzrdatahs: [],

            modalVisibleerji: false, // 二级
            zrdataerji: [],
            selecterji: [],
            modalVisiblecj: false, // 二级
            zrdatacj: [],
            begindate: '', // 预计完成时间
            getfenlei: [],
            selectget: [],
            selectzrgj: [],
            initialBeginDate: '',
            dueDate: '', // 工厂交货期
            planBinTime: '', // 预计完成时间
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        let date = new Date();
        let tommdate = date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        this.setState({ initialBeginDate: new Date(tommdate) });
        dispatch({
            // 用户选择
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 6000 },
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
        dispatch({
            // 责任部门
            type: 'dictionaryL/fetch',
            payload: { type: 'duty', current: 1, pageSize: 5000 },
        });

        dispatch({
            type: `user/fetchCurrent_myself`,
            callback: data => {
                if (isNotBlank(data)) {
                    let defaultPerson = [
                        { uid: data.id, name: data.name, url: data.photo, qqID: data.qqId },
                    ];

                    if (!Object.values(defaultPerson[0]).some(item => item == undefined)) {
                        this.setState({
                            showimgsrc: [...defaultPerson],
                        });
                    } else {
                        this.setState({
                            showimgsrc: [],
                        });
                    }
                }
            },
        });

        if (
            isNotBlank(location) &&
            isNotBlank(location.state) &&
            isNotBlank(location.state.orderlist_wx)
        ) {
            let orderlist_wx = location.state.orderlist_wx;
            this.setState({
                orderlist_wx,
                dueDate: orderlist_wx.dueDate ? orderlist_wx.dueDate : '',
                planBinTime: orderlist_wx.planBinTime ? orderlist_wx.planBinTime : '',
            });

            dispatch({
                // 二级品类
                type: 'communication/fetch_secondname_wx',
                payload: {
                    BuCode: orderlist_wx.buCode,
                    current: 1,
                    pageSize: 5000,
                },
            });
            dispatch({
                //  车间
                type: 'communication/fetch_workshop_wx',
                payload: { BuCode: orderlist_wx.buCode, current: 1, pageSize: 5000 },
                callback: data => {
                    if (data.length == 1) {
                        let newarr = [];
                        newarr.push({
                            id: data[0].id,
                            code: data[0].code,
                            name: data[0].name,
                            siteName: data[0].siteName ? data[0].siteName : '',
                            siteCode: data[0].siteCode ? data[0].siteCode : '',
                        });
                        this.setState({ zrdatacj: newarr });
                    }
                },
            });
            dispatch({
                // 责任分类
                type: 'dictionaryL/fetch',
                payload: {
                    type: 'failure',
                    label: orderlist_wx.buCode,
                    current: 1,
                    pageSize: 5000,
                },
                callback: data => {
                    this.setState({
                        departmentFailure: data,
                    });
                },
            });
            dispatch({
                // 获取话术
                type: 'speaklist/fetch',
                payload: {
                    current: 1,
                    pageSize: 5000,
                    buName: orderlist_wx.buName,
                },
            });
        }

        //  oid
        if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
            dispatch({
                type: 'warning/findoneofIdBaygegiter',
                payload: { oid: location.query.id },
                callback: data => {
                    dispatch({
                        // 二级品类
                        type: 'communication/fetch_secondname_wx',
                        payload: {
                            BuCode: data.buCode,
                            current: 1,
                            pageSize: 5000,
                        },
                    });
                    dispatch({
                        // 车间
                        type: 'communication/fetch_workshop_wx',
                        payload: { BuCode: data.buCode, current: 1, pageSize: 5000 },
                        callback: data => {
                            if (data.length == 1) {
                                let newarr = [];
                                newarr.push({
                                    id: data[0].id,
                                    code: data[0].code,
                                    name: data[0].name,
                                    siteName: data[0].siteName ? data[0].siteName : '',
                                    siteCode: data[0].siteCode ? data[0].siteCode : '',
                                });
                                this.setState({ zrdatacj: newarr });
                            }
                        },
                    });
                    dispatch({
                        // 获取话术
                        type: 'speaklist/fetch',
                        payload: {
                            current: 1,
                            pageSize: 5000,
                            buName: data.buName,
                        },
                    });
                    dispatch({
                        // 责任分类
                        type: 'dictionaryL/fetch',
                        payload: {
                            type: 'failure',
                            label: data.buCode,
                            current: 1,
                            pageSize: 5000,
                        },
                        callback: data => {
                            this.setState({
                                departmentFailure: data,
                            });
                        },
                    });
                    this.setState({
                        dueDate: data.dueDate,
                        planBinTime: data.planBinTime,
                    });
                },
            });
        }

        dispatch({
            type: 'user/get_wx_config',
            payload: { url: window.location.host },
            callback: data => {
                window.wx.config({
                    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，企业微信的corpID
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                    jsApiList: ['selectEnterpriseContact'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                });
                this.setState({
                    Wx_config_data: data,
                });
            },
        });
    }

    // 关闭页面清除数据
    componentWillUnmount() {
        const { form, location, dispatch } = this.props;
        form.resetFields();
        if (location && location.query && location.query.id) {
            dispatch({
                type: 'warning/clear_saveonefindoneofIdBaygegiter',
            });
        } else {
            this.setState({
                orderlist_wx: {},
            });
        }
    }

    onCancelCancel = () => {
        router.goBack();
    };

    handleSubmit = e => {
        const { dispatch, form, AddOnerecord, location } = this.props;
        const {
            addfileList,
            mentionsNameArray,
            mentionsIdArray,
            zrdataerji,
            zrdatacj,
            begindate,
            selectzrbm,
            selectgjbm,
            selectzr,
            selectget,
            selectzrgj,
            initialBeginDate,
            dueDate, // 工厂交货期
            planBinTime,
        } = this.state;
        e.preventDefault();
        form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                const value = { ...val };
                (value.dueDate = dueDate ? moment(dueDate).format('YYYY-MM-DD') : ''), // 工厂交货期
                    (value.planBinTime = planBinTime
                        ? moment(planBinTime).format('YYYY-MM-DD')
                        : '');
                if (isNotBlank(addfileList) && addfileList.length > 0) {
                    value.file = addfileList;
                }
                value.estiCompTime = begindate
                    ? moment(begindate).format('YYYY/MM/DD')
                    : initialBeginDate
                    ? moment(initialBeginDate).format('YYYY/MM/DD')
                    : '';
                if (zrdataerji.length == 0) {
                    message.warning('二级品类必填');
                    return;
                } else if (zrdataerji.length > 0) {
                    value.secondCategoryCode = zrdataerji[0].code;
                    value.secondCategoryName = zrdataerji[0].name;
                }
                if (zrdatacj.length == 0) {
                    message.warning('车间信息必填');
                    return;
                } else if (zrdatacj.length > 0) {
                    value.deptCode = zrdatacj[0].code;
                    value.deptName = zrdatacj[0].name;
                }
                if (selectzr.length == 0) {
                    message.warning('责任分类必填');
                    return;
                } else {
                    value.respType =
                        isNotBlank(selectzr) && selectzr.length > 0
                            ? selectzr.map(item => item.value).join(',')
                            : '';
                }
                if (selectzrbm.length == 0 && selectget.length == 0) {
                    message.warning('责任部门必填');
                    return;
                } else {
                    value.respDept =
                        isNotBlank(selectzrbm) && selectzrbm.length > 0
                            ? selectzrbm.map(item => item.value).join(',')
                            : isNotBlank(selectget) && selectget.length > 0
                            ? selectget.join(',')
                            : '';
                }

                if (selectgjbm.length == 0 && selectzrgj.length == 0 && selectget.length == 0) {
                    message.warning('跟进部门必填!');
                    return;
                } else {
                    value.followDept =
                        isNotBlank(selectgjbm) && selectgjbm.length > 0
                            ? selectgjbm.map(item => item.value).join(',')
                            : isNotBlank(selectzrgj) && selectzrgj.length > 0
                            ? selectzrgj.map(item => item.value).join(',')
                            : isNotBlank(selectget) && selectget.length > 0
                            ? selectget.join(',')
                            : '';
                }

                let respUserStr =
                    isNotBlank(this.state.showimgsrc) &&
                    this.state.showimgsrc.map(item => item.qqID).join(',');
                if (isNotBlank(respUserStr)) {
                    respUserStr = `,${respUserStr},`;
                }

                let mentionsIdArr = [];
                if (isNotBlank(value.exceptionInfo)) {
                    if (isNotBlank(mentionsIdArray) && mentionsIdArray.length > 0) {
                        for (
                            let i = 0;
                            mentionsNameArray.length > 0 && i < mentionsNameArray.length;
                            i += 1
                        ) {
                            if (
                                isNotBlank(mentionsNameArray[i]) &&
                                value.exceptionInfo.indexOf(mentionsNameArray[i]) > -1
                            ) {
                                mentionsIdArr = [...mentionsIdArr, mentionsIdArray[i]];
                            }
                        }
                    }
                    if (isNotBlank(mentionsIdArr) && mentionsIdArr.length > 0) {
                        const ids = mentionsIdArr.map(item => item).join(',');
                        value.mentions = ids;
                    }
                }

                value.respUserQ = respUserStr || '';

                const values = { ...value };
                values.resvStr2 = '1';
                dispatch({
                    type: 'warning/add_wxWarning',
                    payload: { ...values },
                    callback: () => {
                        router.goBack();
                    },
                });
            }
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleImage = url => {
        this.setState({
            previewImage: url,
            previewVisible: true,
        });
    };

    handleUploadChange = info => {
        const isLt10M = info.file.size / 1024 / 1024 <= 10;
        if (isLt10M) {
            this.setState({ fileList: info.fileList });
        }
    };

    handlebeforeUpload = file => {
        const isLt10M = file.size / 1024 / 1024 <= 10;
        if (!isLt10M) {
            message.error('文件大小需为10M以内');
        }
        if (isLt10M) {
            if (
                this.state.addfileList == null ||
                this.state.addfileList === 'undefined' ||
                this.state.addfileList.length <= 0
            ) {
                this.setState({
                    addfileList: [file],
                });
            } else {
                this.setState(({ addfileList }) => ({
                    addfileList: [...addfileList, file],
                }));
            }
        }
        return false;
    };

    handleRemove = file => {
        const { dispatch } = this.props;
        const { data } = this.state;
        this.setState(({ fileList, addfileList }) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);

            const newaddfileList = addfileList.slice();
            newaddfileList.splice(index, 1);

            return {
                fileList: newFileList,
                addfileList: newaddfileList,
            };
        });
    };

    handlePreview = file => {
        // 预览点击
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleshowImgchange({ fileList }) {
        // 删除照片的回调
        this.setState({
            showimgsrc: fileList,
        });
    }

    onMentionsSelect = option => {
        const { mentionsNameArray, mentionsIdArray } = this.state;
        this.setState({
            mentionsNameArray: [...mentionsNameArray, `@${option.value}`],
            mentionsIdArray: [...mentionsIdArray, option.id],
        });
    };
    speakSelectChange(value) {
        this.setState({
            speakValue: value,
        });
    }

    onSelectUser = () => {
        const { showimgsrc } = this.state;
        window.wx.invoke(
            'selectEnterpriseContact',
            {
                fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
                mode: 'multi', // 必填，选择模式，single表示单选，multi表示多选
                type: ['department', 'user'], // 必填，选择限制类型，指定department、user中的一个或者多个
                selectedDepartmentIds: [], // 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
                selectedUserIds: [], // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            },
            res => {
                if (res.err_msg === 'selectEnterpriseContact:ok') {
                    if (typeof res.result === 'string') {
                        res.result = JSON.parse(res.result); // 由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }
                    const selectedDepartmentList = res.result.departmentList; // 已选的部门列表
                    for (let i = 0; i < selectedDepartmentList.length; i++) {
                        const department = selectedDepartmentList[i];
                        const departmentId = department.id; // 已选的单个部门ID
                        const departemntName = department.name; // 已选的单个部门名称
                    }
                    const selectedUserList = res.result.userList; // 已选的成员列表
                    const imgsrc = [];
                    for (let i = 0; i < selectedUserList.length; i += 1) {
                        const user = selectedUserList[i];
                        const userId = user.id; // 已选的单个成员ID
                        const userName = user.name; // 已选的单个成员名称
                        const userAvatar = user.avatar; // 已选的单个成员头像
                        imgsrc.push({ uid: userId, url: userAvatar, name: userName, qqID: userId });
                    }
                    if (showimgsrc.length > 0) {
                        this.setState({
                            showimgsrc: [...showimgsrc, ...imgsrc],
                            facevisible: false,
                        });
                    } else {
                        this.setState({
                            showimgsrc: isNotBlank(imgsrc) && imgsrc,
                            facevisible: false,
                        });
                    }
                }
            }
        );
    };

    showMhs = () => {
        this.setState({
            modalVisiblehs: true,
        });
    };
    handleModalVisibleerji = flag => {
        const { selecterji } = this.state;
        let newobj = this.deepCopy(selecterji);
        this.setState({
            modalVisibleerji: !!flag,
            zrdataerji: newobj,
        });
    };
    handleModalVisible = flag => {
        const { selectzr, getfenlei } = this.state;
        let newobj = this.deepCopy(selectzr);
        let newfenlei = this.deepCopy(getfenlei);
        this.setState({
            modalVisible: !!flag,
            zrdata: newobj,
            getfenlei: newfenlei,
        });
    };
    handleBaseClick(speak) {
        const { dispatch } = this.props;

        this.setState({
            checkedData: speak,
        });
    }
    handleModalVisiblezr = flag => {
        const { selectzrbm } = this.state;
        let newobj = this.deepCopy(selectzrbm);
        this.setState({
            modalVisiblezr: !!flag,
            zrdatazr: newobj,
        });
    };

    handleScondNameClick = scondname => {
        const { zrdata, getfenlei } = this.state;
        let newarr = zrdata;
        let getarr = this.deepCopy(getfenlei);
        if (newarr.length == 0) {
            newarr.push({ id: scondname.id, remarks: scondname.remarks, value: scondname.value });
            getarr.push(scondname.remarks);
        } else {
            if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
                newarr.push({
                    id: scondname.id,
                    remarks: scondname.remarks,
                    value: scondname.value,
                });
                getarr.push(scondname.remarks);
            } else {
                newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
                getarr.splice(getarr.indexOf(scondname.remarks), 1);
            }
        }

        this.setState({
            zrdata: newarr,
            getfenlei: getarr,
        });
        this.forceUpdate();
    };
    handleModalVisiblehs = flag => {
        const { addallzrdatahs } = this.state;
        let newobj = this.deepCopy(addallzrdatahs);
        this.setState({
            modalVisiblehs: !!flag,
            allzrdatahs: newobj,
        });
    };
    showMgj = () => {
        this.setState({
            modalVisiblegj: true,
        });
    };
    showMzr = () => {
        this.setState({
            modalVisiblezr: true,
        });
    };
    showM = () => {
        this.setState({
            modalVisible: true,
        });
    };
    showerji = () => {
        // ereji
        this.setState({
            modalVisibleerji: true,
        });
    };
    showMcj = () => {
        this.setState({
            modalVisiblecj: true,
        });
    };
    handleAddercj = () => {
        const { zrdatacj } = this.state;
        let newobj = this.deepCopy(zrdatacj);
        this.setState({
            modalVisiblecj: false,
            selectercj: newobj,
        });
    };
    // handleModalVisibleerji() {

    // }
    handleModalVisiblecj = flag => {
        this.setState({
            modalVisiblecj: false,
        });
    };

    handleScondNameClickcj(scondname) {
        const { zrdatacj } = this.state;
        let newarr = zrdatacj;
        if (newarr.length == 0) {
            newarr.push({
                id: scondname.id,
                code: scondname.code,
                name: scondname.name,
                siteName: scondname.siteName ? scondname.siteName : '',
                siteCode: scondname.siteCode ? scondname.siteCode : '',
            });
            this.setState({
                modalVisiblecj: true,
            });
        } else {
            if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
                newarr = [];
                newarr.push({
                    id: scondname.id,
                    code: scondname.code,
                    name: scondname.name,
                    siteName: scondname.siteName ? scondname.siteName : '',
                    siteCode: scondname.siteCode ? scondname.siteCode : '',
                });
            } else {
                newarr = [];
            }
        }
        this.setState({
            zrdatacj: newarr,
            selectercj: newarr,
            modalVisiblecj: false,
        });
        this.forceUpdate();
    }

    handleModalVisiblegj = flag => {
        const { selectgjbm } = this.state;
        let newobj = this.deepCopy(selectgjbm);
        this.setState({
            modalVisiblegj: !!flag,
            zrdatagj: newobj,
        });
    };

    deepcopytwo(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        }
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? this.deepcopytwo(obj[i]) : obj[i];
        }
        return newobj;
    }
    deepCopy = obj => {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    result[key] = this.deepCopy(obj[key]); //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    };
    handleScondNameClickgj = scondname => {
        const { zrdatagj } = this.state;
        let newarr = zrdatagj;
        if (newarr.length == 0) {
            newarr.push({ id: scondname.id, value: scondname.value });
        } else {
            if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
                newarr.push({ id: scondname.id, value: scondname.value });
            } else {
                newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
            }
        }
        this.setState({
            zrdatagj: newarr,
        });
        this.forceUpdate();
    };
    handleScondNameClickhs = scondname => {
        const { zrdatahs, allzrdatahs } = this.state;
        // let newarr = zrdatahs
        // let allnewarr = allzrdatahs
        const { form } = this.props;
        if (
            isNotBlank(allzrdatahs) &&
            isNotBlank(allzrdatahs.id) &&
            allzrdatahs.id == scondname.id
        ) {
            this.setState({
                allzrdatahs: {},
                modalVisiblehs: false,
                speakValue: '',
            });
            form.setFieldsValue({ exceptionInfo: '' });
        } else {
            this.setState({
                allzrdatahs: scondname,
                modalVisiblehs: false,
                speakValue: scondname.value,
            });
            form.setFieldsValue({ exceptionInfo: scondname.value });
        }
    };
    handleAdd = () => {
        const { zrdata, getfenlei } = this.state;
        let newobj = this.deepcopytwo(zrdata);
        let newfenlei = this.deepCopy(getfenlei);
        this.setState({
            modalVisible: false,
            selectzr: newobj,
            selectget: newfenlei,
        });
        // this.forceUpdate();
    };
    handleAddgj = () => {
        const { zrdatagj } = this.state;
        let newobj = this.deepcopytwo(zrdatagj);
        this.setState({
            modalVisiblegj: false,
            selectgjbm: newobj,
        });
        // this.forceUpdate();
    };
    handleAddzr = () => {
        const { zrdatazr } = this.state;
        let newobj = this.deepcopytwo(zrdatazr);
        this.setState({
            modalVisiblezr: false,
            selectzrbm: newobj,
            selectzrgj: newobj,
        });
        // this.forceUpdate();
    };
    handleScondNameClickzr = scondname => {
        const { zrdatazr } = this.state;
        let newarr = zrdatazr;
        if (newarr.length == 0) {
            newarr.push({ id: scondname.id, value: scondname.value });
        } else {
            if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
                newarr.push({ id: scondname.id, value: scondname.value });
            } else {
                newarr.splice(newarr.findIndex((item, index, arr) => item.id == scondname.id), 1);
            }
        }
        this.setState({
            zrdatazr: newarr,
        });
        this.forceUpdate();
    };

    //--erji--
    handleAdderji = () => {
        const { zrdataerji } = this.state;
        let newobj = this.deepCopy(zrdataerji);
        this.setState({
            modalVisibleerji: false,
            selecterji: newobj,
        });
    };
    // handleModalVisibleerji() {

    // }
    handleScondNameClickerji(scondname) {
        const { zrdataerji } = this.state;
        let newarr = zrdataerji;
        if (newarr.length == 0) {
            newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
            this.setState({
                modalVisibleerji: true,
            });
        } else {
            if (newarr.findIndex((item, index, arr) => item.id == scondname.id) == -1) {
                newarr = [];
                newarr.push({ id: scondname.id, code: scondname.code, name: scondname.name });
            } else {
                newarr = [];
            }
        }

        this.setState({
            zrdataerji: newarr,
            selecterji: newarr,
            modalVisibleerji: false,
        });
        this.forceUpdate();
    }
    handleRemovegj(value, option) {}
    onDutySearch(value) {
        const { dispatch } = this.props;
        dispatch({
            // 责任部门
            type: 'dictionaryL/fetch',
            payload: { type: 'duty', current: 1, value: value },
        });
    }
    render() {
        const {
            fileList,
            previewVisible,
            previewImage,
            departmentFailure,
            orderlist_wx,
            speakValue,
            ischecked,
            checkedData,
            checkedDataList,
            modalVisible,
            zrdata,
            selectzr,
            modalVisiblezr,
            zrdatazr,
            selectzrbm,
            modalVisiblegj,
            zrdatagj,
            selectgjbm,
            modalVisiblehs,
            zrdatahs,
            allzrdatahs,
            modalVisibleerji, // 二级
            zrdataerji,
            selecterji,
            modalVisibleercj, // 二级
            zrdatacj,
            modalVisiblecj,
            selectget,
            selectzrgj,
            // 选中
        } = this.state;

        const {
            submitting,
            cpAssemblyFormGet,
            sysdeptList,
            departmentList,
            sysoffice: { data },
            warningDateil,
            AddOnerecord, // 沟通传递的值
            findoneofIdBaygegiter, // 登记oid获取值
            location,
            getWorkShopList, // 车间
            getCommList,
            getScondNameList, // 二级品类
        } = this.props;

        const {
            form: { getFieldDecorator },
        } = this.props;

        const uploadButton = (
            <div>
                <Button className="ant-upload-text" type="primary" size="large">
                    上传附件
                </Button>
            </div>
        );
        const parentMethodserji = {
            handleAdderji: this.handleAdderji,
            handleModalVisibleerji: this.handleModalVisibleerji,
            getScondNameListerji: getScondNameList,
            modalVisibleerji,
            ischecked,
            zrdataerji,
            handleScondNameClickerji: this.handleScondNameClickerji.bind(this),
        };

        const parentMethodsgj = {
            handleAddgj: this.handleAddgj,
            handleModalVisiblegj: this.handleModalVisiblegj,
            departmentList,
            modalVisiblegj,
            ischecked,
            zrdatagj,
            handleScondNameClickgj: this.handleScondNameClickgj,
            onDutySearch: value => this.onDutySearch(value),
        };

        const parentMethodsercj = {
            handleAddercj: this.handleAddercj,
            handleModalVisiblecj: this.handleModalVisiblecj,
            getScondNameListercj: getWorkShopList,
            modalVisiblecj,
            ischecked,
            zrdatacj,
            handleScondNameClickcj: this.handleScondNameClickcj.bind(this),
        };

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            departmentFailure,
            modalVisible,
            ischecked,
            zrdata,
            handleScondNameClick: this.handleScondNameClick,
        };
        const parentMethodszr = {
            handleAddzr: this.handleAddzr,
            handleModalVisiblezr: this.handleModalVisiblezr,
            departmentList,
            modalVisiblezr,
            ischecked,
            zrdatazr,
            handleScondNameClickzr: this.handleScondNameClickzr,
            onDutySearch: value => this.onDutySearch(value),
        };

        const parentMethodshs = {
            handleAddhs: this.handleAddhs,
            handleModalVisiblehs: this.handleModalVisiblehs,
            getCommList,
            modalVisiblehs,
            ischecked,
            zrdatahs,
            allzrdatahs,
            handleScondNameClickhs: this.handleScondNameClickhs,
        };

        return (
            <div className={styles.page}>
                {/* <NavBar
                    className={styles.tabBar}
                    mode="light"
                // icon={<Icon type="left" />}
                // onLeftClick={() => this.onCancelCancel()}
                >
                    登记
                </NavBar> */}
                <div
                    style={{
                        paddingTop: '10px',
                        paddingBottom: '40px',
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 20,
                    }}
                >
                    <div className={styles.title_con}>
                        <div
                            className={styles.orderSelfNum_style_con}
                            style={{ fontWeight: 600, fontSize: '16px' }}
                        >
                            {isNotBlank(findoneofIdBaygegiter) &&
                            isNotBlank(findoneofIdBaygegiter.orderSelfNum)
                                ? findoneofIdBaygegiter.orderSelfNum
                                : isNotBlank(orderlist_wx) && isNotBlank(orderlist_wx.orderSelfNum)
                                ? orderlist_wx.orderSelfNum
                                : ''}
                        </div>
                        <div className={styles.orderSelfNum_style_con}>
                            {isNotBlank(findoneofIdBaygegiter) &&
                            isNotBlank(findoneofIdBaygegiter.buName)
                                ? findoneofIdBaygegiter.buName
                                : isNotBlank(orderlist_wx) && isNotBlank(orderlist_wx.buName)
                                ? orderlist_wx.buName
                                : ''}
                        </div>
                    </div>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ marginTop: 8, marginBottom: '20px' }}
                        layout="horizontal"
                    >
                        <FormItem label="订单Guid" style={{ display: 'none' }}>
                            {getFieldDecorator('oid', {
                                initialValue:
                                    isNotBlank(findoneofIdBaygegiter) &&
                                    isNotBlank(findoneofIdBaygegiter.oid)
                                        ? findoneofIdBaygegiter.oid
                                        : isNotBlank(orderlist_wx) && isNotBlank(orderlist_wx.oid)
                                        ? orderlist_wx.oid
                                        : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                        </FormItem>
                        <FormItem label="订单自编号" style={{ display: 'none' }}>
                            {getFieldDecorator('orderSelfNum', {
                                initialValue:
                                    isNotBlank(findoneofIdBaygegiter) &&
                                    isNotBlank(findoneofIdBaygegiter.orderSelfNum)
                                        ? findoneofIdBaygegiter.orderSelfNum
                                        : isNotBlank(orderlist_wx) &&
                                          isNotBlank(orderlist_wx.orderSelfNum)
                                        ? orderlist_wx.orderSelfNum
                                        : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                        </FormItem>
                        <FormItem label="Wcc编号" style={{ display: 'none' }}>
                            {getFieldDecorator('wccNum', {
                                initialValue:
                                    isNotBlank(findoneofIdBaygegiter) &&
                                    isNotBlank(findoneofIdBaygegiter.wccNum)
                                        ? findoneofIdBaygegiter.wccNum
                                        : isNotBlank(orderlist_wx) &&
                                          isNotBlank(orderlist_wx.wccNum)
                                        ? orderlist_wx.wccNum
                                        : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                        </FormItem>
                        <FormItem
                            label={
                                <span>
                                    二级品类 <em style={{ color: 'red', fontSize: '12px' }}>*</em>
                                </span>
                            }
                        >
                            <Input
                                value={
                                    isNotBlank(zrdataerji) && zrdataerji.length > 0
                                        ? zrdataerji[0].name
                                        : []
                                }
                                onClick={this.showerji}
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <span>
                                    车间 <em style={{ color: 'red', fontSize: '12px' }}>*</em>
                                </span>
                            }
                        >
                            <Input
                                value={
                                    isNotBlank(zrdatacj) && zrdatacj.length > 0
                                        ? zrdatacj[0].name
                                        : []
                                }
                                onClick={this.showMcj}
                            />
                        </FormItem>
                        <FormItem label="品类名称" style={{ display: 'none' }}>
                            {getFieldDecorator('buName', {
                                initialValue:
                                    isNotBlank(findoneofIdBaygegiter) &&
                                    isNotBlank(findoneofIdBaygegiter.buName)
                                        ? findoneofIdBaygegiter.buName
                                        : isNotBlank(orderlist_wx) &&
                                          isNotBlank(orderlist_wx.buName)
                                        ? orderlist_wx.buName
                                        : '',
                                rules: [
                                    {
                                        required: false,
                                        message: '',
                                    },
                                ],
                            })(<Input placeholder="请输入品类名称" />)}
                        </FormItem>
                        <FormItem label="品类编码" style={{ display: 'none' }}>
                            {getFieldDecorator('buCode', {
                                initialValue:
                                    isNotBlank(findoneofIdBaygegiter) &&
                                    isNotBlank(findoneofIdBaygegiter.buCode)
                                        ? findoneofIdBaygegiter.buCode
                                        : isNotBlank(orderlist_wx) &&
                                          isNotBlank(orderlist_wx.buCode)
                                        ? orderlist_wx.buCode
                                        : '',
                                rules: [
                                    {
                                        required: false,
                                        message: '',
                                    },
                                ],
                            })(<Input placeholder="请输入品类编码" />)}
                        </FormItem>
                        <FormItem label="基地名称" style={{ display: 'none' }}>
                            {getFieldDecorator('siteName', {
                                initialValue:
                                    zrdatacj && zrdatacj.length > 0 ? zrdatacj[0].siteName : '',
                            })(<Input placeholder="请输入基地名称" />)}
                        </FormItem>
                        <FormItem label="基地编码" style={{ display: 'none' }}>
                            {getFieldDecorator('siteCode', {
                                initialValue:
                                    zrdatacj && zrdatacj.length > 0 ? zrdatacj[0].siteCode : '',
                            })(<Input placeholder="请输入基地编码" />)}
                        </FormItem>

                        <Button
                            className={styles.button_person}
                            type="primary"
                            size="large"
                            onClick={e => this.showMhs(e)}
                            style={{ marginBottom: '8px' }}
                            className={styles.my_but}
                        >
                            选择话术
                        </Button>
                        <FormItem
                            label={
                                <span>
                                    请录入信息 <em style={{ color: 'red', fontSize: '12px' }}>*</em>
                                </span>
                            }
                        >
                            {getFieldDecorator('exceptionInfo', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true, // 是否必填
                                        message: '字节不超过2000位',
                                        max: 2000,
                                    },
                                ],
                            })(
                                <Mentions
                                    rows="6"
                                    onSelect={this.onMentionsSelect}
                                    placeholder="请输入信息,使用@圈出人员用于提醒"
                                >
                                    {isNotBlank(this.state.tableData) &&
                                        isNotBlank(this.state.tableData.list) &&
                                        this.state.tableData.list.map(item => (
                                            <Option
                                                value={`${item.name}(${item.mobile})`}
                                                key={item.id}
                                                id={item.id}
                                            >
                                                {`${item.name}(${item.mobile})`}
                                            </Option>
                                        ))}
                                </Mentions>
                            )}
                        </FormItem>
                        <FormItem label="预计完成时间">
                            <DatePicker
                                mode="date"
                                title="请选择开始时间"
                                // extra="Optional"
                                locale={zh_CN}
                                value={
                                    this.state.begindate
                                        ? this.state.begindate
                                        : this.state.initialBeginDate
                                }
                                onChange={begindate => this.setState({ begindate })}
                            >
                                <div className={styles.begin_time}>
                                    <span className={styles.span_time}>
                                        {this.state.begindate ? (
                                            <span style={{ color: '#1890ff' }}>
                                                {moment(this.state.begindate).format('YYYY-MM-DD')}
                                            </span>
                                        ) : this.state.initialBeginDate ? (
                                            <span>
                                                {moment(this.state.initialBeginDate).format(
                                                    'YYYY-MM-DD'
                                                )}
                                            </span>
                                        ) : (
                                            '请选择时间'
                                        )}
                                    </span>
                                </div>
                            </DatePicker>
                        </FormItem>

                        <FormItem label="责任分类">
                            <div style={{ position: 'relative' }}>
                                <Select
                                    open={false}
                                    dropdownClassName={styles.select_none}
                                    dropdownMatchSelectWidth={false}
                                    mode="multiple"
                                    allowClear={false}
                                    removeIcon={function() {
                                        return '';
                                    }}
                                    value={
                                        isNotBlank(selectzr) && selectzr.length > 0
                                            ? selectzr.map(res => res.id)
                                            : []
                                    }
                                    onDropdownVisibleChange={this.showM}
                                >
                                    {isNotBlank(departmentFailure) &&
                                        isNotBlank(departmentFailure.list) &&
                                        departmentFailure.list.map(item => {
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
                            </div>
                        </FormItem>
                        <FormItem label="责任部门">
                            <Select
                                open={false}
                                dropdownClassName={styles.select_none}
                                dropdownMatchSelectWidth={false}
                                value={
                                    isNotBlank(selectzrbm) && selectzrbm.length > 0
                                        ? selectzrbm.map(res => res.id)
                                        : isNotBlank(selectget) && selectget.length > 0
                                        ? selectget
                                        : []
                                }
                                mode="multiple"
                                allowClear={false}
                                removeIcon={function() {
                                    return '';
                                }}
                                onDropdownVisibleChange={this.showMzr}
                            >
                                {departmentList &&
                                    departmentList.list &&
                                    departmentList.list.map((item, index) => {
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
                        </FormItem>

                        <FormItem label="跟进部门">
                            <Select
                                open={false}
                                dropdownClassName={styles.select_none}
                                dropdownMatchSelectWidth={false}
                                value={
                                    isNotBlank(selectgjbm) && selectgjbm.length > 0
                                        ? selectgjbm.map(res => res.id)
                                        : isNotBlank(selectzrgj) && selectzrgj.length > 0
                                        ? selectzrgj.map(res => res.id)
                                        : isNotBlank(selectget) && selectget.length > 0
                                        ? selectget
                                        : []
                                }
                                mode="multiple"
                                allowClear={false}
                                removeIcon={function() {
                                    return '';
                                }}
                                onDropdownVisibleChange={this.showMgj}
                            >
                                {departmentList &&
                                    departmentList.list &&
                                    departmentList.list.map((item, index) => {
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
                        </FormItem>
                        <FormItem>
                            <Button
                                className={styles.my_but}
                                type="primary"
                                size="large"
                                onClick={e => this.onSelectUser(e)}
                            >
                                选择跟进人
                            </Button>

                            <Upload
                                fileList={this.state.showimgsrc}
                                listType="picture-card"
                                onChange={fileList => {
                                    this.handleshowImgchange(fileList);
                                }}
                            />
                        </FormItem>
                        <FormItem>
                            <Upload
                                accept=".xls,.xlsx,.xlsm.docx"
                                onChange={this.handleUploadChange}
                                onRemove={this.handleRemove}
                                beforeUpload={this.handlebeforeUpload}
                                fileList={this.state.fileList}
                                listType="text"
                                onPreview={this.handlePreview}
                            >
                                {uploadButton}
                            </Upload>
                        </FormItem>

                        <div className={styles.button_bottom}>
                            <Button
                                className={styles.my_bu}
                                block
                                type="primary"
                                loading={submitting}
                                size="large"
                                htmlType="submit"
                                onClick={e => {
                                    this.handleSubmit(e);
                                }}
                            >
                                提交
                            </Button>
                        </div>
                    </Form>
                </div>

                <CreateFormcj {...parentMethodsercj} modalVisiblecj={modalVisiblecj} />
                <CreateFormerji {...parentMethodserji} modalVisibleerji={modalVisibleerji} />
                <CreateForm {...parentMethods} modalVisible={modalVisible} />
                <CreateFormzr {...parentMethodszr} modalVisiblezr={modalVisiblezr} />
                <CreateFormgj {...parentMethodsgj} modalVisiblegj={modalVisiblegj} />
                <CreateFormhs {...parentMethodshs} modalVisiblehs={modalVisiblehs} />
            </div>
        );
    }
}
export default RegisterFromWeUi;

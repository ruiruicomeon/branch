/**
 * 异常沟通
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { NavBar, Tag, Flex, DatePicker } from 'antd-mobile';
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
import styles from './DisposeFromWeUi.less';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';

const moreAnd = require('../../assets/genduo.png');
const comm = require('../../assets/huifu.png');
const { Search } = Input;
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
            title="选择责任分类"
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            style={{ top: 10 }}
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
            title="选择责任部门"
            bodyStyle={{
                padding: '24px',
                fontSize: '14px',
                lineHeight: 1.5,
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'scroll',
            }}
            style={{ top: 10 }}
            visible={modalVisiblezr}
            onOk={okHandle}
            onCancel={() => handleModalVisiblezr()}
            width="80%"
        >
            <div style={{ marginBottom: '10px' }}>
                <Search
                    loading
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
        <div className={styles.model_style}>
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
                        loading
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
        </div>
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
        <div className={styles.model_style}>
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
                                                ? classnames(styles.Flex_item, ischecked)
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
        </div>
    );
});

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
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
    }) => ({
        ...dictionaryL,
        ...communication,
        sysdeptList,
        sysoffice,
        ...sysuser,
        ...warning,
        ...speaklist,
        userloading: loading.models.sysuser,
        submitting: loading.effects['warning/add_wxWarning'],
        submitting2: loading.effects['warning/recordOnecomm'],
        submitting3: loading.effects['warning/exception_wxClose'],
    })
)
@Form.create()
class DisposeFromWeUi extends PureComponent {
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
            speakValue: '', // 话术内容
            checkedData: {}, // 选中
            ischecked: styles.on_select, // 控制选中的样式
            checkedDataList: [],
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
            initialBeginDate: '',
            begindate: '',
            initialOverDate: new Date(),
            enddate: '',
            getfenlei: [],
            selectget: [],
            selectzrgj: [],
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        let date = new Date();
        let tommdate = date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        this.setState({ initialBeginDate: new Date(tommdate) });
        const ua = navigator.userAgent.toLowerCase();
        dispatch({
            // 责任部门
            type: 'dictionaryL/fetch',
            payload: { type: 'duty' , current:1,pageSize:500 },
        });
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

        if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
            dispatch({
                type: 'warning/findoneofId',
                payload: { id: location.query.id },
                callback: data => {
                    let getSingleofId = data;
                    dispatch({
                        // 根据基地和品类来筛选 车间
                        type: 'communication/fetch_workshop_wx',
                        payload: {
                            grade: 3,
                            SiteCode: data.siteCode,
                            type: 1,
                            current:1,
                            pageSize:5000,
                            buCode: data.buCode,
                        },
                    });
                    dispatch({
                        // 二级品类
                        type: 'communication/fetch_secondname_wx',
                        payload: {
                            BuCode: data.buCode,
                            current:1,
                            pageSize:5000
                        },
                    });
                    dispatch({
                        // 获取话术
                        type: 'speaklist/fetch',
                        payload: {
                            current:1,
                            pageSize:5000,
                            buName: data.buName,
                        },
                    });
                    dispatch({
                        // 责任分类
                        type: 'dictionaryL/fetch',
                        payload: {
                            type: 'failure',
                            label: data.buCode,
                            current:1,
                            pageSize:5000
                        },
                        callback: data => {
                            this.setState({
                                departmentFailure: data,
                            });
                        },
                    });
                    if (location.query.msg == 'comm') {
                        dispatch({
                            // 用户选择
                            type: 'sysuser/fetch',
                            payload:{ current:1,pageSize:6000 },
                            callback: data => {
                                let personlist = [];
                                let tableData = data;
                                if (
                                    isNotBlank(getSingleofId) &&
                                    isNotBlank(getSingleofId.respUser) &&
                                    isNotBlank(tableData) &&
                                    isNotBlank(tableData.list) &&
                                    tableData.list.length > 0
                                ) {
                                    let respUserArr = getSingleofId.respUser.split(',');
                                    respUserArr = respUserArr.filter(Boolean);
                                    for (let i = 0; i < respUserArr.length; i++) {
                                        tableData.list.forEach(item => {
                                            if (item.id == respUserArr[i]) {
                                                personlist.push({
                                                    uid: item.id,
                                                    url: item.photo,
                                                    name: item.name,
                                                    qqID: item.qqId,
                                                });
                                            }
                                        });
                                    }
                                    this.setState({
                                        showimgsrc: personlist,
                                    });
                                }
                            },
                        });
                    }
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
        const { form } = this.props;
        form.resetFields();
    }

    onCancelCancel = () => {
        router.goBack();
    };

    handleSubmit = e => {
        const { dispatch, form, AddOnerecord, location, getSingleofId } = this.props;
        const {
            addfileList,
            mentionsNameArray,
            mentionsIdArray,
            selectzr,
            selectzrbm,
            selectgjbm,
            begindate,
            enddate,
            selectget,
            selectzrgj,
            initialBeginDate,
        } = this.state;
        e.preventDefault();
        form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                const value = { ...val };
                if (isNotBlank(addfileList) && isNotBlank(addfileList.length > 0)) {
                    value.file = addfileList;
                }
                if (
                    isNotBlank(value.deptName) &&
                    isNotBlank(value.deptName.value) &&
                    isNotBlank(value.deptName.label)
                ) {
                    value.deptCode = value.deptName.value;
                    value.deptName = value.deptName.label;
                } else {
                    value.deptName = '';
                }

                if (
                    isNotBlank(value.secondCategoryName) &&
                    isNotBlank(value.secondCategoryName.value) &&
                    isNotBlank(value.secondCategoryName.label)
                ) {
                    value.secondCategoryCode = value.secondCategoryName.value;
                    value.secondCategoryName = value.secondCategoryName.label;
                } else {
                    value.secondCategoryName = '';
                }

                value.estiCompTime = begindate
                    ? moment(begindate).format('YYYY-MM-DD')
                    : initialBeginDate
                    ? moment(initialBeginDate).format('YYYY-MM-DD')
                    : '';

                let respUserStr =
                    isNotBlank(this.state.showimgsrc) &&
                    this.state.showimgsrc.map(item => item.qqID).join(',');
                if (isNotBlank(respUserStr)) {
                    respUserStr = `,${respUserStr},`;
                }

                let mentionsIdArr = [];
                if (isNotBlank(value.exceptionInfo && mentionsIdArray.length > 0)) {
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

                if (selectzr.length == 0 && !isNotBlank(getSingleofId.respType)) {
                    message.warning('责任分类必填');
                    return;
                } else {
                    value.respType =
                        isNotBlank(selectzr) && selectzr.length > 0
                            ? selectzr.map(item => item.value).join(',')
                            : isNotBlank(getSingleofId.respType)
                            ? getSingleofId.respType
                            : '';
                }
                if (
                    selectzrbm.length == 0 &&
                    selectget.length == 0 &&
                    !isNotBlank(getSingleofId.respDept)
                ) {
                    message.warning('责任部门必填!');
                    return;
                } else {
                    value.respDept =
                        isNotBlank(selectzrbm) && selectzrbm.length > 0
                            ? selectzrbm.map(item => item.value).join(',')
                            : isNotBlank(selectget) && selectget.length > 0
                            ? selectget.join(',')
                            : isNotBlank(getSingleofId.respDept)
                            ? getSingleofId.respDept
                            : '';
                }

                if (
                    selectgjbm.length == 0 &&
                    selectzrgj.length == 0 &&
                    selectget.length == 0 &&
                    !isNotBlank(getSingleofId.followDept)
                ) {
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
                            : isNotBlank(getSingleofId.followDept)
                            ? getSingleofId.followDept
                            : '';
                }
                const values = { ...value };

                if (
                    isNotBlank(location.query) &&
                    location.query.msg === 'comm' &&
                    isNotBlank(location.query.id)
                ) {
                    values.exceptionId = location.query.id; // 异常沟通新增
                    values.resvStr2 = '1';
                    dispatch({
                        type: 'warning/recordOnecomm',
                        payload: { ...values },
                        callback: () => {
                            router.goBack();
                        },
                    });
                } else if (
                    isNotBlank(location.query) &&
                    location.query.msg === 'colse' &&
                    isNotBlank(location.query.id)
                ) {
                    // 关闭异常
                    values.exceptionId = location.query.id;
                    values.status = 1;
                    dispatch({
                        type: 'warning/exception_wxClose',
                        payload: { ...values },
                        callback: () => {
                            router.push('/wx/app');
                        },
                    });
                }
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
        if (info.fileList && info.fileList.length > 0) {
            Object.keys(info.fileList);
        }
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

    dutydepartment(value) {
        // 责任分类选择框事件
        const { departmentFailure } = this.state;
        let initDutydept = [];
        if (isNotBlank(departmentFailure) && isNotBlank(departmentFailure.list)) {
            initDutydept = departmentFailure.list.map(item => {
                if (item.value === value) {
                    return item.remarks;
                }
                return '';
            });
            initDutydept = initDutydept.filter(Boolean); // 过滤掉假值

            this.setState({ initDutydept });
        }
    }

    onMentionsSelect = option => {
        const { mentionsNameArray, mentionsIdArray } = this.state;
        this.setState({
            mentionsNameArray: [...mentionsNameArray, `@${option.value}`],
            mentionsIdArray: [...mentionsIdArray, option.id],
        });
    };
    speakSelectChange(value) {
        const { checkedDataList } = this.state;
        // let speakItem = value
        let newarr = checkedDataList;
        // if (newarr.length == 0) {
        //     newarr.push(speakItem.value)
        //     this.setState({ checkedDataList: newarr, checkedData: speakItem })
        // } else if (newarr.indexOf(speakItem.value) > -1) {
        //     newarr.splice(newarr.indexOf(speakItem.value), 1)
        //     this.setState({ checkedDataList: newarr, checkedData: {} })
        // }
        this.setState({
            speakValue: newarr,
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
                    if (isNotBlank(imgsrc) && imgsrc.length > 0) {
                        if (showimgsrc.length > 0) {
                            this.setState({
                                showimgsrc: [...showimgsrc, ...imgsrc],
                                facevisible: false,
                            });
                        } else {
                            this.setState({
                                showimgsrc: imgsrc,
                                facevisible: false,
                            });
                        }
                    }
                }
            }
        );
    };
    handleBaseClick(speak) {
        const { dispatch } = this.props;

        this.setState({
            checkedData: speak,
        });
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

    handleModalVisible = flag => {
        const { selectzr, getfenlei } = this.state;
        let newfenlei = this.deepCopy(getfenlei);
        let newobj = this.deepCopy(selectzr);
        this.setState({
            modalVisible: !!flag,
            zrdata: newobj,
            getfenlei: newfenlei,
        });
    };

    showM = () => {
        this.select_class.blur();
        this.setState({
            modalVisible: true,
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

    handleAdd = () => {
        const { zrdata, getfenlei } = this.state;
        let newobj = this.deepCopy(zrdata);
        let newfenlei = this.deepCopy(getfenlei);
        this.setState({
            modalVisible: false,
            selectzr: newobj,
            selectget: newfenlei,
        });
        // this.forceUpdate();
    };

    handleModalVisiblezr = flag => {
        const { selectzrbm } = this.state;
        let newobj = this.deepCopy(selectzrbm);
        this.setState({
            modalVisiblezr: !!flag,
            zrdatazr: newobj,
        });
    };

    showMzr = () => {
        this.select_bm.blur();
        this.setState({
            modalVisiblezr: true,
        });
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

    handleAddzr = () => {
        this.select_class.blur();
        const { zrdatazr } = this.state;
        let newobj = this.deepCopy(zrdatazr);
        this.setState({
            modalVisiblezr: false,
            selectzrbm: newobj,
            selectzrgj: newobj,
        });
        // this.forceUpdate();
    };

    handleModalVisiblegj = flag => {
        const { selectgjbm } = this.state;
        let newobj = this.deepCopy(selectgjbm);
        this.setState({
            modalVisiblegj: !!flag,
            zrdatagj: newobj,
        });
    };

    showMgj = () => {
        this.select_gjbm.blur();
        this.setState({
            modalVisiblegj: true,
        });
    };

    handleScondNameClickgj = scondname => {
        const { zrdatagj } = this.state;
        let newarr = zrdatagj;
        // if (newarr.length == 0) {
        //     newarr.push(scondname.id)
        // } else {
        //     if (newarr.indexOf(scondname.id) == -1) {
        //         newarr.push(scondname.id)
        //     } else {
        //         newarr.splice(newarr.indexOf(scondname.id), 1)
        //     }
        // }
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

    handleAddgj = () => {
        const { zrdatagj } = this.state;
        let newobj = this.deepCopy(zrdatagj);
        this.setState({
            modalVisiblegj: false,
            selectgjbm: newobj,
        });
        // this.forceUpdate();
    };

    handleModalVisiblehs = flag => {
        const { addallzrdatahs } = this.state;
        let newobj = this.deepCopy(addallzrdatahs);
        this.setState({
            modalVisiblehs: !!flag,
            allzrdatahs: newobj,
        });
    };

    showMhs = () => {
        this.setState({
            modalVisiblehs: true,
        });
    };

    handleScondNameClickhs = scondname => {
        const { zrdatahs, allzrdatahs } = this.state;
        const { form } = this.props;
        // let newarr = zrdatahs
        // let allnewarr = allzrdatahs
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
            form.setFieldsValue({ commInfo: '' });
        } else {
            this.setState({
                allzrdatahs: scondname,
                modalVisiblehs: false,
                speakValue: scondname.value,
            });

            form.setFieldsValue({ commInfo: scondname.value });
        }
    };

    handleAddhs = () => {
        const { zrdatahs, allzrdatahs, checkedDataList } = this.state;
        let newallhs = this.deepCopy(allzrdatahs);
        // let speakItem = newallhs
        // let newarr = checkedDataList
        // if (newarr.length == 0) {
        //     newarr.push(speakItem.value)
        //     this.setState({ checkedDataList: newarr, checkedData: speakItem })
        // } else if (newarr.indexOf(speakItem.value) > -1) {
        //     newarr.splice(newarr.indexOf(speakItem.value), 1)
        //     this.setState({ checkedDataList: newarr, checkedData: {} })
        // }
        this.setState({
            speakValue: newallhs,
            modalVisiblehs: false,
            // selecths  : newobj,
            addallzrdatahs: newallhs,
        });
        this.forceUpdate();
    };
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
            begindate,
            selectget,
            selectzrgj,
        } = this.state;
        const {
            submitting,
            submitting2,
            submitting3,
            cpAssemblyFormGet,
            sysdeptList,
            departmentList,
            sysoffice: { data },
            warningDateil,
            AddOnerecord, // 沟通传递的值
            getSingleofId,
            location,
            getWorkShopList,
            getCommList,
            getScondNameList,
        } = this.props;

        const {
            form: { getFieldDecorator },
        } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 16 },
            },
        };

        const uploadButton = (
            <div>
                <Button
                    className="ant-upload-text"
                    type="primary"
                    size="large"
                    className={styles.button_person}
                >
                    上传附件
                </Button>
            </div>
        );
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
                    {isNotBlank(location) &&
                    isNotBlank(location.query) &&
                    isNotBlank(location.query.msg) &&
                    location.query.msg == 'colse'
                        ? '关闭'
                        : '沟通'}
                </NavBar> */}
                <div
                    style={{
                        paddingTop: '10px',
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 20,
                    }}
                >
                    <div className={styles.title_con}>
                        <div className={styles.title_selfnum_one}>
                            {isNotBlank(getSingleofId) && isNotBlank(getSingleofId.orderSelfNum)
                                ? getSingleofId.orderSelfNum
                                : ''}
                        </div>
                        <div className={styles.title_selfnum}>
                            {isNotBlank(getSingleofId) &&
                            isNotBlank(getSingleofId.deptName) &&
                            isNotBlank(getSingleofId.deptCode)
                                ? getSingleofId.deptName
                                : ' '}
                        </div>
                    </div>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ paddingBottom: 20 }}
                        layout="horizontal"
                    >
                        <FormItem label="订单Guid" style={{ display: 'none' }}>
                            {getFieldDecorator('oid', {
                                initialValue:
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.oid)
                                        ? getSingleofId.oid
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
                                    isNotBlank(getSingleofId) &&
                                    isNotBlank(getSingleofId.orderSelfNum)
                                        ? getSingleofId.orderSelfNum
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
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.wccNum)
                                        ? getSingleofId.wccNum
                                        : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '此字段为必填字段',
                                    },
                                ],
                            })(<Input placeholder="请输入订单编号" disabled />)}
                        </FormItem>
                        <FormItem label="二级品类" style={{ display: 'none' }}>
                            {getFieldDecorator('secondCategoryName', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                    isNotBlank(getSingleofId.secondCategoryName) &&
                                    isNotBlank(getSingleofId.secondCategoryCode)
                                        ? {
                                              value: getSingleofId.secondCategoryCode,
                                              label: getSingleofId.secondCategoryName,
                                          }
                                        : {},
                                rules: [{ required: true, message: '二级品类为必选字段' }],
                            })(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    labelInValue
                                    allowClear
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    // treeData={getScondNameList}
                                    placeholder="选择品类"
                                    treeDefaultExpandAll
                                />
                            )}
                        </FormItem>
                        <FormItem label="车间" style={{ display: 'none' }}>
                            {getFieldDecorator('deptName', {
                                initialValue:
                                    isNotBlank(getSingleofId) &&
                                    isNotBlank(getSingleofId.deptName) &&
                                    isNotBlank(getSingleofId.deptCode)
                                        ? {
                                              value: getSingleofId.deptCode,
                                              label: getSingleofId.deptName,
                                          }
                                        : { value: '', label: '' },
                                rules: [{ required: true, message: '车间为必选字段' }],
                            })(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    labelInValue
                                    allowClear
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    // treeData={getWorkShopList}
                                    placeholder="请选择车间"
                                    treeDefaultExpandAll
                                />
                            )}
                        </FormItem>
                        <FormItem label="品类名称" style={{ display: 'none' }}>
                            {getFieldDecorator('buName', {
                                initialValue:
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.buName)
                                        ? getSingleofId.buName
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
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.buCode)
                                        ? getSingleofId.buCode
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
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.siteName)
                                        ? getSingleofId.siteName
                                        : '',
                            })(<Input placeholder="请输入基地名称" />)}
                        </FormItem>
                        <FormItem label="基地编码" style={{ display: 'none' }}>
                            {getFieldDecorator('siteCode', {
                                initialValue:
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.siteCode)
                                        ? getSingleofId.siteCode
                                        : '',
                            })(<Input placeholder="请输入基地编码" />)}
                        </FormItem>
                        <Button
                            className={styles.button_person}
                            type="primary"
                            size="large"
                            onClick={e => this.showMhs(e)}
                            style={{ marginBottom: '8px' }}
                        >
                            选择话术
                        </Button>
                        {isNotBlank(location) &&
                        isNotBlank(location.query) &&
                        isNotBlank(location.query.msg) &&
                        location.query.msg == 'colse' ? (
                            <>
                                <FormItem
                                    label={
                                        <span>
                                            关闭备注
                                            <em style={{ color: 'red', fontSize: '12px' }}>*</em>
                                        </span>
                                    }
                                >
                                    {getFieldDecorator('commInfo', {
                                        initialValue:
                                            isNotBlank(getSingleofId) &&
                                            isNotBlank(getSingleofId.commInfo)
                                                ? getSingleofId.commInfo
                                                : '',
                                        rules: [
                                            {
                                                required: true, // 是否必填
                                                message: '请输入信息',
                                                max: 64,
                                            },
                                        ],
                                    })(
                                        <TextArea
                                            style={{ minHeight: 32 }}
                                            placeholder="请输入关闭备注"
                                            rows={3}
                                        />
                                    )}
                                </FormItem>
                                <FormItem label="实际完成">
                                    <DatePicker
                                        mode="date"
                                        title="请选择实际完成时间"
                                        value={
                                            this.state.enddate
                                                ? this.state.enddate
                                                : this.state.initialOverDate
                                        }
                                        extra="Optional"
                                        locale={zh_CN}
                                        onChange={enddate => this.setState({ enddate })}
                                    >
                                        <div className={styles.begin_time}>
                                            <span>
                                                {this.state.enddate ? (
                                                    <span style={{ color: '#1890ff' }}>
                                                        {moment(this.state.enddate).format(
                                                            'YYYY-MM-DD'
                                                        )}
                                                    </span>
                                                ) : this.state.initialOverDate ? (
                                                    <span>
                                                        {moment(this.state.initialOverDate).format(
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
                            </>
                        ) : (
                            <div>
                                <div className={styles.mentions_con}>
                                    <FormItem>
                                        {getFieldDecorator('commInfo', {
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
                                                rows="3"
                                                onSelect={this.onMentionsSelect}
                                                placeholder="请录入信息,使用@圈出人员用于提醒"
                                            >
                                                {isNotBlank(this.state.tableData) &&
                                                    isNotBlank(this.state.tableData.list) &&
                                                    this.state.tableData.list.length > 0 &&
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
                                </div>
                                <FormItem label="预计完成时间">
                                    <DatePicker
                                        mode="date"
                                        title="请选择预计完成时间"
                                        minDate={this.state.begindate ? this.state.begindate : ''}
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
                                            <span className={styles.begin_time_son}>
                                                {this.state.begindate ? (
                                                    <span style={{ color: '#1890ff' }}>
                                                        {moment(this.state.begindate).format(
                                                            'YYYY-MM-DD'
                                                        )}
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
                            </div>
                        )}

                        <FormItem label="责任分类">
                            {/* {getFieldDecorator('respType', {
                                initialValue: isNotBlank(selectzr)&& selectzr.length>0?selectzr:[],
                                       :(isNotBlank(AddOnerecord) && isNotBlank(AddOnerecord.respType)
                                        ? AddOnerecord.respType
                                        : isNotBlank(getSingleofId) &&
                                            isNotBlank(getSingleofId.respType)
                                            ? getSingleofId.respType
                                            : ''),
                            })( */}
                            <Select
                                ref={el => (this.select_class = el)}
                                dropdownClassName={styles.select_none}
                                dropdownMatchSelectWidth={false}
                                mode="multiple"
                                allowClear={false}
                                removeIcon={function() {
                                    return <img src={moreAnd} />;
                                }}
                                value={
                                    isNotBlank(selectzr) && selectzr.length > 0
                                        ? selectzr.map(res => res.id)
                                        : isNotBlank(getSingleofId) &&
                                          isNotBlank(getSingleofId.respType)
                                        ? getSingleofId.respType.split(',')
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
                            {/* )} */}
                        </FormItem>
                        <FormItem label="责任部门">
                            {/* {getFieldDecorator('respDept', {
                                initialValue:
                                    isNotBlank(getSingleofId) && isNotBlank(getSingleofId.respDept)
                                        ? getSingleofId.respDept.split(',')
                                        : [],
                                rules: [],
                            })( */}
                            <Select
                                ref={el => (this.select_bm = el)}
                                open={false}
                                value={
                                    isNotBlank(selectzrbm) && selectzrbm.length > 0
                                        ? selectzrbm.map(res => res.id)
                                        : isNotBlank(selectget) && selectget.length > 0
                                        ? selectget
                                        : isNotBlank(getSingleofId) &&
                                          isNotBlank(getSingleofId.respDept)
                                        ? getSingleofId.respDept.split(',')
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
                            {/* )} */}
                        </FormItem>
                        <FormItem label="跟进部门">
                            {/* {getFieldDecorator('followDept', {
                                initialValue:'',
                                rules: [],
                            })( */}
                            <Select
                                ref={el => (this.select_gjbm = el)}
                                dropdownClassName={styles.select_none}
                                value={
                                    isNotBlank(selectgjbm) && selectgjbm.length > 0
                                        ? selectgjbm.map(res => res.id)
                                        : isNotBlank(selectzrgj) && selectzrgj.length > 0
                                        ? selectzrgj.map(res => res.id)
                                        : isNotBlank(selectget) && selectget.length > 0
                                        ? selectget
                                        : isNotBlank(getSingleofId) &&
                                          isNotBlank(getSingleofId.followDept)
                                        ? getSingleofId.followDept.split(',')
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
                            {/* )} */}
                        </FormItem>
                        <FormItem>
                            {isNotBlank(location) &&
                            isNotBlank(location.query) &&
                            isNotBlank(location.query.msg) &&
                            location.query.msg == 'colse' ? (
                                ''
                            ) : (
                                <div className={styles.button_select_person}>
                                    <Button
                                        className={styles.my_but}
                                        className={styles.button_person}
                                        type="primary"
                                        size="large"
                                        onClick={e => this.onSelectUser(e)}
                                    >
                                        选择跟进人
                                    </Button>
                                </div>
                            )}
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
                                accept=".xls,.xlsx,.xlsm"
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
                    </Form>
                    <div className={styles.button_bottom}>
                        <Button
                            block
                            type="primary"
                            loading={submitting || submitting2 || submitting3}
                            size="large"
                            htmlType="submit"
                            onClick={e => this.handleSubmit(e)}
                        >
                            提交
                        </Button>
                    </div>
                </div>

                <CreateForm {...parentMethods} modalVisible={modalVisible} />
                <CreateFormzr {...parentMethodszr} modalVisiblezr={modalVisiblezr} />
                <CreateFormgj {...parentMethodsgj} modalVisiblegj={modalVisiblegj} />
                <CreateFormhs {...parentMethodshs} modalVisiblehs={modalVisiblehs} />
            </div>
        );
    }
}
export default DisposeFromWeUi;

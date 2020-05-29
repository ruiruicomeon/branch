import React, { PureComponent } from 'react';
import {
    List,
    NavBar,
    Icon,
    Toast,
    WingBlank,
    SearchBar,
    Modal,
    Checkbox,
    PullToRefresh,
    ListView,
    Radio,
} from 'antd-mobile';
import router from 'umi/router';
import { Input, Button, Empty } from 'antd';
import { connect } from 'dva';
import monment from 'moment';
import { isNotBlank } from '@/utils/utils';
import { setStorage,getStorage } from '@/utils/localStorageUtils';
import styles from './IndexWeUi.less';
import { homeUrl } from '../../../config/baseConfig';
import classnames from 'classnames';
import { number } from 'prop-types';
const operation = Modal.operation;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const noAttention = require('../../assets/no_attention_new.png');
const attention = require('../../assets/attention_new.png');
const warningone = require('../../assets/wraning_new_one.png');
const warningtwo = require('../../assets/waring_new_two.png');
const Warning = require('../../assets/Warning.png');

const dispose = require('../../assets/dispose.png');
const transmit = require('../../assets/transmit.png');
const division = require('../../assets/division.png');
const qrCode = require('../../assets/qr_code.png');

const more = require('../../assets/more.png');
const search = require('../../assets/search.png');

const single = require('../../assets/gingle_forward.png');
const merge = require('../../assets/merge_forward.png');

const zflogo = require('../../assets/zflogo.png');

const single_style = {
    fontSize: '16px',
    background: `url(${single})  10px center / 20px 20px no-repeat`,
    paddingLeft: '40px',
    width: '80%',
};
const merge_style = {
    fontSize: '16px',
    background: `url(${merge}) 10px center / 20px 20px no-repeat`,
    paddingLeft: '40px',
    width: '80%',
};
@connect(({ warning, loading, user }) => ({
    ...warning,
    ...user,
    loading: loading.models.warning,
}))
class ListExample extends PureComponent {

    state = {
        searchFocus: false,
        isdisplay: styles.display,
        isShowCheckBox: false,
        isCheckAll: '',
        mergeItem: {},
        gingleItem: {},
        singleItemOid: '',
        singleParnodeid: '',
        qrCodeOfValue: '', // 微信扫一扫value
        selectdata: [],
        selectflag: {},
        zfflag: true,
        zfflag1: true,
        warning_search_value: {},
        srcolltop: 0,
        current: 1,
    };

    componentDidMount() {
        const { dispatch, location, presentTab, warningList } = this.props;
        const { warning_search_value } = this.state;
        if (location.query.presentTab == 'redTab') {
            const { dispatch, location } = this.props;
        }
        let searchValue = getStorage('searchValue');
        let searchValue_info =getStorage('searchValue_info');
        if (isNotBlank(searchValue_info)) {
            this.setState({ warning_search_value: JSON.parse(searchValue_info)})
            setStorage('searchValue_info','');
        } 
        if (isNotBlank(getStorage('searchValue'))) {
           const searchValues = JSON.parse(searchValue);
            if (
                isNotBlank(searchValues.srcolltop) &&
                isNotBlank(searchValues.current) &&
                isNotBlank(searchValues.pageSize)
            ) {
                if( isNotBlank(searchValue_info)){
                    const searchValue_infos = JSON.parse(searchValue_info);
                    dispatch({
                        type: 'warning/warning_List',
                        payload: {
                            current: searchValues.current,
                            pageSize: searchValues.pageSize,
                            ...searchValue_infos,
                        },
                        callback: () => {
                            this.setState({
                                current: searchValues.current,
                                pageSize: searchValues.pageSize,
                            });
                            this.lv.scrollTo(0, searchValues.srcolltop);
                            setStorage('searchValue','');
                        },
                    }); 
                } else if( !isNotBlank(searchValue_info) ){
                    dispatch({
                        type: 'warning/warning_List',
                        payload: {
                            current: searchValues.current,
                            pageSize: searchValues.pageSize,
                            ...searchValues.warning_search_value,
                        },
                        callback: () => {
                            this.setState({
                                warning_search_value: searchValues.warning_search_value,
                                current: searchValues.current,
                                pageSize: searchValues.pageSize,
                            });
                            this.lv.scrollTo(0, searchValues.srcolltop);
                            setStorage('searchValue','');
                        },
                    });
                }
            } 
        } else if (!isNotBlank(searchValue)) {
            dispatch({
                type: 'warning/warning_List',
                payload: {
                    current: 1,
                    pageSize: 5,
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
                    jsApiList: [
                        'selectEnterpriseContact',
                        'checkJsApi',
                        'scanQRCode',
                        'shareAppMessage',
                    ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                });
                this.setState({
                    Wx_config_data: data,
                });
            },
        });
        wx.ready(function() {
            //配置文件加载完成之后会自动调用ready中的模块
            wx.checkJsApi({
                jsApiList: ['scanQRCode'],
                success: function(res) {},
            });
        });
        wx.error(function(res) {
            Toast.info(res.errMsg, 1);
        });
    }

    componentWillUnmount() {
        const { dispatch, warningList } = this.props;
        const { srcolltop, current, warning_search_value } = this.state;
        let livePageSaveObj = {};
        livePageSaveObj.current = current;
        livePageSaveObj.pageSize = warningList.list.length < 5 ? 5 : warningList.list.length;
        livePageSaveObj.srcolltop = srcolltop;
        livePageSaveObj.warning_search_value = warning_search_value;
        setStorage('searchValue',JSON.stringify(livePageSaveObj));
    }
    onRegisterClick = item => {
        const { dispatch } = this.props;
        router.push(`/wx/register_from?id=${item.oid}`);
    };

    onDisposeClick = (e, item) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: 'communication/AddOnerecord',
            payload: { AddOnerecord: item },
        });
        router.push(`/wx/dispose?id=${item.id}`);
    };

    fetchMore = () => {
        const { dispatch, warningList } = this.props;
        const pageCurrent = warningList.pagination.current + 1;
        this.setState({ current: pageCurrent });
        const value = {
            current: pageCurrent,
            pageSize: 5,
        };
        dispatch({
            type: 'warning/warning_List',
            payload: value,
        });
    };

    handleHasWatchTono = (e, item, index) => {
        e.preventDefault();
        const { dispatch } = this.props;
        Toast.loading('Loading...', 1);
        dispatch({
            type: 'warning/handleChangeOrderStatus',
            payload: {
                watch: !item.watch,
                oid: item.oid,
            },
            callback: data => {
                if (data.watch === true) {
                    Toast.info('关注成功', 1);
                } else {
                    Toast.info('取消关注', 1);
                }
                const newItem = item;
                newItem.watch = !item.watch;
                dispatch({
                    type: 'warning/update_warning',
                    payload: {
                        newItem,
                        index,
                    },
                });
            },
        });
    };

    onFocusClick = e => {
        e.preventDefault();
        const { searchFocus } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/warning_List',
            payload: {
                watch: !searchFocus,
                current: 1,
                pageSize: 5,
            },
            callback: () => {
                this.setState({ searchFocus: !searchFocus });
            },
        });
    };

    handleGoToDateil(item) {
        router.push(`/wx/ExceptionDateil?oid=${item.oid}`);
    }

    handleInputFocus() {
        router.push('/wx/SearchInfo');
    }
    handleMergeForward(merge) {
        const { mergeItem, isShowCheckBox } = this.state;
        this.setState({
            mergeItem: merge,
            isShowCheckBox: true,
            zfflag: false,
        });
    }
    handleSingleForward(single) {
        const { singleItem, isShowCheckBox } = this.state;
        this.setState({
            singleItem: single,
        });
    }

    onCheckboxItemChange(e, item, items, index, indexs) {
        e ? e.stopPropagation() : '';
        const { selectdata, selectflag } = this.state;
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
                this.forceUpdate();
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
    }
    onCheckboxParnodeChange(e, item, index) {
        // id
        e ? e.stopPropagation() : '';
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
        // if (e.target.checked) {
        //     this.setState({
        //         singleParnodeid: item.oid,
        //     });
        // } else {
        //     this.setState({
        //         singleParnodeid: '',
        //     });
        // }
    }
    handleGoForward() {
        // 点击转发

        const { isShowCheckBox } = this.state;
        this.setState({
            isShowCheckBox: false,
        });
    }
    isCheckAll(e) {
        // 是否全选
        e ? e.stopPropagation() : '';
        const { warningList } = this.props;
        const { isCheckAll } = this.state;

        if (e.target.checked) {
            let newdata = [];
            for (var i = 0; i < warningList.list.length; i++) {
                if (warningList.list[i].exceptionList.length > 0) {
                    for (var j = 0; j < warningList.list[i].exceptionList.length; j++) {
                        newdata.push(warningList.list[i].exceptionList[j].id);
                    }
                }
            }
            this.setState({
                isCheckAll: true,
                selectdata: newdata,
            });
        } else {
            this.setState({
                isCheckAll: false,
                selectdata: [],
            });
        }
    }

    gotoSearch(value) {
        let search_value = {};
        const { dispatch } = this.props;
        if (value.split(',').filter(Boolean).length == 1) {
            search_value.wccNum = value;
            dispatch({
                type: 'warning/warning_List',
                payload: { ...search_value },
                callback: data => {
                    if (data.pagination.total == 0) {
                        Toast.info(`${value}MSCS订单号未存在异常!`, 2);
                    } else {
                        dispatch({
                            type: 'warning/warning_search_value',
                            payload: { ...search_value },
                        });
                    }
                },
            });
        } else if (value.indexOf(',') > -1 && value.split(',').length > 0) {
            let id = value.split(',').filter(Boolean)[1];
            dispatch({
                type: 'warning/SearchTofind_wccnum',
                payload: { id: id, orderType: 1 },
                callback: data => {
                    search_value = data;
                    dispatch({
                        type: 'warning/warning_List',
                        payload: { ...search_value },
                        callback: data => {
                            if (data.pagination.total == 0) {
                                Toast.info(
                                    `${
                                        search_value.orderSelfNum ? search_value.orderSelfNum : null
                                    }订单没有异常!`,
                                    2
                                );
                            } else {
                                dispatch({
                                    type: 'warning/warning_search_value',
                                    payload: { ...search_value },
                                });
                            }
                        },
                    });
                },
            });
        }
    }

    qrCodeAnd_WX(e) {
        e.preventDefault();
        let that = this;
        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
            success: function(res) {
                // 回调
                let result = res.resultStr;
                that.setState({ qrCodeOfValue: result }, () => {
                    that.gotoSearch(result);
                });
            },
            error: function(res) {
                if (res.errMsg.indexOf('function_not_exist') > 0) {
                    Toast.info('版本过低请升级', 1);
                }
            },
        });
    }

    handleOnRefresh = event => {
        const { dispatch, warningList } = this.props;
        const { warning_search_value } = this.state;
        const pageCurrent = warningList.pagination.current + 1;
        this.setState({ current: pageCurrent });
        console.log('warning_search_value', warning_search_value);
        let value = {};
        if (warningList.pagination.total > warningList.list.length) {
            if (JSON.stringify(warning_search_value) !== '{}' && warningList.pagination.total > 0) {
                value = {
                    current: pageCurrent,
                    pageSize: 5,
                    ...warning_search_value,
                };
            } else {
                value = {
                    current: pageCurrent,
                    pageSize: 5,
                };
            }
            dispatch({
                type: 'warning/warning_List',
                payload: value,
            });
        } else {
            Toast.info('没有更多了', 1);
        }
    };

    hidezf = () => {
        this.setState({
            isShowCheckBox: false,
            zfflag: true,
        });
    };

    postzf = () => {
        const { selectdata } = this.state;
        let ids = selectdata.join(',');
        wx.invoke(
            'shareAppMessage',
            {
                title: '订单协同平台', // 分享标题
                desc: '', // 分享描述
                link: `${homeUrl}/#/wx/Forward?id=${ids}`, // 分享链接
                imgUrl: '', // 分享封面
            },
            function(res) {
                if (res.err_msg == 'shareAppMessage:ok') {
                    this.setState({
                        isShowCheckBox: false,
                        zfflag: true,
                        zfflag1: true,
                    });
                    //  router.push(`/wx/Forward?id=${ids}`)
                }
            }
        );
    };

    onListviewScroll(e) {
        let srcolltop = e ? e.target.scrollTop : '';
        this.setState({ srcolltop });
    }
    onScrollclick() {
        const { srcolltop_current } = this.props;
        this.lv.scrollTo(0, srcolltop_current.srcolltop);
    }
    handleReload() {
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/warning_List',
            payload: {
                current: 1,
                pageSize: 5,
            },
            callback: () => {
                this.setState({ warning_search_value: {} });
            },
        });
    }
    searchOfSelfNum(e) {
        e.preventDefault();
        const { qrCodeOfValue } = this.state;
        const { dispatch } = this.props;
        let search_value = {};
        if (qrCodeOfValue) {
            search_value.orderSelfNum = qrCodeOfValue;
            dispatch({
                type: 'warning/warning_List',
                payload: { ...search_value },
                callback: () => {
                    dispatch({
                        type: 'warning/warning_search_value',
                        payload: { ...search_value },
                    });
                },
            });
        } else {
            Toast.info('请输入查询条件!');
        }
    }
    onSearchSelfNumChange(e) {
        let searchValue = e.target.value;
        this.setState({ qrCodeOfValue: searchValue });
    }

    render() {
        const { loading, warningList } = this.props;
        const {
            searchFocus,
            isdisplay,
            isShowCheckBox,
            isCheckAll,
            singleParnodeid,
            singleItemOid,
            selectdata,
            selectflag,
            zfflag,
            zfflag1,
        } = this.state;

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        const row = (item, sectionID, index) => {
            return (
                <div className={styles.item} key={index}>
                    <div className={styles.item_header}>
                        {isShowCheckBox ? (
                            <Checkbox
                                checked={isCheckAll || selectflag['i' + index]}
                                className={styles.checkbox_style}
                                key={item.oid}
                                onChange={e => this.onCheckboxParnodeChange(e, item, index)}
                            />
                        ) : (
                            ''
                        )}
                        {item.watch == true ? (
                            <img
                                src={attention}
                                alt=""
                                style={{
                                    height: 17,
                                    width: 18,
                                    margin: 'auto',
                                    marginRight: 11,
                                }}
                                onClick={e => this.handleHasWatchTono(e, item, index)}
                            />
                        ) : (
                            <img
                                src={noAttention}
                                alt=""
                                style={{
                                    height: 17,
                                    width: 18,
                                    margin: 'auto',
                                    marginRight: 11,
                                }}
                                onClick={e => this.handleHasWatchTono(e, item, index)}
                            />
                        )}
                        <div
                            className={styles.item_title}
                            onClick={() => {
                                this.handleGoToDateil(item);
                            }}
                        >
                            {item.orderSelfNum}
                        </div>
                        <span className={styles.orderExceptionone}>
                            {item.exceptionList ? item.exceptionList.length : ''}
                        </span>
                        {/* <span
                            className={styles.item_header_register}
                            onClick={() => this.onRegisterClick(item)}
                        >
                            登记
                        </span> */}
                    </div>
                    {isNotBlank(item.exceptionList) &&
                        item.exceptionList.length > 0 &&
                        item.exceptionList.map((items, indexs) => (
                            <div
                                className={styles.item_info_layout}
                                key={indexs}
                                style={{ paddingBottom: '10px' }}
                            >
                                <div className={styles.item_info_header}>
                                    {isShowCheckBox ? (
                                        <Checkbox
                                            checked={
                                                isCheckAll ||
                                                ((isNotBlank(selectflag['i' + index]) &&
                                                    selectflag['i' + index]) ||
                                                    (isNotBlank(selectflag['z' + index]) &&
                                                        isNotBlank(
                                                            selectflag['z' + index]['y' + indexs]
                                                        ) &&
                                                        selectflag['z' + index]['y' + indexs]))
                                            }
                                            className={styles.checkbox_scond}
                                            key={items.id}
                                            onChange={e =>
                                                this.onCheckboxItemChange(
                                                    e,
                                                    items,
                                                    item,
                                                    index,
                                                    indexs
                                                )
                                            }
                                        />
                                    ) : (
                                        ''
                                    )}
                                    {isNotBlank(items.warringType) &&
                                    (items.warringType === 1 || items.warringType === '1') ? (
                                        <img
                                            src={warningone}
                                            alt=""
                                            style={{
                                                height: '16px',
                                                width: '16px',
                                                margin: 'auto',
                                                marginRight: 12,
                                            }}
                                        />
                                    ) : isNotBlank(items.warringType) &&
                                      (items.warringType === 2 || items.warringType === '2') ? (
                                        <img
                                            src={warningtwo}
                                            alt=""
                                            style={{
                                                height: '16px',
                                                width: '16px',
                                                margin: 'auto',
                                                marginRight: 12,
                                            }}
                                        />
                                    ) : isNotBlank(items.warringType) &&
                                      (items.warringType === 3 || items.warringType === '3') ? (
                                        <img
                                            src={Warning}
                                            alt=""
                                            style={{
                                                height: '16px',
                                                width: '16px',
                                                margin: 'auto',
                                                marginRight: 12,
                                            }}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <span
                                        className={styles.item_info_header_name}
                                        onClick={e => this.onDisposeClick(e, items)}
                                    >
                                        {isNotBlank(items) && isNotBlank(items.secondCategoryName)
                                            ? items.secondCategoryName
                                            : ''}
                                    </span>
                                    <span className={styles.item_info_header_text}>
                                        {isNotBlank(items) && isNotBlank(items.deptName)
                                            ? items.deptName
                                            : ''}
                                    </span>
                                </div>
                                <div
                                    className={styles.item_info_header}
                                    onClick={e => this.onDisposeClick(e, items)}
                                >
                                    <span
                                        className={styles.item_info_header_time}
                                        style={{
                                            paddingLeft: '0',
                                            marginLeft: '0',
                                        }}
                                    >
                                        预计进仓:
                                        {items.planBinTime
                                            ? monment(items.planBinTime).format('YYYY/MM/DD')
                                            : ''}
                                    </span>
                                    <span className={styles.item_info_header_time}>
                                        工厂交期：
                                        {items.dueDate
                                            ? monment(items.dueDate).format('YYYY/MM/DD')
                                            : ''}
                                    </span>
                                </div>
                                <div
                                    className={styles.item_info_header}
                                    style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <span className={styles.title_comm}>评论：</span>
                                    <span
                                        style={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {isNotBlank(items) && isNotBlank(items.updateInfo)
                                            ? items.updateInfo
                                            : '无回复'}
                                    </span>
                                    <a
                                        style={{ marginLeft: '5px' }}
                                        onClick={e => this.onDisposeClick(e, items)}
                                    >
                                        >>
                                        {items.commentCount ? items.commentCount : ''}
                                    </a>
                                    {/* <span onClick={()=>this.onScrollclick()}>回到刚才位置</span> */}
                                </div>
                            </div>
                        ))}
                </div>
            );
        };

        return (
            <div className={styles.index_content}>
                <div className={styles.header_class} style={{ position: 'relative' }}>
                    <a
                        className={searchFocus ? styles.header_text2 : styles.header_text}
                        onClick={e => this.onFocusClick(e)}
                    >
                        我的关注
                    </a>
                    <Input
                        placeholder="请输入订单自编号"
                        prefix={
                            <img
                                src={search}
                                alt=""
                                style={{ height: 15, width: 15, margin: 'auto' }}
                                onClick={e => this.searchOfSelfNum(e)}
                            />
                        }
                        // value={this.state.qrCodeOfValue}
                        className={styles.header_search}
                        // onChange={value => this.onSearchSelfNumChange(value)}
                        onFocus={() => {
                            this.handleInputFocus();
                        }}
                    />
                    <img
                        src={qrCode}
                        alt=""
                        style={{
                            position: 'absolute',
                            right: '49px',
                            top: '6px',
                            height: '18px',
                            width: '18px',
                            margin: 'auto',
                        }}
                        onClick={e => {
                            this.qrCodeAnd_WX(e);
                        }}
                    />
                    {zfflag ? (
                        <a
                            // src={transmit}
                            style={{
                                height: '22px',
                                width: '30px',
                                margin: 'auto',
                                marginLeft: 13,
                            }}
                            onClick={e => {
                                this.handleMergeForward('merge');
                                // this.tranSpond();
                                // this.qrCodeAnd_WX(e);
                            }}
                        >
                            转发
                        </a>
                    ) : (
                        <span
                            onClick={zfflag1 ? this.hidezf : this.postzf}
                            style={{
                                height: '30px',
                                lineHeight: '30px',
                                marginLeft: '6px',
                                color: 'rgb(51, 163, 244)',
                            }}
                        >
                            {zfflag1 ? '取消' : '转发'}
                        </span>
                    )}
                </div>

                {isNotBlank(warningList) &&
                isNotBlank(warningList.list) &&
                warningList.list.length == 0 ? (
                    <Empty description="抱歉！暂无数据">
                        <Button
                            type="primary"
                            onClick={() => {
                                this.handleReload();
                            }}
                            loading={loading}
                        >
                            点我重新加载
                        </Button>
                    </Empty>
                ) : (
                    <ListView
                        key="1"
                        ref={el => (this.lv = el)}
                        dataSource={ds.cloneWithRows(warningList.list)}
                        renderFooter={() => (
                            <div style={{ padding: 20, textAlign: 'center' }}>
                                {loading ? '正在加载...' : ''}
                                <div>
                                    <Button onClick={e => this.handleReload()}>初始页面</Button>
                                </div>
                            </div>
                        )}
                        renderRow={row}
                        onScroll={e => this.onListviewScroll(e)}
                        useBodyScroll={this.state.useBodyScroll}
                        className={styles.list_view_css}
                        onEndReached={this.handleOnRefresh.bind(this)}
                        initialListSize={500}
                    />
                )}
            </div>
        );
    }
}
export default ListExample;

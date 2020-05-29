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
import { Input, Button } from 'antd';
import { connect } from 'dva';
import monment from 'moment';
import { isNotBlank, filterKeywordData } from '@/utils/utils';
import styles from './ForwardIndex.less';
import classnames from 'classnames';

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
        id: '',
        wx_filterList: [],
    };

    componentDidMount() {
        const { dispatch, location, presentTab } = this.props;

        if (location.query && location.query.id) {
            let ids = location.query.id;
            this.setState({ id: ids });
            dispatch({
                type: 'warning/wx_forward',
                payload: {
                    current: 1,
                    pageSize: 10,
                    id: ids,
                },
                callback: wx_forwardList => {
                    let wx_filterList = filterKeywordData(
                        'orderSelfNum',
                        'watch',
                        'orderSelfNum',
                        wx_forwardList
                    );
                    this.setState({ wx_filterList });
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
        wx.error(function(res) {});
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
        router.push(`/wx/SearchInfo?value=${value}`);
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
        const { dispatch, wx_forwardLis } = this.props;
        const { current } = this.state;
        dispatch({
            type: 'warning/wx_forward',
            payload: {},
        });
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
        router.push(`/wx/Forward?id=${ids}`);
        wx.invoke(
            'shareAppMessage',
            {
                title: '订单协同平台', // 分享标题
                desc: '', // 分享描述
                link: `/wx/Forward?id=${ids}`, // 分享链接
                imgUrl: '', // 分享封面
            },
            function(res) {
                if (res.err_msg == 'shareAppMessage:ok') {
                    this.setState({
                        isShowCheckBox: false,
                        zfflag: true,
                        zfflag1: true,
                    });
                    router.push(`/wx/Forward?id=${ids}`);
                }
            }
        );
    };

    render() {
        const { loading, warningList, wx_forwardList } = this.props;
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
            wx_filterList,
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
                                    {/* <span
                             className={styles.item_info_header_time}
                         >
                             {monment(items.createDate).format(
                                 'YYYY/MM/DD'
                             )}
                         </span> */}
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
                                </div>
                            </div>
                        ))}
                </div>
            );
        };

        return (
            <div className={styles.index_content}>
                {/* <div className={styles.header_class} style={{ position: 'relative' }}>
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
                            />
                        }
                        value={this.state.qrCodeOfValue}
                        className={styles.header_search}
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
                            style={{ height: '22px', width: '30px', margin: 'auto', marginLeft: 13 }}
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
                </div> */}

                <ListView
                    key="1"
                    ref={el => (this.lv = el)}
                    dataSource={ds.cloneWithRows(wx_filterList)}
                    renderFooter={() => (
                        <div style={{ padding: 20, textAlign: 'center' }}>
                            {loading ? '正在加载' : ''}
                        </div>
                    )}
                    renderRow={row}
                    useBodyScroll={this.state.useBodyScroll}
                    className={styles.list_view_css}
                    // onEndReached={this.handleOnRefresh.bind(this)}
                    pageSize={5}
                />
            </div>
        );
    }
}
export default ListExample;

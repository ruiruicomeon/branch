import React, { PureComponent } from 'react';
import {
    List,
    NavBar,
    Icon,
    Toast,
    SearchBar,
    WhiteSpace,
    WingBlank,
    ListView,
    PullToRefresh,
} from 'antd-mobile';
import router from 'umi/router';
import { Input, Button, Empty } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank } from '@/utils/utils';
import styles from './QueryOrderList.less';
const { Search } = Input;
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

@connect(({ warning, loading, user }) => ({
    ...warning,
    ...user,
    loading: loading.models.warning,
    finishMatterLoding: loading.effects['warning/queryExceptionOrderList_wx'],
}))
class QueryOrderList extends PureComponent {
    state = {
        searchValue: '', // 搜索框value
        refreshing: false,
        searchFocus: false,
        data: [],
        pageSize: 10,
        Page1: 1, //页数
        presentTab: '', //  保存页面
        current: 1, // 当前页
    };

    componentDidMount() {
        const { dispatch, location, presentTab } = this.props;
        this.setState({
            presentTab,
        });
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

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            //清除掉搜索数据
            type: 'warning/clear_add_search_value_orderlist',
        });
    }

    handleOnRefreshFinish() {
        //上拉刷新的回调
        let { current } = this.state;
        const { dispatch, queryExceptionOrderList_wx, add_search_value_orderlistobj } = this.props;
       
        if (JSON.stringify(add_search_value_orderlistobj) !== '{}') {
            current += 1;
            this.setState({ current });
            this.forceUpdate();
            if (
                isNotBlank(queryExceptionOrderList_wx) &&
                isNotBlank(queryExceptionOrderList_wx.list) &&
                queryExceptionOrderList_wx.list.length < queryExceptionOrderList_wx.totalCount
            ) {
                const value = {
                    Page1: current,
                    PageCount: 20,
                    ...add_search_value_orderlistobj,
                };
                dispatch({
                    type: 'warning/queryExceptionOrderList_wx',
                    payload: value,
                });
            } else {
                Toast.info('没有更多了!');
            }
        } else {
            Toast.info('请重新输入查询条件');
        }
    }

    onFocusClick = e => {
        e.preventDefault();
        const { searchFocus } = this.state;
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'warning/queryExceptionOrderList',
        //     payload: {
        //         watch: !searchFocus,
        //         current: 1,
        //         pageSize: 5,
        //     },
        //     callback: () => {
        //         this.setState({ searchFocus: !searchFocus });
        //     },
        // });
    };
    onRegisterClick = item => {
        // 登记页面
        const { dispatch } = this.props;
        router.push({ pathname: `/wx/register_from`, state: { orderlist_wx: item } });
    };
    handleToDateil(item) {
        // 跳至详情
        router.push(`/wx/ExceptionDateil?oid=${item.oid}`);
    }
    handleInputFocus() {
        router.push(`/wx/SearchOrder?presentTab=${this.state.presentTab}`);
    }
    gotoSearch(value) {
        let search_value = {};
        const { dispatch } = this.props;
        if (value.split(',').filter(Boolean).length == 1) {
            search_value.wccNum = value;
            dispatch({
                type: 'warning/queryExceptionOrderList_wx',
                payload: { Page1: 1, PageCount: 50, ...search_value },
                callback: () => {
                    dispatch({
                        type: 'warning/add_search_value_orderlist',
                        payload: { ...search_value },
                    });
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
                        type: 'warning/queryExceptionOrderList_wx',
                        payload: { Page1: 1, PageCount: 50, ...search_value },
                        callback: () => {
                            dispatch({
                                type: 'warning/add_search_value_orderlist',
                                payload: { ...search_value },
                            });
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
                that.setState({ searchValue: result }, () => {
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
    onSearchSelfNumChange(e) {
        let Value = e.target.value;
        this.setState({ searchValue: Value });
    }
    searchOfSelfNum(value) {
        const { searchValue } = this.state;
        const { dispatch } = this.props;
        let search_value = {};
        if (value) {
            search_value.orderSelfNum = searchValue;
            dispatch({
                type: 'warning/queryExceptionOrderList_wx',
                payload: { Page1: 1, PageCount: 50, ...search_value },
                callback: () => {
                    dispatch({
                        type: 'warning/add_search_value_orderlist',
                        payload: { ...search_value },
                    });
                },
            });
        } else {
            Toast.info('请输入查询条件!');
        }
    }
    render() {
        const {
            loading,
            queryExceptionOrderList_wx,
            finishMatterLoding,
            add_search_value_orderlist,
        } = this.props;
        const { searchFocus } = this.state;

        const loadMore =
            isNotBlank(queryExceptionOrderList_wx) &&
            isNotBlank(queryExceptionOrderList_wx.list) &&
            isNotBlank(queryExceptionOrderList_wx.totalCount) &&
            queryExceptionOrderList_wx.list.length < queryExceptionOrderList_wx.totalCount ? (
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
                        {loading ? (
                            <span>
                                <Icon type="loading" /> 加载中...
                            </span>
                        ) : (
                            '加载更多'
                        )}
                    </Button>
                </div>
            ) : null;

        const header = (
            <div className={styles.header_class}>
                <Search
                    placeholder="请输入订单自编号"
                    onSearch={value => this.searchOfSelfNum(value)}
                    onChange={value => this.onSearchSelfNumChange(value)}
                    // onFocus={() => {
                    //     this.handleInputFocus();
                    // }}
                    className={styles.header_search}
                />
                <img
                    src={qrCode}
                    alt=""
                    style={{ height: '20px', width: '22px', margin: 'auto', marginLeft: 13 }}
                    onClick={e => {
                        this.qrCodeAnd_WX(e);
                    }}
                />
            </div>
        );
        return (
            <div>
                <div className={styles.contentbox}>
                    <div className={styles.list_wrap}>
                        <PullToRefresh
                            direction="up" // 拉动方向
                            damping={50} // 拉动距离
                            ref={el => (this.ptr = el)}
                            className={styles.list_view_content}
                            indicator={{ deactivate: '上拉刷新', finish: '刷新完成' }}
                            refreshing={finishMatterLoding} // 是否显示刷新状态
                            onRefresh={() => {
                                this.handleOnRefreshFinish();
                            }}
                        >
                            <List
                                // renderFooter={loadMore}
                                renderHeader={header}
                                className={styles.my_list}
                            >
                                {isNotBlank(queryExceptionOrderList_wx) &&
                                isNotBlank(queryExceptionOrderList_wx.list) &&
                                queryExceptionOrderList_wx.list.length > 0 ? (
                                    queryExceptionOrderList_wx.list.map((item, index) => {
                                        return (
                                            <div className={styles.list_item} key={index}>
                                                <div
                                                    className={styles.orderSelfNum}
                                                    onClick={() => {
                                                        this.handleToDateil(item);
                                                    }}
                                                >
                                                    {item.orderSelfNum}
                                                </div>
                                                <div className={styles.warringType}>
                                                    {!isNotBlank(item.orderException) ||
                                                    item.orderException == '0' ? (
                                                        <div className={styles.no_warning_box}>
                                                            正常
                                                        </div>
                                                    ) : isNotBlank(item.orderException) &&
                                                      isNotBlank(item.orderException.number) &&
                                                      item.orderException.number !== '0' ? (
                                                        <div className={styles.warning_box}>
                                                            有异常
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className={styles.orderException_box}>
                                                    {isNotBlank(item.orderException) &&
                                                    isNotBlank(item.orderException.number) &&
                                                    item.orderException.number !== '0' ? (
                                                        <div className={styles.orderExceptionone}>
                                                            {parseInt(item.orderException.number)}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className={styles.header_register}>
                                                    <span
                                                        className={styles.item_header_register}
                                                        onClick={() => this.onRegisterClick(item)}
                                                    >
                                                        登记
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <Empty />
                                )}
                            </List>
                        </PullToRefresh>
                    </div>
                </div>
            </div>
        );
    }
}
export default QueryOrderList;

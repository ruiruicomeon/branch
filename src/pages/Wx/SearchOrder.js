import React, { PureComponent } from 'react';
import {
    List,
    NavBar,
    Icon,
    Toast,
    WingBlank,
    SearchBar,
    Flex,
    WhiteSpace,
    Picker,
    DatePicker,
} from 'antd-mobile';
import router from 'umi/router';
import { Input, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank } from '@/utils/utils';
import stylesindex from './IndexWeUi.less';
import styles from './SearchOrder.less';
import classnames from 'classnames';
const more = require('../../assets/more_new.png');
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';

@connect(({ warning, loading, communication }) => ({
    ...warning,
    ...communication,
    loading: loading.models.warning,
    submitting: loading.effects['warning/queryExceptionOrderList_wx'],
}))
class SearchOrderList extends PureComponent {
    state = {
        PickerList: [],
        baseNameList: [], // 所有基地名称
        BUnameList: [], // 所有的品类
        ischecked: styles.on_select, // 控制选中的样式
        checkedData: {}, // 基地选中后携带数据
        bunameData: {}, // 品类选中后携带数据
        scondnameData: {}, //二级品类选中后携带数据
        factoryEndDate: '', // 工厂交货结束时间
        factoryBeginTime: '', //工厂交货开始时间
        pickerLable: '',
        pickerValue: '', // 车间 选择  code
        searchBarValue: '',
        begindate: '',
        enddate: '',
        initialBeginDate: '', // 初始 一级排产开始时间
        initialOverDate: '', // 初始一级排产结束时间
        searchMaeketValue: ' ', // 商场
        jidi: [],
        plone: [],
        pltwo: [],
        search_value: {},
        flagOfmore: false,
        flagOfbuname: false,
    };

    OnselctChange(value) {
        this.setState({
            PickerList: value,
        });
    }
    handlePICkok(value) {
        // 确定选择之后回调
        if (value && value.length > 0) {
            const { getWorkShopList } = this.props;
            let pickerLable =
                isNotBlank(getWorkShopList) &&
                getWorkShopList.length > 0 &&
                getWorkShopList.filter(item => {
                    if (item.value == value) {
                        return item.label;
                    }
                });
            this.setState({
                pickerLable: pickerLable[0].label,
                pickerValue: value[0],
            });
        }
    }
    handleBegintime(value) {
        // 开始时间确定触发
    }
    handleEndtime(time) {
        // 确定点击时触发
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let data = new Date(); // 1个月之前的时间
        let threeMonthAgo = data.setMonth(data.getMonth() - 1);
        this.setState({
            initialBeginDate: new Date(threeMonthAgo),
            initialOverDate: new Date(),
        });
        dispatch({
            // 基地
            type: 'communication/fetch_basenamelist',
            payload: { grade: 1, type: 1 },
            callback: data => {
                this.setState({
                    baseNameList: data,
                });
            },
        });
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

        // dispatch({
        //     // 根据基地和品类来筛选 车间
        //     type: 'communication/fetch_workshop_wx',
        //     payload: {
        //         grade: 3,
        //         type: 1,
        //     },
        // });
    }

    componentWillMount() {
        const { dispatch } = this.props;
        this.setState({
            checkedData: {},
            bunameData: {},
            scondnameData: {},
            begindate: '',
            enddate: '',
            pickerValue: '',
            searchBarValue: '',
            factoryEndDate: '', // 工厂交货结束时间
            factoryBeginTime: '', //工厂交货开始时间
        });
        dispatch({
            type: 'communication/clearSearchRecord',
        });
    }

    handleBaseClick(base) {
        const { dispatch } = this.props;
        const { jidi } = this.state;
        let newarr = jidi;
        if (newarr.length == 0) {
            newarr.push(base.code);
        } else {
            if (newarr.indexOf(base.code) == -1) {
                newarr.push(base.code);
            } else {
                newarr.splice(newarr.indexOf(base.code), 1);
            }
        }
        this.setState({
            jidi: newarr,
        });

        dispatch({
            // 根据基地来选择车间
            type: 'communication/fetch_workshop_wx',
            payload: { grade: 3, SiteCode: newarr.join(','), type: 1 },
        });
        this.setState({
            checkedData: base,
        });
    }
    handleBuNameClick(buname) {
        const { dispatch } = this.props;
        const { checkedData, plone, jidi, pltwo } = this.state;
        this.setState({
            pltwo: [],
        });
        let newarr = plone;
        if (newarr.length == 0) {
            newarr.push(buname.code);
        } else {
            if (newarr.indexOf(buname.code) == -1) {
                newarr.push(buname.code);
            } else {
                newarr.splice(newarr.indexOf(buname.code), 1);
            }
        }
        this.setState({
            plone: newarr,
        });

        if (newarr.length == 0) {
            dispatch({
                type: 'communication/clear_fetch_secondname_wx',
            });
        } else {
            dispatch({
                type: 'communication/fetch_secondname_wx',
                payload: { buCode: newarr.join(',') },
            });
        }
        dispatch({
            // 根据基地和品类来筛选 车间
            type: 'communication/fetch_workshop_wx',
            payload: {
                SiteCode: jidi.join(','),
                buCode: newarr.join(','),
            },
        });
        this.setState({
            bunameData: buname,
        });
    }
    handleScondNameClick(scondname) {
        const { pltwo } = this.state;

        let newarr = pltwo;
        if (newarr.length == 0) {
            newarr.push(scondname.code);
        } else {
            if (newarr.indexOf(scondname.code) == -1) {
                newarr.push(scondname.code);
            } else {
                newarr.splice(newarr.indexOf(scondname.code), 1);
            }
        }

        this.setState({
            pltwo: newarr,
        });
        this.forceUpdate();
    }
    searchBarChange(value) {
        this.setState({
            searchBarValue: value,
        });
    }
    onMarketChange(e) {
        this.setState({
            searchMaeketValue: e.target.value,
        });
    }
    handlCancel() {
        const { location } = this.props;
        router.push(
            `/wx/app?presentTab=${
            isNotBlank(location) &&
                isNotBlank(location.query) &&
                isNotBlank(location.query.presentTab)
                ? location.query.presentTab
                : ''
            }`
        );
    }
    handleReset(e) {
        this.setState({
            PickerList: [],
            checkedData: {}, // 基地选中后携带数据
            bunameData: {}, // 品类选中后携带数据
            scondnameData: {}, //二级品类选中后携带数据
            factoryEndDate: '', // 工厂交货结束时间
            factoryBeginTime: '', //工厂交货开始时间
            pickerLable: '',
            pickerValue: '', // 车间 选择  code
            searchBarValue: '',
            begindate: '',
            enddate: '',
            initialBeginDate: '', // 初始 一级排产开始时间
            initialOverDate: '', // 初始一级排产结束时间
            searchMaeketValue: ' ', // 商场
        });
    }
    handleSearchOk(e) {
        e.stopPropagation();
        const { dispatch, location } = this.props;
        let search_value = {};
        const {
            checkedData,
            bunameData,
            scondnameData,
            begindate,
            enddate,
            pickerValue,
            pickerLable,
            searchBarValue,
            factoryBeginTime,
            factoryEndDate,
            initialBeginDate,
            initialOverDate,
            searchMaeketValue,
            jidi,
            plone,
            pltwo,
        } = this.state;

        search_value.siteCode = isNotBlank(jidi) && jidi.length > 0 ? jidi.join(',') : '';
        search_value.buCode = isNotBlank(plone) && plone.length > 0 ? plone.join(',') : '';
        search_value.secondaryCategoryCode =
            isNotBlank(pltwo) && pltwo.length > 0 ? pltwo.join(',') : '';

        search_value.orderSelfNum = searchBarValue ? searchBarValue : '';

        search_value.WorkShopCode = pickerValue ? pickerValue : '';

        search_value.scheduleBeginDate = begindate
            ? moment(begindate).format('YYYY-MM-DD')
            : initialBeginDate
                ? moment(initialBeginDate).format('YYYY-MM-DD')
                : '';
        search_value.scheduleEndDate = enddate
            ? moment(enddate).format('YYYY-MM-DD')
            : initialOverDate
                ? moment(initialOverDate).format('YYYY-MM-DD')
                : '';
        search_value.dueBeginDate = factoryBeginTime
            ? moment(factoryBeginTime).format('YYYY-MM-DD')
            : '';
        search_value.dueEndDate = factoryEndDate ? moment(factoryEndDate).format('YYYY-MM-DD') : '';
        search_value.dealerName = searchMaeketValue ? searchMaeketValue : '';
        if (
            (isNotBlank(begindate) && isNotBlank(enddate)) ||
            ((isNotBlank(search_value.dueBeginDate ) && isNotBlank( search_value.dueEndDate)) ||
                isNotBlank(searchBarValue) ||
                (isNotBlank(search_value.scheduleBeginDate) &&
                    isNotBlank(search_value.scheduleEndDate)))
        ) {
            //  确定已经选择了必填的一个
            this.setState({ search_value: search_value });
            dispatch({
                type: 'warning/queryExceptionOrderList_wx',
                payload: { Page1: 1, PageCount: 100, ...search_value },
                callback: () => {
                    router.push(
                        `/wx/app?isearch=order_list&presentTab=${location.query.presentTab}`
                    );
                    dispatch({
                        type: 'warning/add_search_value_orderlist',
                        payload: { ...search_value },
                    });
                },
            });
        } else {
            if (!isNotBlank(searchBarValue)) {
                Toast.info('请填写订单自编号或者MSCS编号', 1);
            }
            if (!isNotBlank(begindate) || !isNotBlank(enddate)) {
                Toast.info('请选择完整的一级排产时间', 1);
            }
            if (!isNotBlank(factoryBeginTime) || !isNotBlank(factoryEndDate)) {
                Toast.info('请选择完整的一级排产时间', 1);
            }
        }
    }
    switchbase() {
        const { flagOfmore } = this.state;
        this.setState({ flagOfmore: !flagOfmore });
    }
    switchbuname() {
        const { flagOfbuname } = this.state;
        this.setState({ flagOfbuname: !flagOfbuname });
    }
    render() {
        const { getWorkShopList, getScondNameList, location } = this.props;
        const {
            pickerLable,
            PickerList,
            baseNameList,
            ischecked,
            BUnameList,
            checkedData,
            bunameData,
            scondnameData,
            searchMaeketValue,
            jidi,
            plone,
            pltwo,
            flagOfmore,
            flagOfbuname,
        } = this.state;
        let resultbaseNameList = [];
        let baseArr = ['无锡基地', '天津基地', '清远基地', '成都基地'];
        let bunameArr = ['橱柜', '集成家居', '木门', '卫浴'];
        const scileListBase = (baseArr, baseNameList) => {
            let resultbaseNameList = [];
            if (isNotBlank(baseArr) && baseArr.length > 0) {
                for (var i = 0; i < baseArr.length; i++) {
                    if (baseNameList && baseNameList.length > 0) {
                        baseNameList.forEach(item => {
                            if (baseArr[i] == item.name) {
                                resultbaseNameList.push(item);
                            }
                        });
                    }
                }
                return resultbaseNameList;
            }
        };
        let defaultbaseList = scileListBase(baseArr, baseNameList)
            ? scileListBase(baseArr, baseNameList)
            : [];

        let defaultBunameList = scileListBase(bunameArr, BUnameList)
            ? scileListBase(bunameArr, BUnameList)
            : [];

        return (
            <div className={styles.searchinfo_content}>
                <div className={styles.search_warp}>
                    <div className={styles.searchCon}>
                        <SearchBar
                            placeholder="请输入订单自编号"
                            className={styles.SearchBar}
                            value={this.state.searchBarValue}
                            onChange={value => this.searchBarChange(value)}
                        />
                        <div className={styles.sub_title}>基地:</div>
                        {flagOfmore ? (
                            <Flex
                                justify="center"
                                wrap="wrap"
                                className={styles.am_flexbox_justify_center}
                            >
                                {isNotBlank(baseNameList) &&
                                    baseNameList.length > 0 &&
                                    baseNameList.map((base, idnex) => {
                                        return (
                                            <Flex.Item
                                                key={base.id}
                                                id={`${base.name}`}
                                                className={
                                                    isNotBlank(jidi) &&
                                                        jidi.length > 0 &&
                                                        jidi.indexOf(base.code) != -1
                                                        ? classnames(styles.Flex_item, ischecked)
                                                        : classnames(styles.Flex_item)
                                                }
                                                onClick={() => {
                                                    this.handleBaseClick(base);
                                                }}
                                            >
                                                {base.name}
                                            </Flex.Item>
                                        );
                                    })}
                                <a
                                    onClick={() => this.switchbase()}
                                    className={styles.switchbase_flag}
                                >
                                    收起
                                </a>
                            </Flex>
                        ) : (
                                <Flex
                                    justify="center"
                                    id="base"
                                    wrap="wrap"
                                    className={styles.am_flexbox_justify_center}
                                >
                                    {isNotBlank(defaultbaseList) &&
                                        defaultbaseList.length > 0 &&
                                        defaultbaseList.map((base, idnex) => {
                                            return (
                                                <Flex.Item
                                                    key={base.id}
                                                    id={`${base.name}`}
                                                    className={
                                                        isNotBlank(jidi) &&
                                                            jidi.length > 0 &&
                                                            jidi.indexOf(base.code) != -1
                                                            ? classnames(styles.Flex_item, ischecked)
                                                            : classnames(styles.Flex_item)
                                                    }
                                                    onClick={() => {
                                                        this.handleBaseClick(base);
                                                    }}
                                                >
                                                    {base.name}
                                                </Flex.Item>
                                            );
                                        })}
                                    <a
                                        onClick={() => this.switchbase()}
                                        className={styles.switchbase_flag}
                                    >
                                        展开所有
                                </a>
                                </Flex>
                            )}

                        <div className={styles.sub_title}>品类:</div>
                        {flagOfbuname ? (
                            <Flex
                                justify="center"
                                wrap="wrap"
                                className={styles.am_flexbox_justify_center}
                            >
                                {isNotBlank(BUnameList) &&
                                    BUnameList.length > 0 &&
                                    BUnameList.map(buname => {
                                        return (
                                            <Flex.Item
                                                key={buname.id}
                                                className={
                                                    isNotBlank(plone) &&
                                                        plone.length > 0 &&
                                                        plone.indexOf(buname.code) != -1
                                                        ? classnames(styles.Flex_item, ischecked)
                                                        : classnames(styles.Flex_item)
                                                }
                                                onClick={() => {
                                                    this.handleBuNameClick(buname);
                                                }}
                                            >
                                                {buname.name}
                                            </Flex.Item>
                                        );
                                    })}
                                <a
                                    onClick={() => this.switchbuname()}
                                    className={styles.switchbase_flag}
                                >
                                    收起
                                </a>
                            </Flex>
                        ) : (
                                <Flex
                                    justify="center"
                                    wrap="wrap"
                                    className={styles.am_flexbox_justify_center}
                                >
                                    {isNotBlank(defaultBunameList) &&
                                        defaultBunameList.length > 0 &&
                                        defaultBunameList.map(buname => {
                                            return (
                                                <Flex.Item
                                                    key={buname.id}
                                                    className={
                                                        isNotBlank(plone) &&
                                                            plone.length > 0 &&
                                                            plone.indexOf(buname.code) != -1
                                                            ? classnames(styles.Flex_item, ischecked)
                                                            : classnames(styles.Flex_item)
                                                    }
                                                    onClick={() => {
                                                        this.handleBuNameClick(buname);
                                                    }}
                                                >
                                                    {buname.name}
                                                </Flex.Item>
                                            );
                                        })}
                                    <a
                                        onClick={() => this.switchbuname()}
                                        className={styles.switchbase_flag}
                                    >
                                        展开所有
                                </a>
                                </Flex>
                            )}
                        <div className={styles.sub_title}>二级品类:</div>

                        <Flex
                            justify="center"
                            wrap="wrap"
                            className={styles.am_flexbox_justify_center}
                        >
                            {isNotBlank(getScondNameList) &&
                                getScondNameList.length > 0 &&
                                getScondNameList.map(scondname => {
                                    return (
                                        <Flex.Item
                                            key={scondname.id}
                                            className={
                                                isNotBlank(pltwo) &&
                                                    pltwo.length > 0 &&
                                                    pltwo.indexOf(scondname.code) != -1
                                                    ? classnames(styles.Flex_item, ischecked)
                                                    : classnames(styles.Flex_item)
                                            }
                                            onClick={() => {
                                                this.handleScondNameClick(scondname);
                                            }}
                                        >
                                            {scondname.name}
                                        </Flex.Item>
                                    );
                                })}
                        </Flex>
                        <Flex justify="center"></Flex>
                        <div className={styles.sub_title}>商场:</div>
                        <div className={styles.searchMaeket}>
                            <Input
                                style={{ height: '50px', paddingLeft: 10 }}
                                allowClear={true}
                                value={searchMaeketValue}
                                placeholder="请输入商场名称"
                                onChange={e => {
                                    this.onMarketChange(e);
                                }}
                            />
                        </div>

                        <div className={styles.sub_title}>车间:</div>
                        <Picker
                            title="请选择车间"
                            data={getWorkShopList ? getWorkShopList : []}
                            cols={1}
                            value={PickerList}
                            onChange={e => {
                                this.OnselctChange(e);
                            }}
                            onOk={v => {
                                this.handlePICkok(v);
                            }}
                        >
                            <div className={styles.shop_work}>
                                <span className={styles.shop_work_cj}>车间:</span>
                                 <p className={styles.shop_work_jd}>
                                    <span style={{ paddingRight: 10, color: '#ccc' }}>
                                        {pickerLable ? (
                                            <span style={{ color: '#333' }}>
                                                <Icon
                                                    style={{
                                                        paddingTop: '12px',
                                                        position: 'relative',
                                                        top: '6px',
                                                    }}
                                                    type="cross"
                                                    size="lg"
                                                    color="#ccc"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        this.setState({
                                                            PickerList: [],
                                                            pickerLable: '',
                                                            pickervalue: '',
                                                        });
                                                    }}
                                                />
                                                {pickerLable}
                                            </span>
                                        ) : (
                                               '请选择车间'
                                            )}
                                    </span>
                                    <img src={more} className={styles.more_imgstyle} />
                                </p>
                            </div>
                        </Picker>
                        <div className={styles.sub_title}>一级排产时间:</div>
                        <div>
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
                                onOk={e => {
                                    styles;
                                    this.handleBegintime(e);
                                }}
                                onChange={begindate => this.setState({ begindate })}
                            >
                                <div className={styles.begin_time}>
                                    <span>开始时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10, color: '#ccc' }}>
                                            {this.state.begindate ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ begindate: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.begindate).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : this.state.initialBeginDate ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ initialBeginDate: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.initialBeginDate).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : (
                                                        '请选择开始时间'
                                                    )}
                                        </span>
                                        <img src={more} className={styles.more_imgstyle} />
                                    </p>
                                </div>
                            </DatePicker>
                            <DatePicker
                                maxDate={
                                    this.state.begindate
                                        ? new Date(
                                            new Date(this.state.begindate).getTime() +
                                            12 * 30 * 24 * 3600 * 1000
                                        )
                                        : ''
                                }
                                mode="date"
                                title="请选择结束时间"
                                extra="Optional"
                                locale={zh_CN}
                                value={
                                    this.state.enddate
                                        ? this.state.enddate
                                        : this.state.initialOverDate
                                }
                                onOk={e => {
                                    this.handleEndtime(e);
                                }}
                                onChange={enddate => this.setState({ enddate })}
                            >
                                <div className={styles.end_time}>
                                    <span>结束时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10, color: "#ccc" }}>
                                            {this.state.enddate ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ enddate: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.enddate).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : this.state.initialOverDate ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ initialOverDate: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.initialOverDate).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : (
                                                        '请选择结束时间'
                                                    )}
                                        </span>
                                        <span
                                            onClick={() => {
                                                this.setState({ initialOverDate: '' });
                                            }}
                                        ></span>
                                        <img src={more} className={styles.more_imgstyle} />
                                    </p>
                                </div>
                            </DatePicker>
                        </div>
                        <div className={styles.sub_title}>工厂交货期:</div>
                        <div>
                            <DatePicker
                                mode="date"
                                title="请选择开始时间"
                                locale={zh_CN}
                                minDate={
                                    this.state.factoryBeginTime ? this.state.factoryBeginTime : ''
                                }
                                value={this.state.factoryBeginTime}
                                // onOk={e => {
                                //     this.factoryBeginTime(e);
                                // }}
                                onChange={factoryBeginTime => this.setState({ factoryBeginTime })}
                            >
                                <div className={styles.begin_time}>
                                    <span>开始时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10, color: "#ccc" }}>
                                            {this.state.factoryBeginTime ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ factoryBeginTime: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.factoryBeginTime).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : (
                                                    '请选择开始时间'
                                                )}
                                        </span>
                                        <img src={more} className={styles.more_imgstyle} />
                                    </p>
                                </div>
                            </DatePicker>
                            <DatePicker
                                mode="date"
                                title="请选择结束时间"
                                extra="Optional"
                                maxDate={
                                    this.state.factoryBeginTime
                                        ? new Date(
                                            new Date(this.state.factoryBeginTime).getTime() +
                                            12 * 30 * 24 * 3600 * 1000
                                        )
                                        : ''
                                }
                                locale={zh_CN}
                                value={this.state.factoryEndDate}
                                onChange={factoryEndDate => this.setState({ factoryEndDate })}
                            >
                                <div className={styles.end_time}>
                                    <span>结束时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10, color: "#ccc" }}>
                                            {this.state.factoryEndDate ? (
                                                <span style={{ color: '#333' }}>
                                                    <Icon
                                                        style={{
                                                            paddingTop: '12px',
                                                            position: 'relative',
                                                            top: '6px',
                                                        }}
                                                        type="cross"
                                                        size="lg"
                                                        color="#ccc"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.setState({ factoryEndDate: '' });
                                                        }}
                                                    />
                                                    {moment(this.state.factoryEndDate).format(
                                                        'YYYY-MM-DD'
                                                    )}
                                                </span>
                                            ) : (
                                                    '请选择结束时间'
                                                )}
                                        </span>
                                        <img src={more} className={styles.more_imgstyle} />
                                    </p>
                                </div>
                            </DatePicker>
                        </div>
                    </div>
                </div>
                <div className={styles.button}>
                    <Button
                        className={styles.button_bom}
                        type="default"
                        size="small"
                        onClick={e => {
                            this.handleReset(e);
                        }}
                    >
                        重置
                    </Button>
                    <Button
                        block
                        className={styles.button_bom}
                        onClick={() => {
                            this.handlCancel();
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        loading={this.props.submitting}
                        block
                        type="primary"
                        className={styles.button_bom}
                        onClick={e => {
                            this.handleSearchOk(e);
                        }}
                    >
                        确定
                    </Button>
                </div>
            </div>
        );
    }
}

export default SearchOrderList;

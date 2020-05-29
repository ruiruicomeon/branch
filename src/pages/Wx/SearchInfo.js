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
import { Input, Button, Mention } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank , proccessObject} from '@/utils/utils';
import { setStorage} from '@/utils/localStorageUtils';
import stylesindex from './IndexWeUi.less';
import styles from './SearchInfo.less';
import classnames from 'classnames';

import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
const more = require('../../assets/more_new.png');
@connect(({ warning, loading, communication }) => ({
    ...warning,
    ...communication,
    loading: loading.models.warning,
    submitting: loading.effects['warning/warning_List'],
}))
class SearchBarOf extends PureComponent {
    state = {
        defaultSearchValue: '', //默认搜索内容 存在自动搜索
        PickerList: [],
        baseNameList: [], // 所有基地名称
        BUnameList: [], // 所有的品类
        ischecked: styles.on_select, // 控制选中的样式
        checkedData: {}, // 基地选中后携带数据
        bunameData: {}, // 品类选中后携带数据
        scondnameData: {}, //二级品类选中后携带数据
        pickerLable: '',
        pickerValue: '', // 车间 选择  code
        searchBarValue: '',
        begindate: '',
        enddate: '',
        initialBeginDate: '',
        initialOverDate: '',
        jidi: [],
        plone: [],
        pltwo: [],
    };

    OnselctChange(value) {
        this.setState({
            PickerList: value,
        });
    }
    handlePICkok(value) {
        // 确定选择之后回调
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
            pickerLable:
                isNotBlank(pickerLable[0]) && isNotBlank(pickerLable[0].label)
                    ? pickerLable[0].label
                    : '',
            pickerValue: isNotBlank(value[0]) ? value[0] : '',
        });
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        if (
            isNotBlank(location) &&
            isNotBlank(location.query) &&
            isNotBlank(location.query.value)
        ) {
            this.setState({ defaultSearchValue: location.query.value }, () => {
                this.handleSearchOk();
            });
        }
        let date = new Date();
        // let oneMonthAgo = date.setMonth(date.getMonth() - 1);
        let tommdate = date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        this.setState({
            initialBeginDate: new Date(tommdate),
            initialOverDate: new Date(),
        });

        dispatch({
            // 基地
            type: 'communication/fetch_basenamelist',
            callback: data => {
                this.setState({
                    baseNameList: data,
                });
            },
        });
        dispatch({
            // 品类
            type: 'communication/fetch_buname_wx',
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
        dispatch({
            type: 'communication/clearSearchRecord',
        });
        this.setState({
            checkedData: {},
            bunameData: {},
            scondnameData: {},
            begindate: '',
            enddate: '',
            pickerValue: '',
            searchBarValue: '',
            flagOfmore: false,
            flagOfbuname: false,
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
            payload: { SiteCode: newarr.join(',') },
        });
        this.setState({
            checkedData: base,
        });
        this.forceUpdate();
    }
    handleBuNameClick(buname) {
        const { dispatch } = this.props;
        const { bunameData, plone, jidi, pltwo } = this.state;

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

        dispatch({
            // 根据基地和品类来筛选 车间
            type: 'communication/fetch_workshop_wx',
            payload: {
                grade: 3,
                SiteCode: jidi.join(','),
                type: 1,
                buCode: newarr.join(','),
            },
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
        this.setState({
            bunameData: buname,
        });
        this.forceUpdate();
    }
    handleScondNameClick(scondname) {
        const { pltwo, scondnameData } = this.state;
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

        this.setState({
            scondnameData: scondname,
        });
        this.forceUpdate();
    }
    searchBarChange(value) {
        this.setState({
            searchBarValue: value,
        });
    }
    handleReset(e) {
        this.setState({
            PickerList: [],
            checkedData: {}, // 基地选中后携带数据
            bunameData: {}, // 品类选中后携带数据
            scondnameData: {}, //二级品类选中后携带数据
            pickerLable: '',
            pickerValue: '', // 车间 选择  code
            searchBarValue: '',
            begindate: '',
            enddate: '',
            jidi: [],
            plone: [],
            pltwo: [],
            initialBeginDate:'',
            initialOverDate:''
        });
    }
    handleSearchOk(e) {
        e ? e.stopPropagation() : '';
        const { dispatch } = this.props;
        let search_value = {};
        const {
            checkedData,
            bunameData,
            scondnameData,
            begindate,
            enddate,
            pickerValue,
            searchBarValue,
            defaultSearchValue,
            jidi,
            plone,
            pltwo,
            initialBeginDate,
            initialOverDate,
        } = this.state;
        if (isNotBlank(jidi) && jidi.length == 1) {
            search_value.siteCode = checkedData.code;
        } else {
            search_value.siteCode = isNotBlank(jidi) && jidi.length > 0 ? jidi.join(',') : '';
        }
        if (isNotBlank(plone) && plone.length == 1) {
            search_value.buCode = bunameData.code;
        } else {
            search_value.buCode = isNotBlank(plone) && plone.length > 0 ? plone.join(',') : '';
        }
        if (isNotBlank(pltwo) && pltwo.length == 1) {
            search_value.secondCategoryCode = scondnameData.code;
        } else {
            search_value.secondCategoryCode =
                isNotBlank(pltwo) && pltwo.length > 0 ? pltwo.join(',') : '';
        }
        search_value.orderSelfNum = searchBarValue
            ? searchBarValue
            : defaultSearchValue
            ? defaultSearchValue
            : '';

        search_value.deptCode = pickerValue ? pickerValue : '';

        search_value.beginFirstScheduleTime = begindate
            ? moment(begindate).format('YYYY-MM-DD')
            : initialBeginDate
            ? moment(initialBeginDate).format('YYYY-MM-DD')
            : '';
        search_value.endFirstScheduleTime = enddate
            ? moment(enddate).format('YYYY-MM-DD')
            : initialOverDate
            ? moment(initialOverDate).format('YYYY-MM-DD')
            : '';
            search_value=proccessObject(search_value)
        dispatch({
            type: 'warning/warning_List',
            payload: { ...search_value },
            callback: () => {
                setStorage('searchValue_info',JSON.stringify(search_value))
                router.push({ pathname: `/wx/app`, state: { isearch: 'yes' } });
            },
        });
    }
    switchbase() {
        const { flagOfmore } = this.state;
        this.setState({ flagOfmore: !flagOfmore });
    }
    switchbuname() {
        const { flagOfbuname } = this.state;
        this.setState({ flagOfbuname: !flagOfbuname });
    }
    handleBegintime() {}
    handleEndtime() {}
    render() {
        const { getWorkShopList, getScondNameList } = this.props;
        const {
            pickerLable,
            PickerList,
            baseNameList,
            ischecked,
            BUnameList,
            checkedData,
            bunameData,
            scondnameData,
            defaultSearchValue,
            jidi,
            plone,
            pltwo,
            flagOfmore,
            flagOfbuname,
        } = this.state;
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
                            value={
                                this.state.searchBarValue
                                    ? this.state.searchBarValue
                                    : defaultSearchValue
                            }
                            onChange={value => this.searchBarChange(value)}
                        />
                        <div className={styles.sub_title}>基地</div>
                        {flagOfmore ? (
                            <Flex
                                justify="center"
                                id="base"
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

                        <div className={styles.sub_title}>品类</div>
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

                        <div className={styles.sub_title}>二级品类</div>

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
                        <div className={styles.sub_title}>车间</div>

                        <Picker
                            title="车间选择"
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
                                <span className={styles.shop_work_cj}>车间</span>
                                <p className={styles.shop_work_jd}>
                                    <span style={{ paddingRight: 10 }}>
                                        {pickerLable ? (
                                            <span style={{ color: '#333' }}>{pickerLable} </span>
                                        ) : (
                                            '请选择车间'
                                        )}
                                    </span>
                                    <img src={more} className={styles.more_imgstyle} />
                                </p>
                            </div>
                        </Picker>
                        <div className={styles.sub_title}>一级排产时间</div>

                        <div>
                            <DatePicker
                                mode="date"
                                title="请选择开始时间"
                                minDate={this.state.begindate ? this.state.begindate : ''}
                                // extra="Optional"
                                locale={zh_CN}
                                value={
                                    this.state.begindate
                                        ? this.state.begindate
                                        : this.state.initialBeginDate
                                }
                                onOk={e => {
                                    this.handleBegintime(e);
                                }}
                                onChange={begindate => this.setState({ begindate })}
                            >
                                <div className={styles.begin_time}>
                                    <span>开始时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10 }}>
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
                                                        'YYYY/MM/DD'
                                                    )}
                                                </span>
                                            ) : this.state.initialBeginDate ? (
                                                <span>
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
                                                        'YYYY/MM/DD'
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
                                value={
                                    this.state.enddate
                                        ? this.state.enddate
                                        : this.state.initialOverDate
                                }
                                maxDate={
                                    this.state.begindate
                                        ? new Date(
                                              new Date(this.state.begindate).getTime() +
                                                  30 * 24 * 3600 * 1000
                                          )
                                        : ''
                                }
                                extra="Optional"
                                locale={zh_CN}
                                onOk={e => {
                                    this.handleEndtime(e);
                                }}
                                onChange={enddate => this.setState({ enddate })}
                            >
                                <div className={styles.end_time}>
                                    <span>结束时间</span>
                                    <p className={styles.shop_work_jd}>
                                        <span style={{ paddingRight: 10 }}>
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
                                                        'YYYY/MM/DD'
                                                    )}
                                                </span>
                                            ) : this.state.initialOverDate ? (
                                                <span>
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
                                                        'YYYY/MM/DD'
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
                            router.push(`/wx/app`);
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

export default SearchBarOf;

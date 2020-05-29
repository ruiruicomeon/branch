import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Input, Empty, Table, Mentions, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {
    List,
    NavBar,
    Icon,
    Toast,
    SearchBar,
    WhiteSpace,
    WingBlank,
    Steps,
    Card,
    Menu,
    ActivityIndicator,
    Button,
    Tag,
    Flex,
} from 'antd-mobile';
import { isNotBlank, getFullUrl, judgeLen } from '@/utils/utils';
import classnames from 'classnames';
import styles from './ExceptionDateil.less';
const down_img = require('../../assets/down.png');

const Item = List.Item;
const Brief = Item.Brief;

const Step = Steps.Step;
const fileImg = require('../../assets/file_img.png');
const moreFile = require('../../assets/more_file.png');
const comm = require('../../assets/huifu.png');
const down = require('../../assets/down.png');
const data = [
    {
        value: '1',
        label: '沟通记录',
    },
    {
        value: '2',
        label: '基本信息',
    },
    {
        value: '3',
        label: '相关附件',
    },
    {
        value: '4',
        label: '生产进度',
    },
    {
        value: '5',
        label: '物流进度',
    },
];
@connect(({ warning, communication, loading }) => ({
    ...warning,
    ...communication,
    loading: loading.models.warning,
    submitting: loading.effects['warning/getOrderExceptionDateil'],
}))
class ExceptionDateilList extends PureComponent {
    state = {
        searchValue: '', // 搜索框value
        refreshing: false,
        searchFocus: false,
        data: [],
        pageSize: 10,
        parsentLable: '沟通记录', // 初始菜单
        value: ['1'],
        oid: '',
        replyUserId: '', // 回复
        replyUserName: '',
        replyItem: {},
        replyInfo: '',
        isShowClickInput: '',

        replyUserIdTWO: '',
        replyUserNameTWO: '',
        replyOfInfoTWO: '',
        replyItemTWO: {},
        isShowClickInputTWO: '',
        parentId: '',
        initShowInput: true, //初始显示取消
        initShowInputTWO: true,
        isdisplaycomm: false, //  展开/收起
        isdisplaycommone: false,
        fladIdArr: [], //
        showmorecomm: 3,
        flagId: [], // 评论条数id
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            // 用户选择
            type: 'sysuser/fetch',
            callback: data => {
                this.setState({
                    tableData: data,
                });
            },
        });
        if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.oid)) {
            dispatch({
                type: 'warning/getOrderExceptionDateil',
                payload: { oid: location.query.oid },
            });
            this.setState({
                oid: location.query.id,
            });
        }
    }
    componentWillMount() {}
    fetchMore = () => {
        const { dispatch, warningList } = this.props;
        const pageCurrent = warningList.pagination.current + 1;
        const value = {
            current: pageCurrent,
            pageSize: 5,
        };
        dispatch({
            type: 'warning/queryExceptionOrderList',
            payload: value,
        });
    };

    SearInputonChange(value) {
        // 搜索框变化回调
        this.setState({
            searchValue: value,
        });
    }

    onFocusClick = e => {
        e.preventDefault();
        const { searchFocus } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/queryExceptionOrderList',
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
    onRegisterClick = item => {
        // 登记页面
        const { dispatch } = this.props;
        router.push(`/wx/register_from?id=${item.id}`);
    };

    onChange = value => {
        // 菜单选择回调
        let label = '';
        data.forEach(dataItem => {
            if (dataItem.value === value[0]) {
                label = dataItem.label;
            }
        });
        this.setState({
            parsentLable: label,
            value,
        });
    };

    onMaskClick = () => {
        this.setState({
            show: false,
        });
    };
    onReplyClick = (e, item) => {
        e.preventDefault();
        if (
            isNotBlank(item) &&
            isNotBlank(item.createBy) &&
            isNotBlank(item.createBy.id) &&
            isNotBlank(item.createBy.name)
        ) {
            this.setState({
                replyUserId: item.createBy.id,
                replyUserName: `@${item.createBy.name}`,
                replyItem: item,
                isShowClickInput: item.id,
            });
        } else {
            this.setState({
                replyItem: item,
                isShowClickInput: item.id,
            });
        }
    };

    confirmAddcommun() {
        // 回复信息
        const { dispatch } = this.props;
        const { replyInfo, replyUserId, replyUserName, replyItem, isShowClickInput } = this.state;
        const { location } = this.props;
        let oid = isNotBlank(location.query) && location.query.oid ? location.query.oid : '';
        if (isNotBlank(replyInfo)) {
            dispatch({
                type: 'communication/addcommrecoed',
                payload: {
                    exceptionId: replyItem.exceptionId,
                    commInfo: replyInfo,
                    parentId: isShowClickInput,
                },
                callback: () => {
                    dispatch({
                        type: 'warning/getOrderExceptionDateil',
                        payload: { oid: oid },
                    });
                    this.setState({
                        replyUserId: '',
                        replyUserName: '',
                        replyItem: {},
                        replyInfo: '',
                        isShowClickInput: '',
                    });
                },
            });
        } else {
            Toast.info('请输入回复内容', 1);
        }
    }
    onReplyClickTWO(e, item) {
        e.preventDefault();
        if (
            isNotBlank(item) &&
            isNotBlank(item.createBy) &&
            isNotBlank(item.createBy.id) &&
            isNotBlank(item.createBy.name)
        ) {
            this.setState({
                replyUserIdTWO: item.createBy.id,
                replyUserNameTWO: `@${item.createBy.name}`,
                replyOfInfoTWO: `@${item.createBy.name}`,
                replyItemTWO: item,
                isShowClickInputTWO: item.id,
                parentId: item.parentId,
            });
        }
    }
    confirmAddcommunOfTWO() {
        // 回复@人
        const { dispatch } = this.props;
        const {
            replyUserIdTWO,
            replyUserNameTWO,
            replyOfInfoTWO,
            replyItemTWO,
            isShowClickInputTWO,
            parentId,
        } = this.state;
        const { location } = this.props;
        let oid = isNotBlank(location.query) && location.query.oid ? location.query.oid : '';
        if (replyOfInfoTWO.indexOf(replyUserNameTWO) > -1) {
            let info = replyOfInfoTWO;
            if (replyOfInfoTWO.indexOf(replyUserNameTWO) > -1) {
                info = info.replace(replyUserNameTWO, '');
            }
            info = info.replace(/^\s*|\s*$/g, '');
            if (isNotBlank(info)) {
                dispatch({
                    type: 'communication/addcommrecoed',
                    payload: {
                        exceptionId: replyItemTWO.exceptionId,
                        commInfo: replyOfInfoTWO,
                        mentions: replyUserIdTWO,
                        parentId: parentId,
                    },
                    callback: () => {
                        dispatch({
                            type: 'warning/getOrderExceptionDateil',
                            payload: { oid: oid },
                        });
                        this.setState({
                            replyUserIdTWO: '',
                            replyUserNameTWO: '',
                            replyItemTWO: {},
                            replyOfInfoTWO: '',
                            isShowClickInputTWO: '',
                            parentId: '',
                        });
                    },
                });
            } else {
                Toast.info('请输入回复内容', 1);
            }
        }
    }
    onReplyInfoChangeTWO(e) {
        // 输入框变化回调
        let valueTWO = e.target.value;
        this.setState({
            replyOfInfoTWO: e.target.value,
            initShowInputTWO: false,
        });
        if (!valueTWO) {
            this.setState({
                initShowInputTWO: true,
            });
        }
    }

    onChangeOfClick(e, id) {
        let value = e.target.value;
        this.setState({
            replyInfo: e.target.value,
            initShowInput: false,
        });
        if (!value) {
            this.setState({
                initShowInput: true,
            });
        }
    }
    handleCancla() {
        this.setState({
            isShowClickInput: '',
        });
    }
    handleCanclaTWO() {
        this.setState({
            isShowClickInputTWO: '',
        });
    }
    click_down(id) {
        const { isdisplaycomm, fladIdArr } = this.state;
        let tmpearr = fladIdArr;
        tmpearr.push(id);
        if (tmpearr.indexOf(id) > -1) {
            tmpearr.splice(tmpearr.indexOf(id), 1);
        }
        this.setState({
            isdisplaycomm: true,
            fladIdArr: tmpearr,
        });
    }
    click_up() {
        const { isdisplaycomm } = this.state;
        this.setState({
            isdisplaycomm: false,
        });
    }
    click_down_one() {
        this.setState({
            isdisplaycommone: true,
        });
    }
    click_up_one() {
        this.setState({
            isdisplaycommone: false,
        });
    }
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
    handleShowAllcomm(length, id) {
        const { flagId } = this.state;
        let newarr = this.deepcopytwo(flagId);
        if (newarr.indexOf(id) > -1) {
        } else {
            newarr.push(id);
        }
        this.setState({ showmorecomm: length, flagId: newarr });
        this.forceUpdate();
    }

    handleClosecomm(length, item) {
        const { flagId } = this.state;
        let id = item.id;
        let newarr = this.deepcopytwo(flagId);
        newarr.splice(flagId.indexOf(id), 1);
        this.setState({ showmorecomm: 3, flagId: newarr });
        this.forceUpdate();
    }
    render() {
        const { getOrderExceptionDateil, loading, submitting, location } = this.props;
        const {
            searchFocus,
            value,
            parsentLable,
            replyInfo,
            replyUserId,
            isShowClickInput,
            isShowClickInputTWO,
            replyOfInfoTWO,
            initShowInput, // 初始显示取消
            initShowInputTWO,
            fladIdArr,
        } = this.state;
        let orderPlan = [
            // 订单进度
            { name: '接单', date: '' },
            { name: '技术审核', date: '' },
            { name: '价格审核', date: '' },
            { name: '已排期', date: '' },
            { name: '已排AS', date: '' },
            { name: '已入库', date: '' },
            { name: '已发货', date: '' },
        ];
        const orderPlanfn = (orderPlan, SInfo) => {
            //  所有的进度sq
            if (SInfo) {
                for (let i = 0; i < SInfo.length; i++) {
                    for (let j = 0; j < orderPlan.length; j++) {
                        if (SInfo[i].name == orderPlan[j].name) {
                            orderPlan[j].date = SInfo[i].date;
                        }
                    }
                }
                return orderPlan;
            }
        };
        const orderPlanfnMyself = (orderPlan, SInfo) => {
            //  所有的进度
            if (SInfo) {
                for (let i = 0; i < SInfo.length; i++) {
                    for (let j = 0; j < orderPlan.length; j++) {
                        if (SInfo[i].name == orderPlan[j].name) {
                            orderPlan[j].date = SInfo[i].date;
                        }
                    }
                }
                return orderPlan;
            }
        };

        const getAllSecondPlan = SInfo => {
            // 取到所有二级品类的进度条
            let secondofCabinet = ['派单', '开料', '打包', '进仓'];
            let result = [];
            for (var i = 0; i < SInfo.length; i++) {
                let scbu = {};
                scbu.name = SInfo[i].scname;
                scbu.code = SInfo[i].sccode;
                let arr = [];
                for (var j = 0; j < secondofCabinet.length; j++) {
                    if (SInfo[i].sinfo) {
                        SInfo[i].sinfo.forEach(item => {
                            if (item.name.indexOf(secondofCabinet[j]) > -1) {
                                arr.push({
                                    name: item.name,
                                    date: item.date ? item.date : '',
                                });
                            }
                        });
                        if (arr.length <= j) {
                            arr.push({
                                name: secondofCabinet[j],
                                date: '',
                            });
                        }
                    } else {
                        arr.push({
                            name: secondofCabinet[j],
                            date: '',
                        });
                    }
                }
                scbu.scsinfo = arr;
                result.push(scbu);
            }
            return result;
        };
        let AllthePlan =
            isNotBlank(getOrderExceptionDateil) &&
            isNotBlank(orderPlanfn(orderPlan, getOrderExceptionDateil.sinfo)) &&
            orderPlanfn(orderPlan, getOrderExceptionDateil.sinfo); // 主进度条

        let getAllSecondPlanList = getAllSecondPlan(
            isNotBlank(getOrderExceptionDateil) && isNotBlank(getOrderExceptionDateil.scsinfo)
                ? getOrderExceptionDateil.scsinfo
                : []
        );
        return (
            <div className={styles.exceptiondata_content}>
                <Spin size="large" spinning={submitting}>
                    <div className={styles.contentbox}>
                        <Card>
                            <Card.Header
                                title={
                                    <p className={styles.card_title}>
                                        {isNotBlank(getOrderExceptionDateil) &&
                                            getOrderExceptionDateil.orderSelfNum}
                                    </p>
                                }
                            />
                            <Card.Body className={styles.am_card_body}>
                                <MySteps stepsData={AllthePlan} direction="horizontal" />
                            </Card.Body>
                        </Card>

                        <div className={styles.single_content}>
                            <Menu
                                className={styles.single_foo_menu}
                                data={data}
                                value={value}
                                level={1}
                                onChange={value => {
                                    this.onChange(value);
                                }}
                                height={document.documentElement.clientHeight * 0.8}
                            />
                            <div className={styles.right_content}>
                                {isNotBlank(getOrderExceptionDateil) &&
                                    isNotBlank(getOrderExceptionDateil.exceptionList) &&
                                    getOrderExceptionDateil.exceptionList.map(item => {
                                        return (
                                            <CommRecoed
                                                isdisplay={
                                                    parsentLable !== '沟通记录'
                                                        ? styles.displaynone
                                                        : ''
                                                }
                                                oid={
                                                    isNotBlank(location.query) && location.query.oid
                                                        ? location.query.oid
                                                        : ''
                                                }
                                                communicationData={
                                                    isNotBlank(item.commList) && item.commList
                                                }
                                                exceptionId={isNotBlank(item.id) && item.id}
                                                secondName={
                                                    isNotBlank(item.secondCategoryName) &&
                                                    item.secondCategoryName
                                                }
                                                warringType={
                                                    isNotBlank(item.warringType) && item.warringType
                                                }
                                                handleCancla={() => this.handleCancla()}
                                                initShowInput={initShowInput}
                                                handleCanclaTWO={() => this.handleCanclaTWO()}
                                                initShowInputTWO={initShowInputTWO}
                                                loading={loading}
                                                key={item.orderNum}
                                                onReplyClick={this.onReplyClick}
                                                confirmAddcommun={this.confirmAddcommun.bind(this)}
                                                isShowClickInput={isShowClickInput}
                                                replyOfInfo={replyInfo}
                                                onChangeOfClick={(e, id) =>
                                                    this.onChangeOfClick(e, id)
                                                }
                                                onClickReply={() => this.confirmAddcommun()}
                                                onReplyClickTWO={(e, item) =>
                                                    this.onReplyClickTWO(e, item)
                                                }
                                                isShowClickInputTWO={isShowClickInputTWO}
                                                onChangeOfClickTWO={() =>
                                                    this.confirmAddcommunOfTWO()
                                                }
                                                onReplyInfoChangeTWO={e =>
                                                    this.onReplyInfoChangeTWO(e)
                                                }
                                                replyOfInfoTWO={replyOfInfoTWO}
                                                click_down={id => this.click_down(id)}
                                                fladIdArr={fladIdArr}
                                                click_up={() => this.click_up()}
                                                isdisplaycomm={this.state.isdisplaycomm}
                                                click_down_one={() => this.click_down_one()}
                                                click_up_one={() => this.click_up_one()}
                                                isdisplaycommone={this.state.isdisplaycommone}
                                                handleShowAllcomm={(length, id) =>
                                                    this.handleShowAllcomm(length, id)
                                                }
                                                handleClosecomm={(length, item) =>
                                                    this.handleClosecomm(length, item)
                                                }
                                                showmorecomm={this.state.showmorecomm}
                                                flagId={this.state.flagId}
                                            />
                                        );
                                    })}
                                {parsentLable === '沟通记录' ? (
                                    <div className={styles.warning_footer_but}>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                router.push(
                                                    `/wx/register_from?id=${location.query.oid}`
                                                );
                                            }}
                                            type="primary"
                                        >
                                            异常登记
                                        </Button>
                                    </div>
                                ) : null}
                                <BaseInfo
                                    isdisplay={
                                        parsentLable !== '基本信息' ? styles.displaynone : ''
                                    }
                                    BasicInfoLisData={
                                        isNotBlank(getOrderExceptionDateil) &&
                                        getOrderExceptionDateil
                                    }
                                />

                                <FileList
                                    isdisplay={
                                        parsentLable !== '相关附件' ? styles.displaynone : ''
                                    }
                                    filedata={
                                        isNotBlank(getOrderExceptionDateil) &&
                                        isNotBlank(getOrderExceptionDateil.ainfo)
                                            ? getOrderExceptionDateil.ainfo
                                            : []
                                    }
                                />

                                {isNotBlank(getAllSecondPlanList) &&
                                    getAllSecondPlanList.map(item => {
                                        return (
                                            <OrderSecond
                                                stepsData={item.scsinfo}
                                                direction="horizontal"
                                                isdisplay={
                                                    parsentLable !== '生产进度'
                                                        ? styles.displaynone
                                                        : ''
                                                }
                                            />
                                        );
                                    })}

                                <LogisticsPlan
                                    isdisplay={
                                        parsentLable !== '物流进度' ? styles.displaynone : ''
                                    }
                                    LogisticsPlanData={
                                        isNotBlank(getOrderExceptionDateil) &&
                                        isNotBlank(getOrderExceptionDateil.lsinfo)
                                            ? getOrderExceptionDateil.lsinfo
                                            : []
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
export default ExceptionDateilList;

const LogisticsPlan = props => {
    const { LogisticsPlanData, isdisplay } = props;
    return isNotBlank(LogisticsPlanData) && LogisticsPlanData.length > 0 ? (
        LogisticsPlanData.map(item => (
            <div className={classnames(isdisplay)}>
                <div className={styles.item}>
                    <div className={styles.item_header}>
                        <div className={styles.item_title}>单号：{item.num ? item.num : ''}</div>
                    </div>
                    <div className={styles.item_info_layout} style={{ paddingBottom: '10px' }}>
                        <div className={styles.item_info_header_text_top}>
                            车次：{item.carNum ? item.carNum : ''}
                        </div>
                        <div className={styles.item_info_header_text}>
                            件数：{item.count ? item.count : ''}
                        </div>
                        <div className={styles.item_info_header_text} style={{ color: '#909090' }}>
                            发货时间:
                            {item && item.date ? moment(item.date).format('YYYY-MM-DD') : ''}
                        </div>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className={classnames(isdisplay)}>
            <Empty />
        </div>
    );
};

const MySteps = props => {
    const { stepsData, direction } = props;
    return (
        <Steps direction={direction} size="small">
            {stepsData &&
                stepsData.map((item, index) => {
                    return (
                        <Step
                            key={index}
                            title={item.name}
                            description={
                                item.date ? moment(item.date).format('MM-DD HH:mm:ss') : ''
                            }
                            status={item.date ? 'finish' : 'wait'}
                            icon={
                                <Icon
                                    size={item.date ? 'md' : 'xs'}
                                    type={item.date ? 'check-circle' : 'check-circle'}
                                    color={item.date ? '#1890FF' : '#ccc'}
                                />
                            }
                        />
                    );
                })}
        </Steps>
    );
};

const OrderSecond = props => {
    const { stepsData, direction, isdisplay } = props;
    return (
        <div className={classnames(isdisplay, styles.OrderSecond)}>
            <Steps direction={direction} size="small">
                {stepsData &&
                    stepsData.map((item, index) => {
                        return (
                            <Step
                                key={index}
                                title={item.name}
                                description={
                                    item.date ? moment(item.date).format('MM-DD HH:mm:ss') : ''
                                }
                                icon={
                                    <Icon
                                        size={item.date ? 'md' : 'xs'}
                                        type={item.date ? 'check-circle' : 'check-circle'}
                                        color={item.date ? '#1890FF' : '#ccc'}
                                    />
                                }
                            />
                        );
                    })}
            </Steps>
        </div>
    );
};

const CommRecoed = props => {
    const {
        communicationData,
        secondName,
        warringType,
        isdisplay,
        key,
        createDate,
        onReplyClick,
        confirmAddcommun,
        replyInfo,
        onReplyInfoChange,
        onMentionsSelect,
        handleTextAreachange,
        isShowClickInput, // 显示input
        replyOfInfo, //input框信息
        onChangeOfClick,
        onReplyClickTWO,
        onClickReply,
        isShowClickInputTWO,
        replyOfInfoTWO,
        onChangeOfClickTWO, // 点击事件
        onReplyInfoChangeTWO, // input框回调事件
        exceptionId, // 异常id
        handleCancla, // 取消评论
        initShowInput,
        initShowInputTWO,
        handleCanclaTWO, //取消评论
        oid,
        click_down,
        click_up,
        isdisplaycomm,
        isdisplaycommone,
        click_up_one,
        click_down_one,
        fladIdArr,
        handleShowAllcomm,
        handleClosecomm,
        showmorecomm,
        flagId,
    } = props;
    const onClickFile = file => {
        window.open(getFullUrl(file));
    };
    const goTotheCommunication = exceptionId => {
        router.push(`/wx/dispose?id=${exceptionId}`);
    };
    return isNotBlank(communicationData) && communicationData.length > 0 ? (
        <div className={classnames(isdisplay)} key={key}>
            <div className={styles.warp_list} key={key}>
                <List key={key} className={classnames(styles.my_list)}>
                    <div className={styles.list_heared}>
                        <div onClick={() => goTotheCommunication(exceptionId)}>
                            {isNotBlank(secondName) ? secondName : ''} &nbsp;
                            {warringType ? (warringType == '1' ? '推迟' : '预警') : ''}
                        </div>
                    </div>
                    {isNotBlank(communicationData) &&
                        communicationData.length > 0 &&
                        communicationData.map((item, index) => (
                            <div className={styles.item_laytout} key={index}>
                                <div className={styles.item_info_laytout} key={index}>
                                    <div className={styles.item_user_layout} key={index}>
                                        <img
                                            src={
                                                isNotBlank(item) &&
                                                isNotBlank(item.createBy) &&
                                                isNotBlank(item.createBy.photo)
                                                    ? getFullUrl(item.createBy.photo)
                                                    : ''
                                            }
                                            alt=""
                                            className={styles.img_style}
                                        />
                                        <div className={styles.info_msg_layout}>
                                            <div className={styles.user_name}>
                                                {isNotBlank(item) &&
                                                isNotBlank(item.createBy) &&
                                                isNotBlank(item.createBy.name)
                                                    ? item.createBy.name
                                                    : ''}
                                            </div>
                                            <div className={styles.user_time}>
                                                {isNotBlank(item.createDate)
                                                    ? moment(item.createDate).format(
                                                          'YYYY/MM/DD HH:mm:ss'
                                                      )
                                                    : ''}
                                            </div>
                                        </div>

                                        <img
                                            src={comm}
                                            style={{ width: '20px', height: '20px' }}
                                            onClick={e => onReplyClick(e, item)}
                                        />
                                    </div>

                                    {isNotBlank(item.commInfo) && (
                                        <>
                                            <div
                                                className={
                                                    isdisplaycommone
                                                        ? classnames(
                                                              styles.displaynone,
                                                              styles.content_msg
                                                          )
                                                        : classnames(styles.content_msg)
                                                }
                                            >
                                                <span className={styles.info_msg}>
                                                    {item.commInfo}
                                                </span>
                                                {isNotBlank(item.commInfo) &&
                                                judgeLen(item.commInfo) > 28 ? (
                                                    <a
                                                        style={{
                                                            fontSize: '12px',
                                                            marginTop: '3px',
                                                            width: '50px',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                        onClick={() => click_down_one()}
                                                        className={styles.downcss}
                                                    >
                                                        展开
                                                    </a>
                                                ) : null}
                                            </div>

                                            <div
                                                className={
                                                    isdisplaycommone
                                                        ? classnames(styles.info_msg_all)
                                                        : classnames(
                                                              styles.info_msg_all,
                                                              styles.displaynone
                                                          )
                                                }
                                            >
                                                {item.commInfo}
                                                <a
                                                    onClick={() => click_up_one()}
                                                    style={{ paddingLeft: '5px' }}
                                                >
                                                    收起
                                                </a>
                                            </div>
                                        </>
                                    )}

                                    {isNotBlank(item.respType) && (
                                        <div className={styles.info_msg_other}>
                                            责任分类：{item.respType}
                                        </div>
                                    )}
                                    {isNotBlank(item.respDept) && (
                                        <div className={styles.info_msg_other}>
                                            责任部门：{item.respDept}
                                        </div>
                                    )}
                                    {isNotBlank(item.followDept) && (
                                        <div className={styles.info_msg_other}>
                                            跟进部门：{item.followDept}
                                        </div>
                                    )}
                                    {isNotBlank(item.estiCompTime) && (
                                        <div className={styles.info_msg_other}>
                                            预计完成：
                                            {moment(item.estiCompTime).format('YYYY/MM/DD ')}
                                        </div>
                                    )}

                                    {isNotBlank(item) &&
                                    isNotBlank(item.accessorys) &&
                                    item.accessorys.length > 0 ? (
                                        <div className={styles.file_list_layout}>
                                            {item.accessorys.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.file_item}
                                                    onClick={() => onClickFile(file.path)}
                                                >
                                                    <img
                                                        src={fileImg}
                                                        alt=""
                                                        className={styles.item_file_img}
                                                    />
                                                    <div className={styles.item_path}>
                                                        {isNotBlank(file.path)
                                                            ? file.path.substring(
                                                                  file.path.lastIndexOf('/') + 1
                                                              )
                                                            : ''}
                                                    </div>
                                                    <img
                                                        src={moreFile}
                                                        alt=""
                                                        style={{
                                                            height: '8px',
                                                            width: '5px',
                                                            margin: 'auto',
                                                            marginRight: 10,
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        ''
                                    )}

                                    {isShowClickInput == item.id ? (
                                        <div className={styles.imputMsg_click}>
                                            <Input
                                                value={replyOfInfo}
                                                placeholder="请输入回复内容"
                                                className={styles.header_search}
                                                onChange={e => {
                                                    onChangeOfClick(e, item.id);
                                                }}
                                            />
                                            {
                                                <>
                                                    {initShowInput ? (
                                                        <div
                                                            className={styles.reply_button}
                                                            onClick={() => handleCancla()}
                                                        >
                                                            取消
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={styles.reply_button}
                                                            onClick={e => onClickReply(e)}
                                                        >
                                                            提交
                                                        </div>
                                                    )}
                                                </>
                                            }
                                        </div>
                                    ) : (
                                        ''
                                    )}

                                    {isNotBlank(item) &&
                                    isNotBlank(item.children) &&
                                    item.children.length > 0
                                        ? item.children.map((items, childrenIndex) => {
                                              let length_comm = 3;
                                              if (
                                                  item.children.length > 3 &&
                                                  flagId.indexOf(item.id) > -1
                                              ) {
                                                  length_comm = item.children.length;
                                              }
                                              if (childrenIndex < length_comm) {
                                                  return (
                                                      <div
                                                          className={styles.reply_object}
                                                          key={childrenIndex}
                                                      >
                                                          <div className={styles.item_user_layout}>
                                                              <div>
                                                                  <img
                                                                      src={
                                                                          isNotBlank(items) &&
                                                                          isNotBlank(
                                                                              items.createBy
                                                                          ) &&
                                                                          isNotBlank(
                                                                              items.createBy.photo
                                                                          )
                                                                              ? getFullUrl(
                                                                                    items.createBy
                                                                                        .photo
                                                                                )
                                                                              : ''
                                                                      }
                                                                      alt=""
                                                                      className={
                                                                          styles.img_style_leave
                                                                      }
                                                                      onClick={e => {
                                                                          onReplyClickTWO(e, items);
                                                                      }}
                                                                  />
                                                              </div>
                                                              <div
                                                                  className={
                                                                      styles.info_msg_layout_son
                                                                  }
                                                              >
                                                                  <div
                                                                      className={
                                                                          styles.user_name_warp
                                                                      }
                                                                  >
                                                                      <div
                                                                          style={{
                                                                              marginRight: '2px',
                                                                          }}
                                                                          className={
                                                                              styles.user_name_quteinfo
                                                                          }
                                                                      >
                                                                          {isNotBlank(items) &&
                                                                          isNotBlank(items) &&
                                                                          isNotBlank(
                                                                              items.createBy
                                                                          ) &&
                                                                          isNotBlank(
                                                                              items.createBy.name
                                                                          )
                                                                              ? items.createBy.name
                                                                              : ''}
                                                                      </div>
                                                                      <div
                                                                          style={{
                                                                              fontSize: '8px',
                                                                          }}
                                                                          className={
                                                                              styles.user_time
                                                                          }
                                                                      >
                                                                          {isNotBlank(items) &&
                                                                          isNotBlank(
                                                                              items.createDate
                                                                          )
                                                                              ? moment(
                                                                                    items.createDate
                                                                                ).format(
                                                                                    'YYYY/MM/DD HH:mm:ss'
                                                                                )
                                                                              : ''}
                                                                      </div>
                                                                  </div>

                                                                  <div
                                                                      className={
                                                                          isdisplaycomm
                                                                              ? classnames(
                                                                                    styles.info_msg_son,
                                                                                    styles.displaynone
                                                                                )
                                                                              : classnames(
                                                                                    styles.info_msg_son
                                                                                )
                                                                      }
                                                                  >
                                                                      <span
                                                                          className={
                                                                              styles.more_down
                                                                          }
                                                                      >
                                                                          {isNotBlank(items) &&
                                                                          isNotBlank(items.commInfo)
                                                                              ? items.commInfo
                                                                              : ''}
                                                                      </span>
                                                                      {isNotBlank(items.commInfo) &&
                                                                      judgeLen(items.commInfo) >
                                                                          20 ? (
                                                                          <a
                                                                              style={{
                                                                                  fontSize: '13px',
                                                                                  width: '49px',
                                                                                  marginLeft: '5px',
                                                                              }}
                                                                              onClick={() =>
                                                                                  click_down(
                                                                                      items.id
                                                                                  )
                                                                              }
                                                                              className={
                                                                                  styles.downcss
                                                                              }
                                                                          >
                                                                              展开
                                                                          </a>
                                                                      ) : null}
                                                                  </div>
                                                                  <div
                                                                      className={
                                                                          isdisplaycomm
                                                                              ? classnames(
                                                                                    styles.info_msg_son_all
                                                                                )
                                                                              : classnames(
                                                                                    styles.info_msg_son_all,
                                                                                    styles.displaynone
                                                                                )
                                                                      }
                                                                  >
                                                                      {isNotBlank(items) &&
                                                                      isNotBlank(items.commInfo)
                                                                          ? items.commInfo
                                                                          : ''}
                                                                      <span
                                                                          className={
                                                                              styles.more_down
                                                                          }
                                                                      >
                                                                          <a
                                                                              onClick={() =>
                                                                                  click_up()
                                                                              }
                                                                              className={
                                                                                  styles.upcss
                                                                              }
                                                                          >
                                                                              收起
                                                                          </a>
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          {isShowClickInputTWO == items.id ? (
                                                              <div
                                                                  className={styles.imputMsg_click}
                                                              >
                                                                  <Input
                                                                      value={replyOfInfoTWO}
                                                                      placeholder="请输入回复内容"
                                                                      className={
                                                                          styles.header_search
                                                                      }
                                                                      onChange={e => {
                                                                          onReplyInfoChangeTWO(e);
                                                                      }}
                                                                  />
                                                                  {
                                                                      <>
                                                                          {initShowInputTWO ? (
                                                                              <div
                                                                                  className={
                                                                                      styles.reply_button
                                                                                  }
                                                                                  onClick={() =>
                                                                                      handleCanclaTWO()
                                                                                  }
                                                                              >
                                                                                  取消
                                                                              </div>
                                                                          ) : (
                                                                              <div
                                                                                  className={
                                                                                      styles.reply_button
                                                                                  }
                                                                                  onClick={e =>
                                                                                      onChangeOfClickTWO(
                                                                                          e
                                                                                      )
                                                                                  }
                                                                              >
                                                                                  提交
                                                                              </div>
                                                                          )}
                                                                      </>
                                                                  }
                                                              </div>
                                                          ) : (
                                                              ''
                                                          )}
                                                      </div>
                                                  );
                                              }
                                          })
                                        : null}

                                    {isNotBlank(item) &&
                                    isNotBlank(item.children) &&
                                    item.children.length > 3 &&
                                    flagId.indexOf(item.id) < 0 ? (
                                        <div style={{ width: '100%', height: '100%' }}>
                                            <div className={styles.comm_box}>
                                                <a
                                                    onClick={() =>
                                                        handleShowAllcomm(
                                                            item.children.length,
                                                            item.id
                                                        )
                                                    }
                                                    className={styles.showmorecomm_box}
                                                >
                                                    展示所有评论
                                                </a>
                                                <img
                                                    src={down_img}
                                                    className={styles.down_img_css}
                                                />
                                            </div>
                                        </div>
                                    ) : isNotBlank(item) &&
                                      isNotBlank(item.children) &&
                                      item.children.length > 3 &&
                                      flagId.indexOf(item.id) > -1 ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <a
                                                onClick={() =>
                                                    handleClosecomm(item.children.length, item)
                                                }
                                            >
                                                收起
                                            </a>
                                        </div>
                                    ) : null}
                                </div>
                                <div className={styles.division} />
                            </div>
                        ))}
                </List>
            </div>
        </div>
    ) : (
        <div className={classnames(isdisplay)}>
            <Empty />
        </div>
    );
};

const FileList = props => {
    const { filedata, isdisplay } = props;
    const onClickFile = url => {
        window.open(getFullUrl(url));
    };
    return isNotBlank(filedata) && filedata.length > 0 ? (
        <div className={classnames(styles.file_list_layout, isdisplay)}>
            {isNotBlank(filedata) &&
                filedata.map((file, index) => (
                    <div
                        key={index}
                        className={styles.file_item}
                        onClick={() => onClickFile(file.url)}
                    >
                        <img src={fileImg} alt="" className={styles.item_file_img} />
                        <div className={styles.item_path}>
                            {isNotBlank(file.name) ? file.name : ''}
                            {isNotBlank(file.path)
                                ? file.path.substring(file.path.lastIndexOf('/') + 1)
                                : ''}
                        </div>
                        <img
                            src={moreFile}
                            alt=""
                            style={{
                                height: '8px',
                                width: '5px',
                                margin: 'auto',
                                marginRight: 10,
                            }}
                        />
                    </div>
                ))}
        </div>
    ) : (
        <div className={classnames(isdisplay)}>
            <Empty />
        </div>
    );
};

const BaseInfo = props => {
    const { isdisplay } = props;
    const { BasicInfoLisData } = props;
    return (
        <div className={classnames(isdisplay, styles.baseinfo_content)}>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>订单自编号</p>
                <p className={styles.letter_description}>
                    {isNotBlank(BasicInfoLisData) && BasicInfoLisData.orderSelfNum}
                </p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>订单类型</p>
                <p className={styles.letter_description}>{BasicInfoLisData.orderType}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>订单类别</p>
                <p className={styles.letter_description}>{BasicInfoLisData.orderCategory}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>品牌</p>
                <p className={styles.letter_description}>{BasicInfoLisData.brandName}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>品类</p>
                <p className={styles.letter_description}>{BasicInfoLisData.buName}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>二级品类</p>
                <p className={styles.letter_description}>{BasicInfoLisData.secondaryCategory}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>商场名称</p>
                <p className={styles.letter_description}> {BasicInfoLisData.dealerName}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>商场编号</p>
                <p className={styles.letter_description}>{BasicInfoLisData.dealerCode}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>客户姓名</p>
                <p className={styles.letter_description}>{BasicInfoLisData.cusName}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>客户电话</p>
                <p className={styles.letter_description}>{BasicInfoLisData.cusPhone}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>客户地址</p>
                <p className={styles.letter_description}>{BasicInfoLisData.customAddress}</p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>期望交期</p>
                <p className={styles.letter_description}>
                    {BasicInfoLisData.reqDate
                        ? moment(BasicInfoLisData.reqDate).format('YYYY-MM-DD')
                        : ''}
                </p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>工厂交期</p>
                <p className={styles.letter_description}>
                    {BasicInfoLisData.dueDate
                        ? moment(BasicInfoLisData.dueDate).format('YYYY-MM-DD')
                        : ''}
                </p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>预计进仓</p>
                <p className={styles.letter_description}>
                    {BasicInfoLisData.planBinDate
                        ? moment(BasicInfoLisData.planBinDate).format('YYYY-MM-DD')
                        : ''}
                </p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>批次号</p>
                <p className={styles.letter_description}>
                    {BasicInfoLisData.batchNum ? BasicInfoLisData.batchNum : ''}
                </p>
            </div>
            <div className={styles.letter_box}>
                <p className={styles.letter_title}>柜身材料(主花色)</p>
                <p className={styles.letter_description}>{''}</p>
            </div>
        </div>
    );
};

const OrderSteps = props => {
    const { stepsData, direction, isdisplay } = props;
    return (
        <div className={classnames(isdisplay, styles.orderPlan)}>
            <Steps direction={direction} size="small">
                {stepsData &&
                    stepsData.map((item, index) => {
                        return (
                            <Step
                                key={index}
                                title={item.name ? item.name : ' '}
                                description={
                                    item.date ? moment(item.date).format('MM-DD HH:mm:ss') : ''
                                }
                                status={item.date ? 'finish' : 'wait'}
                                icon={
                                    <Icon
                                        type={item.date ? 'check-circle' : 'check-circle'}
                                        color={item.date ? '#1890FF' : '#ccc'}
                                    />
                                }
                            />
                        );
                    })}
            </Steps>
        </div>
    );
};

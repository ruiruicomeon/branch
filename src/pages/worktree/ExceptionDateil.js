import React, { PureComponent, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
    Button,
    Input,
    InputNumber,
    Form,
    Card,
    Popconfirm,
    Icon,
    Row,
    Col,
    Select,
    DatePicker,
    Divider,
    Tag,
    Avatar,
    message,
    Modal,
    List,
    Radio,
    Collapse,
    Transfer,
    Popover,
    Tabs,
    Tooltip,
    Table,
    Descriptions,
    Spin,
    Comment,
    Upload,
} from 'antd';
import { Steps } from 'antd-mobile';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import { homeUrl } from '../../../config/baseConfig';
import styles from './ExceptionDateil.less';
import moment from 'moment';
import avatar from '../../../src/assets/avater.png';
const { TextArea } = Input;

const { Step } = Steps;
const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}
const MyStep = props => {
    const { stepData, direction } = props;
    return (
        <div className={styles.step_css}>
            <Steps direction="horizontal" size="small">
                {stepData &&
                    stepData.map((item, index) => {
                        return (
                            <Step
                                key={index}
                                title={item.name}
                                description={
                                    item.date ? moment(item.date).format('YYYY/MM/DD HH:mm:ss') : ''
                                }
                                status={item.date ? 'finish' : 'wait'}
                                icon={
                                    <Icon
                                        size={item.date ? 'lg' : 'md'}
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

const BasicInfoLis = props => {
    const { BasicInfoLisData } = props;
    return (
        <>
            <Descriptions
                bordered={true}
                size="default"
                column={1}
                size="middle"
                layout="horizontal"
            >
                <Descriptions.Item label="订单自编号">
                    {BasicInfoLisData.orderSelfNum}
                </Descriptions.Item>
                <Descriptions.Item label="订单类型">{BasicInfoLisData.orderType}</Descriptions.Item>
                <Descriptions.Item label="订单类别">
                    {BasicInfoLisData.orderCategory}
                </Descriptions.Item>
                <Descriptions.Item label="商场名称">
                    {BasicInfoLisData.dealerName}
                </Descriptions.Item>
                <Descriptions.Item label="商场编号">
                    {BasicInfoLisData.dealerCode}
                </Descriptions.Item>
                <Descriptions.Item label="客户姓名">{BasicInfoLisData.cusName}</Descriptions.Item>
                <Descriptions.Item label="客户电话">{BasicInfoLisData.cusPhone}</Descriptions.Item>
                <Descriptions.Item label="客户地址">
                    {BasicInfoLisData.customAddress}
                </Descriptions.Item>
                <Descriptions.Item label="品牌">{BasicInfoLisData.brandName}</Descriptions.Item>
                <Descriptions.Item label="品类">{BasicInfoLisData.buName}</Descriptions.Item>
                <Descriptions.Item label="二级品类">
                    {BasicInfoLisData.secondaryCategory}
                </Descriptions.Item>
                <Descriptions.Item label="期望交期">
                    {BasicInfoLisData.reqDate
                        ? moment(BasicInfoLisData.reqDate).format('YYYY-MM-DD')
                        : ''}
                </Descriptions.Item>
                <Descriptions.Item label="工厂交货期">
                    {BasicInfoLisData.dueDate
                        ? moment(BasicInfoLisData.dueDate).format('YYYY-MM-DD')
                        : ''}
                </Descriptions.Item>
                <Descriptions.Item label="预计进仓时间">
                    {BasicInfoLisData.planBinDate
                        ? moment(BasicInfoLisData.planBinDate).format('YYYY-MM-DD')
                        : ''}
                </Descriptions.Item>
                <Descriptions.Item label="批次号">
                    {BasicInfoLisData.batchNum
                        ? BasicInfoLisData.batchNum
                        : ''}
                </Descriptions.Item>
                <Descriptions.Item label="柜身材料(主花色)">
                    {''}
                </Descriptions.Item>
            </Descriptions>
        </>
    );
};

const AccessoryList = props => {
    const { AccessoryData } = props;
    const columns = [
        {
            title: '文件图片',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '预览',
            dataIndex: 'url',
            width: 150,
            render: text => {
                return (
                    <>
                        <a href={text}>预览</a>
                    </>
                );
            },
        },
        {
            title: '下载',
            dataIndex: 'url',
            width: 150,
            render: text => {
                return (
                    <>
                        <a href={text}>下载</a>
                    </>
                );
            },
        },
    ];
    return (
        <>
            <Table dataSource={AccessoryData} columns={columns} bordered showHeader={false} />
        </>
    );
};

@connect(({ warning, loading, communication }) => ({
    ...warning,
    ...communication,
    loading: loading.models.warning,
    loadingaddcomment: loading.effects['communication/getCompletedMatterinfo'],
}))
class ExcepTionDateil extends PureComponent {
    state = {
        stepData: [],
        watchDateilrecord: {},
        location: getLocation(),
        watchDateilvisb: false, // 查看表格数据是否显示弹窗
        oid: '',
        recordId: '',
        textAreaValue_comment_parent: '',
        commentItem: {},
        textValue_comment_son: '',
        recordId_son: '',
        commentItem_son: {},
        mentionOfId: '', // @人员的id
        mentionOfName: '',
        parentId: '',
    };
    ExceptionReight() {
        // 跳转异常登记页面
        const { oid } = this.state;
        router.push(`/worktree/abnormal?id=${oid}`);
    }
    componentDidMount() {
        const { location } = this.state;
        const { dispatch } = this.props;
        if (isNotBlank(location.query) && isNotBlank(location.query.id)) {
            this.setState({ oid: location.query.id });
            dispatch({
                type: 'warning/getOrderExceptionDateil',
                payload: { oid: location.query.id },
            });
        }
    }

    componentWillUnmount() {}

    handleWatchDateil(record) {
        // 点击表格查看详情
        this.setState({
            watchDateilvisb: true,
            watchDateilrecord: record,
        });
    }

    addComment(id, item) {
        // 点击评论
        this.setState({ recordId: id, commentItem: item, parentId: id });
    }
    confirmReplyComm(e, item) {
        this.setState({
            recordId_son: item.id,
            mentionOfName: `@${item.createBy.name}`,
            textValue_comment_son: `@${item.createBy.name} `,
            mentionOfId: item.createBy.id,
            commentItem_son: item,
        });
    }
    handlesubmit_comment_parent(item) {
        // 确定提交评论
        const { dispatch } = this.props;
        const { textAreaValue_comment_parent, recordId } = this.state;
        if (isNotBlank(textAreaValue_comment_parent)) {
            dispatch({
                type: 'communication/addcommrecoed',
                payload: {
                    exceptionId: item.exceptionId,
                    commInfo: textAreaValue_comment_parent,
                    // mentions: mentions || '',
                    parentId: recordId,
                },
                callback: () => {
                    dispatch({
                        type: 'warning/getOrderExceptionDateil',
                        payload: { oid: this.state.oid ? this.state.oid : '' },
                    });
                    this.setState({
                        textAreaValue_comment_parent: '',
                        recordId: '',
                    });
                },
            });
        } else {
            message.warning('请输入评论内容');
            this.setState({
                recordId: '',
                textAreaValue_comment_parent: '',
            });
        }
    }
    confirmAddSoncommun(item) {
        const {
            mentionOfName,
            textValue_comment_son,
            mentionOfId,
            commentItem_son,
            parentId,
        } = this.state;
        const { dispatch } = this.props;
        if (textValue_comment_son.indexOf(mentionOfName) > -1) {
            let mentions = '';
            let info = textValue_comment_son;
            mentions = mentionOfId;
            info = info.replace(mentionOfName, '');
            info = info.replace(/^\s*|\s*$/g, '');

            if (isNotBlank(info)) {
                dispatch({
                    type: 'communication/addcommrecoed',
                    payload: {
                        exceptionId: commentItem_son.exceptionId,
                        commInfo: textValue_comment_son,
                        mentions: mentions || '',
                        parentId: commentItem_son.parentId,
                    },
                    callback: () => {
                        dispatch({
                            type: 'warning/getOrderExceptionDateil',
                            payload: { oid: this.state.oid ? this.state.oid : '' },
                        });
                        this.setState({
                            mentionOfName: '',
                            textValue_comment_son: '',
                            mentionOfId: '',
                            commentItem_son: {},
                            parentId: '',
                            recordId_son: '',
                        });
                    },
                });
            } else {
                message.warning('请输入评论内容');
            }
        } else {
            message.warning('请选择@到的人员');
        }
    }

    handleTextAreachange(e) {
        // 文本框内容变化回调
        let textAreaValue = e.target.value;
        this.setState({
            textAreaValue_comment_parent: textAreaValue,
        });
    }
    handlecanle_comment_parent() {
        this.setState({
            textAreaValue_comment_parent: '',
            recordId: '',
        });
    }
    handlecanle_comment_son() {
        this.setState({
            textAreaValue_comment_parent: '',
            recordId_son: '',
        });
    }
    handleSonTextAreachange(e) {
        let textAreaValue = e.target.value;
        this.setState({
            textValue_comment_son: textAreaValue,
        });
    }
    render() {
        const { stepData, ExcepTionTitle } = this.state;
        const { getOrderExceptionDateil, loading } = this.props;

        const columns = [
            {
                title: '货运单号',
                dataIndex: 'Num',
                width: 150,
            },

            {
                title: '车次',
                dataIndex: 'CarNum',
                width: 150,
            },
            {
                title: '发货时间',
                dataIndex: 'Date',
                width: 150,
            },
            {
                title: '件数',
                dataIndex: 'Count',
                width: 150,
            },
            {
                title: '',
                dataIndex: 'Name',
                width: 150,
                render: (text, record) => {
                    return (
                        <a
                            onClick={() => {
                                this.handleWatchDateil(record);
                            }}
                        >
                            查看详情
                        </a>
                    );
                },
            },
        ];
        const columnsWatch = [
            {
                title: '序号',
                dataIndex: 'CarNum',
                width: 150,
            },
            {
                title: '包装条码',
                dataIndex: 'CarNum',
                width: 150,
            },
            {
                title: '三级品类',
                dataIndex: 'CarNum',
                width: 150,
            },
            {
                title: '例放',
                dataIndex: 'CarNum',
                width: 150,
            },
            {
                title: '状态',
                dataIndex: 'CarNum',
                width: 150,
            },
        ];

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
            // 取到
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
                                    date: item.date,
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

        const getAllNameAndDate = SInfo => {
            // 得到所有的进度步骤
            let secondofCabinet = ['派单', '开料', '打包', '进仓'];
            let arr = [];
            if (SInfo) {
                for (var i = 0; i < SInfo.length; i++) {
                    if (SInfo[i].sinfo) {
                        for (var j = 0; j < secondofCabinet.length; j++) {
                            SInfo[i].sinfo.forEach(item => {
                                if (item.name.indexOf(secondofCabinet[j]) > -1) {
                                    arr.push({
                                        name: item.name,
                                        date: item.date,
                                    });
                                }
                            });
                        }
                    } else {
                        arr.push({
                            name: SInfo[i].scname,
                            date: '',
                        });
                    }
                }
            }
            return arr;
        };

        const maxTime = SInfo => {
            // 取到时间的最大值   没有最大值  返回空值
            let timesAll = getAllNameAndDate(SInfo);
            let maxtimer = '';
            let maxTimeArr = [];
            if (timesAll) {
                for (let i = 0; i < timesAll.length; i++) {
                    if (timesAll[i].name.indexOf('进仓') > -1) {
                        if (timesAll[i].date) {
                            maxTimeArr.push({
                                name: timesAll[i].name,
                                date: new Date(timesAll[i].date).getTime(),
                            });
                        } else {
                            maxtimer = null;
                        }
                    } else {
                        maxtimer = null;
                    }
                }
                if (maxTimeArr.length > 0) {
                    maxtimer = Math.max.apply(
                        Math,
                        maxTimeArr.map(item => {
                            return item.date;
                        })
                    );
                }
            }
            return maxtimer;
        };

        let maxTimstr = maxTime(
            // 得到最大时间
            isNotBlank(getOrderExceptionDateil) && isNotBlank(getOrderExceptionDateil.scsinfo)
                ? getOrderExceptionDateil.scsinfo
                : []
        );
        let AllthePlan =
            isNotBlank(getOrderExceptionDateil) &&
            isNotBlank(orderPlanfn(orderPlan, getOrderExceptionDateil.sinfo)) &&
            orderPlanfn(orderPlan, getOrderExceptionDateil.sinfo); // 主进度条

        let getAllSecondPlanList = getAllSecondPlan(
            isNotBlank(getOrderExceptionDateil) && isNotBlank(getOrderExceptionDateil.scsinfo)
                ? getOrderExceptionDateil.scsinfo
                : []
        );
        if (maxTimstr) {
            // 判断是否有时间最大值
            if (AllthePlan) {
                AllthePlan.forEach(ele => {
                    if (ele.name == '生产完成') {
                        ele.date = maxTimstr;
                    }
                });
            }
        } else {
            if (AllthePlan) {
                AllthePlan.forEach(ele => {
                    if (ele.name == '生产完成') {
                        ele.date = null;
                    }
                });
            }
        }
        const commentProps = {
            handleTextAreachange: e => this.handleTextAreachange(e),
            handlesubmit_comment_parent: item => this.handlesubmit_comment_parent(item),
            handlecanle_comment_parent: () => this.handlecanle_comment_parent(),
            addComment: (id, item) => this.addComment(id, item),
            confirmReplyComm: (e, item) => this.confirmReplyComm(e, item),
            handlecanle_comment_son: () => this.handlecanle_comment_son(),
            confirmAddSoncommun: item => this.confirmAddSoncommun(item),
            handleSonTextAreachange: e => this.handleSonTextAreachange(e),
            recordId_son: this.state.recordId_son,
            recordId: this.state.recordId,
            textAreaValue_comment_parent: this.state.textAreaValue_comment_parent,
            textValue_comment_son: this.state.textValue_comment_son,
        };
        return (
            <PageHeaderWrapper>
                <Spin size="large" spinning={loading}>
                    <Card>
                        <Row>
                            <Col span={24} className={styles.order_selfnum}>
                                {isNotBlank(getOrderExceptionDateil) &&
                                    getOrderExceptionDateil.orderSelfNum}
                            </Col>
                            <Col span={24} className={styles.step_box}>
                                <MyStep stepData={AllthePlan ? AllthePlan : []} />
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ height: '100%', width: '100%' }} className={styles.my_content}>
                        <Card style={{ overflowY: 'scroll' }}>
                            <Tabs
                                defaultActiveKey="1"
                                onChange={callback}
                                type="card"
                                tabBarStyle={{ borderRadius: 10 }}
                            >
                                <TabPane tab="沟通记录" key="1">
                                    {isNotBlank(getOrderExceptionDateil) &&
                                        isNotBlank(getOrderExceptionDateil.exceptionList) &&
                                        getOrderExceptionDateil.exceptionList.map(item => {
                                            return (
                                                <CommuniCationRecordAll
                                                    communicationData={
                                                        item.commList && item.commList.length > 0
                                                            ? item.commList
                                                            : []
                                                    }
                                                    secondName={
                                                        isNotBlank(item.secondCategoryName) &&
                                                        item.secondCategoryName
                                                    }
                                                    Dcode={isNotBlank(item.id) && item.id}
                                                    warringType={
                                                        isNotBlank(item.warringType)
                                                            ? item.warringType
                                                            : ''
                                                    }
                                                    loading={loading}
                                                    {...commentProps}
                                                />
                                            );
                                        })}

                                    <Divider>
                                        <Button
                                            size="large"
                                            type="primary"
                                            onClick={() => {
                                                this.ExceptionReight();
                                            }}
                                        >
                                            异常登记
                                        </Button>
                                    </Divider>
                                </TabPane>
                                <TabPane tab="基本信息" key="2">
                                    <BasicInfoLis
                                        BasicInfoLisData={
                                            isNotBlank(getOrderExceptionDateil) &&
                                            getOrderExceptionDateil
                                        }
                                    />
                                </TabPane>
                                <TabPane tab="相关附件" key="3">
                                    <AccessoryList
                                        AccessoryData={
                                            isNotBlank(getOrderExceptionDateil) &&
                                            isNotBlank(getOrderExceptionDateil.ainfo)
                                                ? getOrderExceptionDateil.ainfo
                                                : []
                                        }
                                    />
                                </TabPane>
                                <TabPane tab="生产进度" key="4">
                                    <Row>
                                        {isNotBlank(getAllSecondPlanList) &&
                                            getAllSecondPlanList.map(item => {
                                                return (
                                                    <Col span={24}>
                                                        <Card
                                                            title={`${item.name} :`}
                                                            style={{ width: '100%' }}
                                                        >
                                                            {
                                                                <MyStep
                                                                    stepData={item.scsinfo}
                                                                    direction={
                                                                        this.state.stepDirection
                                                                    }
                                                                />
                                                            }
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                    </Row>
                                </TabPane>
                                <TabPane tab="物流进度" key="5">
                                    <Table columns={columns} dataSource={[]} />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>

                    <Modal
                        visible={this.state.watchDateilvisb}
                        onOk={() => {}}
                        onCancel={() => {
                            this.setState({ watchDateilvisb: false });
                        }}
                        footer={null}
                    >
                        <Table columns={columnsWatch} dataSource={[]} />
                    </Modal>
                </Spin>
            </PageHeaderWrapper>
        );
    }
}

export default ExcepTionDateil;

class CommuniCationRecordAll extends PureComponent {
    onPreview(file, url) {
        // 文件打开
        window.open(`${homeUrl}/Api${url}`);
    }
    render() {
        const {
            secondName,
            Dcode,
            fileList,
            loading,
            communicationData,
            loadingaddcomment,

            recordId,
            textAreaValue_comment_parent,
            textValue_comment_son,
            recordId_son,

            addComment,
            confirmReplyComm,
            handleTextAreachange,
            handlesubmit_comment_parent,
            handlecanle_comment_parent,
            handlecanle_comment_son,
            confirmAddSoncommun,
            handleSonTextAreachange,
            warringType,
        } = this.props;

        return (
            <List
                loading={loading}
                header={
                    <div>
                        {
                            <h3 style={{ fontWeight: 600, color: '' }}>
                                {secondName}&nbsp;&nbsp;&nbsp;{warringType == '1' ? '推迟' : '预警'}
                            </h3>
                        }
                    </div>
                }
                itemLayout="horizontal"
                dataSource={
                    isNotBlank(communicationData) && communicationData.length > 0
                        ? communicationData
                        : []
                }
                renderItem={item => (
                    <li>
                        {/* {
                            <div style={{ color: '#333', marginTop: 10 }}>
                                <span>异常类型:&nbsp;&nbsp;{ Dcode  } </span>
                            </div>
                        } */}
                        <Comment
                            actions={[
                                <a
                                    style={{ textDecoration: 'underline' }}
                                    onClick={e => {
                                        addComment(item.id, item);
                                    }}
                                >
                                    评论
                                </a>,
                            ]}
                            author={isNotBlank(item.createBy.name) && item.createBy.name}
                            avatar={
                                <Avatar
                                    src={item.createBy.photo && item.createBy.photo}
                                    shape="square"
                                />
                            }
                            datetime={
                                <Tooltip
                                    title={
                                        isNotBlank(item.createDate) &&
                                        moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                                    }
                                >
                                    <span>
                                        {isNotBlank(item.createDate) &&
                                            moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}
                                    </span>
                                </Tooltip>
                            }
                            content={
                                <div>
                                    {isNotBlank(item.commInfo) ? (
                                        <div className={styles.comm_info}>
                                            回复信息：{item.commInfo}{' '}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <div className={styles.res_box}>
                                        {isNotBlank(item.respDept) && (
                                            <span className={styles.item_res}>
                                                责任分类：{item.respType}
                                            </span>
                                        )}
                                        {isNotBlank(item.respDept) && (
                                            <span className={styles.item_res}>
                                                责任部门： {item.respDept}
                                            </span>
                                        )}
                                        {isNotBlank(item.followDept) && (
                                            <span className={styles.item_res}>
                                                跟进部门： {item.followDept}
                                            </span>
                                        )}
                                        {isNotBlank(item.estiCompTime) && (
                                            <span className={styles.item_res}>
                                                预计完成：
                                                {moment(item.estiCompTime).format('YYYY-MM-DD')}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {isNotBlank(item.accessorys) &&
                                            item.accessorys.map(item => {
                                                return (
                                                    <Upload
                                                        onPreview={file => {
                                                            this.onPreview(file, item.path);
                                                        }}
                                                        fileList={[
                                                            {
                                                                uid: isNotBlank(item.id) && item.id,
                                                                name:
                                                                    isNotBlank(item.path) &&
                                                                    item.path.replace(
                                                                        /[^\u4e00-\u9fa5]/gi,
                                                                        ''
                                                                    ),
                                                                url:
                                                                    isNotBlank(item.path) &&
                                                                    item.path,
                                                            },
                                                        ]}
                                                    />
                                                );
                                            })}
                                    </div>
                                    {item.children && item.children.length > 0
                                        ? item.children.map((items, index) => {
                                              return (
                                                  <Comment
                                                      style={{
                                                          background: '#F8F9FA',
                                                          marginBottom: '10px',
                                                      }}
                                                      actions={[]}
                                                      author={
                                                          <a>
                                                              {isNotBlank(items) &&
                                                              isNotBlank(items.createBy) &&
                                                              isNotBlank(items.createBy.name)
                                                                  ? items.createBy.name
                                                                  : ' '}
                                                          </a>
                                                      }
                                                      avatar={
                                                          <Avatar
                                                              onClick={e =>
                                                                  confirmReplyComm(e, items)
                                                              }
                                                              size="small"
                                                              src={
                                                                  isNotBlank(items) &&
                                                                  isNotBlank(items.createBy) &&
                                                                  isNotBlank(items.createBy.photo)
                                                                      ? items.createBy.photo
                                                                      : ' '
                                                              }
                                                              alt="person"
                                                              shape="square"
                                                          />
                                                      }
                                                      datetime={
                                                          <Tooltip
                                                              title={
                                                                  isNotBlank(items.createDate) &&
                                                                  moment(items.createDate).format(
                                                                      'YYYY-MM-DD HH:mm:ss'
                                                                  )
                                                              }
                                                          >
                                                              <span>
                                                                  {isNotBlank(items.createDate) &&
                                                                      moment(
                                                                          items.createDate
                                                                      ).format(
                                                                          'YYYY-MM-DD HH:mm:ss'
                                                                      )}
                                                              </span>
                                                          </Tooltip>
                                                      }
                                                      content={
                                                          <div>
                                                              <div>
                                                                  <span>
                                                                      {isNotBlank(items) &&
                                                                      isNotBlank(items.commInfo)
                                                                          ? items.commInfo
                                                                          : ''}
                                                                  </span>
                                                              </div>
                                                              <div>
                                                                  {recordId_son == items.id ? (
                                                                      <div
                                                                          style={{
                                                                              display: 'flex',
                                                                          }}
                                                                      >
                                                                          <TextArea
                                                                              style={{
                                                                                  width: '60%',
                                                                              }}
                                                                              placeholder="请输入评论内容"
                                                                              autosize
                                                                              value={
                                                                                  textValue_comment_son
                                                                              }
                                                                              onChange={e => {
                                                                                  handleSonTextAreachange(
                                                                                      e
                                                                                  );
                                                                              }}
                                                                          />
                                                                          {textValue_comment_son ? (
                                                                              <Button
                                                                                  type="primary"
                                                                                  onClick={e => {
                                                                                      {
                                                                                          confirmAddSoncommun(
                                                                                              e,
                                                                                              items
                                                                                          );
                                                                                      }
                                                                                  }}
                                                                              >
                                                                                  确定
                                                                              </Button>
                                                                          ) : (
                                                                              <Button
                                                                                  type="primary"
                                                                                  onClick={() =>
                                                                                      handlecanle_comment_son()
                                                                                  }
                                                                              >
                                                                                  取消
                                                                              </Button>
                                                                          )}
                                                                      </div>
                                                                  ) : (
                                                                      ''
                                                                  )}
                                                              </div>
                                                          </div>
                                                      }
                                                  ></Comment>
                                              );
                                          })
                                        : ''}

                                    {recordId == item.id ? (
                                        <div className={styles.text_comment}>
                                            <TextArea
                                                placeholder="请输入评论内容"
                                                autosize
                                                onChange={e => {
                                                    handleTextAreachange(e);
                                                }}
                                                value={textAreaValue_comment_parent}
                                            />
                                            {textAreaValue_comment_parent ? (
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        handlesubmit_comment_parent(item);
                                                    }}
                                                    loading={loadingaddcomment}
                                                >
                                                    提交
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    onClick={() => handlecanle_comment_parent()}
                                                >
                                                    取消
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            }
                        ></Comment>
                    </li>
                )}
            />
        );
    }
}

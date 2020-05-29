/**
 * 报表统计s
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Modal,
    List,
    Avatar,
    Select,
    DatePicker,
    message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, deepCopy ,proccessObject } from '@/utils/utils';
import { homeUrl } from '../../../config/baseConfig';
import styles from './FormStatistics.less';
import logo from '../../assets/logo.jpg';
import TextArea from 'antd/lib/input/TextArea';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import moment from 'moment';
import { stringify } from 'qs';
import { getStorage } from '@/utils/localStorageUtils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

@connect(({ loading, communication, user }) => ({
    ...communication,
    ...user,
    loadingmodle: loading.models.communication,
    loading: loading.effects['communication/formStatistice_batch'],
}))
@Form.create()
class FormStatisticsList extends PureComponent {
    state = {
        data: {},
        expandForm: false,
        selectedRows: [],
        formValues: {},
        modalVisible: false,
        modalRecord: {},
        pageSize: 20,
        siteCode: '',
        currentUserData: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
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
        dispatch({
            // 基地
            type: 'communication/fetch_basenamelist',
            payload: { grade: 1, type: 1 },
        });
        dispatch({
            type: `user/fetchCurrent_myself`,
            callback: data => {
                if (isNotBlank(data)) {
                    this.setState({ currentUserData: data });
                }
            },
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'communication/formStatistice_batch',
            payload: {
                ...params,
            },
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        // dispatch({
        //     type: 'communication/formStatistice_batch',
        // });
    };

    removeClick = () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;
        dispatch({
            type: 'dictionaryL/del_dict',
            payload: {
                ids: selectedRows.map(rows => rows.id).join(','),
            },
            callback: () => {
                this.setState({
                    selectedRows: [],
                });
            },
        });
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

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
    selectBunameChange(value, Option) {
        const { dispatch } = this.props;
        const { siteCode } = this.state;
        if (value.length == 0) {
            dispatch({
                type: 'communication/clear_fetch_secondname_wx',
            });
        } else {
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
    handleSearch(e) {
        // 查询
        const { form, dispatch } = this.props;
        const { location } = this.state;
        e.preventDefault();

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let  value = { ...values };
                if (isNotBlank(value.createDate) && value.createDate.length > 0) {
                    value.beginCreateDate = value.createDate[0].format('YYYY-MM-DD');
                    value.endCreateDate = value.createDate[1].format('YYYY-MM-DD HH:mm:ss');
                    delete value.createDate;
                } else {
                    delete value.createDate;
                }
                value = proccessObject(value);
                this.setState({
                    formValues: value,
                });

                dispatch({
                    type: 'communication/formStatistice_batch',
                    payload: { ...value, pageSize: this.state.pageSize, current: 1 },
                });
            }
        });
    }
    handleExport(e) {
        const { formValues, currentUserData } = this.state;
        const { dispatch } = this.props;
        let exportValue = deepCopy(formValues);
        if (JSON.stringify(exportValue) !== '{}' && JSON.stringify(currentUserData) !== '{}') {
            exportValue.createBy = currentUserData.id;
            Object.keys(exportValue).forEach(ele => {
                if (Array.isArray(exportValue[ele])) {
                    exportValue[ele] = exportValue[ele].join(',');
                }
            });
            let formElement = document.createElement('form');
            formElement.style.display = 'display:none;';
            formElement.method = 'post';
            formElement.action = `${homeUrl}/Api/op/orderException/exporStatistics`;
            formElement.target = 'callBackTarget';
            for (var key in exportValue) {
                let inputElement = document.createElement('input');
                inputElement.type = 'hidden';
                inputElement.name = key;
                inputElement.value = exportValue[key];
                formElement.appendChild(inputElement);
            }
            document.body.appendChild(formElement);
            formElement.submit();
            document.body.removeChild(formElement);
        } else {
            message.warning('请先选择筛选条件!');
        }
    }
    renderSimpleForm = () => {
        const {
            form,
            getScondNameList,
            getAllBaseNameList,
            getWorkShopList,
            getbuNamelist,
        } = this.props;
        const { BUnameList } = this.state;
        const { getFieldDecorator } = form;
        const limitSelectDate = {
            min: moment()
                .startOf('day')
                .subtract(1, 'days'),
            max: moment().endOf('day'),
        };
        return (
            <Form onSubmit={e => this.handleSearch(e)} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={5} sm={24}>
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
                    <Col md={5} sm={24}>
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
                    <Col md={5} sm={24}>
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
                    <Col md={9} sm={24}>
                        <FormItem label="异常处理时间">
                            {getFieldDecorator('createDate', {
                                rules: [
                                    { type: 'array', required: true, message: '异常处理时间必填' },
                                ],
                                initialValue: [limitSelectDate.min, limitSelectDate.max],
                            })(
                                <RangePicker
                                    size="default"
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm={24}>
                        <div style={{ marginBottom: 24 }}>
                            <span style={{ marginBottom: 24 }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                    重置
                                </Button>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type="primary"
                                    onClick={e => this.handleExport(e)}
                                >
                                    导出
                                </Button>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    };

    renderForm = () => {
        return this.renderSimpleForm();
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
            modalRecord: {},
        });
    };

    render() {
        const { loading, formStatisticeList_obj } = this.props;
        const { selectedRows, modalVisible, modalRecord, BUnameList } = this.state;

        const columns = [
            {
                title: '基地',
                dataIndex: 'siteName',
                width: 100,
                key: 'siteCode',
            },
            {
                title: '品类',
                dataIndex: 'buName',
                width: 100,
                key: 'buCode',
            },
            {
                title: '车间',
                dataIndex: 'deptName',
                width: 150,
                key: 'deptCode',
            },
            {
                title: '新增异常数',
                dataIndex: 'newCount',
                key: 'newCount',
                width: 150,
                children: [
                    {
                        title: '系统自动生成',
                        dataIndex: 'newSysCount',
                        key: 'newSysCount',
                        width: 75,
                    },
                    {
                        title: '用户操作',
                        dataIndex: 'newCount',
                        key: 'newCount',
                        width: 75,
                    },
                ],
            },
            {
                title: '更新异常数',
                width: 150,
                key: '',
                children: [
                    {
                        title: '系统自动生成',
                        dataIndex: 'updateSysCount',
                        key: 'updateSysCount',
                        width: 75,
                    },
                    {
                        title: '用户操作',
                        dataIndex: 'updateCount',
                        key: 'updateCount',
                        width: 75,
                    },
                ],
            },
            {
                title: '关闭异常数',
                width: 150,
                children: [
                    {
                        title: '系统自动生成',
                        dataIndex: 'closeSysCount',
                        key: 'closeSysCount',
                        width: 75,
                    },
                    {
                        title: '用户操作',
                        dataIndex: 'closeCount',
                        key: 'closeCount',
                        width: 75,
                    },
                ],
            },
            {
                title: '总异常数',
                dataIndex: 'totalCount',
                key :'totalCount',
                width: 150,
            },
            {
                title: '推迟订单量',
                dataIndex: 'delayCount',
                key :'delayCount',
                width: 150,
            },
            {
                title: '预警订单量',
                key :'warningCount',
                dataIndex: 'warningCount',
                width: 150,
            },
        ];
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            {/* {selectedRows.length > 0 && (
                                <span>
                                    <Button onClick={() => this.removeClick()}>删除</Button>
                                </span>
                            )} */}
                        </div>

                        <StandardTable
                            bordered
                            scroll={{ x: 1050 }}
                            selectedRows={selectedRows}
                            loading={loading}
                            defaultExpandAllRows
                            data={formStatisticeList_obj}
                            columns={columns}
                            pagination={true}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default FormStatisticsList;

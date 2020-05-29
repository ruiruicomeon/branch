/**
 * 异常沟通记录
 */

import React, { PureComponent, Fragment } from 'react';
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
    Steps,
    Popover,
    Tabs,
    Comment,
    Tooltip,
    Breadcrumb,
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import CommuniCationRecord from './Component/communication'; // 信息组件
import moment from 'moment';

import avatar from '../../../src/assets/avater.png';

@connect(({ communication, loading }) => ({
    ...communication,
    communicationLoading: loading.models.communication,
}))
class Communication extends PureComponent {
    state = {
        location: getLocation(),
        exceptionId: '',
    };

    componentDidMount() {
        const { dispatch } = this.props;
        const { location } = this.state;

        let exceptionId =
            isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)
                ? location.query.id
                : '';
        this.setState({ exceptionId });
        if (isNotBlank(exceptionId)) {
            dispatch({
                type: 'communication/fetch',
                payload: {
                    exceptionId,
                },
            });
            dispatch({
                type: 'warning/findoneofId',
                payload: { id: location.query.id },
                callback: data => {
                    this.setState({
                        orderSelfNum: data.orderSelfNum,
                    });
                },
            });
        }
    }

    handleGoback() {
        // 返回
        router.goBack();
    }

    handleColse(msg) {
        // 关闭异常
        const { exceptionId } = this.state;
        router.push(`/worktree/error_communication?msg=${msg}&id=${exceptionId}`);
    }

    handleComm(msg) {
        // 沟通
        const { exceptionId } = this.state;
        router.push(`/worktree/error_communication?msg=${msg}&id=${exceptionId}`);
    }

    render() {
        const { location, exceptionId } = this.state;
        const { communicationLoading, communicationData } = this.props;
        let isdone =
            isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.msg)
                ? location.query.msg
                : '';
        const communicationProps = {
            loading: communicationLoading,
            communicationData,
        };
        return (
            <PageHeaderWrapper>
                <Card title={isNotBlank(this.state.orderSelfNum) ? this.state.orderSelfNum : ''}>
                    <Breadcrumb>
                        <Breadcrumb.Item>{''}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        {isNotBlank(isdone) && isdone == 'undone' ? (
                            <Col offset={6} style={{ textAlign: 'center', marginLeft: '0' }}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.handleComm('comm');
                                    }}
                                >
                                    异常处理
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ margin: '0  50px' }}
                                    onClick={() => {
                                        this.handleColse('colse');
                                    }}
                                >
                                    关闭异常
                                </Button>
                            </Col>
                        ) : isNotBlank(isdone) && isdone == 'done' ? (
                            <Col offset={12}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.handleComm('nodone');
                                    }}
                                >
                                    评论
                                </Button>
                            </Col>
                        ) : (
                            <Col offset={6} style={{ textAlign: 'center', marginLeft: '0' }}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.handleComm('comm');
                                    }}
                                >
                                    异常处理
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ margin: '0  50px' }}
                                    onClick={() => {
                                        this.handleColse('colse');
                                    }}
                                >
                                    关闭异常
                                </Button>
                            </Col>
                        )}
                        <CommuniCationRecord {...communicationProps} exceptionId={exceptionId} />
                    </Row>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Communication;

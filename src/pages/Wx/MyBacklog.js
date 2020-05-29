import React, { PureComponent } from 'react';
import {
    List,
    NavBar,
    Icon,
    Toast,
    SearchBar,
    WhiteSpace,
    WingBlank,
    Tabs,
    Badge,
    PullToRefresh,
} from 'antd-mobile';
import router from 'umi/router';
import { Input, Button, Empty } from 'antd';
import { connect } from 'dva';
import monment from 'moment';
import classnames from 'classnames';
import { isNotBlank } from '@/utils/utils';
import styles from './MyBacklog.less';

const warningone = require('../../assets/wraning_new_one.png');
const warningtwo = require('../../assets/waring_new_two.png');

const Item = List.Item;
const { Search } = Input;
@connect(({ communication, loading }) => ({
    ...communication,
    loading: loading.models.communication,
    todoMatterLoding: loading.effects['communication/getTodoMatterinfo'],
    finishMatterLoding: loading.effects['communication/getCompletedMatterinfo'],
}))
class MyBacklogList extends PureComponent {
    state = {
        searchFocus: false,
        searchValue: '', // 搜索框value
        refreshing: false,
        down: true,
        height: document.documentElement.clientHeight,
        data: [],
        presentTab: '',
    };

    componentDidMount() {
        const { dispatch, presentTab } = this.props;
        this.setState({ presentTab });
        dispatch({
            type: 'communication/getTodoMatterinfo',
            payload: {
                current: 1,
                pageSize: 5,
            },
        });
    }

    onRegisterClick = item => {
        const { dispatch } = this.props;
        dispatch({
            type: 'warning/additem',
            payload: item,
        });
        router.push(`/wx/register_from?presentTab=${this.state.presentTab}`);
    };

    SearInputonChange(e) {
        // 搜索框变化回调
        this.setState({
            searchValue: e.target.value,
        });
    }
    handleSearchOfTop(value, e) {
        // 搜索
        let searchValue = value;
        const { dispatch } = this.props;
        if (isNotBlank(searchValue)) {
            dispatch({
                type: 'communication/getTodoMatterinfo',
                payload: { orderSelfNum: value },
                callback: () => {
                    this.setState({
                        searchValue: '',
                    });
                },
            });
        } else {
            Toast.info('请输入查询条件!',1)
        }
    }
    handleTabsChange(index, tab) {
        const { dispatch } = this.props;
        if (index == 1) {
            dispatch({
                type: 'communication/getCompletedMatterinfo',
                payload: {
                    current: 1,
                    pageSize: 5,
                },
                callback: data => {
                    if (isNotBlank(data) && data.pagination.total == 0) {
                        Toast.info('暂无数据');
                    }
                },
            });
        }
    }
    handleOnRefresh() {
        //上拉刷新的回调
        const { dispatch, TodoMatterinfoList } = this.props;
        const pageCurrent = TodoMatterinfoList.pagination.current + 1;
        if (
            isNotBlank(TodoMatterinfoList) &&
            isNotBlank(TodoMatterinfoList.list) &&
            isNotBlank(TodoMatterinfoList.pagination) &&
            TodoMatterinfoList.list.length < TodoMatterinfoList.pagination.total
        ) {
            const value = {
                current: pageCurrent,
                pageSize: 5,
            };
            dispatch({
                type: 'communication/getTodoMatterinfo',
                payload: value,
            });
        } else {
            Toast.info('没有更多了!');
        }
    }
    handleOnRefreshFinish() {
        //上拉刷新的回调
        const { dispatch, CompletedMatterList } = this.props;
        const pageCurrent = CompletedMatterList.pagination.current + 1;
        if (
            isNotBlank(CompletedMatterList) &&
            isNotBlank(CompletedMatterList.list) &&
            isNotBlank(CompletedMatterList.pagination) &&
            CompletedMatterList.list.length < CompletedMatterList.pagination.total
        ) {
            const value = {
                current: pageCurrent,
                pageSize: 5,
            };
            dispatch({
                type: 'communication/getCompletedMatterinfo',
                payload: value,
            });
        } else {
            Toast.info('没有更多了!');
        }
    }

    onDisposeClick = (e, item) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: 'communication/AddOnerecord',
            payload: { AddOnerecord: item },
        });
        router.push(`/wx/dispose?id=${item.id}`);
    };

    render() {
        const {
            loading,
            TodoMatterinfoList,
            CompletedMatterList,
            todoMatterLoding,
            finishMatterLoding,
        } = this.props;
        const { searchFocus } = this.state;
        const loadMore =
            isNotBlank(TodoMatterinfoList) &&
            isNotBlank(TodoMatterinfoList.list) &&
            isNotBlank(TodoMatterinfoList.pagination) &&
            TodoMatterinfoList.list.length < TodoMatterinfoList.pagination.total ? (
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

        const tabs = [
            {
                title: (
                    <Badge
                        text={
                            isNotBlank(TodoMatterinfoList) &&
                            isNotBlank(TodoMatterinfoList.pagination) &&
                            TodoMatterinfoList.pagination.total
                        }
                    >
                        待办
                    </Badge>
                ),
                sub: '1',
            },
            {
                title: <Badge>已办</Badge>,
                sub: '2',
            },
        ];

        return (
            <div className={styles.MyBacklogList_content}>
                <div className={styles.contentbox}>
                    <div className={styles.search_con}>
                        <Search
                            allowClear
                            value={this.state.searchValue}
                            placeholder="搜索人名、订单、内容、状态"
                            onChange={value => {
                                this.SearInputonChange(value);
                            }}
                            onSearch={(value, e) => {
                                this.handleSearchOfTop(value, e);
                            }}
                            className={classnames(styles.search_bar)}
                        />
                    </div>
                    <Tabs
                        tabs={tabs}
                        initialPage={0} // 默认第一个
                        onChange={(tab, index) => {
                            this.handleTabsChange(index, tab);
                        }}
                    >
                        <PullToRefresh
                            direction="up" // 拉动方向
                            damping={30} // 拉动距离
                            ref={el => (this.ptr = el)}
                            className={styles.list_view_content}
                            indicator={{ deactivate: '上拉刷新', finish: '刷新完成' }}
                            refreshing={todoMatterLoding} // 是否显示刷新状态
                            onRefresh={() => {
                                this.handleOnRefresh();
                            }}
                        >
                            <MyListTodo
                                presentTab={this.state.presentTab}
                                onDisposeClick={() => this.onDisposeClick}
                                renderListData={
                                    isNotBlank(TodoMatterinfoList) &&
                                    isNotBlank(TodoMatterinfoList.list)
                                        ? TodoMatterinfoList.list
                                        : []
                                }
                            />
                        </PullToRefresh>

                        <PullToRefresh
                            direction="up" // 拉动方向
                            damping={30} // 拉动距离
                            ref={el => (this.ptr = el)}
                            className={styles.list_view_content}
                            indicator={{ deactivate: '上拉刷新', finish: '刷新完成' }}
                            refreshing={finishMatterLoding} // 是否显示刷新状态
                            onRefresh={() => {
                                this.handleOnRefreshFinish();
                            }}
                        >
                            <MyListDone
                                presentTab={this.state.presentTab}
                                renderListData={
                                    isNotBlank(CompletedMatterList) &&
                                    isNotBlank(CompletedMatterList.list)
                                        ? CompletedMatterList.list
                                        : []
                                }
                                onDisposeClick={(e, items) => {
                                    this.onDisposeClick(e, items);
                                }}
                            />
                        </PullToRefresh>
                    </Tabs>
                </div>
            </div>
        );
    }
}
export default MyBacklogList;

const MyListTodo = props => {
    const { renderListData, onDisposeClick, presentTab } = props;
    const onClickItem = id => {
        router.push(`/wx/dispose?id=${id}&presentTab=${presentTab}`);
    };
    const wholong = updateDate => {
        return monment(updateDate, 'YYYYMMDD').fromNow();
    };

    return (
        <List className={styles.my_list} key={renderListData && renderListData.id}>
            {renderListData && renderListData.length > 0 ? (
                renderListData.map(items => {
                    return (
                        <div
                            onClick={() => {
                                onClickItem(items.id);
                            }}
                            className={styles.item}
                            style={{ marginTop: '8px', paddingBottom: '10px' }}
                            // className={styles.warp_content}
                            key={items.id}
                        >
                            <div className={styles.orderSelfNum_style}>
                                {items.orderSelfNum ? items.orderSelfNum : ''}
                            </div>
                            <div className={styles.list_style} style={{ borderBottom: 'none' }}>
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

                                <span className={styles.item_info_header_text}>
                                    {isNotBlank(items) && isNotBlank(items.secondCategoryName)
                                        ? items.secondCategoryName
                                        : ''}
                                </span>
                                <span className={styles.item_info_header_name}>
                                    {isNotBlank(items) && isNotBlank(items.deptName)
                                        ? items.deptName
                                        : ''}
                                </span>
                            </div>
                            <div className={styles.item_info_header}>
                                <span
                                    className={styles.item_info_header_time}
                                    style={{ paddingLeft: '0', marginLeft: '0' }}
                                >
                                    预计进仓:{' '}
                                    {items.planBinTime
                                        ? monment(items.planBinTime).format('YYYY/MM/DD')
                                        : ''}
                                </span>
                                <span className={styles.item_info_header_time}>
                                    工厂交期：
                                    {monment(items.dueDate).format('YYYY/MM/DD')}
                                </span>
                            </div>
                            <div className={styles.item_info_header_pl}>
                                评论：{' '}
                                {isNotBlank(items) && isNotBlank(items.updateInfo)
                                    ? items.updateInfo
                                    : '无回复'}
                            </div>
                        </div>
                    );
                })
            ) : (
                <Empty />
            )}
        </List>
    );
};
const MyListDone = props => {
    const { renderListData, presentTab } = props;
    const onClickItem = id => {
        router.push(`/wx/dispose?id=${id}&presentTab=${presentTab}`);
    };
    const wholong = updateDate => {
        return monment(updateDate, 'YYYYMMDD').fromNow();
    };
    return (
        <List className={styles.my_list} key={renderListData && renderListData.id}>
            {renderListData && renderListData.length > 0 ? (
                renderListData.map(items => {
                    return (
                        <div
                            onClick={() => {
                                onClickItem(items.id);
                            }}
                            className={styles.item}
                            style={{ marginTop: '8px', paddingBottom: '10px' }}
                            // className={styles.warp_content}
                            key={items.id}
                        >
                            <div className={styles.orderSelfNum_style}>
                                {items.orderSelfNum ? items.orderSelfNum : ''}
                            </div>
                            <div className={styles.list_style} style={{ borderBottom: 'none' }}>
                                <span className={styles.item_info_header_text}>
                                    {isNotBlank(items) && isNotBlank(items.secondCategoryName)
                                        ? items.secondCategoryName
                                        : ''}
                                </span>
                                <span className={styles.item_info_header_name}>
                                    {isNotBlank(items) && isNotBlank(items.deptName)
                                        ? items.deptName
                                        : ''}
                                </span>
                            </div>
                            <div className={styles.item_info_header}>
                                <span
                                    className={styles.item_info_header_time}
                                    style={{ paddingLeft: '0', marginLeft: '0' }}
                                >
                                    预计完成: {monment(items.estiCompTime).format('YYYY/MM/DD')}
                                </span>
                                <span className={styles.item_info_header_time}>
                                    实际完成：
                                    {monment(items.finishTime).format('YYYY/MM/DD')}
                                </span>
                            </div>
                            {/* <div className={styles.item_info_header}>
                                评论：{' '}
                                {isNotBlank(items) &&
                                    isNotBlank(items.updateInfo)
                                    ? items.updateInfo
                                    : '无回复'}
                                <a style={{ marginLeft: '5px' }} onClick={e =>
                                    onDisposeClick(e, items)
                                }>>>5</a>
                            </div> */}
                        </div>
                    );
                })
            ) : (
                <Empty />
            )}
        </List>
    );
};

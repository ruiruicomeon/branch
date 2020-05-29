import React, { PureComponent } from 'react';
import IndexWeUi from './IndexWeUi.js';
import MyBacklogList from "./MyBacklog"
import QueryOrderList from "./QueryOrderList"
import { TabBar, ListView } from 'antd-mobile';
import { isNotBlank } from '@/utils/utils';
const file = require('../../assets/file.png');
const person = require('../../assets/person.png');
const search_index = require('../../assets/search_index.png');
const file_live = require('../../assets/file_live_new.png');
const person_live = require('../../assets/person_live_new.png');
const search_live = require('../../assets/search_live_new.png');
import router from "umi/router";
class AppWeUi extends PureComponent {
    constructor(props) {
        super(props);
    }
    state = {
        selectedTab: 'redTab',
        hidden: false,
    };
    componentDidMount() {
        const { selectedTab } = this.state
        const { location } = this.props
        this.setState({ selectedTab: isNotBlank(location.query.presentTab) ? location.query.presentTab : 'redTab' })
        
    }

    renderContent(pageText) {
        return (
            <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
                <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            hidden: !this.state.hidden,
                        });
                    }}
                >
                    Click to show/hide tab-bar
                </a>
            </div>
        );
    }

    render() {
        const { location } = this.props
        return (
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="white"
                    tabBarPosition="bottom"
                    hidden={this.state.hidden}
                    prerenderingSiblingsNumber={0}
                >
                    <TabBar.Item
                        icon={
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${file_live}) center center /  21px 21px no-repeat`
                            }}
                            />
                        }
                        selectedIcon={
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${file}) center center /  21px 21px no-repeat`
                            }}
                            />
                        }
                        title="异常预警"
                        key="Koubei"
                        badge={''}
                        selected={this.state.selectedTab === 'redTab'}
                        onPress={() => {
                            router.push('/wx/app?presentTab=redTab')
                            this.setState({
                                selectedTab: 'redTab',
                            });
                        }}
                        data-seed="logId1"
                    >
                        <IndexWeUi location={location} presentTab={isNotBlank(location.query.presentTab) ? location.query.presentTab : 'redTab' } />
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${person_live}) center center /  21px 21px no-repeat`
                            }}
                            />
                        }
                        selectedIcon={
                            <div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${person}) center center /  21px 21px no-repeat`
                            }}
                            />
                        }
                        title="我的待办"
                        key="Friend"
                        dot
                        selected={this.state.selectedTab === 'greenTab'}
                        onPress={() => {
                            router.push('/wx/app?presentTab=greenTab')
                            this.setState({
                                selectedTab: 'greenTab',
                            });
                        }}
                    >
                        <MyBacklogList location={location} presentTab={isNotBlank(location.query.presentTab) ? location.query.presentTab : 'redTab' } /> 
                    </TabBar.Item>
                    <TabBar.Item
                        icon={{ uri: search_live }}
                        selectedIcon={{ uri: search_index }}
                        title="订单查询"
                        key="my"
                        selected={this.state.selectedTab === 'yellowTab'}
                        onPress={() => {
                            router.push('/wx/app?presentTab=yellowTab')
                            this.setState({
                                selectedTab: 'yellowTab',
                            });
                        }}
                    >
                        <QueryOrderList location={location} presentTab={isNotBlank(location.query.presentTab) ? location.query.presentTab : 'redTab' } /> 
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}

export default AppWeUi;


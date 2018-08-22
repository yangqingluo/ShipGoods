import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBottom from '../components/CustomTapBottom';
import OrderListVC from './Order/OrderListVC';
import HomeListGoodsVC from './Home/HomeGoodsVC';

const tabTitles = ['首页', '订单', '发布', '消息', '我的'];
//默认图标
const tabIcon = [
    require('../images/tabGoods-outline.png'),
    require('../images/tabOrders-outline.png'),
    require('../images/tabAdd.png'),
    require('../images/tabMessage-outline.png'),
    require('../images/tabMyInfo-outline.png'),
];
//选中图标
const tabSelectedIcon = [
    require('../images/tabGoods.png'),
    require('../images/tabOrders.png'),
    require('../images/tabAdd.png'),
    require('../images/tabMessage.png'),
    require('../images/tabMyInfo.png'),
];

export default class CustomTabVC extends Component {
    static navigationOptions = {
        headerTitle: '自定义TabBarVC',
    };

    componentDidMount() {
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <ScrollableTabView
                ref={o => this.refTab = o}
                renderTabBar={() =>
                    <TabBottom tabNames={tabTitles}
                               tabItemFlex={1}
                               tabIconNames={tabIcon}
                               selectedTabIconNames={tabSelectedIcon}
                    />}
                style={{flex: 1, backgroundColor: "#fff"}}
                tabBarPosition='bottom'
                tabBarActiveTextColor={appData.appBlueColor}
                //onChangeTab={this.onChangeTabs}>
            >
                <HomeListGoodsVC ref={o => this.subListGoodsVC = o}/>
                <OrderListVC ref={o => this.subOrderingVC = o} order_state={"0"} navigation={this.props.navigation}/>
                <OrderListVC ref={o => this.subOrderedVC = o} order_state={"1"} navigation={this.props.navigation}/>
                <OrderListVC ref={o => this.subOrderedVC = o} order_state={"1"} navigation={this.props.navigation}/>
                <OrderListVC ref={o => this.subOrderedVC = o} order_state={"1"} navigation={this.props.navigation}/>
            </ScrollableTabView>
        );
    }
}
const styles = StyleSheet.create({

});
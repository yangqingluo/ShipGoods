import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabTop from '../components/TabTop';
import OrderListVC from './Order/OrderListVC';

export default class OrderVC extends Component {
    static navigationOptions = {
        headerTitle: '订单',
        tabBarLabel: '订单',
    };
    render() {
        let tabTitles = ['执行中', '历史订单'];
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    renderTabBar={() =>
                        <TabTop tabNames={tabTitles}
                            //FIXME:tabIconNames={tabIcon}
                            //FIXME:selectedTabIconNames={tabSelectedIcon}
                        />}
                    style={{flex: 1, backgroundColor: 'white'}}
                    tabBarPosition='top'
                    tabBarActiveTextColor={appData.appBlueColor}
                    //onChangeTab={this.onChangeTabs}>
                >
                    <OrderListVC ref={o => this.subOrderingVC = o} order_state={"0"}/>
                    <OrderListVC ref={o => this.subOrderedVC = o} order_state={"1"}/>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity, Image
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBottom from '../components/CustomTapBottom';

import HomeVC from './HomeVC'
import OrderVC from './OrderVC';
import ReleaseVC from './ReleaseVC';
import MessageVC from './MessageVC';
import MineVC from './MineVC';
import {StackNavigator} from "react-navigation";

const HomeNavigator = StackNavigator({
        HomeVC: {screen: HomeVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: 18, alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const OrderNavigator = StackNavigator({
        OrderVC: {screen: OrderVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: 18, alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const ReleaseNavigator = StackNavigator({
        ReleaseVC: {
            screen: ReleaseVC,
        },
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: 18, alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        initialRouteParams: {headerTitle: "发布"}
    }
);

const MessageNavigator = StackNavigator({
        MessageVC: {screen: MessageVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: 18, alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const MineNavigator = StackNavigator({
        MineVC: {screen: MineVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: 18, alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

export default class CustomTabVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    componentDidMount() {
        global.appMainTab = this;
    }

    onPressTabItemForIndex(i) {
        if (i === 2) {
            if (isAuthed()) {
                this.props.navigation.navigate("Release",
                    {headerTitle: "发布"});
            }
            else {
                PublicAlert('未认证不可发布，去认证？','',
                    [{text:"取消"},
                        {text:"确定", onPress:backAndGoToAuth}]
                );
            }
        }
        else {
            this.refTab.goToPage(i);
        }
    }

    render() {
        const tabTitles = [isShipOwner() ? '物流圈' : '空船', '订单', '发布', '消息', '我的'];
        const tabIcon = [
            require('../images/tabbar_icon_home.png'),
            require('../images/tabbar_icon_business.png'),
            require('../images/tabAdd.png'),
            require('../images/tabbar_icon_message.png'),
            require('../images/tabbar_icon_mine.png'),
        ];
        const { navigate } = this.props.navigation;
        return (
            <ScrollableTabView
                ref={o => this.refTab = o}
                locked={true}
                scrollWithoutAnimation={true}
                renderTabBar={() =>
                    <TabBottom tabNames={tabTitles}
                               tabItemFlex={1}
                               tabIconNames={tabIcon}
                    />}
                style={{flex: 1, backgroundColor: "#fff"}}
                tabBarPosition='bottom'
                tabBarActiveTextColor={appData.appBlueColor}
                //onChangeTab={this.onChangeTabs}>
            >
                <HomeNavigator />
                <OrderNavigator/>
                <ReleaseNavigator/>
                <MessageNavigator/>
                <MineNavigator />
            </ScrollableTabView>
        );
    }
}
const styles = StyleSheet.create({

});
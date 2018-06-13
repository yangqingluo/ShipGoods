import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import {TabBarBottom, TabNavigator} from 'react-navigation';
import TabBarItem from '../components/TabBarItem'

import HomeVC from './HomeVC'
import OrderVC from './OrderVC';
import ReleaseVC from './ReleaseVC';
import MessageVC from './MessageVC';
import MineVC from './MineVC';

const MainTabNavigator = TabNavigator(
    {
        HomeVC:{screen:HomeVC},
        OrderVC:{screen:OrderVC},
        ReleaseVC:{screen:ReleaseVC},
        MessageVC:{screen:MessageVC},
        MineVC:{screen:MineVC},
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon:({focused, tintColor}) => {
                const { routeName } = navigation.state;
                    let iconPath;
                    let isRelease = false;
                    if (routeName === 'HomeVC') {
                        iconPath = require("../images/tabbar_icon_home.png");
                    } else if (routeName === 'OrderVC') {
                        iconPath = require("../images/tabbar_icon_business.png");
                    } else if (routeName === 'ReleaseVC') {
                        iconPath = require("../images/tabPublish.png");
                        isRelease = true;
                    }
                    else if (routeName === 'MessageVC') {
                        iconPath = require("../images/tabbar_icon_message.png");
                    }
                    else if (routeName === 'MineVC') {
                        iconPath = require("../images/tabbar_icon_mine.png");
                    }
                return <TabBarItem
                    tintColor={isRelease ? appData.appBlueColor : tintColor}
                    focused={focused}
                    normalImage={iconPath}
                    isRelease={isRelease}
                />
            },
            // tabBarIcon: ({ focused, tintColor }) => {
            //     const { routeName } = navigation.state;
            //     let iconPath;
            //     let radius = 25;
            //     if (routeName === 'HomeVC') {
            //         iconPath = require("../images/tabGoods-outline.png");
            //     } else if (routeName === 'OrderVC') {
            //         iconPath = focused ? require("../images/tabOrders.png") : require("../images/tabOrders-outline.png");
            //     } else if (routeName === 'ReleaseVC') {
            //         iconPath = require("../images/tabPublish.png");
            //         radius = Platform.OS === 'ios' ? 60 : 40;
            //     }
            //     else if (routeName === 'MessageVC') {
            //         iconPath = focused ? require("../images/tabMessage.png") : require("../images/tabMessage-outline.png");
            //     }
            //     else if (routeName === 'MineVC') {
            //         iconPath = focused ? require("../images/tabMyInfo.png") : require("../images/tabMyInfo-outline.png");
            //     }
            //
            //     // You can return any component that you like here! We usually use an
            //     // logo component from react-native-vector-icons
            //     return (routeName === 'ReleaseVC') ?
            //         <Image source={iconPath} style={{
            //             position: 'absolute',
            //             overflow: 'visible',
            //             bottom: Platform.OS === 'ios' ? 5 : -3,
            //             width: radius,
            //             height:radius,
            //             }}>
            //         </Image>
            //         :
            //         <Image source={iconPath} style={{
            //             width: radius,
            //             height:radius
            //         }}>
            //         </Image>;
            // },
        }),
        // initialRouteName: 'ReleaseVC',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        lazy: true,
        tabBarOptions: {
            activeTintColor: appData.appBlueColor,
            inactiveTintColor: '#6A6A6A',
            labelStyle: {
                marginTop: 0,
                fontSize: 10, // 文字大小
                fontWeight: '700',
            },
            //tabStyle的父容器
            style: {
                //backgroundColor: '#0ff',
                height: 50,
                //position: 'absolute',
                //overflow: 'visible',
            },
            //tabImage的父容器
            tabStyle: {
                //marginTop: 30,
                height: 50,
                //backgroundColor: '#ff0',

                //position: 'relative',
                //overflow: 'visible',
            },
            //TabBar下面显示一条线//安卓
            indicatorStyle : {
                height: 0,
            },
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
);

export default class MainTab extends MainTabNavigator {
    componentDidMount() {
        global.appMainTab = this;
    }
}
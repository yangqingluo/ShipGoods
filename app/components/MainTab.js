import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';

import HomeVC from '../pages/HomeVC'
import BusinessVC from '../pages/BusinessVC';
import ReleaseVC from '../pages/ReleaseVC';
import MessageVC from '../pages/MessageVC';
import MineVC from '../pages/MineVC';

// 通过TabNavigator做路由映射
const MainScreenNavigator = TabNavigator(
    {
        HomeVC:{screen:HomeVC},
        BusinessVC:{screen:BusinessVC},
        ReleaseVC:{screen:ReleaseVC},
        MessageVC:{screen:MessageVC},
        MineVC:{screen:MineVC},
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconPath;
                if (routeName === 'HomeVC') {
                    iconPath = focused ? require("../images/tabGoods.png") : require("../images/tabGoods-outline.png");
                } else if (routeName === 'BusinessVC') {
                    iconPath = focused ? require("../images/tabOrders.png") : require("../images/tabOrders-outline.png");
                } else if (routeName === 'ReleaseVC') {
                    iconPath = require("../images/tabPublish.png");
                }
                else if (routeName === 'MessageVC') {
                    iconPath = focused ? require("../images/tabMessage.png") : require("../images/tabMessage-outline.png");
                }
                else if (routeName === 'MineVC') {
                    iconPath = focused ? require("../images/tabMyInfo.png") : require("../images/tabMyInfo-outline.png");
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Image source={iconPath} style={{width: 25, height:25}}></Image>;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        lazy: true,
        tabBarOptions: {
            activeTintColor: '#2D9BFD',
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

export default class MainTab extends Component {
    render() {
        return (
            <MainScreenNavigator />
        );
    }
}
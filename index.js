import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';

import HomeVC from './app/pages/HomeVC'
import BusinessVC from './app/pages/BusinessVC';
import ReleaseVC from './app/pages/ReleaseVC';
import MessageVC from './app/pages/MessageVC';
import MineVC from './app/pages/MineVC';
import DetailVC from './app/pages/DetailVC';

import LoginVC from './app/pages/LoginVC';

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
                    iconPath = focused ? require("./app/images/tabGoods.png") : require("./app/images/tabGoods-outline.png");
                } else if (routeName === 'BusinessVC') {
                    iconPath = focused ? require("./app/images/tabOrders.png") : require("./app/images/tabOrders-outline.png");
                } else if (routeName === 'ReleaseVC') {
                    iconPath = require("./app/images/tabPublish.png");
                }
                else if (routeName === 'MessageVC') {
                    iconPath = focused ? require("./app/images/tabMessage.png") : require("./app/images/tabMessage-outline.png");
                }
                else if (routeName === 'MineVC') {
                    iconPath = focused ? require("./app/images/tabMyInfo.png") : require("./app/images/tabMyInfo-outline.png");
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

//引入要用到的跳转页面
const MyNavigator = StackNavigator({
    Login: {screen: LoginVC},
    Main:{screen:MainScreenNavigator},
    DetailVC:{screen:DetailVC},
});

AppRegistry.registerComponent('ShipGoods', () => MyNavigator);

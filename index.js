// import { AppRegistry } from 'react-native';
// import App from './App';
//
// AppRegistry.registerComponent('ShipGoods', () => App);


import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';
import CirclePage from './pages/CirclePage'

import FindVC from './app/pages/FindVC';
import ReleaseVC from './app/pages/ReleaseVC';
import NewsVC from './app/pages/NewsVC';
import MineVC from './app/pages/MineVC';
import DetailVC from './app/pages/DetailVC';

import LoginVC from './app/pages/Login';

// 通过TabNavigator做路由映射
const MainScreentNavigator = TabNavigator(
    {
        CirclePage:{screen:CirclePage},
        FindVC:{screen:FindVC},
        ReleaseVC:{screen:ReleaseVC},
        NewsVC:{screen:NewsVC},
        MineVC:{screen:MineVC},
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconPath;
                if (routeName === 'CirclePage') {
                    iconPath = focused ? require("./app/images/tabGoods.png") : require("./app/images/tabGoods-outline.png");
                } else if (routeName === 'GoodsBillPage') {
                    iconPath = focused ? require("./app/images/tabOrders.png") : require("./app/images/tabOrders-outline.png");
                } else if (routeName === 'ReleaseVC') {
                    iconPath = require("./app/images/tabPublish.png");
                }
                else if (routeName === 'GoodsMessagePage') {
                    iconPath = focused ? require("./app/images/tabMessage.png") : require("./app/images/tabMessage-outline.png");
                }
                else if (routeName === 'GoodsMyInfoPage') {
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
const MyNavigatior = StackNavigator({
    Login: {screen: LoginVC},
    Main:{screen:MainScreentNavigator},
    DetailVC:{screen:DetailVC},
});

AppRegistry.registerComponent('ShipGoods', () => MyNavigatior);

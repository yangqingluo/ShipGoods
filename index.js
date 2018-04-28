import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';

import './app/util/Global'

import WaitVC from './app/pages/WaitVC'
import MainTab from './app/pages/MainTab'
import DetailVC from './app/pages/DetailVC';
import LoginVC from './app/pages/LoginVC';
import Register from './app/pages/Register';
import AddAuth from './app/pages/AddAuth';
import AddShip from './app/pages/AddShip';
import SelectEmptyTimeVC from './app/pages/SelectEmptyTimeVC';
import CustomSelect from './app/components/CustomSelect';
import CustomSectionSelect from './app/components/CustomSectionSelect';

const MyNavigator = StackNavigator({
        Wait: {screen: WaitVC},
        Login: {screen: LoginVC},
        Register: {screen: Register},
        Main:{screen: MainTab},
        DetailVC:{screen:DetailVC},
        AddAuth:{screen: AddAuth},
        AddShip:{screen: AddShip},
        CustomSelect:{screen: CustomSelect},
        CustomSectionSelect:{screen: CustomSectionSelect},
        SelectEmptyTimeVC:{screen: SelectEmptyTimeVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: '#000', fontSize: 16, alignSelf:'center', justifyContent:'center'},
            // headerBackTitleStyle: { color: '#000', fontSize: 12},
            headerTintColor:'#222',
            //gesturesEnabled: true,//是否支持滑动返回收拾，iOS默认支持，安卓默认关闭
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        onTransitionStart: (Start) => { console.log('导航栏切换开始'); },  // 回调
        onTransitionEnd: () => { console.log('导航栏切换结束'); }  // 回调
    }
    );

AppRegistry.registerComponent('ShipGoods', () => MyNavigator);

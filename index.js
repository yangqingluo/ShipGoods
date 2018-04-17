import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';

import './app/util/Global'

import WaitVC from './app/pages/WaitVC'
import MainTab from './app/pages/MainTab'
import DetailVC from './app/pages/DetailVC';
import LoginVC from './app/pages/LoginVC';
import Register from './app/pages/Register';


//引入要用到的跳转页面
const MyNavigator = StackNavigator({
    Wait: {screen: WaitVC},
    Login: {screen: LoginVC},
    Register: {screen: Register},
    Main:{screen: MainTab},
    DetailVC:{screen:DetailVC},
});

AppRegistry.registerComponent('ShipGoods', () => MyNavigator);

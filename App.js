/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Register from './app/pages/Register';
import LoginVC from './app/pages/LoginVC';
import MainTab from './pages/MainTab';
import { StackNavigator } from 'react-navigation';

const HomePage = StackNavigator({
  Login: {
      screen: LoginVC,
      navigationOptions: {
          headerTitle: '登录',
      }
  },
  Register: {
    screen: Register,
  },
  MainTab: {
    screen: MainTab,
  },

},
    // {
    // // 首页先设置成注册页
    // initialRouteName: 'LoginVC',
    // navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
    //   headerStyle: { elevation: 0, shadowOpacity: 0, height: 44, backgroundColor: "#FFFFFF" },
    //   headerTitleStyle: { color: '#000', fontSize: 16 }, //alignSelf:'center'  文字居中
    //   headerBackTitleStyle: { color: '#fff', fontSize: 12 },
    //   // headerTintColor:{},
    //   //gesturesEnabled: true,//是否支持滑动返回收拾，iOS默认支持，安卓默认关闭
    // },
    // mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    // headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    // onTransitionStart: (Start) => { console.log('导航栏切换开始'); },  // 回调
    // onTransitionEnd: () => { console.log('导航栏切换结束'); }  // 回调
    // }
);

// type Props = {};
export default class App extends Component {
  render() {
    return (
      <HomePage></HomePage>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

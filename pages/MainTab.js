/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    ToastAndroid,
    Button,
    Alert,
    Picker,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';

import { StackNavigator, TabNavigator, DrawerNavigator, TabBarBottom} from 'react-navigation';
import Swiper from 'react-native-swiper'

//物流圈/订单/发布/信息/我的
import CirclePage from './CirclePage'
import GoodsBillPage from './GoodsBillPage'
import GoodsPublishPage from './GoodsPublishPage'
import GoodsMessagePage from './GoodsMessagePage'
import GoodsMyInfoPage from './GoodsMyInfoPage'

//顶部tab样式分离。
import TabTop from './TabTop';

const HomePage = TabNavigator({
    //物流圈
    CirclePage: { 
        screen: CirclePage,
        navigationOptions: {
            headerTitle: '标题',
            tabBarLabel: '物流圈',
        }
    },
    //订单
    GoodsBillPage: {
        screen: GoodsBillPage,
        navigationOptions: {
            tabBarLabel: '订单',
        }
    },

    //发布
    GoodsPublishPage: {
        screen: GoodsPublishPage,
        
    },
    //消息
    GoodsMessagePage: {
        screen: GoodsMessagePage,
        navigationOptions: {
            tabBarLabel: '消息',
        }
    },
    //我的
    GoodsMyInfoPage: {
        screen: GoodsMyInfoPage,
        navigationOptions: {
            tabBarLabel: '我的',
        }
    },
    
}, 
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconPath;
                if (routeName === 'CirclePage') {
                    iconPath = focused ? require("../app/images/tabGoods.png") : require("../app/images/tabGoods-outline.png");
                } else if (routeName === 'GoodsBillPage') {
                    iconPath = focused ? require("../app/images/tabOrders.png") : require("../app/images/tabOrders-outline.png");
                } else if (routeName === 'GoodsPublishPage') {
                    iconPath = null;
                }
                else if (routeName === 'GoodsMessagePage') {
                    iconPath = focused ? require("../app/images/tabMessage.png") : require("../app/images/tabMessage-outline.png");
                }
                else if (routeName === 'GoodsMyInfoPage') {
                    iconPath = focused ? require("../app/images/tabMyInfo.png") : require("../app/images/tabMyInfo-outline.png");
                }


                {/* <Image
                    source={require('../img/sort.png')}
                    style={{ width: 18, height: 18, marginLeft: 10, marginRight: 10, }}
                /> */}
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
            //这个是tab Image的父容器
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
)

// type Props = {};
export default class MainTab extends Component {
  render() {
    return (
      <HomePage></HomePage>
    );
  }
}

const styles = StyleSheet.create({
    test: {
        borderWidth: 1,
        borderColor: '#999',
        //borderRadius: 20,

        alignSelf: 'center',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',

        marginTop: 60,
        marginBottom: 20,

        width: 100,
        height: 100,

        color: '#3EA3FC',
        fontSize: 15,
        opacity: .6,

        backgroundColor: "#60BBFE",

    },
    container: {
        //width: 100,
        //height: 100,
        //alignSelf: 'flex-start',
        //alignItems: 'flex-start',
        //justifyContent: 'flex-start',
        //backgroundColor: '#000'
        //borderWidth: 1,
        flexDirection: 'column',
        flex: 1,

        padding: 10,
        //borderWidth: 1,
        backgroundColor: '#fff',
    },
    swiperWrap: {
        //marginTop: 0,
        //height: 120,
        //backgroundColor: '#0ff',
        //flex: 0,
    },
    swiperView: {
        //height: 150, 
        //margin: 10,
        //backgroundColor: '#0ff',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swiperImg: {
        height: 120,
        resizeMode: 'contain',
        margin: 10,
    },
    tabView: {
        marginTop: -240,
        //flex: 0,
        //backgroundColor: '#00f',
    }
})

import React, { Component } from 'react';

import {
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    Button,
    Alert,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
} from 'react-native'

import Swiper from 'react-native-swiper';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import InfoCard from '../components/InfoCard';
import TabTop from '../components/TabTop';
import HomeListGoodsVC from './Home/HomeGoodsVC';


//顶部右边的图标，这段代码不可复用，但是可以复制修改使用。
class RightHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };
    onSortBtnPress = () => {
        const { navigate } = this.props.navigation;
        navigate('DetailVC', { title: '详情',des:'我是返回点击我' });
    };
    onScreenBtnPress = () => {
        Alert.alert("筛选");

    };
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={this.onSortBtnPress}
                >
                    <Image
                        source={require('../images/sort.png')}
                        style={{ width: 18, height: 18, marginLeft: 10, marginRight: 10,}}
                    />
                </TouchableOpacity>
                <View style={{ width: 0, height: 15, borderWidth: 1, opacity: .1 }} />
                <TouchableOpacity
                    onPress={this.onScreenBtnPress}
                >
                    <Image
                        source={require('../images/screen.png')}
                        style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
        headerRight: <RightHeader navigation={navigation} />,
        // headerTitle: <Text>物流圈</Text>,
        // title: 'Home',
        tabBarLabel: isShipOwner() ? '物流圈' : '空船',
        // tabBarIcon:<Image source={require("../app/images/tabGoods.png")} style={{width: 25, height:25}}></Image>,
    });

    constructor(props) {
        super(props)
        this.state = {
            //phoneNum: "",

        }
    }

    onXxxBtnPress = () => {
        Alert.alert('xx按钮被按下！');
    }

    render() {
        let tabTitles = isShipOwner() ? ['等待报价', '已报价'] : ['空船', '我的货'];
        return (
            <View style={styles.container}>
                {/* <View style={styles.swiperWrap}> */}
                    <Swiper
                    style={styles.swiperWrap}
                    showsButtons={false}
                    autoplay={true}
                    //隐藏小圆点
                    dot={<View />}
                    activeDot={<View />}
                    >
                        <View style={styles.swiperView}>
                            <Image
                                source={require('../images/swiper.png')}
                                style={styles.swiperImg}
                            />
                        </View>
                        <View style={styles.swiperView}>
                            <Image
                                source={require('../images/swiper.png')}
                                style={styles.swiperImg}
                            />
                        </View>
                        <View style={styles.swiperView}>
                            <Image
                                source={require('../images/swiper.png')}
                                style={styles.swiperImg}
                            />
                        </View>
                            
                    </Swiper>

                {/* </View> */}

                <ScrollableTabView 
                    renderTabBar={() =>
                        <TabTop tabNames={tabTitles}
                            //FIXME:tabIconNames={tabIcon}
                            //FIXME:selectedTabIconNames={tabSelectedIcon}
                            />}
                    
                    style={styles.tabView}
                    tabBarPosition='top'
                    tabBarActiveTextColor={appData.appBlueColor}
                    //onChangeTab={this.onChangeTabs}>
                >
                    <HomeListGoodsVC />
                    <View>
                        <ScrollView>
                            <InfoCard Navg={this.props.navigation} />

                            <InfoCard Navg={this.props.navigation} />

                            <InfoCard Navg={this.props.navigation} />

                            <InfoCard Navg={this.props.navigation} />

                            <InfoCard Navg={this.props.navigation} />
                        </ScrollView>
                    </View>
                </ScrollableTabView>


            </View >
        )
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



import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
} from 'react-native'

import Swiper from 'react-native-swiper';
import ScrollableTabView,{DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabTop from '../components/TabTop';
import HomeListGoodsVC from './Home/HomeGoodsVC';
import HomeListOrderVC from './Home/HomeOrderVC';
import HomeListOfferVC from './Home/HomeOfferVC';
import SideMenu from '../components/SideMenu';
import Menu from './Home/HomeMenu';
import px2dp from "../util";


//顶部右边的图标，这段代码不可复用，但是可以复制修改使用。
class RightHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };
    onSortBtnPress = () => {
        appHomeVC.onSortBtnAction();
    };
    onScreenBtnPress = () => {
        appHomeVC.onFilterBtnAction();
    };

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={this.onSortBtnPress} style={{minWidth: px2dp(51)}}>
                    <Image source={require('../images/navbar_icon_paixu.png')}
                        style={{ width: px2dp(17), height: px2dp(21), marginLeft: px2dp(20), marginRight: px2dp(10),}}
                    />
                </TouchableOpacity>
                <View style={{ width: 0, height: 15, borderWidth: 1, opacity: .1 }} />
                <TouchableOpacity onPress={this.onScreenBtnPress} style={{minWidth: px2dp(51)}}>
                    <Image source={require('../images/navbar_icon_shai.png')}
                        style={{ width: px2dp(20), height: px2dp(16), marginLeft: px2dp(13), marginRight: px2dp(18), }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
        headerRight: <RightHeader navigation={navigation}/>,
        tabBarLabel: isShipOwner() ? '物流圈' : '空船',
    });

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            selectedItem: '',
        };
    }

    componentDidMount() {
        global.appHomeVC = this;
    }

    onSortBtnAction() {
        PublicAlert("精彩功能，敬请期待");
    }

    onFilterBtnAction() {
        // this.props.navigation.navigate('HomeFilter', { title: '筛选条件'});
        this.toggle();
    }

    toggle() {
        if (!this.state.isOpen) {
            this.rightMenu.refreshDatasource();
        }
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }

    onMenuItemSelected = item => {
        this.setState({
            isOpen: false,
            selectedItem: item,
        });

        if (item === 'OK') {
            appHomeCondition.empty_port = this.rightMenu.state.empty_port;
            appHomeCondition.empty_time = this.rightMenu.state.empty_time;
            appHomeCondition.empty_delay = this.rightMenu.state.empty_delay;
            appHomeCondition.goods = this.rightMenu.state.goods;
            appHomeCondition.area = this.rightMenu.state.area;
            appHomeCondition.min_ton = this.rightMenu.state.min_ton;
            appHomeCondition.max_ton = this.rightMenu.state.max_ton;

            appHomeCondition.loading_port = this.rightMenu.state.loading_port;
            appHomeCondition.unloading_port = this.rightMenu.state.unloading_port;
            appHomeCondition.loading_time = this.rightMenu.state.loading_time;
            appHomeCondition.loading_delay = this.rightMenu.state.loading_delay;

            if (isShipOwner()) {
                this.subListToOfferVC.requestData();
                if (typeof(this.subListOfferedVC) !== appUndefined) {
                    this.subListOfferedVC.requestData();
                }
            }
            else {
                this.subListGoodsVC.requestData();
            }
        }
    };

    render() {
        let tabTitles = isShipOwner() ? ['等待报价', '已报价'] : ['空船', '我的货'];
        const menu = <Menu ref={o => this.rightMenu = o} onItemSelected={this.onMenuItemSelected} navigation={this.props.navigation}/>;
        return (
            <SideMenu menu={menu}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={isOpen => this.updateMenuState(isOpen)}
                      menuPosition={'right'}>
                <View style={styles.container}>
                    <View style={styles.swiperWrap}>
                        <Swiper
                            style={styles.swiperWrap}
                            showsButtons={false}
                            autoplay={true}
                            showsPagination={false}
                            horizontal={true}
                        >
                            <View style={styles.swiperView}>
                                <Image source={require('../images/swiper.png')} style={styles.swiperImg}/>
                            </View>
                            <View style={styles.swiperView}>
                                <Image source={require('../images/swiper.png')} style={styles.swiperImg}/>
                            </View>
                            <View style={styles.swiperView}>
                                <Image source={require('../images/swiper.png')} style={styles.swiperImg}/>
                            </View>
                        </Swiper>
                    </View>
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
                        {isShipOwner() ?
                            <HomeListOfferVC ref={o => this.subListToOfferVC = o} is_offer={"0"}/>
                            :
                            <HomeListGoodsVC ref={o => this.subListGoodsVC = o}/>}
                        {isShipOwner() ?
                            <HomeListOfferVC ref={o => this.subListOfferedVC = o} is_offer={"1"}/>
                            :
                            <HomeListOrderVC ref={o => this.subListOrderVC = o} />}
                    </ScrollableTabView>
                </View >
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    swiperWrap: {
        height: 140,
    },
    swiperView: {
        padding: 10,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swiperImg: {
        resizeMode: 'contain',
        flex: 1,
    },
    tabView: {
        flex: 1,
    }
});



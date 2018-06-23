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
import ActionSheet from 'react-native-actionsheet';
import Swiper from 'react-native-swiper';
import ScrollableTabView,{DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabTop from '../components/TabTop';
import HomeListGoodsVC from './Home/HomeGoodsVC';
import HomeListOrderVC from './Home/HomeOrderVC';
import HomeListOfferVC from './Home/HomeOfferVC';
import SideMenu from '../components/SideMenu';
import Menu from './Home/HomeMenu';
import px2dp from "../util";



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

        this.orderTypes = isShipOwner() ?
            ["取消", "默认排序" , "装货时间正序", "装货时间倒序", "吨位正序", "吨位倒序", "结算时间正序", "结算时间倒序", "货主信用正序", "货主信用倒序"]
                :
            ["取消", "默认排序" , "空船时间正序", "空船时间倒序", "吨位正序", "吨位倒序", "船主信用正序", "船主信用倒序"];
    }

    componentDidMount() {
        global.appHomeVC = this;
    }

    onSelectOrderType(index) {
        if (index > 0) {
            if (index === 1) {
                appHomeCondition.emptyorder = null;
                appHomeCondition.tonnageorder = null;
                appHomeCondition.creditorder = null;

                appHomeCondition.loadorder = null;
                appHomeCondition.cleanorder = null;
            }
            else {
                if (isShipOwner()) {
                    switch (index){
                        case 2:
                            appHomeCondition.loadorder = "ASC";
                            break;

                        case 3:
                            appHomeCondition.loadorder = "DESC";
                            break;

                        case 4:
                            appHomeCondition.tonnageorder = "ASC";
                            break;

                        case 5:
                            appHomeCondition.tonnageorder = "DESC";
                            break;

                        case 6:
                            appHomeCondition.cleanorder = "ASC";
                            break;

                        case 7:
                            appHomeCondition.cleanorder = "DESC";
                            break;

                        case 8:
                            appHomeCondition.creditorder = "ASC";
                            break;

                        case 9:
                            appHomeCondition.creditorder = "DESC";
                            break;
                    }
                }
                else {
                    switch (index){
                        case 2:
                            appHomeCondition.emptyorder = "ASC";
                            break;

                        case 3:
                            appHomeCondition.emptyorder = "DESC";
                            break;

                        case 4:
                            appHomeCondition.tonnageorder = "ASC";
                            break;

                        case 5:
                            appHomeCondition.tonnageorder = "DESC";
                            break;

                        case 6:
                            appHomeCondition.creditorder = "ASC";
                            break;

                        case 7:
                            appHomeCondition.creditorder = "DESC";
                            break;
                    }
                }
            }
            this.refreshList();
        }
    }

    refreshList() {
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

    onSortBtnAction() {
        this.refOrderTypeSheet.show();
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

    reloadSubListOrderVC = () => {
        if (objectNotNull(this.subListOrderVC)) {
            this.subListOrderVC.state.dataList = [];
            this.subListOrderVC.requestData();
        }
    };

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
            appHomeCondition.ship_type = this.rightMenu.state.ship_type;
            appHomeCondition.area = this.rightMenu.state.area;
            appHomeCondition.min_ton = this.rightMenu.state.min_ton;
            appHomeCondition.max_ton = this.rightMenu.state.max_ton;

            appHomeCondition.loading_port = this.rightMenu.state.loading_port;
            appHomeCondition.unloading_port = this.rightMenu.state.unloading_port;
            appHomeCondition.loading_time = this.rightMenu.state.loading_time;
            appHomeCondition.loading_delay = this.rightMenu.state.loading_delay;

            this.refreshList();
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
                </View>
                <ActionSheet
                    ref={o => this.refOrderTypeSheet = o}
                    title={'请选择排序方式'}
                    options={this.orderTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectOrderType.bind(this)}
                />
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



import React, { Component } from 'react';

import {
    Animated,
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import ActionSheet from 'react-native-actionsheet';
import Swiper from 'react-native-swiper';
import ScrollableTabView,{DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabTop from '../components/HomeTabTop';
import HomeListGoodsVC from './Home/HomeGoodsVC';
import HomeListOrderVC from './Home/HomeOrderVC';
import HomeListOfferVC from './Home/HomeOfferVC';
import SideMenu from '../components/SideMenu';
import Menu from './Home/HomeMenu';
import FullScreenAd from '../components/FullScreenAd';
import IndicatorModal from "../components/IndicatorModal";

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
                <TouchableOpacity onPress={this.onSortBtnPress} style={{minWidth: 51}}>
                    <Image source={require('../images/navbar_icon_paixu.png')}
                        style={{ width: 17, height: 21, marginLeft: 20, marginRight: 10,}}
                    />
                </TouchableOpacity>
                <View style={{ width: 0, height: 15, borderWidth: 1, opacity: .1 }} />
                <TouchableOpacity onPress={this.onScreenBtnPress} style={{minWidth: 51}}>
                    <Image source={require('../images/navbar_icon_shai.png')}
                        style={{ width: 20, height: 16, marginLeft: 13, marginRight: 18, }}
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
        this.state = {
            isOpen: false,
            selectedItem: '',
            scrollHeight: new Animated.Value(0),
            isSort: false,
        };
    }

    componentDidMount() {
        global.appHomeVC = this;
        this.refAd.show({
            source: require("../images/ad.png"),
        });
    }

    refreshList() {
        if (isShipOwner()) {
            if (objectNotNull(this.subListToOfferVC)) {
                this.subListToOfferVC.scrollAndRequestData();
            }
            if (objectNotNull(this.subListOfferedVC)) {
                this.subListOfferedVC.scrollAndRequestData();
            }
        }
        else {
            if (objectNotNull(this.subListGoodsVC)) {
                this.subListGoodsVC.scrollAndRequestData();
            }
        }
    }

    hideSort() {
        this.setState({
            isSort: false,
        });
    }

    onSortBtnAction() {
        let {isSort} = this.state;
        this.setState({
            isSort: !isSort,
        });

        // if (isSort)  {
        //     appResetSort();
        //     this.refreshList();
        // }
    }

    onSortItemAction(index) {
        if (isShipOwner()) {
            switch (index){
                case 0:
                    appHomeCondition.loadorder = createNextSort(appHomeCondition.loadorder, true);
                    break;

                case 1:
                    appHomeCondition.tonnageorder = createNextSort(appHomeCondition.tonnageorder);
                    break;

                case 2:
                    appHomeCondition.cleanorder = createNextSort(appHomeCondition.cleanorder, true);
                    break;

                case 3:
                    appHomeCondition.creditorder = createNextSort(appHomeCondition.creditorder);
                    break;
            }
        }
        else {
            switch (index){
                case 0:
                    appHomeCondition.emptyorder = createNextSort(appHomeCondition.emptyorder, true);
                    break;

                case 1:
                    appHomeCondition.tonnageorder = createNextSort(appHomeCondition.tonnageorder);
                    break;

                case 2:
                    appHomeCondition.creditorder = createNextSort(appHomeCondition.creditorder);
                    break;
            }
        }
        this.forceUpdate();
        this.refreshList();
    }

    onFilterBtnAction() {
        let refMenu = appMainTab.refMenu;
        if (refMenu.state.visible) {
            appMainTab.refMenu.hide();
        }
        else {
            appMainTab.refMenu.show();
        }
    }

    reloadSubListOrderVC = (switchPage = false) => {
        if (objectNotNull(this.subListOrderVC)) {
            this.subListOrderVC.state.dataList = [];
            this.subListOrderVC.requestData();
        }
        if (switchPage && objectNotNull(this.refTab)) {
            this.refTab.goToPage(1);
        }
    };

    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }

    onMenuItemSelected(item) {
        appMainTab.refMenu.hide();
        this.setState({
            selectedItem: item,
        });

        let rightMenu = appMainTab.refMenu.rightMenu;
        if (item === 'OK') {
            appHomeCondition.empty_port = rightMenu.state.empty_port;
            appHomeCondition.empty_time = rightMenu.state.empty_time;
            appHomeCondition.empty_delay = rightMenu.state.empty_delay;
            appHomeCondition.goods = rightMenu.state.goods;
            appHomeCondition.ship_type = rightMenu.state.ship_type;
            appHomeCondition.area = rightMenu.state.area;
            appHomeCondition.min_ton = rightMenu.state.min_ton;
            appHomeCondition.max_ton = rightMenu.state.max_ton;

            appHomeCondition.loading_port = rightMenu.state.loading_port;
            appHomeCondition.unloading_port = rightMenu.state.unloading_port;
            appHomeCondition.loading_time = rightMenu.state.loading_time;
            appHomeCondition.loading_delay = rightMenu.state.loading_delay;

            this.refreshList();
        }
        else {
            appResetMenu();
            this.refreshList();
        }
    };

    onScroll(event) {
        let {contentSize, layoutMeasurement} = event.nativeEvent;
        if (contentSize.height > layoutMeasurement.height) {
            Animated.event(
                [{nativeEvent: {contentOffset: {y: this.state.scrollHeight}}}]
            )(event);
        }
    }

    onScrollBeginDrag(event) {
    }

    onScrollEndDrag(event) {
        let {contentSize, layoutMeasurement, contentOffset} = event.nativeEvent;
        Animated.timing(
            this.state.scrollHeight,
            {
                toValue: contentOffset.y > 0 ? AnimatedHeight + 1 : 0,
                duration: 10,
            },
        ).start();
    }

    onMomentumScrollEnd(event) {

    }

    onRefreshControl() {
        if (!isIOS()) {
            Animated.timing(
                this.state.scrollHeight,
                {
                    toValue: 0,
                    duration: 10,
                },
            ).start();
        }
    }

    onChangeTab(object) {
        let index = object.i;
        if (index !== 0 && this.state.isSort) {
            this.onSortBtnAction();
        }
    }

    render() {
        let t_y = this.state.scrollHeight.interpolate({
            inputRange: [-1, 0, AnimatedHeight, AnimatedHeight + 1],
            outputRange: [TopHeight, TopHeight, 0.8 * TopHeight, 0]
        });
        let tabTitles = isShipOwner() ? ['等待报价', '已报价'] : ['空船', '我的货'];
        let sorts = isShipOwner() ?
            [
                {title:'装货时间', order: appHomeCondition.loadorder},
                {title:'货量', order: appHomeCondition.tonnageorder},
                {title:'结算时间', order: appHomeCondition.cleanorder},
                {title:'货主信用', order: appHomeCondition.creditorder},
            ]
            :
            [
                {title:'空船时间', order: appHomeCondition.emptyorder},
                {title:'吨位', order: appHomeCondition.tonnageorder},
                {title:'船东信用', order: appHomeCondition.creditorder},
            ];
        return (
            <View style={styles.container}>
                <Animated.View style={{height: t_y}}>
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
                </Animated.View>
                <ScrollableTabView
                    ref={o => this.refTab = o}
                    renderTabBar={() =>
                        <TabTop tabNames={tabTitles} sorts={sorts} isSort={this.state.isSort}/>}
                    // style={styles.tabView}
                    tabBarPosition='top'
                    tabBarActiveTextColor={appData.appBlueColor}
                    onChangeTab = {this.onChangeTab.bind(this)}
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
                <FullScreenAd ref={o => this.refAd = o}/>
            </View>
        )
    }
}

const TopHeight = 140;
const AnimatedHeight = isIOS() ? 1 : Math.max(4 * TopHeight, screenHeight);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    swiperView: {
        padding: 10,
        height: TopHeight,
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



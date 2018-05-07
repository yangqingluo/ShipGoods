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
import HomeListOrderVC from './Home/HomeOrderVC';
import SideMenu from '../components/SideMenu'
import Menu from './Home/HomeMenu';


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
        headerRight: <RightHeader navigation={navigation}/>,
        tabBarLabel: isShipOwner() ? '物流圈' : '空船',
    });

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            selectedItem: 'About',
        };
    }

    componentDidMount() {
        // this.props.navigation.setParams({onSortBtnAction: null});
        // PublicAlert(JSON.stringify(this.props.navigation.state));
        global.appHomeVC = this;
    }

    onSortBtnAction() {
        PublicAlert('***');
    }

    onFilterBtnAction() {
        // this.props.navigation.navigate('HomeFilter', { title: '筛选条件'});
        this.toggle();
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }

    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item,
        });

    render() {
        let tabTitles = isShipOwner() ? ['等待报价', '已报价'] : ['空船', '我的货'];
        const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
        return (
            <SideMenu menu={menu}
                      isOpen={this.state.isOpen}
                      onChange={isOpen => this.updateMenuState(isOpen)}
                      menuPosition={'right'}>
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
                        {isShipOwner() ?
                            <View>
                                <ScrollView>
                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />
                                </ScrollView>
                            </View>
                            :
                            <HomeListGoodsVC />}
                        {isShipOwner() ?
                            <View>
                                <ScrollView>
                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />

                                    <InfoCard Navg={this.props.navigation} />
                                </ScrollView>
                            </View>
                            :
                            <HomeListOrderVC />}
                    </ScrollableTabView>
                </View >
            </SideMenu>
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

        // padding: 10,
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
        // backgroundColor: appData.appViewColor,
    }
})



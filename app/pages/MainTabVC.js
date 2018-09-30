import React, { Component } from 'react';
import {
    AppState,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';

import JPushModule from 'jpush-react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBottom from '../components/CustomTapBottom';
import CustomMenu from "../components/CustomMenu";
import HomeVC from './HomeVC'
import OrderVC from './OrderVC';
import ReleaseVC from './ReleaseVC';
import MessageVC from './MessageVC';
import MineVC from './MineVC';
import {StackNavigator} from "react-navigation";
import NetUtil from "../util/NetUtil";

let RedirectType = {
    Default: 0,
    ShipPostDetail: 1,//船东-我的发布-详情
    ShipOrderDetail: 2,//船东-订单-详情
    ShipRelease: 3,//船东-发布
    ShipAuth: 4,//船东-认证
    ShipPricedDetail: 5,//船东-已报价-详情
    ShipOrderHistoryDetail: 6,//船东-订单-历史订单-详情
    ShipFavorDetail: 7,//船东-我的收藏-详情
    GoodsGoodsDetailOfferList:8,//货主-我的货-详情-报价列表
    GoodsOrderingTransport:9,//货主-订单-执行中-货运详情
    GoodsRelease:10,//货主-发布
    GoodsAuth:11,//货主-认证
    GoodsOfferedDetail:12,//货主-已报价-详情
    GoodsOrdering:13,//货主-订单-执行中
};


const HomeNavigator = StackNavigator({
        HomeVC: {screen: HomeVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize:appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const OrderNavigator = StackNavigator({
        OrderVC: {screen: OrderVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize:appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const ReleaseNavigator = StackNavigator({
        ReleaseVC: {
            screen: ReleaseVC,
        },
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize:appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        initialRouteParams: {headerTitle: "发布"}
    }
);

const MessageNavigator = StackNavigator({
        MessageVC: {screen: MessageVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize:appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const MineNavigator = StackNavigator({
        MineVC: {screen: MineVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize:appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            headerTintColor:'#222',
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

export default class MainTabVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
    });

    constructor(props) {
        super(props);
        //设置一个标记，表示从后台进入前台的时候，处理其他逻辑
        this.flage = false
    }

    componentDidMount() {
        global.appMainTab = this;
        // AppState.addEventListener('change',this._handleAppStateChange);
        if (global.appIsFirst) {
            this.appRefreshUserInfo();
            global.appIsFirst = false;
        }

        global.setAlias(userData.username);
        if (!isIOS()) {
            // 通知 JPushModule 初始化完成，发送缓存事件。
            JPushModule.notifyJSDidLoad((resultCode) => {

            });
        }

        // 接收自定义消息事件
        JPushModule.addReceiveCustomMsgListener((message) => {
            // PublicAlert("ReceiveCustomMsgListener:", JSON.stringify(message));
        });

        // 接收推送事件
        JPushModule.addReceiveNotificationListener((message) => {
            // PublicAlert('ReceiveNotificationListener: ', JSON.stringify(message));
            this.doReceivedMessage(message, false);
        });

        // 点击推送事件,打开通知
        JPushModule.addReceiveOpenNotificationListener((message) => {
            // PublicAlert("ReceiveOpenNotificationListener: ", JSON.stringify(message));
            this.doReceivedMessage(message, true);
        });

        if (objectNotNull(appInitialProps) && objectNotNull(appInitialProps.extras)) {
            this.doReceivedMessage(appInitialProps, true);
            global.appInitialProps = null;
        }
    }

    componentWillUnmount() {
        this.removeReceivedJPush();
    }

    //移除监听消息通知
    removeReceivedJPush() {
        // AppState.removeEventListener('change', this._handleAppStateChange);

        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        JPushModule.removeReceiveOpenNotificationListener();
        // 清除所有通知
        JPushModule.clearAllNotifications();
        DeviceEventEmitter.removeAllListeners();
    }

    _handleAppStateChange = (nextAppState)=>{
        if (nextAppState!= null && nextAppState === 'active') {
            //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
            if (this.flage) {
                //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
                // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
                // 当第二次进入前台的时候 ，这里就是true ，就走进来了。
                // 测试通过
                // alert("从后台进入前台");
                // 这个地方进行网络请求等其他逻辑。
            }
            this.flage = false ;
        }else if(nextAppState != null && nextAppState === 'background'){
            this.flage = true;
        }
    };

    // setTag() {
    //     if (objectNotNull(this.state.tag)) {
    //         /*
    //         * 请注意这个接口要传一个数组过去，这里只是个简单的示范
    //         */
    //         JPushModule.setTags(["VIP", "NOTVIP"], () => {
    //             console.log("Set tag succeed");
    //         }, () => {
    //             console.log("Set tag failed");
    //         });
    //     }
    // }
    //
    // getAlias() {
    //     JPushModule.getAlias((alias) => {
    //         PublicAlert("Get alias succeed: " + JSON.stringify(alias));
    //     }, () => {
    //         PublicAlert("Get alias failed.");
    //     });
    // }

    doReceivedMessage(message, isRedirect = false) {
        let content = null;
        let {extras, aps, alertContent} = message;
        if (isIOS()) {
            if (objectNotNull(aps)) {
                content = aps.alert;
            }
        }
        else {
            content = alertContent;
            if (typeof(extras) === "string") {
                extras = JSON.parse(extras);
            }
        }
        let {uid, redirect_type, param_value} = extras;
        if (objectNotNull(uid) && uid === userData.uid && !stringIsEmpty(redirect_type)) {
            this.doAnalyzeMessage(content, redirect_type, param_value);

            if (objectNotNull(appMessageVC)) {
                appMessageVC.reloadSubMessageVC();
            }
        }
    }

    doAnalyzeMessage(content, redirect_type, param_value) {
        const {navigate} = this.props.navigation;
        switch (parseInt(redirect_type)) {
            case RedirectType.GoodsAuth:
            case RedirectType.ShipAuth:
                PublicAlert(content || "认证未通过", '',
                    [{text:"取消"},
                        {text:"去认证", onPress:backAndGoToAuth}]
                );
                break;

            case RedirectType.GoodsRelease:
            case RedirectType.ShipRelease:
                PublicAlert(content || "认证通过，可以发布了", '',
                    [{text:"取消"},
                        {text:"去发布", onPress:backAndGoToRelease}]
                );
                break;

            case RedirectType.ShipPostDetail:
                this.doPushToVCFunction(content, "MyPostDetail", param_value);
                break;


            case RedirectType.ShipOrderDetail:
                this.doPushToVCFunction(content, "OrderDetail", param_value);
                break;

            case RedirectType.ShipPricedDetail:
                this.doPushToVCFunction(content, "ShipPricedDetail", param_value);
                break;

            case RedirectType.ShipOrderHistoryDetail:
                this.doPushToVCFunction(content, "OrderDetail", param_value);
                break;

            case RedirectType.ShipFavorDetail:
                this.doPushToVCFunction(content, "ShipFavorDetail", param_value);
                break;

            case RedirectType.GoodsGoodsDetailOfferList:
                this.doPushToVCFunction(content, "GoodsGoodsDetailOfferList", param_value);
                break;

            case RedirectType.GoodsOrderingTransport: {
                doTabGoToOrder();
                if (objectNotNull(appOrderVC)) {
                    appOrderVC.reloadSubOrderingVC(true);
                }
                this.doPushToVCFunction(content, "GoodsOrderingTransport", param_value);
            }
                break;

            case RedirectType.GoodsOfferedDetail: {
                doTabGoToHome();
                if (objectNotNull(appHomeVC)) {
                    appHomeVC.reloadSubListOrderVC(true);
                }
                this.doPushToVCFunction(content, "GoodsOfferedDetail", param_value);
            }
                break;

            case RedirectType.GoodsOrdering: {
                doTabGoToOrder();
                if (objectNotNull(appOrderVC)) {
                    appOrderVC.reloadSubOrderingVC(true);
                }
                this.doPushToVCFunction(content, "OrderDetail", param_value);
            }
                break;

            default:
                break
        }
    }

    doPushToVCFunction(title, key, param_value) {
        if (objectNotNull(param_value)) {
            PublicAlert(title || "新的动态", '',
                [{text:"取消"},
                    {text:"去查看", onPress:()=>{
                            global.appPushData = param_value;
                            this.props.navigation.goBack(key);
                        }}]
            );
        }
    }

    async appRefreshUserInfo() {
        let data = {suid: userData.uid};
        NetUtil.post(appUrl + 'index.php/Mobile/User/get_user_info/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        saveUserData(result.data);
                    }
                },(error)=>{
                });
    };

    onPressTabItemForIndex(i) {
        if (i === 2) {
            // if (isAuthed()) {
            //     this.props.navigation.navigate("Release",
            //         {headerTitle: "发布"});
            // }
            // else {
            //     PublicAlert('未认证不可发布，去认证？','',
            //         [{text:"取消"},
            //             {text:"确定", onPress:backAndGoToAuth}]
            //     );
            // }
            if (objectNotNull(userData) && userData.authstate) {
                let state = parseInt(userData.authstate);
                switch (state) {
                    case AuthStateEnum.Authing:
                        PublicAlert('您的资质认证正在审核，请耐心等待','',
                            [{text:"确定"}]
                        );
                        break;

                    case AuthStateEnum.Authed:
                        this.props.navigation.navigate("Release",
                            {headerTitle: "发布"});
                        break;

                    default:
                        PublicAlert('未认证不可发布，去认证？','',
                            [{text:"取消"},
                                {text:"确定", onPress:backAndGoToAuth}]
                        );
                        break;
                }
            }
        }
        else {
            this.refTab.goToPage(i);
        }
    }

    render() {
        const tabTitles = [isShipOwner() ? '物流圈' : '空船', '订单', '发布', '消息', '我的'];
        const tabIcon = [
            require('../images/tabbar_icon_home.png'),
            require('../images/tabbar_icon_business.png'),
            require('../images/tabAdd.png'),
            require('../images/tabbar_icon_message.png'),
            require('../images/tabbar_icon_mine.png'),
        ];
        const { navigate } = this.props.navigation;
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    ref={o => this.refTab = o}
                    locked={true}
                    scrollWithoutAnimation={true}
                    renderTabBar={() =>
                        <TabBottom tabNames={tabTitles}
                                   tabItemFlex={1}
                                   tabIconNames={tabIcon}
                        />}
                    style={appStyles.container}
                    tabBarPosition='bottom'
                    tabBarActiveTextColor={appData.appBlueColor}
                    //onChangeTab={this.onChangeTabs}>
                >
                    <HomeNavigator />
                    <OrderNavigator/>
                    <ReleaseNavigator/>
                    <MessageNavigator/>
                    <MineNavigator />
                </ScrollableTabView>
                <CustomMenu ref={o => this.refMenu = o} />
            </View>
        );
    }
}
const styles = StyleSheet.create({

});
import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {StackNavigator, NavigationActions} from 'react-navigation';

import './app/util/Global'

import WaitVC from './app/pages/WaitVC'
import MainTab from './app/pages/MainTab'
import CustomMainTab from './app/pages/MainTabVC';
import DetailVC from './app/pages/DetailVC';
import LoginVC from './app/pages/LoginVC';
import Register from './app/pages/Register';
import AddAuth from './app/pages/Mine/AddAuth';
import AddShip from './app/pages/Mine/AddShip';
import EditShip from './app/pages/Mine/EditShip';
import SelectText from './app/components/SelectTextVC';
import SelectPort from './app/components/SelectPortVC';
import SelectPortSecond from './app/components/SelectPortSecond';
import SelectPortSearch from './app/components/SelectPortSearch';
import SelectEmptyTimeVC from './app/components/SelectEmptyTimeVC';
import SelectWastageVC from './app/components/SelectWastageVC';
import SelectPrice from './app/components/SelectPriceVC';
import SelectTonnage from './app/components/SelectTonnageVC';
import SelectBookTonnage from './app/components/SelectBookTonnageVC';
import CustomSelect from './app/components/CustomSelect';
import CustomSectionSelect from './app/components/CustomSectionSelect';
import PublicWebVC from "./app/pages/PublicWebVC";
import PublicImageShowVC from "./app/pages/PublicImageShowVC";

import HomeShipDetailVC from './app/pages/Home/HomeShipDetailVC';
import HomeOrderDetailVC from './app/pages/Home/HomeOrderDetailVC';
import HomeOrderSelectVC from './app/pages/Home/HomeOrderSelectVC';
import HomeOfferDetailVC from './app/pages/Home/HomeOfferDetailVC';
import HomeOfferPriceVC from './app/pages/Home/HomeOfferPriceVC';
import HomeOfferTwicePriceVC from './app/pages/Home/HomeOfferTwicePriceVC';
import HomeOrderShipListVC from './app/pages/Home/HomeOrderShipListVC';
import HomeOrderShipDetailVC from './app/pages/Home/HomeOrderShipDetailVC';
import AddGoodsReleaseVC from './app/pages/Home/AddGoodsReleaseVC';

import ReleaseVC from './app/pages/ReleaseVC';

import OrderJudgementVC from './app/pages/Order/OrderJudgementVC';
import OrderTransportVC from './app/pages/Order/OrderTransportVC';
import OrderTransportEditVC from './app/pages/Order/OrderTransportEditVC';
import OrderDetailVC from './app/pages/Order/OrderDetailVC';

import MyShip from './app/pages/Mine/MyShip';
import MyShipPrice from './app/pages/Mine/MyShipPriceVC';
import MyPostOrderVC from './app/pages/Mine/MyPostOrderVC';
import MyBookVC from './app/pages/Mine/MyBookVC';
import MyPostVC from './app/pages/Mine/MyPostVC';
import MyPostDetailVC from './app/pages/Mine/MyPostDetailVC';
import MoreSettingsVC from './app/pages/Mine/MoreSettingsVC';
import MyFavorsVC from './app/pages/Mine/MyFavorsVC';
import ChangeContactVC from './app/pages/Mine/ChangeContactVC';
import ChangePasswordVC from './app/pages/Mine/ChangePasswordVC';
import SuggestionVC from './app/pages/Mine/SuggestionVC';
import EditShipReleaseVC from './app/pages/Mine/EditShipReleaseVC';
import EditGoodsReleaseVC from './app/pages/Mine/EditGoodsReleaseVC';
import ScrollTopVC from './app/pages/ScrollTopVC';

const MyNavigator = StackNavigator({
        Wait: {screen: WaitVC},
        Login: {screen: LoginVC},
        Register: {screen: Register},
        Main:{screen: CustomMainTab},
        DetailVC:{screen:DetailVC},
        AddAuth:{screen: AddAuth},
        SelectText:{screen: SelectText},
        SelectPort:{screen: SelectPort},
        SelectPortSecond:{screen: SelectPortSecond},
        SelectPortSearch:{screen: SelectPortSearch},
        CustomSelect:{screen: CustomSelect},
        CustomSectionSelect:{screen: CustomSectionSelect},
        SelectEmptyTimeVC:{screen: SelectEmptyTimeVC},
        SelectWastageVC:{screen: SelectWastageVC},
        SelectPrice:{screen: SelectPrice},
        SelectTonnage:{screen: SelectTonnage},
        SelectBookTonnage:{screen: SelectBookTonnage},
        PublicWeb:{screen:PublicWebVC},
        PublicImageShow:{screen:PublicImageShowVC},

        HomeShipDetail:{screen: HomeShipDetailVC},
        HomeOrderDetail:{screen: HomeOrderDetailVC},
        HomeOrderSelect:{screen: HomeOrderSelectVC},
        HomeOfferDetail:{screen: HomeOfferDetailVC},
        HomeOfferPrice:{screen: HomeOfferPriceVC},
        HomeOfferTwicePrice:{screen: HomeOfferTwicePriceVC},
        HomeOrderShipList:{screen: HomeOrderShipListVC},
        HomeOrderShipDetail:{screen:HomeOrderShipDetailVC},
        AddGoodsRelease:{screen:AddGoodsReleaseVC},

        Release:{screen:ReleaseVC},

        OrderJudgement:{screen:OrderJudgementVC},
        OrderTransport:{screen:OrderTransportVC},
        OrderTransportEdit:{screen:OrderTransportEditVC},
        OrderDetail:{screen:OrderDetailVC},

        MyShip:{screen: MyShip},
        AddShip:{screen: AddShip},
        EditShip:{screen: EditShip},
        MyShipPrice:{screen: MyShipPrice},
        MyBook:{screen:MyBookVC},
        MyPost:{screen:MyPostVC},
        MyPostDetail:{screen:MyPostDetailVC},
        MyPostOrder:{screen: MyPostOrderVC},
        MoreSettings:{screen:MoreSettingsVC},
        MyFavors:{screen:MyFavorsVC},
        ChangeContact:{screen:ChangeContactVC},
        ChangePwd:{screen:ChangePasswordVC},
        Suggestion:{screen:SuggestionVC},
        EditShipRelease:{screen:EditShipReleaseVC},
        EditGoodsRelease:{screen:EditGoodsReleaseVC},
        ScrollTopVC:{screen:ScrollTopVC},
    }
    , {
        navigationOptions: {
            headerTitleStyle: { color: appData.appLittleTextColor, fontSize: appFontFit(18), alignSelf:'center', justifyContent:'center', fontWeight:appData.fontWeightMedium},
            // headerBackTitleStyle: { color: '#000', fontSize:appFontFit(12)},
            headerTintColor:'#222',
            // gesturesEnabled: true,//是否支持滑动返回收拾，iOS默认支持，安卓默认关闭
        },
        mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        // onTransitionStart: (Start) => { console.log('导航栏切换开始'); },  // 回调
        // onTransitionEnd: () => { console.log('导航栏切换结束'); }  // 回调
    }
    );

const defaultGetStateForAction = MyNavigator.router.getStateForAction;
MyNavigator.router.getStateForAction = (action, state) => {
    // goBack返回指定页面
    if (state && action.type === 'Navigation/BACK' && action.key) {
        let routes = null;
        switch (action.key) {
            case "MyPostDetail": {
                routes = appCreateRoutes(state.routes,
                    ["MyPost", action.key],
                    [{}, {info: {task_id: appPushData}}]);
            }
                break;
            case "OrderDetail": {
                routes = appCreateRoutes(state.routes,
                    [action.key],
                    {
                        info: {or_id: appPushData},
                    });
            }
                break;
            case "ShipPricedDetail": {
                let info = {
                    task_id: appPushData.task_id,
                    book_id: appPushData.book_id,
                };
                global.appSecondPriceParams = {info : info};
                routes = appCreateRoutes(state.routes,
                    ["HomeOfferTwicePrice"],
                    {
                        info: info,
                        is_offer: '1',
                    });
            }
                break;
            case "ShipFavorDetail": {
                let {task_id, book_id, is_offer} = appPushData;

                let info = {
                    task_id: task_id,
                    book_id: book_id,
                    is_offer: is_offer,
                };

                global.appSecondPriceParams = {info: info};
                routes = appCreateRoutes(state.routes,
                    [offerIsOffer(is_offer) ? "HomeOfferTwicePrice" : "HomeOfferDetail"],
                    {
                        info: info,
                        is_offer: is_offer,
                    });
            }
                break;
            case "GoodsGoodsDetailOfferList": {
                let info = {
                    task_id: appPushData,
                };
                let param = {info : info};
                routes = appCreateRoutes(state.routes,
                    ["HomeOrderDetail", "HomeOrderShipList"],
                    [param, param]
                );
            }
                break;
        }

        if (arrayNotEmpty(routes)) {
            const purposeState = {
                ...state,
                routes: routes,
                index: routes.length - 1,
            };
            return purposeState;
        }

        const backRoute = state.routes.find((route) => route.routeName === action.key);
        if (backRoute) {
            const backRouteIndex = state.routes.indexOf(backRoute);

            const purposeState = {
                ...state,
                routes: state.routes.slice(0, backRouteIndex + 1),
                index: backRouteIndex,
            };
            return purposeState;
        }
        else if (state.routes.length > 1) {
            if (action.key === "HomeOfferTwicePrice") {
                let routes = state.routes.slice(0, state.routes.length - 2);
                routes.push({routeName: action.key});
                const purposeState = {
                    ...state,
                    routes: routes,
                    index: routes.length - 1,
                };
                return purposeState;
            }
            else if (action.key === "GoBackSkip") {
                let routes = state.routes.slice(0, state.routes.length - 2);
                const purposeState = {
                    ...state,
                    routes: routes,
                    index: routes.length - 1,
                };
                return purposeState;
            }
            else {
                let routes = state.routes.slice(0, state.routes.length - 1);
                const purposeState = {
                    ...state,
                    routes: routes,
                    index: routes.length - 1,
                };
                return purposeState;
            }
        }
    }
    return defaultGetStateForAction(action, state)
};

export default class MainNav extends MyNavigator {
    componentDidMount() {
        global.appInitialProps = this.props;
    }
}

AppRegistry.registerComponent('ShipGoods', () => MainNav);

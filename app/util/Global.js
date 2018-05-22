import React, {Component} from 'react';
import {
    AsyncStorage,
    Alert,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Storage from 'react-native-storage';
import NetUtil from './NetUtil'
import {NavigationActions} from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import px2dp from "./index";
const {width,height}=Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Font = {
    Ionicons,
    FontAwesome
};


Date.prototype.pattern=function(fmt) {
    let o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 === 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    let week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(let k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Number.prototype.Format = function (n){
    let s = this;
    if(s ==='')
        return;
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace("/[^\\d\\.-]/g", "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    let t = "";
    for(let i = 0; i < l.length; i ++ ) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
};


const KEY_USERDATA = 'ships_goods_user_data';
const UI_STANDARD = 375;
class Constant {
    static colorDefault = '#FFFFFF'; // 颜色
    static sizeMarginDefault = 10;  // 尺寸
    // 自适应屏幕（以iOS为模板）
    static scale(width) {
        return Dimensions.get('window').width / UI_STANDARD * width;
    }
}


const Log = (...params) => { // 全局Log
    if (GLOBAL.__DEV__) {
        console.log(params);
    }
};

const GlobalAlert = (...params) => {
    Alert.alert(...params);
};

const resetAction = (routeName) => NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: routeName, params:{}})
    ]
});


var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // sync: require('./sync') // 这个sync文件是要你自己写的
});

// 最好在全局范围内创建一个（且只有一个）storage实例，方便直接调用

// 对于web
// window.storage = storage;

// 对于react native
// global.storage = storage;

// 这样，在此**之后**的任意位置即可以直接调用storage
// 注意：全局变量一定是先声明，后使用
// 如果你在某处调用storage报错未定义
// 请检查global.storage = storage语句是否确实已经执行过了

//导出为全局变量
global.storage = storage;


let userData;
//用户登录数据
global.userData = userData;
//刷新的时候重新获得用户数据
storage.load({
    key: 'userData',
}).then(ret => {
    global.userData = ret;
}).catch(err => {
    global.userData = null;
});

global.PublicLog = Log;
global.PublicAlert = GlobalAlert;
global.PublicResetAction = resetAction;


let appData = {
    appCustomerServicePhone: "18267811011",

    appFontWeightLight:'100',
    appFontWeightSemibold: '400',
    appFontWeightMedium:'800',

    appClearColor: '#fff0',
    appBlueColor: '#2c9bfd',
    appLightBlueColor: "#54b2ff",
    appLittleBlueColor: "#7dd3ff",
    appDeepGrayColor: '#d8d8d8',
    appGrayColor: '#f7f7f7',
    appRedColor: '#ff4848',
    appYellowColor: '#f09340',
    appTextColor: '#000',
    appLightTextColor: '#464646',
    appSecondaryTextColor: '#ababab',
    appThirdTextColor: '#c3c4c4',
    appViewColor: '#eee',
    appBorderColor: '#e0e0e0',
    appSeparatorColor: '#c0c0c099',
    appSeparatorLightColor: '#c0c0c020',

    appItemPaddingLeft: 16,
    appDashWidth: 4.0,
    appSureButtonWidth: 123,
    appSureButtonHeight: 44,
    appSureButtonRadius: 22,

    appItemHeight: 50,
    appSeparatorHeight: 1,
};

let appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appData.appViewColor,
    },
    sureBtnContainer: {
        width:appData.appSureButtonWidth,
        height:appData.appSureButtonHeight,
        borderRadius:appData.appSureButtonRadius,
        backgroundColor: appData.appBlueColor,
        alignItems: "center",
        justifyContent: "center",
    },
    orderBtnContainer:{
        width: 91,
        height: 33,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        borderWidth: 1,
    },
});

let OrderBtnEnum = {
    Default: 0,
    CollectGoods: 1,//收货
    CheckTransport: 2,//查看货运
    JudgeOrder: 3,//去评价
    JudgeCheck: 4,//查看评价
    EditTransport: 5,//编辑货运
    Transporting: 6,//正在运输
};

global.appStyles = appStyles;
global.appData = appData;
global.OrderBtnEnum = OrderBtnEnum;
global.appFont = Font;
global.appUrl = 'http://shiphire.com.cn/';//服务器url
global.appUndefined =  'undefined';
global.NetUtil = NetUtil;
global.appHomeVC = null;
global.appDeviceId = DeviceInfo.getUniqueID();
global.screenWidth = width;
global.screenHeight = height;
global.appSecondPriceParams = null;

global.dismissKeyboard = require('dismissKeyboard');
global.renderSeparator = () => {
    return <View style={{height:0.5,backgroundColor:appData.appSeparatorColor}}/>;
};

global.renderSubSeparator = () => {
    return <View style={{marginLeft:80, height:0.5,backgroundColor:appData.appSeparatorColor}}/>;
};
global.judgeMobilePhone = function(object : String) : boolean {
    // /^1[3|4|5|7|8][0-9]{9}$/
    let reg = /^1[0-9]{10}$/;
    return reg.test(object);
};

global.judgeVerifyCode = function(object : String) : boolean {
    let reg = /^[0-9]{4}$/;
    return reg.test(object);
};

global.judgePassword = function(object : String) : boolean {
    let reg = /^[a-zA-Z0-9]{6,20}$/;
    return reg.test(object);
};

global.getShipStateText = function(state : Number) : String {
    switch (state){
        case 1:
            return "执行中";

        default:
            return "空船";
    }
};

global.shipAreaObjects = [{key: 1, name: '沿海'}, {key: 2, name: '内河（可进川）'}, {key: 3, name: '内河（不可进川)'}];
global.shipAreaTypes = ['取消', '沿海', '内河（可进川）', '内河（不可进川)'];
global.shipWastageTypes = ['取消', '船检量 -> 船检量', '罐发量 -> 入库量', '船检量 -> 入库量', '罐发量 -> 船检量'];
global.createShipWastageNumberTypes = function() : Array {
    let array = ['取消'];
    for (let i = 0.1; i < 4; i += 0.1) {
        array.push(i.Format(1) + '‰');
    }
    return array;
};

global.shipWastageNumberTypes = createShipWastageNumberTypes();


global.createDemurrageTypes = function() : Array {
    let array = ['取消'];
    for (let i = 0; i < 100000; i += 1000) {
        array.push(i + '');
    }
    return array;
};
global.demurrageTypes = createDemurrageTypes();

global.getShipAreaTypesText = function(area : Number) : String {
    if (area < shipAreaTypes.length) {
        return shipAreaTypes[area];
    }
    return "未知";
};

global.isShipOwner = function() : boolean {
    if (global.userData !== null) {
        return global.userData.usertype === '2';
    }
    return false;
};

global.offerIsOffer = function(is_offer) : boolean {
    return (is_offer === '1');
};

global.commentIscomment = function(iscomment) : boolean {
    return (iscomment === '11');
};

global.offerIsBargain = function(info) : boolean {
    return (info.is_bargain === '0');
};

global.itemIsFavor = function(iscollect) : boolean {
    return (parseInt(iscollect) === 1)
};

global.goodsOwnerNotNull = function(info) : boolean {
    return ((info.goods_owner !== null) && (typeof(info.goods_owner) !== appUndefined));
};

global.objectNotNull = function(object) : boolean {
    return ((object !== null) && (typeof(object) !== appUndefined));
};

global.createRequestTime = function(date : Date) : String {
    if (date !== null) {
        return date.Format("yyyy-MM-dd");
    }
    return "1970-01-01";
};

global.deepCopy = function(obj : Object) : Object {
    var newobj = {};
    for ( var attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
};

global.appAllGoods = [];
global.appAllPortsFirst = [];
global.appAllPortsSecond = [];
global.appHomeCondition = {
    empty_port: null,//空船港
    empty_time: null,//空船期
    empty_delay: 0,//空船延迟
    goods: null,//可运货品
    area: [],//航行区域
    min_ton: 0,//货量区间 最小吨位
    max_ton: 0,//货量区间 最大吨位
    loading_port: null,//装货港
    loading_time: null,//发货时间
    loading_delay: 0,//发货延迟
    unloading_port: null,//卸货港
};

export const imagePickerOptions = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    title: null,
    takePhotoButtonTitle: '选择相机',
    chooseFromLibraryButtonTitle: '选择相册',
    cancelButtonTitle: '取消',
    storageOptions: {
        skipBackup: true
    }
};
import React, {Component} from 'react';
import {
    Platform,
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


let storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间(毫秒)，默认一个月，设为null则永不过期
    // defaultExpires: 1000 * 3600 * 24 * 30,
    defaultExpires: null,

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

global.saveUserData = (data) => {
    global.storage.save({
        key: 'userData', // 注意:请不要在key中使用_下划线符号!
        data: data,
    });
    global.userData = data;
};


let appData = {
    appCustomerServicePhone: "18267811011",

    appFontWeightLight:'100',
    appFontWeightSemibold: '400',
    appFontWeightMedium:'800',

    appClearColor: '#fff0',
    appBlueColor: '#2c9bfd',
    appLightBlueColor: "#54b2ff",
    appLittleBlueColor: "#7dd3ff",
    appLightGrayColor: '#a8a8a8',
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
    appMaxImageUploadNumber: 2,

    appItemHeight: 50,
    appSeparatorHeight: 1,

    appMaxLengthInput: 100,
    appMaxLengthName: 40,
    appMaxLengthNumber: 10,
    appMaxLengthVerifyCode: 4,
    appMaxLengthPhone: 11,
    appMaxLengthPassword: 20,

    appOnEndReachedThreshold: 0.1,
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
        minWidth: 91,
        height: 33,
        paddingHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        borderWidth: 1,
    },
});

let OrderCenterEnum = {
    Default: 0,
    Order: 1,//订单
};

let OrderBtnEnum = {
    Default: 0,
    CollectGoods: 1,//收货
    CheckTransport: 2,//查看货运
    JudgeOrder: 3,//去评价
    JudgeCheck: 4,//查看评价
    EditTransport: 5,//编辑货运
    Transporting: 6,//正在运输
    Transported: 7,//货运已完成
};

let OfferPriceEnum = {
    ShipPrice: 0,//船东报价
    AgreePrice: 1,//认同报价
    BargainPrice: 2,//议价
};

let OfferOrderEnum = {
    GoodsOrder: 1,//货主约船
    ShipOrder: 2,//船东约货
};

let AuthStateEnum = {
    NotApply: -1,//未认证
    Authing: 0,//认证中
    Authed: 1,//已认证
    Reject: 2,//认证不通过
};

global.appStyles = appStyles;
global.appData = appData;
global.OrderCenterEnum = OrderCenterEnum;
global.OrderBtnEnum = OrderBtnEnum;
global.OfferPriceEnum = OfferPriceEnum;
global.OfferOrderEnum = OfferOrderEnum;
global.AuthStateEnum = AuthStateEnum;
global.appFont = Font;
global.appUrl = 'http://shiphire.com.cn/';//服务器url
global.appShareUrl = 'http://shiphire.com.cn/shared/mobile/';
global.appShareImage = 'res/ic_launcher';
global.appUndefined =  'undefined';
global.appPageSize = 15;
global.NetUtil = NetUtil;
global.appDeviceId = DeviceInfo.getUniqueID();
global.screenWidth = width;
global.screenHeight = height;
global.appSecondPriceParams = null;

global.dismissKeyboard = require('dismissKeyboard');
global.backAndGoToAuth = function() : void {
    appMainTab.props.navigation.goBack('Main');
    if (objectNotNull(appMainTab.refTab)) {
        appMainTab.refTab.goToPage(4);
    }
    else {
        appMainTab.props.navigation.navigate('MineVC');
    }
    appMineVC.requestRecommend(true);
};

global.backAndGoToOrder = function() : void {
    appMainTab.props.navigation.goBack('Main');
    if (objectNotNull(appMainTab.refTab)) {
        appMainTab.refTab.goToPage(1);
    }
    else {
        appMainTab.props.navigation.navigate('OrderVC');
    }
};

global.backAndGoToMyRelease = function() : void {
    appMainTab.props.navigation.goBack('Main');
    if (objectNotNull(appMainTab.refTab)) {
        appMainTab.refTab.goToPage(4);
    }
    else {
        appMainTab.props.navigation.navigate('MineVC');
    }
    appMainTab.props.navigation.navigate('MyPost');
};

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

global.cleanDeleyTypes = ['取消', '15', '30', '45', '60'];
global.shipAreaObjects = [{key: 1, name: '沿海'}, {key: 2, name: '内河（可进川）'}, {key: 3, name: '内河（不可进川)'}];
global.shipAreaTypes = ['取消', '沿海', '内河（可进川）', '内河（不可进川)'];
global.shipCourseTypes = ['南下', '北上', '上江', '下江', '运河'];
global.shipWastageTypes = ['取消', '船板量 -> 船板量', '罐发量 -> 入库量', '船板量 -> 入库量', '罐发量 -> 船板量'];
global.transportStateTypes = ["抵锚", "靠泊", "开始装货", "装货完毕", "离港", "抵锚", "靠泊", "开始卸货", "卸货完毕", "离港"];
global.shipTypes = ['取消',
    '油船1级',
    '油船2级',
    '油船3级',
    '化学品Ⅰ级',
    '化学品Ⅱ级',
    '化学品Ⅲ级',
    '液压气船全压',
    '液压气船全冷',
    '液压气船半压半冷',
    '油化船(油1化Ⅰ)',
    '油化船(油1化Ⅱ)',
    '干货散船',
    '粮油船'];
global.shipTypeObjects = [
    {key: 1, name: '油船1级'},
    {key: 2, name: '油船2级'},
    {key: 3, name: '油船3级'},
    {key: 4, name: '化学品Ⅰ级'},
    {key: 5, name: '化学品Ⅱ级'},
    {key: 6, name: '化学品Ⅲ级'},
    {key: 7, name: '液压气船全压'},
    {key: 8, name: '液压气船全冷'},
    {key: 9, name: '液压气船半压半冷'},
    {key: 10, name: '油化船(油1化Ⅰ)'},
    {key: 11, name: '油化船(油1化Ⅱ)'},
    {key: 12, name: '干货散船'},
    {key: 13, name: '粮油船'}];

global.createShipWastageNumberTypes = function() : Array {
    let array = [];
    for (let i = 0.0; i <= 4; i += 0.1) {
        array.push(i.Format(1) + '‰');
    }
    return array;
};
global.shipWastageNumberTypes = createShipWastageNumberTypes();

global.createTonSectionTypes = function() : Array {
    let array = [];
    for (let i = 1; i <= 20; i += 1) {
        array.push(i + '%');
    }
    return array;
};
global.tonSectionTypes = createTonSectionTypes();

global.createDemurrageTypes = function() : Array {
    let array = ['取消'];
    for (let i = 0; i <= 100000; i += 1000) {
        array.push(i + '');
    }
    return array;
};
global.demurrageTypes = createDemurrageTypes();

global.getArrayTypesText = function(array, index) : String {
    if (index >= 0 && index < array.length) {
        return array[index];
    }
    return "";
};

global.getShipAreaTypesText = function(area : Number) : String {
    if (area < shipAreaTypes.length) {
        return shipAreaTypes[area];
    }
    return "";
};

global.getShipCourseTypesText = function(course : String) : String {
    if (course !== null && course.length > 0) {
        let types = course.split("##");
        let typesText = [];
        for (let i = 0, len = types.length; i < len; i++) {
            let index = parseInt(types[i]);
            if (index > 0 && index <= shipCourseTypes.length) {
                typesText.push(shipCourseTypes[index - 1]);
            }
        }
        if (typesText.length > 0) {
            return typesText.join(",");
        }
    }
    return "";
};

global.isAuthed = function() : boolean {
    if (objectNotNull(global.userData) && global.userData.authstate) {
        let state = parseInt(global.userData.authstate);
        return state === AuthStateEnum.Authed;
    }
    return false;
};

global.getAuthStateText = function(authState) : String {
    let stateText = "未知";
    let state = parseInt(authState);
    switch (state) {
        case AuthStateEnum.NotApply:
            stateText = "未认证";
            break;

        case AuthStateEnum.Authing:
            stateText = "认证中";
            break;

        case AuthStateEnum.Authed:
            stateText = "已认证";
            break;

        case AuthStateEnum.Reject:
            stateText = "认证未通过";
            break;

        default:
            break;
    }

    return stateText;
};

global.isShipOwner = function() : boolean {
    if (global.userData !== null) {
        return global.userData.usertype === '2';
    }
    return false;
};

global.shipIsShowType = function(dieseloil, gasoline, ship_type) : boolean {
    if (!stringIsEmpty(ship_type)) {
        let typeIndex = parseInt(ship_type);
        if (typeIndex > 0 && typeIndex < shipTypes.length) {
            let type = shipTypes[typeIndex];
            if (type.search("油") === -1) {
                return true;
            }
        }
    }
    return false;
};

global.shipTransportStateJudge = function(current, standard) : boolean {
    return current > standard;
};

global.offerIsOffer = function(is_offer) : boolean {
    return (is_offer === '1');
};

global.offerIsOrdered = function(status) : boolean {
    return (status === '1');
};

global.commentIscomment = function(iscomment) : boolean {
    return (iscomment === '11');
};

global.offerIsBargain = function(is_bargain) : boolean {
    return (parseInt(is_bargain) === 0);
};
global.offerIsShipPrice = function(is_shipprice) : boolean {
    if (objectNotNull(is_shipprice)) {
        return (parseInt(is_shipprice) === 1);
    }
    return false;
};

global.itemIsFavor = function(iscollect) : boolean {
    return (parseInt(iscollect) === 1)
};

global.objectNotNull = function(object) : boolean {
    return ((object !== null) && (typeof(object) !== appUndefined));
};

global.arrayNotEmpty = function(object) : boolean {
    return ((object !== null) && (typeof(object) !== appUndefined) && object.length > 0);
};

global.dateStringIsValid = function check(dateString) : boolean {
    return (new Date(dateString).getDate() === dateString.substring(dateString.length - 2));
};

global.dateIsValid = function check(date) : boolean {
    if (objectNotNull(date)) {
        return date.Format("yyyy").search("NaN") === -1;
    }
    return false;
};

global.objectIsZero = function(object) : boolean {
    return ((object === null) || (typeof(object) === appUndefined) || (parseInt(object) === 0));
};

global.stringIsEmpty = function(object) : boolean {
    return ((object === null) || (typeof(object) === appUndefined) || object.length === 0);
};

global.createRequestTime = function(date : Date) : String {
    if (date !== null) {
        return date.Format("yyyy-MM-dd");
    }
    return "1970-01-01";
};

global.createRequestDetailTime = function(date : Date) : String {
    if (date !== null) {
        return date.Format("yyyy-MM-dd hh:mm:ss");
    }
    return "1970-01-01 00:00:00";
};

global.createTimeFormat = function(time, format) : String {
    if (time !== null) {
        let date = new Date(parseFloat(time) * 1000);
        // date.setTime(time * 1000);
        return date.pattern(format);
    }
    return "1970-01-01";
};

global.deepCopy = function(obj : Object) : Object {
    let newobj = {};
    for (let attr in obj) {
        newobj[attr] = obj[attr];
    }
    return newobj;
};

global.compare = function compare(val1, val2){
    return val1 > val2;
};

global.isIOS = function() : boolean {
    return Platform.OS === 'ios';
};

global.appHomeVC = null;
global.appOrderVC = null;
global.appReleaseVC = null;
global.appMineVC = null;
global.appMainTab = null;
global.appAllGoods = [];
global.appHotPorts = [];
global.appAllPortsFirst = [];
global.appAllPortsSecond = [];
global.appHomeCondition = {
    empty_port: null,//空船港
    empty_time: null,//空船期
    empty_delay: 0,//空船延迟
    goods: null,//可运货品
    ship_type: null,//船舶类型
    area: [],//航行区域
    min_ton: 0,//货量区间 最小吨位
    max_ton: 0,//货量区间 最大吨位
    loading_port: null,//装货港
    loading_time: null,//发货时间
    loading_delay: 0,//发货延迟
    unloading_port: null,//卸货港
};

global.appResetState = function () {
    global.appHomeVC = null;
    global.appOrderVC = null;
    global.appReleaseVC = null;
    global.appMineVC = null;
    global.appMainTab = null;
    global.appAllGoods = [];
    global.appHotPorts = [];
    global.appAllPortsFirst = [];
    global.appAllPortsSecond = [];
    global.appHomeCondition = {
        empty_port: null,//空船港
        empty_time: null,//空船期
        empty_delay: 0,//空船延迟
        goods: null,//可运货品
        ship_type: null,//船舶类型
        area: [],//航行区域
        min_ton: 0,//货量区间 最小吨位
        max_ton: 0,//货量区间 最大吨位
        loading_port: null,//装货港
        loading_time: null,//发货时间
        loading_delay: 0,//发货延迟
        unloading_port: null,//卸货港
    };
    storage.remove({
        key: 'userData'
    });
    global.userData = null;
};

global.appLogout = function () {
    appMainTab.props.navigation.dispatch(PublicResetAction('Login'));
    global.appResetState();
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
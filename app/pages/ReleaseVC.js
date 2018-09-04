import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ActionPicker from '../components/ActionPicker';
import CustomItem from '../components/CustomItem';
import CustomInput from '../components/CustomInput';
import Toast from "react-native-easy-toast";
import IndicatorModal from '../components/IndicatorModal';

export default class ReleaseVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '发布',
        tabBarLabel: '发布',
        headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
            <TouchableOpacity
                onPress={()=> {appReleaseVC.sureBtnClick()}}
            >
                <Text style={{marginRight: 10, color: appData.appBlueColor}}>{'  提交  '}</Text>
            </TouchableOpacity>
        </View>,
    });

    constructor(props){
        super(props);
        this.state = {
            ship: null,//船
            upload_oil_list: [],//上载油品
            download_oil_list: [],//意向油品
            empty_port: null,//空船港
            empty_time: new Date(),//空船期
            empty_delay: 0,//空船延迟
            course: '',//运输航向 1：南下 2：北上 3：上江 4：下江 5：运河（多选，用“##”隔开）
            remark: '',//备注

            courseList: [],

            tonnage: '',//否 装载吨位
            ton_section: "5%", //否 吨位区间值
            price: '',//否 单价
            loading_port: null,//否 装货港
            unloading_port: null, //否 卸货港
            loading_time: new Date(), //否 发货时间
            loading_delay: 0, //否 发货延迟
            is_bargain: 0, //否 是否接收议价 0：是（默认） 1：否
            is_shipprice: 0, //是 是否船东开价 0：否 1：是
            clean_deley: '', //否 完货后多少天结算 15/30/45/60
            wastage: '', //否 损耗
            goods: [], //货品
            demurrage: '', //否 滞期费

            wastageTitle: 0,
            wastageNumber: -1,
        };

        this.config = isShipOwner() ?
            [
                {idKey:"ship_name", name:"船名", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectShip")},
                {idKey:"download_oil_list", name:"意向货品", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectDownload")},
                {idKey:"empty_port", name:"空船港", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPort")},
                {idKey:"empty_time",name:"空船期", logo:require('../images/icon_green.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
                {idKey:"course", name:"可运航向", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCourse")},
                {idKey:"upload_oil_list", name:"上载货品", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectUpload")},
            ]
                :
            [
                {idKey:"goods", name:"货品名称", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectGoods")},
                {idKey:"tonnage", name:"货量", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectTonnage")},
                {idKey:"price", name:"运价", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPrice")},
                {idKey:"loading_port", name:"装货港", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingPort")},
                {idKey:"unloading_port",name:"卸货港", logo:require('../images/icon_orange.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectUnloadingPort")},
                {idKey:"loading_time", name:"发货时间", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingTime")},
                {idKey:"wastage", name:"损耗", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectWastage")},
                {idKey:"demurrage", name:"滞期费", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectDemurrage")},
                {idKey:"clean_deley", name:"结算时间", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCleanDeley")},
            ];
    }

    componentDidMount() {
        global.appReleaseVC = this;
        this.refreshDefaultState();
    }

    refreshDefaultState() {
        if (isShipOwner()) {
            this.setState({
                ship: null,//船
                upload_oil_list: [],//上载油品
                download_oil_list: [],//意向油品
                empty_port: null,//空船港
                empty_time: new Date(),//空船期
                empty_delay: 0,//空船延迟
                course: '',//运输航向 1：南下 2：北上 3：上江 4：下江 5：运河（多选，用“##”隔开）
                remark: '',//备注

                courseList: [],
            });
        }
        else {
            let data1 = 1;
            let data2 = 20;
            let m_string = '';
            if (data1 > 0) {
                m_string += shipWastageTypes[data1 - 1];
            }
            if (data2 >= 0) {
                if (m_string.length > 0) {
                    m_string += ' ';
                }
                m_string += shipWastageNumberTypes[data2];
            }

            this.setState({
                tonnage: '',//否 装载吨位
                ton_section: "5%", //否 吨位区间值
                price: '',//否 单价
                loading_port: null,//否 装货港
                unloading_port: null, //否 卸货港
                loading_time: new Date(), //否 发货时间
                loading_delay: 0, //否 发货延迟
                is_bargain: 0, //否 是否接收议价 0：是（默认） 1：否
                is_shipprice: 0, //是 是否船东开价 0：否 1：是
                clean_deley: '', //否 完货后多少天结算 15/30/45/60
                wastage: m_string, //否 损耗
                goods: [], //货品
                demurrage: '20000', //否 滞期费
                remark: '',//备注

                wastageTitle: data1,
                wastageNumber: data2,
            })
        }
    }

    sureBtnClick = () => {
        if (isShipOwner()) {
            this.toReleaseForShipOwner();
        }
        else {
            this.toReleaseForGoodsOwner();
        }
    };

    toReleaseForShipOwner() {
        let {ship, download_oil_list, empty_port, empty_time, empty_delay, course, upload_oil_list, remark} = this.state;
        if (ship === null) {
            this.refToast.show("请选择船舶");
        }
        else if (!arrayNotEmpty(download_oil_list)) {
            this.refToast.show("请选择意向货品");
        }
        else if (empty_port === null) {
            this.refToast.show("请选择空船港");
        }
        else if (empty_time === null) {
            this.refToast.show("请选择空船期");
        }
        else if (course.length === 0) {
            this.refToast.show("请选择可运航向");
        }
        else if (!arrayNotEmpty(upload_oil_list)) {
            this.refToast.show("请选择上载货品");
        }
        // else if (remark.length === 0) {
        //     this.refToast.show("请输入您的备注");
        // }
        else {
            let downloadList = download_oil_list.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let uploadList = upload_oil_list.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                ship_id: ship.ship_id,
                upload_oil_list: uploadList,
                download_oil_list: downloadList,
                empty_port: empty_port.port_id,
                empty_port_name: empty_port.port_name,
                empty_time: empty_time.Format("yyyy-MM-dd"),
                empty_delay: empty_delay,
                course: course,
            };

            if (remark.length > 0) {
                data.remark = remark;
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/add_ship_task/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            this.refreshDefaultState();
                            PublicAlert(result.message, "发布完成，请到\"我的发布\"中查看",
                                [{text:"取消"},
                                    {text:"去查看", onPress:backAndGoToMyRelease}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    }

    toReleaseForGoodsOwner() {
        let {goods, tonnage, ton_section, price, is_shipprice, is_bargain, loading_port, unloading_port, loading_time, loading_delay, wastage, demurrage, clean_deley, remark} = this.state;
        if (goods.length === 0) {
            this.refToast.show("请选择货品");
        }
        else if (tonnage.length === 0) {
            this.refToast.show("请设置货量");
        }
        else if (price.length === 0) {
            this.refToast.show("请设置运价");
        }
        else if (loading_port === null) {
            this.refToast.show("请选择装船港");
        }
        else if (unloading_port === null) {
            this.refToast.show("请选择卸船港");
        }
        else if (loading_time === null) {
            this.refToast.show("请选择发货时间");
        }
        else if (wastage.length === 0) {
            this.refToast.show("请设置损耗");
        }
        else if (stringIsEmpty(demurrage)) {
            this.refToast.show("请选择滞期费");
        }
        else if (stringIsEmpty(clean_deley)) {
            this.refToast.show("请选择结算时间");
        }
        // else if (remark.length === 0) {
        //     this.refToast.show("请输入您的备注");
        // }
        else {
            let goodsList = goods.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                goods: goodsList,
                tonnage: tonnage,
                ton_section: ton_section,
                price: price,
                is_shipprice: is_shipprice,
                is_bargain: is_bargain,
                loading_port: loading_port.port_id,
                loading_port_name: loading_port.port_name,
                unloading_port: unloading_port.port_id,
                unloading_port_name: unloading_port.port_name,
                loading_time: createRequestTime(loading_time),
                loading_delay: loading_delay,
                wastage: wastage,
                demurrage: demurrage,
                clean_deley: clean_deley,
            };

            if (!stringIsEmpty(remark)) {
                data.remark = remark;
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/add_goods_task/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            this.refreshDefaultState();
                            PublicAlert(stringIsEmpty(result.message) ? "已发布" : result.message, "发布完成，请到\"我的货\"中查看",
                                [{text:"取消"},
                                    {text:"去查看", onPress:(() => {
                                        appMainTab.refTab.goToPage(0);
                                        appHomeVC.reloadSubListOrderVC(true);
                                    })}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    }

    cellSelected(key, data = {}){
        const { navigate } = appMainTab.props.navigation;
        dismissKeyboard();
        if (key === "SelectCourse") {
            navigate(
                'SelectText',
                {
                    key: key,
                    title: '可运航向',
                    dataList: shipCourseTypes,
                    selectedList:this.state.courseList,
                    maxSelectCount:shipCourseTypes.length,
                    callBack:this.callBackFromCourseVC.bind(this)
                }
            );
        }
        else if (key === "SelectCleanDeley") {
            this.cleanDelayTypeActionSheet.show();
        }
        else if (key === "SelectDemurrage") {
            // this.demurrageTypeActionSheet.show();
            this.refDemurrageTypePicker.show(this.state.demurrage,
                (choice, index)=>{
                    this.setState({
                        demurrage: choice
                    });
                });
        }
        else if (key === "SelectGoods") {
            this.toGoToGoodsVC();
        }
        else if (key === "SelectDownload") {
            this.toGoToDownGoodsVC();
        }
        else if (key === "SelectUpload") {
            this.toGoToUpGoodsVC();
        }
        else if (key === "SelectPort" || key === "SelectLoadingPort" || key === "SelectUnloadingPort") {
            this.toGoToPortsVC(key);
        }

        else if (key === "SelectShip") {
            navigate(
                "MyShip",
                {
                    callBack:this.callBackFromShipVC.bind(this)
                });
        }
        else if (key === "SelectEmptyTime") {
            navigate(
                "SelectEmptyTimeVC",
                {
                    title: '空船期',
                    key: key,
                    date: this.state.empty_time,
                    delay: this.state.empty_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else if (key === "SelectLoadingTime") {
            navigate(
                "SelectEmptyTimeVC",
                {
                    title: '发货时间',
                    key: key,
                    date: this.state.loading_time,
                    delay: this.state.loading_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else if (key === "SelectWastage") {
            navigate(
                "SelectWastageVC",
                {
                    title: '选择损耗',
                    key: key,
                    wastageTitle: this.state.wastageTitle,
                    wastageNumber: this.state.wastageNumber,
                    callBack:this.callBackFromWastageVC.bind(this)
                });
        }
        else if (key === "SelectPrice") {
            navigate(
                "SelectPrice",
                {
                    title: '选择运价',
                    price: this.state.price,
                    is_bargain: this.state.is_bargain,
                    is_shipprice: this.state.is_shipprice,
                    callBack:this.callBackFromPriceVC.bind(this)
                });
        }
        else if (key === "SelectTonnage") {
            navigate(
                "SelectTonnage",
                {
                    title: '货量吨位',
                    tonnage: this.state.tonnage,
                    ton_section: this.state.ton_section,
                    callBack:this.callBackFromTonnageVC.bind(this)
                });
        }
        else {
            PublicAlert(key);
        }
    }

    callBackFromCourseVC(key, backData) {
        if (key === "SelectCourse") {
            this.setState({
                course: backData.join("##"),
                courseList: backData,
            });
        }
    }

    toGoToPortsVC(key) {
        if (appAllPortsFirst.length > 0) {
            appMainTab.props.navigation.navigate(
                "SelectPort",
                {
                    title: '选择港口',
                    dataList: appAllPortsFirst,
                    key: key,
                    callBack:this.callBackFromPortVC.bind(this)
                });
        }
        else {
            let data = {pid:'0', deep:0};
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_all_port/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllPortsFirst = result.data;
                            this.toGoToPortsVC(key);
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromPortVC(key, backData) {
        if (key === "SelectPort") {
            this.setState({
                empty_port: backData,
            })
        }
        else if (key === "SelectLoadingPort") {
            this.setState({
                loading_port: backData,
            })
        }
        else if (key === "SelectUnloadingPort") {
            this.setState({
                unloading_port: backData,
            })
        }
    }

    callBackFromShipVC(backData) {
        this.setState({
            ship: backData,
        })
    }

    callBackFromTimeVC(key, backDate, backDelay) {
        if (key === "SelectEmptyTime") {
            this.setState({
                empty_time: backDate,
                empty_delay: backDelay,
            })
        }
        else if (key === "SelectLoadingTime") {
            this.setState({
                loading_time: backDate,
                loading_delay: backDelay,
            })
        }

    }

    callBackFromWastageVC(key, data1, data2) {
        if (key === "SelectWastage") {
            let m_string = '';
            if (data1 > 0) {
                m_string += shipWastageTypes[data1 - 1];
            }
            if (data2 > 0) {
                if (m_string.length > 0) {
                    m_string += ' ';
                }
                m_string += shipWastageNumberTypes[data2];
            }

            this.setState({
                wastageTitle: data1,
                wastageNumber: data2,
                wastage: m_string,
            })
        }
    }

    callBackFromPriceVC(price, is_bargain, is_shipprice) {
        this.setState({
            price: price,
            is_bargain: is_bargain,
            is_shipprice: is_shipprice,
        })
    }

    callBackFromTonnageVC(tonnage, ton_section) {
        this.setState({
            tonnage: tonnage,
            ton_section: ton_section,
        })
    }

    toGoToGoodsVC() {
        if (appAllGoods.length > 0) {
            appMainTab.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '可运货品',
                    dataList: appAllGoods,
                    selectedList:this.state.goods,
                    maxSelectCount:1,
                    callBack:this.callBackFromGoodsVC.bind(this)
                }
            );
        }
        else {
            let data = {pid:'0', deep:1};
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllGoods = result.data;
                            this.toGoToGoodsVC();
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromGoodsVC(backData) {
        this.setState({
            goods: backData,
        });
    }

    toGoToDownGoodsVC() {
        if (appAllGoods.length > 0) {
            appMainTab.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '意向货品',
                    dataList: appAllGoods,
                    selectedList:this.state.download_oil_list,
                    maxSelectCount:5,
                    callBack:this.callBackFromDownGoodsVC.bind(this)
                }
            );
        }
        else {
            let data = {pid:'0', deep:1};
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllGoods = result.data;
                            this.toGoToDownGoodsVC();
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromDownGoodsVC(backData) {
        this.setState({
            download_oil_list: backData,
        });
    }

    toGoToUpGoodsVC() {
        if (appAllGoods.length > 0) {
            appMainTab.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '上载货品',
                    dataList: appAllGoods,
                    selectedList:this.state.upload_oil_list,
                    maxSelectCount:1,
                    callBack:this.callBackFromUpGoodsVC.bind(this)
                }
            );
        }
        else {
            let data = {pid:'0', deep:1};
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllGoods = result.data;
                            this.toGoToUpGoodsVC();
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromUpGoodsVC(backData) {
        this.setState({
            upload_oil_list: backData,
        });
    }

    textInputChanged(text, key){
        if (key === "remark") {
            this.setState({
                remark: text,
            });
        }
        else if (key === 'tonnage') {
            this.setState({
                tonnage: text,
            });
        }
    }

    onSelectInvoiceType(index) {
        if (index > 0) {
            this.setState({
                course: index
            });
        }
    }

    onSelectCleanDelayType(index) {
        if (index > 0) {
            this.setState({
                clean_deley: getArrayTypesText(cleanDeleyTypes, index - 1),
            });
        }
    }

    onSelectDemurrageType(index) {
        if (index > 0) {
            this.setState({
                demurrage: getArrayTypesText(demurrageTypes, index),
            });
        }
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'ship_name' && this.state.ship !== null) {
            return this.state.ship.ship_name;
        }
        else if (item.idKey === 'goods' && arrayNotEmpty(this.state.goods)) {
            let dataList = this.state.goods.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return dataList.join(",");
        }
        else if (item.idKey === 'download_oil_list' && arrayNotEmpty(this.state.download_oil_list)) {
            let dataList = this.state.download_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return dataList.join(",");
        }
        else if (item.idKey === 'empty_port' && this.state.empty_port !== null) {
            return this.state.empty_port.port_name;
        }
        else if (item.idKey === 'loading_port' && this.state.loading_port !== null) {
            return this.state.loading_port.port_name;
        }
        else if (item.idKey === 'unloading_port' && this.state.unloading_port !== null) {
            return this.state.unloading_port.port_name;
        }
        else if (item.idKey === 'empty_time' && this.state.empty_time !== null) {
            return this.state.empty_time.Format("yyyy.MM.dd") + '±' + this.state.empty_delay + '天';
        }
        else if (item.idKey === 'loading_time' && this.state.loading_time !== null) {
            return this.state.loading_time.Format("yyyy.MM.dd") + '±' + this.state.loading_delay + '天';
        }
        else if (item.idKey === 'course' && this.state.course.length > 0) {
            return getShipCourseTypesText(this.state.course);
        }
        else if (item.idKey === 'clean_deley' && !stringIsEmpty(this.state.clean_deley)) {
            return '完货' + this.state.clean_deley + '天内';
        }
        else if (item.idKey === 'upload_oil_list' && arrayNotEmpty(this.state.upload_oil_list)) {
            let dataList = this.state.upload_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return dataList.join(",");
        }
        else if (item.idKey === "price") {
            if (offerIsShipPrice(this.state.is_shipprice)) {
                return "船东开价";
            }
            else if (this.state.price.length > 0) {
                return this.state.price + ' 元/吨 ' + (offerIsBargain(this.state.is_bargain) ? "" : "不议价")
            }
        }
        else if (item.idKey === 'tonnage' && this.state.tonnage.length > 0) {
            return this.state.tonnage  + "吨" + '±' + this.state.ton_section;
        }
        else if (item.idKey === 'wastage') {
            return this.state.wastage;
        }
        else if (item.idKey === 'demurrage' && !stringIsEmpty(this.state.demurrage)) {
            return this.state.demurrage + ' 元/天'
        }

        return '';
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (<CustomItem key={i} {...item}
                                subName = {this.renderSubNameForIndex(item, i)}
                                callback={this.textInputChanged.bind(this)}>
            </CustomItem>);
        })
    }

    render() {
        let {remark} = this.state;
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                    {this._renderListItem()}
                    <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>
                    <View style={{paddingHorizontal:18, paddingVertical:15}}>
                        <Image source={require('../images/icon_beizhu.png')} style={{width: 57, height: 21, resizeMode: "cover"}}/>
                        <CustomInput underlineColorAndroid="transparent"
                                     style={styles.textInput}
                                     multiline={true}
                                     placeholder={"请在此输入您的备注"}
                                     placeholderTextColor={appData.appSecondaryTextColor}
                                     onChangeText={(text) => {
                                         this.textInputChanged(text, "remark");
                                     }}
                                     value={remark}
                        >
                        </CustomInput>
                    </View>
                    <View style={{height:80}} />
                </ScrollView>
                <View style={{position: "absolute", bottom: 30, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.sureBtnClick.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.areaTypeActionSheet = o}
                    title={'请选择运输航向'}
                    options={shipCourseTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectInvoiceType.bind(this)}
                />
                <ActionSheet
                    ref={o => this.cleanDelayTypeActionSheet = o}
                    title={'请选择结算时间'}
                    options={addCancelForArray(cleanDeleyTypes)}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectCleanDelayType.bind(this)}
                />
                <ActionSheet
                    ref={o => this.demurrageTypeActionSheet = o}
                    title={'请选择滞期费（单位：元/天）'}
                    options={demurrageTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectDemurrageType.bind(this)}
                />
                <ActionPicker ref={o => this.refDemurrageTypePicker = o}
                              title={'请选择滞期费（单位：元/天）'}
                              options={demurrageTypes}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 0,
        backgroundColor: "#fff"
    },
    textInput: {
        marginTop: 10,
        minHeight: 120,
        borderRadius: 6,
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 15,
        color: appData.appTextColor,
        backgroundColor: appData.appGrayColor,
        textAlignVertical: "top",
    },
});
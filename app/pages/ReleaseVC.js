import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';

import CustomItem from '../components/CustomItem';
import {imagePickerOptions} from "../util/Global";
import Toast from "react-native-easy-toast";

export default class ReleaseVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '发布',
        tabBarLabel: '发布',
        headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
            <TouchableOpacity
                onPress={navigation.state.params.clickSureBtn}
            >
                <Text style={{marginRight: 10, color: appData.appBlueColor}}>{'  提交  '}</Text>
            </TouchableOpacity>
        </View>,
    });

    constructor(props){
        super(props);
        this.state = {
            ship: null,//船
            upload_oil_list: '',//上载油品
            download_oil_list: '',//下载油品
            empty_port: null,//空船港
            empty_time: new Date(),//空船期
            empty_delay: 0,//空船延迟
            course: 0,//运输航向 1：南上 2：北下 3：上江 4：下江 5：运河（多选，用“##”隔开）
            remark: '',//备注

            uploadOilSelectedList: [],
            downloadOilSelectedList: [],


            tonnage: 0,//否 装载吨位
            ton_section: 0, //否 吨位区间值
            price: '',//否 单价
            loading_port: null,//否 装货港
            unloading_port: null, //否 卸货港
            loading_time: new Date(), //否 发货时间
            loading_delay: 0, //否 发货延迟
            is_bargain: 0, //否 是否接收议价 0：是（默认） 1：否
            clean_deley: 0, //否 完货后多少天结算 15/30/45/60
            wastage: '', //否 损耗
            goods: '', //货品
            demurrage: 0, //否 滞期费

            goodsSelectedList: [],
            wastageTitle: 0,
            wastageNumber: 0,
        };

        this.config = isShipOwner() ?
            [
                {idKey:"ship_name", name:"船名", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectShip")},
                {idKey:"download_oil_list", name:"下载可运货品", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectDownload")},
                {idKey:"empty_port", name:"空船港", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPort")},
                {idKey:"empty_time",name:"空船期", logo:require('../images/icon_green.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
                {idKey:"course", name:"可运航向", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCourse")},
                {idKey:"upload_oil_list", name:"上载货品", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectUpload")},
            ]
                :
            [
                {idKey:"goods", name:"货品名称", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectGoods")},
                {idKey:"tonnage", name:"吨位", logo:require('../images/icon_red.png'), disable:true, numeric:true},
                {idKey:"price", name:"运价", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPrice")},
                {idKey:"loading_port", name:"装货港", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingPort")},
                {idKey:"unloading_port",name:"卸货港", logo:require('../images/icon_orange.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectUnloadingPort")},
                {idKey:"loading_time", name:"发货时间", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingTime")},
                {idKey:"wastage", name:"损耗", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectWastage")},
                {idKey:"demurrage", name:"滞期费", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectDemurrage")},
                {idKey:"clean_deley", name:"结算时间", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCleanDeley")},
            ];
        this.areaTypes = ['取消', '南上', '北下', '上江', '下江', '运河'];
        this.cleanDeleyTypes = ['取消', '15', '30', '45', '60'];
    }

    componentDidMount() {
        this.props.navigation.setParams({clickSureBtn:this.sureBtnClick});
    }

    sureBtnClick=()=> {
        if (isShipOwner()) {
            this.toReleaseForShipOwner();
        }
        else {
            this.toReleaseForGoodsOwner();
        }
    };

    toReleaseForShipOwner() {
        if (this.state.ship === null) {
            this.refToast.show("请选择船舶");
        }
        else if (this.state.downloadOilSelectedList.length === 0) {
            this.refToast.show("请选择下载货品");
        }
        else if (this.state.empty_port === null) {
            this.refToast.show("请选择空船港");
        }
        else if (this.state.empty_time === null) {
            this.refToast.show("请选择空船期");
        }
        else if (this.state.course === 0) {
            this.refToast.show("请选择可运航向");
        }
        else if (this.state.uploadOilSelectedList.length === 0) {
            this.refToast.show("请选择上载货品");
        }
        else {
            let downloadList = this.state.downloadOilSelectedList.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let uploadList = this.state.uploadOilSelectedList.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                ship_id: this.state.ship.ship_id,
                upload_oil_list: uploadList,
                download_oil_list: downloadList,
                empty_port: this.state.empty_port.port_id,
                empty_port_name: this.state.empty_port.port_name,
                empty_time: this.state.empty_time.Format("yyyy-MM-dd"),
                empty_delay: this.state.empty_delay,
                course: this.state.course,
                remark: 'from_ios',
            };

            NetUtil.post(appUrl + 'index.php/Mobile/Ship/add_ship_task/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert(result.message,'',
                                [{text:"确定"}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
    }

    toReleaseForGoodsOwner() {
        if (this.state.goodsSelectedList.length === 0) {
            this.refToast.show("请选择货品");
        }
        else if (this.state.tonnage === 0) {
            this.refToast.show("请设置吨位");
        }
        else if (this.state.price === 0) {
            this.refToast.show("请设置运价");
        }
        else if (this.state.loading_port === null) {
            this.refToast.show("请选择装船港");
        }
        else if (this.state.unloading_port === null) {
            this.refToast.show("请选择卸船港");
        }
        else if (this.state.loading_time === null) {
            this.refToast.show("请选择发货时间");
        }
        else if (this.state.wastage.length === 0) {
            this.refToast.show("请设置损耗");
        }
        else if (this.state.demurrage === 0) {
            this.refToast.show("请选择滞期费");
        }
        else if (this.state.clean_deley === 0) {
            this.refToast.show("请选择结算时间");
        }
        else {
            let goodsList = this.state.goodsSelectedList.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                goods: goodsList,
                tonnage: parseInt(this.state.tonnage) * 200,
                ton_section: parseInt(this.state.tonnage),
                price: this.state.price,
                is_bargain: this.state.is_bargain,
                loading_port: this.state.loading_port.port_id,
                loading_port_name: this.state.loading_port.port_name,
                unloading_port: this.state.unloading_port.port_id,
                unloading_port_name: this.state.unloading_port.port_name,
                loading_time: createRequestTime(this.state.loading_time),
                loading_delay: this.state.loading_delay,
                wastage: this.state.wastage,
                demurrage: parseInt(demurrageTypes[this.state.demurrage]),
                clean_deley: this.cleanDeleyTypes[this.state.clean_deley],
                remark: 'from_ios',
            };

            // PublicAlert(JSON.stringify(data));

            NetUtil.post(appUrl + 'index.php/Mobile/Goods/add_goods_task/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert(result.message,'',
                                [{text:"确定"}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectCourse") {
            this.areaTypeActionSheet.show();
        }
        else if (key === "SelectCleanDeley") {
            this.cleanDelayTypeActionSheet.show();
        }
        else if (key === "SelectDemurrage") {
            this.demurrageTypeActionSheet.show();
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
            this.props.navigation.navigate(
                "MyShip",
                {
                    callBack:this.callBackFromShipVC.bind(this)
                });
        }
        else if (key === "SelectEmptyTime") {
            this.props.navigation.navigate(
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
            this.props.navigation.navigate(
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
            this.props.navigation.navigate(
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
            this.props.navigation.navigate(
                "SelectPrice",
                {
                    title: '选择运价',
                    price: this.state.price,
                    is_bargain: this.state.is_bargain,
                    callBack:this.callBackFromPriceVC.bind(this)
                });
        }
        else {
            PublicAlert(key);
        }
    }

    toGoToPortsVC(key) {
        if (appAllPortsFirst.length > 0) {
            this.props.navigation.navigate(
                "SelectPort",
                {
                    title: '选择港口',
                    dataList: appAllPortsFirst,
                    key: key,
                    // selectedList:this.state.downloadOilSelectedList,
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
                m_string += shipWastageTypes[data1];
            }
            if (data1 > 0) {
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

    callBackFromPriceVC(price, is_bargain) {
        this.setState({
            price: price,
            is_bargain: is_bargain,
        })
    }

    toGoToGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '可运货品',
                    dataList: appAllGoods,
                    selectedList:this.state.goodsSelectedList,
                    maxSelectCount:5,
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
        let dataList = backData.map(
            (info) => {
                return info.goods_name;
            }
        )
        this.setState({
            goods: dataList.join(','),
            goodsSelectedList: backData
        });
    }

    toGoToDownGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '下载货品',
                    dataList: appAllGoods,
                    selectedList:this.state.downloadOilSelectedList,
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
        let dataList = backData.map(
            (info) => {
                return info.goods_name;
            }
        );
        this.setState({
            download_oil_list: dataList.join(','),
            downloadOilSelectedList: backData
        });
    }

    toGoToUpGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '上载货品',
                    dataList: appAllGoods,
                    selectedList:this.state.uploadOilSelectedList,
                    maxSelectCount:5,
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
        let dataList = backData.map(
            (info) => {
                return info.goods_name;
            }
        )
        this.setState({
            upload_oil_list: dataList.join(','),
            uploadOilSelectedList: backData
        });
    }

    textInputChanged(text, key){
        if (key === 'tonnage') {
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
                clean_deley: index
            });
        }
    }

    onSelectDemurrageType(index) {
        if (index > 0) {
            this.setState({
                demurrage: index
            });
        }
    }

    toSelectPhoto = (idKey) => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {
                    uri: response.uri
                };
                this.submitImage(source, idKey);
            }
        });
    };

    submitImage = (source, idKey) => {
        let formData = new FormData();
        let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.png'};
        formData.append("filename", file);
        NetUtil.postForm(appUrl + 'index.php/Mobile/Upload/upload_ship/', formData)
            .then(
                (result)=>{
                    if (result.code === 0) {

                    }
                    else {
                        PublicAlert(result.message);
                    }
                },(error)=>{
                    PublicAlert(error);
                });
    };

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'ship_name' && this.state.ship !== null) {
            return this.state.ship.ship_name;
        }
        else if (item.idKey === 'goods' && this.state.goods.length > 0) {
            return this.state.goods;
        }
        else if (item.idKey === 'download_oil_list' && this.state.download_oil_list.length > 0) {
            return this.state.download_oil_list;
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
        else if (item.idKey === 'course' && this.state.course > 0) {
            return this.areaTypes[this.state.course];
        }
        else if (item.idKey === 'clean_deley' && this.state.clean_deley > 0) {
            return '完货' + this.cleanDeleyTypes[this.state.clean_deley] + '天内';
        }
        else if (item.idKey === 'upload_oil_list' && this.state.upload_oil_list.length > 0) {
            return this.state.upload_oil_list;
        }
        else if (item.idKey === 'price' && this.state.price > 0) {
            return this.state.price + ' 元/吨 ' + (this.state.is_bargain === 1 ? "不议价" : "");
        }
        else if (item.idKey === 'wastage') {
            return this.state.wastage;
        }
        else if (item.idKey === 'demurrage' && this.state.demurrage > 0) {
            return demurrageTypes[this.state.demurrage] + ' 元/天'
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
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                <ActionSheet
                    ref={o => this.areaTypeActionSheet = o}
                    title={'请选择运输航向'}
                    options={this.areaTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectInvoiceType.bind(this)}
                />
                <ActionSheet
                    ref={o => this.cleanDelayTypeActionSheet = o}
                    title={'请选择结算时间'}
                    options={this.cleanDeleyTypes}
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
                <ScrollView style={styles.scrollView}>
                    {this._renderListItem()}
                </ScrollView>
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 0,
        backgroundColor: "#fff"
    },
    item:{
        borderBottomWidth: 1,
        borderBottomColor: "#f8f8f8",
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    active: {
        borderColor: "#81c2ff",
        color: "#0096ff"
    },
    label: {
        minWidth: 45,
        fontSize: 13,
        color:"#222",
        // paddingTop: 8
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        height: 30,
        fontSize: 13,
        paddingHorizontal: 10
    },
    radio: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        color: "#666",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        fontSize: 13,
        backgroundColor: "#fff"
    },
    avatar: {
        borderRadius: 5,
        marginLeft: 10,
        width: 60,
        height: 36,
        justifyContent: "center",
        alignItems: "center"
    }
});
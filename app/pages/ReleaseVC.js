import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';

import AddAuthItem from '../components/AddAuthItem';
import px2dp from "../util";
import {imagePickerOptions} from "../util/Global";
import Toast, {DURATION} from "react-native-easy-toast";

let {width, height} = Dimensions.get('window');


export default class ReleaseVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '发布',
        tabBarLabel: '发布',
        headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
            <TouchableOpacity
                onPress={navigation.state.params.clickParams}
            >
                <Text style={{marginRight: 10, color: appData.appBlueColor}}>{'  提交  '}</Text>
            </TouchableOpacity>
        </View>,
    });

    constructor(props){
        super(props)
        this.state = {
            ship: null,//船
            upload_oil_list: '',//上载油品
            download_oil_list: '',//下载油品
            empty_port: null,//空船港
            empty_time: new Date(),//空船期
            empty_delay: 0,//空船延迟
            course: '',//运输航向 1：南上 2：北下 3：上江 4：下江 5：运河（多选，用“##”隔开）
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
            goods: [], //否 货品（数组）
            demurrage: 0, //否 滞期费
        }

        this.config = (userData.usertype === '1') ?
            [
                {idKey:"tonnage", name:"吨位", logo:require('../images/icon_blue.png'), disable:true, numeric:true},
                {idKey:"price", name:"运价", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPrice")},
                {idKey:"loading_port", name:"装货港", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingPort")},
                {idKey:"uploading_port",name:"卸货港", logo:require('../images/icon_green.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectUploadingPort")},
                {idKey:"loading_time", name:"发货时间", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingTime")},
                {idKey:"wastage", name:"损耗", logo:require('../images/icon_red.png'), disable:true, numeric:true},
                {idKey:"demurrage", name:"滞期费", logo:require('../images/icon_blue.png'), disable:true, numeric:true},
                {idKey:"clean_deley", name:"结算时间", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCleanDeley")},
            ]
                :
            [
                {idKey:"ship_name", name:"船名", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectShip")},
                {idKey:"download_oil_list", name:"下载可运货品", logo:require('../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectDownload")},
                {idKey:"empty_port", name:"空船港", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectPort")},
                {idKey:"empty_time",name:"空船期", logo:require('../images/icon_green.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
                {idKey:"course", name:"可运航向", logo:require('../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectCourse")},
                {idKey:"upload_oil_list", name:"上载货品", logo:require('../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "SelectUpload")},
            ];
        this.areaTypes = ['取消', '南上', '北下', '上江', '下江', '运河'];
    }

    sureBtnClick=()=> {
        if (this.state.ship === null) {
            this.refToast.show("请选择船舶");
        }
        else {

        }
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.sureBtnClick});
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectCourse") {
            this.areaTypeActionSheet.show();
        }
        else if (key === "SelectDownload") {
            this.toGoToDownGoodsVC();
        }
        else if (key === "SelectUpload") {
            this.toGoToUpGoodsVC();
        }
        else if (key === "SelectPort") {
            this.toGoToPortsVC();
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
                    date: this.state.empty_time,
                    delay: this.state.empty_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else if (key === "SelectPrice") {
            this.props.navigation.navigate(
                "SelectPrice",
                {
                    title: '选择运价',
                    callBack:this.callBackFromPriceVC.bind(this)
                });
        }
        else {
            PublicAlert(key);
        }
    }

    toGoToPortsVC() {
        if (appAllPortsFirst.length > 0) {
            this.props.navigation.navigate(
                "SelectPort",
                {
                    title: '空船港',
                    dataList: appAllPortsFirst,
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
                            this.toGoToPortsVC();
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

    callBackFromPortVC(backData) {
        this.setState({
            empty_port: backData,
        })
    }

    callBackFromShipVC(backData) {
        this.setState({
            ship: backData,
        })
    }

    callBackFromTimeVC(backDate, backDelay) {
        this.setState({
            empty_time: backDate,
            empty_delay: backDelay,
        })
    }

    callBackFromPriceVC(backData) {
        this.setState({
            ship: backData,
        })
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
        )
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

    }

    onSelectInvoiceType(index) {
        if (index > 0) {
            this.setState({
                course: index
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
    }

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
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'ship_name' && this.state.ship !== null) {
            return this.state.ship.ship_name;
        }
        else if (item.idKey === 'download_oil_list' && this.state.download_oil_list.length > 0) {
            return this.state.download_oil_list;
        }
        else if (item.idKey === 'empty_port' && this.state.empty_port !== null) {
            return this.state.empty_port.port_name;
        }
        else if (item.idKey === 'empty_time' && this.state.empty_time !== null) {
            return this.state.empty_time.Format("yyyy.MM.dd") + '+' + this.state.empty_delay + '天';
        }
        else if (item.idKey === 'course' && this.state.course > 0) {
            return this.areaTypes[this.state.course];
        }
        else if (item.idKey === 'upload_oil_list' && this.state.upload_oil_list.length > 0) {
            return this.state.upload_oil_list;
        }

        return '';
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (<AddAuthItem key={i} {...item}
                                 subName = {this.renderSubNameForIndex(item, i)}
                                 callback={this.textInputChanged.bind(this)}>
            </AddAuthItem>);
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
        marginBottom: px2dp(0),
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
        fontSize: px2dp(13),
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
        fontSize: px2dp(13),
        backgroundColor: "#fff"
    },
    avatar: {
        borderRadius: 5,
        marginLeft: 10,
        width: px2dp(60),
        height: px2dp(36),
        justifyContent: "center",
        alignItems: "center"
    }
});
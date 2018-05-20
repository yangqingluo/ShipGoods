import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput, Dimensions
} from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker';

import CustomItem from '../components/CustomItem'
import Button from '../components/Button'
import {imagePickerOptions} from "../util/Global";
import Toast from "react-native-easy-toast";

export default class AddShip extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: "添加船舶"
        });
    constructor(props){
        super(props)
        this.state = {
            ship_name: '',//船名
            ship_licence: '',//船舶国际证书
            tonnage: '',//吨位
            storage: '',//仓容
            dieseloil: '',//可载柴油吨位
            gasoline: '',//可载汽油吨位
            area: 0,//航行区域 1：沿海 2：长江（可进川） 3：长江（不可进川)
            goods: '',//可运油品
            goodsList: [],

            ship_licence_source: null,
        }
        this.config = [
            {idKey:"ship_name", name:"船名", logo:require('../images/icon_blue.png'), disable:true},
            {idKey:"tonnage", name:"吨位", logo:require('../images/icon_red.png'), disable:true},
            {idKey:"storage", name:"仓容", logo:require('../images/icon_orange.png'), disable:true},
            {name:"可运油品", logo:require('../images/icon_green.png'), disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectGoods")},
            {idKey:"gasoline", name:"可载汽油吨位（选填）", logo:require('../images/icon_orange.png'), disable:true},
            {idKey:"dieseloil", name:"可载柴油吨位（选填）", logo:require('../images/icon_red.png'), disable:true},
            {name:"航行区域", logo:require('../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "area")},
            {idKey:"ship_licence", name:"船舶国际证书", logo:require('../images/icon_blue.png'), disable:false, subName:"", onPress:this.cellSelected.bind(this, "ship_licence")},
        ]

        this.areaTypes = global.shipAreaTypes;
    }


    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === 'SelectGoods') {
            this.toGoToSelectGoodsVC();
        }
        else if (key === 'area') {
            this.areaTypeActionSheet.show();
        }
        else if (key === 'ship_licence') {
            this.toSelectPhoto('ship_licence');
        }
        else {
            PublicAlert(key);
        }
    }

    toGoToSelectGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSelect',
                {
                    title: '请选择可运油品',
                    dataList: appAllGoods,
                    selectedList:this.state.goodsList,
                    maxSelectCount:5,
                    callBack:this.callBackFromSelectGoodsVC.bind(this)
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
                            this.toGoToSelectGoodsVC();
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

    callBackFromSelectGoodsVC(backData) {
        let dataList = backData.map(
            (info) => {
                return info.goods_name;
            }
        )
        this.setState({
            goodsList: backData,
            goods: dataList.join(',')
        });
    }

    goBack() {
        this.props.navigation.goBack();
    }

    submit() {
        if (this.state.ship_name.length === 0) {
            this.refToast.show("请输入船名");
        }
        else if (this.state.tonnage.length === 0) {
            this.refToast.show("请输入吨位");
        }
        else if (this.state.storage.length === 0) {
            this.refToast.show("请输入仓容");
        }
        else if (this.state.goodsList.length === 0) {
            this.refToast.show("请选择可运油品");
        }
        else if (this.state.area === 0) {
            this.refToast.show("请选择航行区域");
        }
        else if (this.state.ship_licence.length === 0) {
            this.refToast.show("请上传船舶国际证书");
        }

        else {
            let dataList = this.state.goodsList.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                ship_name:this.state.ship_name,
                tonnage:this.state.tonnage,
                storage:this.state.storage,
                goods:dataList,
                area:'' + this.state.area,
                ship_lience:this.state.ship_licence
            };
            if (this.state.gasoline.length !== 0) data.gasoline = this.state.gasoline;
            if (this.state.dieseloil.length !== 0) data.dieseloil = this.state.dieseloil;

            NetUtil.post(appUrl + 'index.php/Mobile/Ship/add_ship/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert('添加完成','',
                                [{text:"确定", onPress:this.goBack.bind(this)}]
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
    textInputChanged(text, key){
        if (key === 'ship_name') {
            this.setState({
                ship_name: text
            });
        }
        else if (key === 'tonnage') {
            this.setState({
                tonnage: text
            });
        }
        else if (key === 'storage') {
            this.setState({
                storage: text
            });
        }
        else if (key === 'gasoline') {
            this.setState({
                gasoline: text
            });
        }
        else if (key === 'dieseloil') {
            this.setState({
                dieseloil: text
            });
        }
    }

    onSelectAreaType(index) {
        if (index > 0) {
            this.setState({
                area: index
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
                        if (idKey === 'ship_licence') {
                            this.setState({
                                ship_licence: result.data.filename,
                                ship_licence_source: source
                            });
                        }
                    }
                    else {
                        PublicAlert(result.message);
                    }
                },(error)=>{
                    PublicAlert(error);
                });
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (<CustomItem key={i} {...item} subName = {
                (i === 6 && this.state.area > 0) ? this.areaTypes[this.state.area] :
                    ((i === 3 && this.state.goods.length > 0) ? this.state.goods : '')
            }
                                callback={this.textInputChanged.bind(this)}>
                {(i === 7 && this.state.ship_licence_source != null)?(
                        <Image style={styles.avatar} source={this.state.ship_licence_source} />
                    )
                    :null}
            </CustomItem>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                <ActionSheet
                    ref={o => this.areaTypeActionSheet = o}
                    title={'请选择航行区域'}
                    options={this.areaTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectAreaType.bind(this)}
                />
                <ScrollView style={styles.scrollView}>
                    {this._renderListItem()}
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, height:45, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <Button style={{ width:123, height:45, borderRadius: 22.5, overflow:"hidden"}} onPress={this.submit.bind(this)}>
                        <View style={{flex: 1, backgroundColor: appData.appBlueColor, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </Button>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View> );
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
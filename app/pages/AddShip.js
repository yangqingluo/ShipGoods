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

import AddAuthItem from '../components/AddAuthItem'
import px2dp from "../util";
import Button from '../components/Button'
import {imagePickerOptions} from "../util/Global";
import Toast, {DURATION} from "react-native-easy-toast";
let {width, height} = Dimensions.get('window')

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
            {idKey:"ship_name", name:"船名", color:"#4c6bff", disable:true},
            {idKey:"tonnage", name:"吨位", color:"#fc7b53", disable:true},
            {idKey:"storage", name:"仓容", color:"#ffc636", disable:true},
            {name:"可运油品", disable:false, subName:"324", color:"#94d94a", onPress:this.cellSelected.bind(this, "SelectGoods")},
            {idKey:"gasoline", name:"可载汽油吨位（选填）", color:"#fc7b53", disable:true},
            {idKey:"dieseloil", name:"可载柴油吨位（选填）", color:"#ffc636", disable:true},
            {name:"航行区域", disable:false, color:"#94d94a", onPress:this.cellSelected.bind(this, "area")},
            {idKey:"ship_licence", name:"船舶国际证书", disable:false, subName:"", color:"#fc7b53", onPress:this.cellSelected.bind(this, "ship_licence")},
        ]

        this.areaTypes = ['取消', '沿海', '长江（可进川）', '长江（不可进川)'];
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
            this.refToast.show("请输入船名", DURATION.LENGTH_SHORT);
        }
        else if (this.state.tonnage.length === 0) {
            this.refToast.show("请输入吨位", DURATION.LENGTH_SHORT);
        }
        else if (this.state.storage.length === 0) {
            this.refToast.show("请输入仓容", DURATION.LENGTH_SHORT);
        }
        else if (this.state.goodsList.length === 0) {
            this.refToast.show("请选择可运油品", DURATION.LENGTH_SHORT);
        }
        else if (this.state.area === 0) {
            this.refToast.show("请选择航行区域", DURATION.LENGTH_SHORT);
        }
        else if (this.state.ship_licence.length === 0) {
            this.refToast.show("请上传船舶国际证书", DURATION.LENGTH_SHORT);
        }

        else {
            let dataList = this.state.goodsList.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            )

            let data = {
                ship_name:this.state.ship_name,
                tonnage:this.state.tonnage,
                storage:this.state.storage,
                goods:dataList,
                area:this.state.area,
                ship_licence:this.state.ship_licence
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
                            this.refToast.show(result.message, DURATION.LENGTH_SHORT);
                        }
                    },(error)=>{
                        this.refToast.show(error, DURATION.LENGTH_SHORT);
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
                tonnage: text
            });
        }
        else if (key === 'dieseloil') {
            this.setState({
                storage: text
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
            return (<AddAuthItem key={i} {...item} subName = {
                (i === 6 && this.state.area > 0) ? this.areaTypes[this.state.area] :
                    ((i === 3 && this.state.goods.length > 0) ? this.state.goods : '')
            }
                                 callback={this.textInputChanged.bind(this)}>
                {(i === 7 && this.state.ship_licence_source != null)?(
                        <Image style={styles.avatar} source={this.state.ship_licence_source} />
                    )
                    :null}
            </AddAuthItem>);
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
                <View style={{position: "absolute", bottom: 20, width:width, height:40, justifyContent: "center", alignItems: "center"}}>
                    <Button style={{ width:90, height:40, borderRadius: 20, overflow:"hidden"}} onPress={this.submit.bind(this)}>
                        <View style={{flex: 1, height: 40, backgroundColor: appData.appBlueColor, alignItems: "center", justifyContent: "center"}}>
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
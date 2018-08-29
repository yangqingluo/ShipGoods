import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    TextInput,
    Dimensions
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import SelectImageCell from '../../components/SelectImageCell';
import CustomItem from '../../components/CustomItem';
import Button from '../../components/Button';
import {imagePickerOptions} from "../../util/Global";
import Toast from "react-native-easy-toast";
import IndicatorModal from '../../components/IndicatorModal';

export default class AddShip extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: "添加船舶"
        });
    constructor(props){
        super(props);
        this.state = {
            ship_name: '',//船名
            ship_lience: '',//船舶国籍证书
            tonnage: '',//吨位
            storage: '',//仓容
            dieseloil: '',//可载柴油吨位
            gasoline: '',//可载汽油吨位
            area: 0,//航行区域 1：沿海 2：长江（可进川） 3：长江（不可进川)
            ship_type: 0,
            goods: [],//意向货品
            projects: [],//主要项目证书

            ship_lience_source: null,
        };
        this.config = [];
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === 'goods') {
            this.toGoToSelectGoodsVC();
        }
        else if (key === 'area') {
            this.refAreaTypeActionSheet.show();
        }
        else if (key === 'ship_type') {
            this.refShipTypeActionSheet.show();
        }
        else if (key === 'ship_lience') {
            this.toSelectPhoto('ship_lience');
        }
        else if (key === 'projects') {
            if (this.state.projects.length >= appData.appMaxImageUploadNumber) {
                this.refToast.show("最多只能上传" + appData.appMaxImageUploadNumber + "张图片");
            }
            else {
                this.toSelectPhoto('projects');
            }
        }
        else {
            this.refToast.show("精彩功能，敬请期待 " + key);
        }
    }

    toGoToSelectGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSelect',
                {
                    title: '请选择意向货品',
                    dataList: appAllGoods,
                    selectedList:this.state.goods,
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
        this.setState({
            goods: backData,
        });
    }

    goBack() {
        if (objectNotNull(this.props.navigation.state.params.callBack)) {
            this.props.navigation.state.params.callBack("AddShip");
        }
        this.props.navigation.goBack();
    }

    submit() {
        if (this.state.ship_name.length === 0) {
            this.refToast.show("请输入船名");
        }
        else if (this.state.tonnage.length === 0) {
            this.refToast.show("请输入参考载重量");
        }
        else if (this.state.storage.length === 0) {
            this.refToast.show("请输入仓容");
        }
        else if (this.state.ship_type === 0) {
            this.refToast.show("请选择船舶类型");
        }
        // else if (this.state.goods.length === 0) {
        //     this.refToast.show("请选择意向货品");
        // }
        else if (this.state.area === 0) {
            this.refToast.show("请选择航行区域");
        }
        else if (this.state.ship_lience.length === 0) {
            this.refToast.show("请上传船舶国籍证书");
        }

        else {
            let dataList = this.state.goods.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                ship_name:this.state.ship_name,
                tonnage:this.state.tonnage,
                storage:this.state.storage,
                goods:null,
                ship_type:this.state.ship_type,
                area:'' + this.state.area,
                ship_lience:this.state.ship_lience
            };
            if (this.state.gasoline.length > 0) {
                data.gasoline = this.state.gasoline;
            }
            else {
                data.gasoline = '0';
            }

            if (this.state.dieseloil.length > 0) {
                data.dieseloil = this.state.dieseloil;
            }
            else {
                data.dieseloil = '0';
            }

            if (this.state.projects.length > 0) {
                data.projects = this.state.projects.join(",");
            }

            if (objectNotNull(this.props.navigation.state.params.key)) {
                //从认证界面进入时添加该参数
                data.is_check = '0';
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/add_ship/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            PublicAlert('添加完成','',
                                [{text:"确定", onPress:this.goBack.bind(this)}]
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

    onSelectShipType(index) {
        if (index > 0) {
            this.setState({
                ship_type: index
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

        this.refIndicator.show();
        NetUtil.postForm(appUrl + 'index.php/Mobile/Upload/upload_ship/', formData)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        if (idKey === 'ship_lience') {
                            this.setState({
                                ship_lience: result.data.filename,
                                ship_lience_source: source
                            });
                        }
                        else if (idKey === 'projects') {
                            // this.state.projects.splice(this.state.projects.length - 1, 0, result.data.filename);
                            this.state.projects.push(result.data.filename);
                            this.forceUpdate();
                        }
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
                });
    };

    refreshConfig() {
        let {ship_type} = this.state;
        this.config = [
            {idKey:"ship_name", name:"船名", logo:require('../../images/icon_blue.png'), disable:true},
            {idKey:"tonnage", name:"参考载重量(吨)", logo:require('../../images/icon_red.png'), disable:true, numeric:true},
            {idKey:"storage", name:"仓容", logo:require('../../images/icon_orange.png'), disable:true, numeric:true},
            {idKey:"ship_type", name:"船舶类型", logo:require('../../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "ship_type")},
            // {idKey:"goods", name:"意向货品", logo:require('../../images/icon_orange.png'), disable:false, onPress:this.cellSelected.bind(this, "goods")},
        ];
        let type = null;
        if (ship_type > 0 && ship_type < shipTypes.length) {
            type = shipTypes[ship_type];
        }
        if (objectNotNull(type) && type.search("油") !== -1) {
            if (type === "油船3级") {
                this.config = this.config.concat([
                    {idKey:"dieseloil", name:"可载柴油吨位（选填）", logo:require('../../images/icon_red.png'), disable:true, numeric:true},
                ]);
                this.state.gasoline = '';
            }
            else {
                this.config = this.config.concat([
                    {idKey:"gasoline", name:"可载汽油吨位（选填）", logo:require('../../images/icon_orange.png'), disable:true, numeric:true},
                    {idKey:"dieseloil", name:"可载柴油吨位（选填）", logo:require('../../images/icon_red.png'), disable:true, numeric:true},
                ]);
            }
        }
        else {
            this.state.gasoline = '';
            this.state.dieseloil = '';
        }
        this.config = this.config.concat([
            {idKey:"area", name:"航行区域", logo:require('../../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "area")},
            {idKey:"ship_lience", name:"上传船舶国籍证书", logo:require('../../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "ship_lience")},
            {idKey:"projects", name:"上传船舶主要项目证书", logo:require('../../images/icon_blue.png'), disable:false, onPress:this.cellSelected.bind(this, "projects")},
        ]);
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'goods' && this.state.goods.length > 0) {
            let dataList = this.state.goods.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return dataList.join(",");
        }
        else if (item.idKey === 'area' && this.state.area > 0) {
            return getArrayTypesText(shipAreaTypes, this.state.area);
        }
        else if (item.idKey === 'ship_type' && this.state.ship_type > 0) {
            return getArrayTypesText(shipTypes, this.state.ship_type);
        }
        return '';
    }

    renderEditValueForIndex(item, index) {
        return '';
    }

    onProjectCellSelected = (info) => {
        dismissKeyboard();
        // if (info.index >= this.state.projects.length) {
        //     if (info.index >= appData.appMaxImageUploadNumber) {
        //         this.refToast.show("最多只能上传" + appData.appMaxImageUploadNumber + "张图片");
        //     }
        //     else {
        //         this.toSelectPhoto('projects');
        //     }
        // }
    };

    onProjectCellDelBtnAction = (info) => {
        this.state.projects.splice(info.index, 1);
        this.forceUpdate();
    };

    renderProjectCell = (info) => {
        return (
            <SelectImageCell
                info={info}
                onPress={this.onProjectCellSelected.bind(this)}
                onDelPress={this.onProjectCellDelBtnAction.bind(this)}
                last={info.index >= this.state.projects.length}
            />
        )
    };

    renderSubViewForIndex(item, index) {
        if (item.idKey === 'ship_lience') {
            if (!stringIsEmpty(this.state.ship_lience)) {
                return <Image style={styles.avatar} source={{uri:appUrl + this.state.ship_lience}}/>;
            }
        }
        else if (item.idKey === 'projects') {
            let projects = arrayNotEmpty(this.state.projects) ? [].concat(this.state.projects) : [];
            // projects.push("add");
            return <FlatList
                numColumns ={3}
                data={projects}
                renderItem={this.renderProjectCell}
                keyExtractor={(item: Object, index: number) => {
                    return '' + index;
                }}
                style={{minWidth: 140}}
                contentContainerStyle={{alignItems: "flex-end",}}
            />
        }
        return null;
    }

    _renderListItem() {
        this.refreshConfig();
        return this.config.map((item, i) => {
            return (<CustomItem key={i} {...item}
                                maxLength={objectNotNull(item.numeric) ? appData.appMaxLengthNumber : appData.appMaxLengthName}
                                subName = {this.renderSubNameForIndex(item, i)}
                                editValue = {this.renderEditValueForIndex(item, i)}
                                callback={this.textInputChanged.bind(this)}>
                {this.renderSubViewForIndex(item, i)}
                </CustomItem>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
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
                <ActionSheet
                    ref={o => this.refAreaTypeActionSheet = o}
                    title={'请选择航行区域'}
                    options={shipAreaTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectAreaType.bind(this)}
                />
                <ActionSheet
                    ref={o => this.refShipTypeActionSheet = o}
                    title={'请选择船舶类型'}
                    options={shipTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectShipType.bind(this)}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
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
        alignItems: "center",
        resizeMode: "stretch",
    }
});
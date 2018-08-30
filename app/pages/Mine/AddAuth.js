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
import CustomItem from '../../components/CustomItem'
import Button from '../../components/Button'
import {imagePickerOptions} from "../../util/Global";
import Toast from "react-native-easy-toast";
import IndicatorModal from '../../components/IndicatorModal';

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: '资质认证',
        });

    constructor(props){
        super(props);
        this.state = {
            bz_licence: '',//公司营业执照
            idcard_front: '',//法人身份证正面
            idcard_con: '',//法人身份证反面
            corporation: '',//公司名称
            phone: '',//公司电话
            name: '',//联系人姓名
            contact: '',//联系人手机号
            invoice_type: 0,//可开发票类型 1、增值税专用 2、增值税普通 3、其他
            invoice_remark: '',//发票备注  是/否(二选一)

            bz_licence_source: null,
            idcard_front_source: null,
            idcard_con_source: null,

            hasAddShip: false,
        };
        this.config = isShipOwner() ?
            [
                {idKey:"corporation", name:"公司名称", logo:require('../../images/icon_blue.png'), disable:true},
                {idKey:"name", name:"联系人姓名", logo:require('../../images/icon_red.png'), disable:true},
                {idKey:"contact", name:"联系人手机号", logo:require('../../images/icon_orange.png'), disable:true, numeric:true},
                {idKey:"bz_licence", name:"上传公司营业执照", logo:require('../../images/icon_green.png'), disable:false, onPress:this.cellSelected.bind(this, "bz_licence")},
                {idKey:"idcard", name:"上传法人身份证", disable:false, logo:require('../../images/icon_red.png'),},
                {idKey:"add_ship",name:"添加船舶", disable:false, logo:require('../../images/icon_orange.png'), onPress:this.cellSelected.bind(this, "add_ship")},
                {idKey:"invoice", name:"可开发票类型", disable:false, logo:require('../../images/icon_green.png'), onPress:this.cellSelected.bind(this, "invoice_type")},
            ]
                :
            [
                {idKey:"corporation", name:"公司名称", logo:require('../../images/icon_blue.png'), disable:true},
                {idKey:"phone", name:"公司电话", logo:require('../../images/icon_red.png'), disable:true, numeric:true},
                {idKey:"name", name:"联系人姓名", logo:require('../../images/icon_orange.png'), disable:true},
                {idKey:"contact", name:"联系人手机号", logo:require('../../images/icon_green.png'), disable:true, numeric:true},
                {idKey:"bz_licence", name:"上传公司营业执照", logo:require('../../images/icon_red.png'), disable:false, onPress:this.cellSelected.bind(this, "bz_licence")},
                {idKey:"idcard", name:"上传联系人身份证", disable:false, logo:require('../../images/icon_orange.png')},
                {idKey:"invoice", name:"可开发票类型", disable:false, logo:require('../../images/icon_green.png'), onPress:this.cellSelected.bind(this, "invoice_type")},
            ];

        this.invoiceTypes = ['取消', '增值税专用发票(10%)', '增值税普通发票', '其他发票'];
    }

    componentDidMount() {
        this.requestShipsNumber(false);
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === 'add_ship') {
            if (this.state.hasAddShip) {
                this.refToast.show("船舶已添加");
            }
            else {
                this.requestShipsNumber(true);
            }
        }
        else if (key === 'invoice_type') {
            this.invoiceTypeActionSheet.show();
        }
        else if (key === 'bz_licence') {
            this.toSelectPhoto('bz_licence');
        }
        else {
            PublicAlert(key);
        }
    }

    callBackFromShipVC(key) {
        this.setState({
            hasAddShip: true,
        })
    }

    goBack() {
        userData.authstate = 0;
        saveUserData(userData);
        appMineVC._onRefresh();
        this.props.navigation.goBack();
    }

    submit() {
        if (this.state.corporation.length === 0) {
            this.refToast.show("请输入公司名称");
        }
        else if (this.state.phone.length === 0 && global.userData.usertype === '1') {
            this.refToast.show("请输入公司电话");
        }
        else if (this.state.name.length === 0) {
            this.refToast.show("请输入联系人姓名");
        }
        else if (this.state.contact.length !== 11) {
            this.refToast.show("请输入正确的联系人手机号");
        }
        else if (this.state.bz_licence.length === 0) {
            this.refToast.show("请上传公司营业执照");
        }
        else if (this.state.idcard_front.length === 0 || this.state.idcard_con.length === 0) {
            this.refToast.show("请上传身份证");
        }
        else if (this.state.invoice_type === 0) {
            this.refToast.show("请选择发票类型");
        }
        else if (isShipOwner() && !this.state.hasAddShip) {
            this.refToast.show("请添加船舶");
        }
        else {
            let data = {
                corporation:this.state.corporation,
                phone:this.state.phone,
                contact:this.state.contact,
                name:this.state.name,
                bz_licence:this.state.bz_licence,
                idcard_front:this.state.idcard_front,
                idcard_con:this.state.idcard_con,
                invoice_type:this.state.invoice_type
            };

            this.doAuthFunction(data);
        }
    }

    doAuthFunction(data) {
        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Auth/add_auth/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        PublicAlert('提交认证完成','请等待审核结果',
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

    requestShipsNumber = async (isGoToAdd) => {
        let data = {page: this.state.page, state:2};

        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_my_ship/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        if (result.data.length === 0) {
                            if (isGoToAdd) {
                                this.props.navigation.navigate('AddShip',
                                    {callBack: this.callBackFromShipVC.bind(this),
                                        key:"FromAuth",
                                    });
                            }
                        }
                        else {
                            this.setState({
                                hasAddShip: true,
                            });
                            if (isGoToAdd) {
                                this.refToast.show("未认证不能添加更多船舶");
                            }
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

    textInputChanged(text, key){
        if (key === 'contact') {
            this.setState({
                contact: text
            });
        }
        else if (key === 'name') {
            this.setState({
                name: text
            });
        }
        else if (key === 'corporation') {
            this.setState({
                corporation: text
            });
        }
        else if (key === 'phone') {
            this.setState({
                phone: text
            });
        }
    }

    onSelectInvoiceType(index) {
        if (index > 0) {
            this.setState({
                invoice_type: index
            });
        }
    }

    onSelectIdCard(index) {
        if (index === 0) {
            this.toSelectPhoto('idcard_front');
        }
        else {
            this.toSelectPhoto('idcard_con');
        }
    }

    toSelectPhoto(idKey) {
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

    submitImage(source, idKey) {
        let formData = new FormData();
        let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.png'};
        formData.append("filename", file);

        this.refIndicator.show();
        NetUtil.postForm(appUrl + 'index.php/Mobile/Upload/upload_corporation/', formData)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        if (idKey === 'bz_licence') {
                            this.setState({
                                bz_licence: result.data.filename,
                                bz_licence_source: source
                            });
                        }
                        else if (idKey === 'idcard_front') {
                            this.setState({
                                idcard_front: result.data.filename,
                                idcard_front_source: source
                            });
                        }
                        else if (idKey === 'idcard_con') {
                            this.setState({
                                idcard_con: result.data.filename,
                                idcard_con_source: source
                            });
                        }
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
                });
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'invoice' && this.state.invoice_type > 0) {
            return this.invoiceTypes[this.state.invoice_type];
        }
        else if (item.idKey === 'add_ship' && this.state.hasAddShip) {
            return "已添加";
        }
        return '';
    }

    renderRightForIndex(item, index) {
         if (item.idKey === 'bz_licence' && this.state.bz_licence_source !== null) {
             return <Image style={styles.avatar} source={this.state.bz_licence_source} />;
         }
         else if (item.idKey === 'idcard') {
             return (<View style={{flex:1, flexDirection: "row", justifyContent: "flex-end",}}>
                 <Button style={styles.avatar} onPress={this.onSelectIdCard.bind(this, 0)}>
                     {this.state.idcard_front_source === null ?
                         <Text style={[styles.radio, null]}>{"正面"}</Text>
                         :
                         <Image style={styles.avatar} source={this.state.idcard_front_source} />
                     }
                 </Button>
                 <Button style={styles.avatar} onPress={this.onSelectIdCard.bind(this, 1)}>
                     {this.state.idcard_con_source === null ?
                         <Text style={[styles.radio, null]}>{"反面"}</Text>
                         :
                         <Image style={styles.avatar} source={this.state.idcard_con_source} />
                     }
                 </Button>
             </View>);
         }
        return null;
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (<CustomItem key={i} {...item} subName = {this.renderSubNameForIndex(item, i)}
                                callback={this.textInputChanged.bind(this)}>
                {this.renderRightForIndex(item, i)}
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
                <View style={{position: "absolute", bottom: 20, width:screenWidth, height:40, justifyContent: "center", alignItems: "center"}}>
                    <Button style={{ width:90, height:40, borderRadius: 20, overflow:"hidden"}} onPress={this.submit.bind(this)}>
                        <View style={{flex: 1, height: 40, backgroundColor: appData.appBlueColor, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </Button>
                </View>
                <ActionSheet
                    ref={o => this.invoiceTypeActionSheet = o}
                    title={'请选择发票类型'}
                    options={this.invoiceTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectInvoiceType.bind(this)}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View> );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        flex:1,
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
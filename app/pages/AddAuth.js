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
        };
        this.config = (userData.usertype === '1') ?
            [
                {idKey:"corporation", name:"公司名称", logo:require('../images/icon_blue.png'), disable:true},
                {idKey:"phone", name:"公司电话", logo:require('../images/icon_red.png'), disable:true, numeric:true},
                {idKey:"name", name:"联系人姓名", logo:require('../images/icon_orange.png'), disable:true},
                {idKey:"contact", name:"联系人手机号", logo:require('../images/icon_green.png'), disable:true, numeric:true},
                {idKey:"bz_licence", name:"上传公司营业执照", logo:require('../images/icon_red.png'), disable:false, subName:"", onPress:this.cellSelected.bind(this, "bz_licence")},
                {idKey:"idcard", name:"上传联系人身份证", disable:false, logo:require('../images/icon_orange.png'), subName:"123"},
                {idKey:"invoice", name:"可开发票类型", disable:false, logo:require('../images/icon_green.png'), onPress:this.cellSelected.bind(this, "invoice_type")},
            ]
                :
            [
                {idKey:"corporation", name:"公司名称", logo:require('../images/icon_blue.png'), disable:true},
                {idKey:"name", name:"联系人姓名", logo:require('../images/icon_red.png'), disable:true},
                {idKey:"contact", name:"联系人手机号", logo:require('../images/icon_orange.png'), disable:true, numeric:true},
                {idKey:"bz_licence", name:"上传公司营业执照", logo:require('../images/icon_green.png'), disable:false, subName:"", onPress:this.cellSelected.bind(this, "bz_licence")},
                {idKey:"idcard", name:"上传法人身份证", disable:false, logo:require('../images/icon_red.png'), subName:"123"},
                {name:"添加船舶", disable:false, logo:require('../images/icon_orange.png'), subName:"324", onPress:this.cellSelected.bind(this, "AddShip")},
                {idKey:"invoice", name:"可开发票类型", disable:false, logo:require('../images/icon_green.png'), onPress:this.cellSelected.bind(this, "invoice_type")},
            ];

        this.invoiceTypes = ['取消', '增值税专用发票(11%)', '增值税普通发票', '其他发票'];
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === 'AddShip') {
            this.props.navigation.navigate(key);
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

    goBack() {
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

            NetUtil.post(appUrl + 'index.php/Mobile/Auth/add_auth/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert('提交认证完成','请等待审核结果',
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
        NetUtil.postForm(appUrl + 'index.php/Mobile/Upload/upload_corporation/', formData)
            .then(
                (result)=>{
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
                        PublicAlert(result.message);
                    }
                },(error)=>{
                    PublicAlert(error);
                });
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'invoice' && this.state.invoice_type > 0) {
            return this.invoiceTypes[this.state.invoice_type];
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
            return (<AddAuthItem key={i} {...item} subName = {this.renderSubNameForIndex(item, i)}
                                 callback={this.textInputChanged.bind(this)}>
                {this.renderRightForIndex(item, i)}
            </AddAuthItem>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                <ActionSheet
                    ref={o => this.invoiceTypeActionSheet = o}
                    title={'请选择发票类型'}
                    options={this.invoiceTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectInvoiceType.bind(this)}
                />
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
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import CustomItem from '../../components/CustomItem'
import Button from '../../components/Button'
import {imagePickerOptions} from "../../util/Global";
import Toast from "react-native-easy-toast";

export default class ChangeContactVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: '变更联系人',
        });

    constructor(props){
        super(props);
        this.state = {
            idcard_front: '',//法人身份证正面
            idcard_con: '',//法人身份证反面
            name: '',//联系人姓名
            contact: '',//联系人手机号

            idcard_front_source: null,
            idcard_con_source: null,
        };
        this.config = [
            {idKey:"name", name:"联系人姓名", logo:require('../../images/icon_blue.png'), disable:true},
            {idKey:"contact", name:"联系人手机号", logo:require('../../images/icon_red.png'), disable:true, numeric:true},
            {idKey:"idcard", name:"上传联系人身份证", disable:false, logo:require('../../images/icon_orange.png')},
        ];
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === 'invoice_type') {
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
        if (this.state.name.length === 0) {
            this.refToast.show("请输入联系人姓名");
        }
        else if (this.state.contact.length !== 11) {
            this.refToast.show("请输入正确的联系人手机号");
        }
        else if (this.state.idcard_front.length === 0 || this.state.idcard_con.length === 0) {
            this.refToast.show("请上传身份证");
        }
        else {
            let data = {
                contact:this.state.contact,
                name:this.state.name,
                idcard_front:this.state.idcard_front,
                idcard_con:this.state.idcard_con,
            };

            NetUtil.post(appUrl + 'index.php/Mobile/Auth/update_auth/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            this.refToast.show(result.message);
                            // PublicAlert('变更完成','',
                            //     [{text:"确定", onCellSelected:this.goBack.bind(this)}]
                            // );
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
                        if (idKey === 'idcard_front') {
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
        return '';
    }

    renderRightForIndex(item, index) {
        if (item.idKey === 'idcard') {
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
                <Toast ref={o => this.refToast = o} position={'center'}/>
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
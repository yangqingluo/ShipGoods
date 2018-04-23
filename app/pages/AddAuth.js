import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput, Dimensions
} from 'react-native';

import AddAuthItem from '../components/AddAuthItem'
import px2dp from "../util";
import Button from '../components/Button'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker';
let {width, height} = Dimensions.get('window')

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: '资质认证',
        });

    constructor(props){
        super(props)
        this.state = {
            bz_licence: PropTypes.string,//公司营业执照
            idcard_front: PropTypes.string,//法人身份证正面
            idcard_con: PropTypes.string,//法人身份证反面
            corporation: PropTypes.string,//公司名称
            name: PropTypes.string,//联系人姓名
            contact: PropTypes.string,//联系人手机号
            invoice_type: PropTypes.int,//可开发票类型 1、增值税专用 2、增值税普通 3、其他
            invoice_remark: PropTypes.string,//发票备注  是/否(二选一)

            bz_licence_source: PropTypes.string,
    }
        this.config = [
            {idKey:"corporation", name:"公司名称", color:"#4c6bff", disable:true},
            {idKey:"name", name:"联系人姓名", color:"#fc7b53", disable:true},
            {idKey:"contact", name:"联系人手机号", color:"#ffc636", disable:true, numeric:true},
            {name:"上传公司营业执照", disable:false, subName:"", color:"#94d94a", onPress:this.cellSelected.bind(this, "bz_licence")},
            {name:"上传法人身份证", disable:false, subName:"", color:"#ffc636", onPress:this.cellSelected.bind(this, "法人身份证")},
            {name:"添加船舶", disable:false, subName:"", color:"#fc7b53", onPress:this.cellSelected.bind(this, "AddShip")},
            {name:"可开发票类型", disable:false, subName:"", color:"#94d94a", onPress:this.cellSelected.bind(this, "invoice_type")},
        ]

        this.invoiceTypes = ['增值税专用发票(11%)', '增值税普通发票', '其他发票', '取消'];
    }

    cellSelected(key, data = {}){
        if (key === 'AddShip') {
            this.props.navigation.navigate(key);
        }
        else if (key === 'invoice_type') {
            this.invoiceTypeActionSheet.show();
        }
        else if (key === 'bz_licence') {
            this.toSelectBZLicencePhoto();
        }
        else {
            PublicAlert(key);
        }
    }

    submit(){

    }

    _onPressButton(text, key){
        
    }

    toSelectBZLicencePhoto = () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            title: '请选择营业执照图片',
            takePhotoButtonTitle: '选择相机',
            chooseFromLibraryButtonTitle: '选择相片',
            cancelButtonTitle: '取消',
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
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
                let source = { uri: response.uri };

                this.setState({
                    bz_licence_source: source
                });
            }
        });
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            // switch (i){
            //     case 0:{
            //         return (<AddAuthItem key={i} {...item} callback={this._onPressButton.bind(this)}>
            //         </AddAuthItem>);
            //     }
            //     break;
            // }
            return (<AddAuthItem key={i} {...item} callback={this._onPressButton.bind(this)}/>)
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
                    cancelButtonIndex={3}
                    // destructiveButtonIndex={1}
                    onPress={(index) => {
                        if (index < 3) {

                        }
                    }}
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
    }
});
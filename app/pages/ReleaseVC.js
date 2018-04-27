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
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker';

import AddAuthItem from '../components/AddAuthItem'
import px2dp from "../util";
import Button from '../components/Button'
import {imagePickerOptions} from "../util/Global";
import Toast, {DURATION} from "react-native-easy-toast";

let {width, height} = Dimensions.get('window')


export default class ReleaseVC extends Component {
    static navigationOptions = {
        headerTitle: '发布',
        tabBarLabel: '发布',
    };

    constructor(props){
        super(props)
        this.state = {
            ship: Object,//船
            upload_oil_list: [],//上载油品
            download_oil_list: [],//下载油品
            empty_port: 0,//空船港
            empty_port_name: '',//空船港港口名
            empty_time: 0,//空船期
            empty_delay: 0,//空船延迟
            course: '',//运输航向 1：南上 2：北下 3：上江 4：下江 5：运河（多选，用“##”隔开）
            remark: '',//备注
    }
        this.config = [
            {idKey:"ship_name", name:"船名", color:"#4c6bff", disable:true},
            {idKey:"tonnage", name:"下载可运货品", color:"#fc7b53", disable:false, onPress:this.cellSelected.bind(this, "SelectTonnage")},
            {idKey:"storage", name:"空船港", color:"#ffc636", disable:true},
            {idKey:"storage",name:"空船期", disable:true, subName:"324", color:"#94d94a"},
            {idKey:"course", name:"可运航向", color:"#fc7b53", disable:false, onPress:this.cellSelected.bind(this, "SelectCourse")},
            {idKey:"dieseloil", name:"上载货品", color:"#ffc636", disable:true},
            {idKey:"dieseloil", name:"上载货品", color:"#ffc636", disable:true},
            {idKey:"dieseloil", name:"上载货品", color:"#ffc636", disable:true},
            {idKey:"dieseloil", name:"上载货品", color:"#ffc636", disable:true},
            {idKey:"dieseloil", name:"上载货品", color:"#ffc636", disable:true},
        ]
        this.areaTypes = ['取消', '沿海', '长江（可进川）', '长江（不可进川)'];
    }


    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectCourse") {
            this.areaTypeActionSheet.show();
        }
        else if (key === "SelectTonnage") {
            this.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '请选择下载可运货品',
                }
            );
        }
        else {
            PublicAlert(key);
        }
    }

    submit() {

    }

    textInputChanged(text, key){

    }

    onSelectInvoiceType(index) {
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
            return (<AddAuthItem key={i} {...item}
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
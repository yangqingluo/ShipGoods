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

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: '修改密码',
        });

    constructor(props){
        super(props);
        this.state = {
            mobile: '',
            code: '',
            password: '',
            password_again: '',
            codeInterval: 0,
        };
        this.config = [
            {idKey:"mobile", name:"请输入注册手机号", logo:require('../../images/icon_line.png'), disable:true, maxLength:appData.appMaxLengthPhone, numeric:true},
            {idKey:"code", name:"请输入验证码", logo:require('../../images/icon_line.png'), disable:true, maxLength:appData.appMaxLengthVerifyCode, numeric:true},
            {idKey:"password", name:"请输入新密码", logo:require('../../images/icon_line.png'), disable:true, secureTextEntry:true, maxLength:appData.appMaxLengthPassword},
            {idKey:"password_again", name:"请再次输入新密码", logo:require('../../images/icon_line.png'), disable:true, secureTextEntry:true, maxLength:appData.appMaxLengthPassword},
        ];

        this._timer = null;
    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
    }

    goBack() {
        this.props.navigation.goBack();
    }

    onSendCodeBtnAction() {
        let {mobile} = this.state;
        if (judgeMobilePhone(mobile)) {
            let tokens = (parseInt(mobile.substr(7, 4)) - 18) * 8;
            let data = {mobile:mobile, tokens:tokens};
            NetUtil.post(appUrl + 'index.php/Mobile/App/get_sdfsefdg_5621/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            this.refToast.show(result.message);
                            this.sendedCodeAction();
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
        else {
            this.refToast.show("请输入正确的手机号码");
        }
    };

    sendedCodeAction() {
        this.setState({
            codeInterval: 60,
        });
        let that = this;
        this._timer = setInterval(function () {
            if (that.state.codeInterval > 0) {
                that.setState({
                    codeInterval: that.state.codeInterval - 1,
                });
            }
            else {
                clearInterval(that._timer);
            }
        }, 1000);
    }

    submit() {
        let {mobile, code, password, password_again} = this.state;
        if (!judgeMobilePhone(mobile)) {
            this.refs.toast.show("请输入正确的手机号");
        }
        else if (!judgeVerifyCode(code)) {
            this.refs.toast.show("请输入正确的验证码");
        }
        else if (!judgePassword(password)) {
            this.refToast.show("请输入正确长度的密码");
        }
        else if (password !== password_again) {
            this.refToast.show("两次密码输入不一致");
        }
        else {
            let data = {
                mobile: mobile,
                code: code,
                password: password,
            };

            NetUtil.post(appUrl + 'index.php/Mobile/User/find_password/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            // PublicAlert('修改密码完成','',
                            //     [{text:"确定", onPress:this.goBack.bind(this)}]
                            // );
                            this.refToast.show(result.message);
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
        if (key === 'mobile') {
            this.setState({
                mobile: text
            });
        }
        else if (key === 'code') {
            this.setState({
                code: text
            });
        }
        else if (key === 'password') {
            this.setState({
                password: text
            });
        }
        else if (key === 'password_again') {
            this.setState({
                password_again: text
            });
        }
    }


    renderRightForIndex(item, index) {
        if (item.idKey === 'code') {
            if (this.state.codeInterval > 0) {
                return <Text style={[styles.codeText, {color: appData.appLightGrayColor}]}>
                    {'' + this.state.codeInterval}
                </Text>
            }
            return <Button onPress={this.onSendCodeBtnAction.bind(this)}>
                <Text style={styles.codeText}>
                    {"发送验证码"}
                </Text>
            </Button>;
        }

        return null;
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View style={{paddingLeft:10}} key={'' + i}>
                    <CustomItem key={i} {...item}
                                logoWidth={1}
                                logoHeight={20}
                                callback={this.textInputChanged.bind(this)}>
                        {this.renderRightForIndex(item, i)}
                    </CustomItem>
                </View>
            );
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
                    <Button style={{ width:123, height:45, borderRadius: 100, overflow:"hidden"}} onPress={this.submit.bind(this)}>
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
        flex:1,
        backgroundColor: "#fff"
    },
    codeText: {
        width:80,
        textAlign: 'right',
        fontSize: 14,
        color: appData.appBlueColor,
    },
});
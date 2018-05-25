import React, { Component } from 'react';

import {
    Image,
    ImageBackground,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Picker,
} from 'react-native'

import CustomTextInput from '../components/CustomTextInput'
import ActionSheet from 'react-native-actionsheet'
import Toast from 'react-native-easy-toast';

const checkNum = (num) => {
    if(num) {

        if (num.length > 11) {
            return num.slice(0, 11);
        }
        else {
            return num;
        }
        
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNum: "",
            chkCode: "",
            password: "",
            usertype: 0,
            sendChk: "发送验证码",

            ispassword: true,
            isShowSelectRole: false,
        };

        this.roleTypes = ['取消', '我是货主', '我是船主'];
        this._timer = null;
    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: null,
        }
    };

    goBack() {
        this.props.navigation.goBack();
    }

    onCfmButtonPress = () => {
        let {phoneNum, chkCode, password, usertype} = this.state;
        if (!judgeMobilePhone(phoneNum)) {
            this.refs.toast.show("请输入正确的手机号");
        }
        else if (!judgeVerifyCode(chkCode)) {
            this.refs.toast.show("请输入正确的验证码");
        }
        else if (!judgePassword(password)) {
            this.refs.toast.show("请输入正确长度的密码");
        }
        else if (usertype === 0) {
            this.refs.toast.show("请选择用户角色");
        }
        else {
            let data = {
                mobile: phoneNum,
                code: chkCode,
                password: password,
                usertype: usertype
            };

            NetUtil.post(appUrl + 'index.php/Mobile/User/register/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert('注册完成', '',
                                [{text:"确定", onPress:this.goBack.bind(this)}]
                            );
                        }
                        else {
                            this.refs.toast.show(result.message);
                        }
                    },(error)=>{
                        this.refs.toast.show(error);
                    });
        }
    };
    
    onBackBtnPress = () => {
        this.props.navigation.goBack();
    };
    
    onSendChkCodeBtnPress = () => {
        if (this.state.sendChk === "发送验证码") {
            if (judgeMobilePhone(this.state.phoneNum)) {
                let tokens = (parseInt(this.state.phoneNum.substr(7, 4)) - 18) * 8;

                let data = {mobile:this.state.phoneNum, tokens:tokens};

                NetUtil.post(appUrl + 'index.php/Mobile/App/get_sdfsefdg_5621/', data)
                    .then(
                        (result)=>{
                            if (result.code === 0) {
                                PublicAlert('验证码已发送');
                                this.chkCodeCount();
                            }
                            else {
                                this.refs.toast.show(result.message);
                            }
                        },(error)=>{
                            this.refs.toast.show(error);
                        });
            }
            else {
                this.refs.toast.show("请输入正确的手机号码");
            }
        }
    };

    onEyeBtnPress = () => {
        if (this.state.ispassword) {
            this.setState({
                ispassword: false,
            })
        } else {
            this.setState({
                ispassword: true,
            })
        }
    };

    onRoleBtnAction() {
        this.setState({
            isShowSelectRole: true,
        });
        this.refRoleTypeActionSheet.show();
    }

    onSelectRoleType(index) {
        this.setState({
            isShowSelectRole: false,
        });
        if (index > 0) {
            this.setState({
                usertype: index
            });
        }
    }

    chkCodeCount = () => {
        that = this;
        this._timer = setInterval(function () {
            let sendChkSelf = that.state.sendChk;


            let count = 60;
            if (sendChkSelf === "发送验证码"){

                sendChkSelf = count;

                that.setState({
                    sendChk: sendChkSelf
                })
            } else if (sendChkSelf === 0) {

                sendChkSelf = "发送验证码";

                that.setState({
                    sendChk: sendChkSelf
                })

                clearInterval(that._timer);

            } else {
                sendChkSelf -= 1;
                that.setState({
                    sendChk: sendChkSelf
                })
            }
            
        }, 1000);
    };

    render() {
        let {phoneNum, chkCode, password, usertype, ispassword, isShowSelectRole} = this.state;
        let selectedRole = (usertype === 0);
        return (
            <View style={styles.container} onPress={dismissKeyboard}>
                <Image style={styles.img} source={require('../images/role.png')} />

                <View style={styles.txtBorder}>
                    <CustomTextInput
                        keyboardType={'numeric'}
                        underlineColorAndroid={'transparent'}
                        style={styles.textInput}
                        placeholder={'请输入手机号'}
                        maxLength={appData.appMaxLengthPhone}
                        onChangeText={(text) => {
                            this.setState({
                                phoneNum : checkNum(text)
                            })
                        }}
                        value={phoneNum}
                    />
                    <Text style={styles.sendChk} onPress={this.onSendChkCodeBtnPress}
                    >{this.state.sendChk.length === 5 ? this.state.sendChk : '              ' + this.state.sendChk}</Text>
                </View>

                <View style={styles.txtBorder}>
                    <CustomTextInput
                        keyboardType={'numeric'}
                        underlineColorAndroid={'transparent'}
                        style={styles.textInput}
                        placeholder={'请输入验证码'}
                        maxLength={appData.appMaxLengthVerifyCode}
                        onChangeText={(text) => {
                            this.setState({
                                chkCode: text
                            })
                        }}
                        value={chkCode}
                    />
                </View>

                <View style={styles.txtBorder}>
                    <CustomTextInput
                        underlineColorAndroid={'transparent'}
                        style={styles.textInput}
                        multiline={false}
                        placeholder={'请设置密码'}
                        secureTextEntry ={this.state.ispassword}
                        maxLength={appData.appMaxLengthPassword}
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }}
                        value={password}
                    />
                    <TouchableOpacity style={styles.eyeImgWrap} onPress={this.onEyeBtnPress}>
                        {<Image style={styles.eyeImg} source={ispassword ? require('../images/eye-close.png') : require('../images/eye-open.png')} />}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.txtBorder} onPress={this.onRoleBtnAction.bind(this)}>
                    <View style={{flex:1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color:selectedRole ? appData.appLightGrayColor: appData.appTextColor}}>
                            {selectedRole ? '请选择用户角色' : this.roleTypes[usertype]}
                        </Text>
                        <appFont.Ionicons style={{marginLeft: 10, paddingRight: 14}} name={isShowSelectRole?"ios-arrow-up-outline":"ios-arrow-down-outline"} size={16} color={"#afafaf"} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cfmButton} onPress={this.onCfmButtonPress}>
                    <ImageBackground style={styles.cfmButtonImage} source={require('../images/button_login.png')}>
                        <Text style={styles.btnText}>
                            确定
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                <View style={styles.backBtn}>
                    <Text>or</Text>
                    <Text style={styles.backTxt} onPress={this.onBackBtnPress}>返回登录</Text>
                </View>
                <ActionSheet
                    ref={o => this.refRoleTypeActionSheet = o}
                    title={'请选择用户角色'}
                    options={this.roleTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectRoleType.bind(this)}
                />
                <Toast ref="toast" position={'center'}/>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    img: {
        marginTop: 20,
        marginBottom: 20,
        width: 100,
        height: 100,
    },
    txtBorder: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#999',
        marginLeft: 50,
        marginRight: 50,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    textInput: {
        flex: 1,
    },
    sendChk: {
        height: 20,
        width: 80,
        fontSize: 14,
        color: '#999',
    },
    eyeImgWrap: {
        height: 30,
        width: 32,
    },
    eyeImg: {
        height: 24,
        width: 24,
        resizeMode: "stretch",
        tintColor: "#afafaf",
    },

    cfmButton: {
        width: 137,
        height: 59,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        bottom: 60,
        position: 'absolute',
    },

    cfmButtonImage: {
        flex: 1,
        width: 137,
        height: 59,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    cfmBtn: {
        height: 40,
        fontSize: 15,
        marginTop: 10,
        color: '#fff',
    },
    backBtn: {
        flexDirection: 'row',
        bottom: 20,
        position: 'absolute',
    },
    backTxt: {
        color: appData.appBlueColor,
    },
    rolePicker: {
        marginLeft: 50,
        marginRight: 50,
        height: 40,
        width:200,
        borderColor: '#999',
    },
    btnText: {
        color: '#FFFFFF',
    },
});
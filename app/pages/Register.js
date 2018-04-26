
import React, { Component } from 'react';

import {
    Platform,
    Image,
    ImageBackground,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    Picker,
} from 'react-native'

import PropTypes from 'prop-types';
import Toast, {DURATION} from 'react-native-easy-toast';
import px2dp from "../util";

const checkNum = (num) => {
    if(num) {

        if (num.length > 11) {
            return num.slice(0, 11);
        }
        else {
            return num;
        }
        
    }
    
}

class Register extends Component {
    static propTypes = {
            // sendChkCode: PropTypes.string,
            // phoneNumPlh: PropTypes.string,
            ispassword: PropTypes.bool
        }

    static defaultProps = {
        role: '选择用户角色',
    }
    constructor(props) {
        super(props)
        this.state = {
            phoneNum: "",
            chkCode: "",
            password: "",
            usertype: "2",
            sendChk: "发送验证码",

            ispassword: true,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: null,
        }
    }

    goBack() {
        this.props.navigation.goBack();
    }

    onCfmButtonPress = () => {
        if (!judgeMobilePhone(this.state.phoneNum)) {
            this.refs.toast.show("请输入正确的手机号");
        }
        else if (!judgeVerifyCode(this.state.chkCode)) {
            this.refs.toast.show("请输入正确的验证码");
        }
        else if (!judgePassword(this.state.password)) {
            this.refs.toast.show("请输入正确长度的密码");
        }
        else {
            let data = {
                mobile: this.state.phoneNum,
                code: this.state.chkCode,
                password: this.state.password,
                usertype: this.state.usertype
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
    }
    
    onBackBtnPress = () => {
        this.props.navigation.goBack();
    }
    
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
    }

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
    }

    onRolePickeValueChanged = (myRole) => {
        this.setState({ usertype: myRole })
    }

    chkCodeCount = () => {
        that = this;
        chkCodeCountInt = setInterval(function () {
            var sendChkSelf = that.state.sendChk;


            var count = 60;
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

                clearInterval(this.chkCodeCountInt);

            } else {
                sendChkSelf -= 1;
                that.setState({
                    sendChk: sendChkSelf
                })
            }
            
        }, 1000);
    }


    render() {
        var { style } = this.props
        return (
            <View style={styles.container} onPress={dismissKeyboard}>
                <Image style={styles.img} source={require('../images/role.png')} />

                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>
                        <TextInput
                            keyboardType={'numeric'}
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            placeholder={'请输入手机号'}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNum : checkNum(text)
                                })
                            }}
                            value={this.state.phoneNum}
                        />
                        <Text 
                            style={styles.sendChk}
                            onPress={this.onSendChkCodeBtnPress}
                        >{this.state.sendChk.length === 5 ? this.state.sendChk : '              ' + this.state.sendChk}</Text>
                    </View>
                </View>
                
                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>
                        <TextInput
                            keyboardType={'numeric'}
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            placeholder={'请输入验证码'}
                            onChangeText={(text) => {
                                this.setState({
                                    chkCode: text
                                })
                            }}
                            value={this.state.chkCode}
                        />
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>

                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            multiline={false}
                            placeholder={'请设置密码'}
                            secureTextEntry ={this.state.ispassword}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text
                                })
                            }}
                            value={this.state.password}
                        />
                        <TouchableOpacity style={styles.eyeImgWrap} onPress={this.onEyeBtnPress}>
                            {
                                this.state.ispassword ?
                                    <Image style={styles.eyeImg} source={require('../images/eye-close.png')} />
                                    : <Image style={styles.eyeImg} source={require('../images/eye-open.png')} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <View style={styles.rolePicker}>
                        <Picker
                            mode= {"dropdown"}
                            selectedValue={this.state.usertype}
                            onValueChange={this.onRolePickeValueChanged.bind(this)}>
                            <Picker.Item label="我是船主" value="2" />
                            <Picker.Item label="我是货主" value="1" />
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity style={styles.cfmButton} onPress={this.onCfmButtonPress}>
                    <ImageBackground style={styles.cfmButtonImage} source={require('../images/button_login.png')}>
                        <Text style={styles.btnText}>
                            确定
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                <View style={styles.backBtn}>
                    <Text>
                        or
                    </Text>
                    <Text 
                        style={styles.backTxt}
                        onPress={this.onBackBtnPress}
                        >
                        返回登录
                    </Text>
                </View>
                <Toast ref="toast" position={'center'}/>
            </View >
        )
    }
    getValue() {
        return this.state.txtValue
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
    wrapper: {
        flexDirection: 'row',
        //backgroundColor: '#ff0',
        //justifyContent: 'flex-end',
        //justifyContent: 'space-between',
        //justifyContent: 'space-around',
        //alignSelf: 'center',
        //alignItems: 'flex-end',
    },
    txtBorder: {
        height: 40,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#999',
        marginLeft: 50,
        marginRight: 50,
        flexDirection: 'row',
        //backgroundColor: '#0ff',

        justifyContent: 'space-between',
    },
    textInput: {
        height: 50,
        //width: 200
        flex: 1,
        //backgroundColor: '#0ff',
    },
    sendChk: {
        //backgroundColor: '#ff0',
        //flex: 1,
        height: 20,
        width: 80,
        //justifyContent: 'space-between',
        
        //marginLeft: Platform.OS === 'ios' ? 20: -20,

        //marginRight: 0,
        fontSize: 15,
        marginTop: 15,
        color: '#999',
        
    },
    eyeImgWrap: {
        //marginLeft: Platform.OS === 'ios' ? 65 : 25,
        //backgroundColor: '#ff0',
        //marginRight: 0,
        marginTop: 8,
        height: 30,
        width: 32,
        //borderWidth: 1,
        //backgroundColor: '#f00',
    },
    eyeImg: {
        opacity: .6,
        height: 30,
        width: 30,
        //marginLeft: 30,
        //marginRight: 0,
        //marginTop: 8,
        //borderWidth: 1,
    },

    cfmButton: {
        //width:
        marginTop: Platform.OS === 'ios' ? 60 : 160,
        marginBottom: 0,
        width: px2dp(137),
        height: px2dp(59),
        // backgroundColor: appData.appBlueColor,
        // borderRadius: 20,
        //borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    cfmButtonImage: {
        flex: 1,
        width: px2dp(137),
        height: px2dp(59),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    cfmBtn: {
        //width: 35,
        height: 40,
        fontSize: 15,
        //alignItems: 'center',
        // borderWidth:1,
        //borderRadius: 20,
        //backgroundColor: '#fff',
        marginTop: 10,
        //borderWidth: 1,
        color: '#fff',
    },
    backBtn: {
        flexDirection: 'row',
        marginTop: 15,
    },
    backTxt: {
        color: appData.appBlueColor,
    },
    
    rolePicker: {
        marginLeft: 50,
        marginRight: 50,
        
        marginBottom: Platform.OS === 'ios'? 120: 0,

        height: 40,
        flex: 1,
        //borderBottomWidth: 1,
        borderColor: '#999',
        //backgroundColor: '#999',
        //color: '#999',
        //opacity: .6,

        //fontSize: 5,
    },
    btnText: {
        color: '#FFFFFF',
    },
})

module.exports = Register;
import React, { Component } from 'react';

import {
    Platform,
    Image,
    ImageBackground,
    Text,
    TextInput,
    View,
    StyleSheet,
    ToastAndroid,
    Picker,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types';
import Toast from 'react-native-easy-toast';
import IndicatorModal from '../components/IndicatorModal';

export default class LoginVC extends Component {
    static propTypes = {
        // sendChkCode: PropTypes.string,
        // phoneNumPlh: PropTypes.string,
        ispassword: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: "",
            password: "",
            ispassword: true,
            isSpinnerVisible: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            // headerTitle: <Text>标题</Text>,
            headerLeft: null,

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

    onLoginBtnPress = () => {
        if (!judgeMobilePhone(this.state.phoneNum)) {
            this.refs.toast.show("请输入正确的手机号");
        }
        else if (!judgePassword(this.state.password)) {
            this.refs.toast.show("请输入正确长度的密码");
        }
        else {
            this.refIndicator.show();
            let data = {mobile:this.state.phoneNum, password:this.state.password};

            NetUtil.post(appUrl + 'index.php/Mobile/User/login/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            saveUserData(result.data);
                            this.props.navigation.dispatch(PublicResetAction('Main'));
                        }
                        else {
                            this.refs.toast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refs.toast.show(error);
                    });
        }
    };

    onRegBtnPress = () => {
        this.props.navigation.navigate('Register')
    };

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={require('../images/role.png')} />

                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>
                        <TextInput
                            keyboardType={'numeric'}
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            placeholder={'请输入手机号'}
                            maxLength={appData.appMaxLengthPhone}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNum: text
                                })
                            }}
                            value={this.state.phoneNum}
                        />
                    </View>
                </View>
                
                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>

                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            placeholder={'请输入密码'}
                            secureTextEntry={this.state.ispassword}
                            maxLength={appData.appMaxLengthPassword}
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

                <TouchableOpacity style={styles.cfmButton} onPress={this.onLoginBtnPress}>
                    <ImageBackground style={styles.cfmButtonImage} source={require('../images/button_login.png')}>
                        <Text style={styles.btnText}>
                            登录
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

                <View style={styles.backBtn}>
                    <Text>
                        or
                    </Text>
                    <Text
                        style={styles.backTxt}
                        onPress={this.onRegBtnPress}
                    >
                        注册一个
                    </Text>
                </View>
                <Toast ref="toast" position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
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
    wrapper: {
        flexDirection: 'row'
    },
    textInput: {
        height: 50,
        flex: 1,
        paddingLeft:0,
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
    eyeImgWrap: {
        marginLeft: Platform.OS === 'ios' ? 68 : 28,
        marginRight: 0,
        marginTop: 8,
        height: 30,
        width: 32,
        //borderWidth: 1,
    },
    eyeImg: {
        height: 30,
        width: 30,
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
        bottom: 20,
        position: 'absolute',
    },
    backTxt: {
        color: appData.appBlueColor,
    },
    btnText: {
        color: '#FFFFFF',
    },
});

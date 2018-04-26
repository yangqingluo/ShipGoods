import React, { Component } from 'react';

import {
    Platform,
    Image,
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
import Toast, {DURATION} from 'react-native-easy-toast';
import Spinner from 'react-native-spinkit';

const checkNum = (num) => {
    if (num) {
        if (num.length > 11) {
            return num.slice(0, 11);
        }
        else {
            return num;
        }
    }
}

export default class LoginVC extends Component {
    static propTypes = {
        // sendChkCode: PropTypes.string,
        // phoneNumPlh: PropTypes.string,
        ispassword: PropTypes.bool
    }

    constructor(props) {
        super(props)
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

    onLoginBtnPress = () => {
        if (!judgeMobilePhone(this.state.phoneNum)) {
            this.refs.toast.show("请输入正确的手机号");
        }
        else if (!judgeMobilePhone(this.state.password)) {
            this.refs.toast.show("请输入正确长度的密码");
        }
        else {
            this.setState({isSpinnerVisible : true});
            let data = {mobile:this.state.phoneNum, password:this.state.password};

            NetUtil.post(appUrl + 'index.php/Mobile/User/login/', data)
                .then(
                    (result)=>{
                        this.setState({isSpinnerVisible : false});
                        if (result.code === 0) {
                            storage.save({
                                key: 'userData', // 注意:请不要在key中使用_下划线符号!
                                data: result.data,
                            });
                            global.userData = result.data;
                            this.props.navigation.dispatch(PublicResetAction('Main'));
                        }
                        else {
                            this.refs.toast.show(result.message, DURATION.LENGTH_SHORT);
                        }
                    },(error)=>{
                        this.setState({isSpinnerVisible : false});
                        this.refs.toast.show(error, DURATION.LENGTH_SHORT);
                    });
        }
    }

    onRegBtnPress = () => {
        this.props.navigation.navigate('Register')
    }

    render() {
        var { style } = this.props
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
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNum: checkNum(text)
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

                <View style={{height:0}}>
                    <Spinner style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: "red",
                    }} isVisible={this.state.isSpinnerVisible} size={40} type={'Arc'} color={"gray"}/>
                </View>

                <TouchableOpacity style={styles.cfmButton} onPress={this.onLoginBtnPress}>
                    <Text style={styles.btnText}>
                        登录
                    </Text>
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
        //width: 200
        flex: 1,
        //backgroundColor: '#0ff',
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
        opacity: .6,
        height: 30,
        width: 30,
        //marginLeft: 30,
        //marginRight: 0,
        //marginTop: 8,
        //borderWidth: 1,
    },
    
    cfmButton: {
        marginTop: Platform.OS === 'ios' ? 260 : 160,
        marginBottom: 0,
        width: 100,
        height: 40,
        backgroundColor: appData.appBlueColor,
        borderRadius: 20,
        //borderWidth: 1,
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
    btnText: {
        color: '#FFFFFF',
    },
})

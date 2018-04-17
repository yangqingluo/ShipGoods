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

//带参数的POST请求
function postRequest(url, data, callback) {
    var opts = {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(url, opts)
        .then((resonse) => resonse.text())
        .then((responseText) => {
            //将返回的JSON字符串转成JSON对象，并传递到回调方法中
            callback(JSON.parse(responseText));
        });
}

export default class LoginVC extends Component {
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
            password: "",
            role: "",

            ispassword: true,
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
        // // 使用key来保存数据。这些数据一般是全局独有的，常常需要调用的。
        // // 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
        // storage.save({
        //     key: 'userData', // 注意:请不要在key中使用_下划线符号!
        //     data: {
        //         userid: '1001',
        //         userName:'lori',
        //         token: 'token'
        //     },
        // });
        // global.userData = { userid: '1001', userName:'yangqingluo', token: '572687236876321876'};//保存用户数据
        // this.props.navigation.dispatch(PublicResetAction('Main'));

        if (this.state.phoneNum.length !== 11) {
            this.refs.toast.show("请输入正确的手机号", DURATION.LENGTH_SHORT);
            return;
        }
        else if (this.state.password.length === 0) {
            this.refs.toast.show("请输入密码", DURATION.LENGTH_SHORT);
            return;
        }

        var data = {mobile:17681981616, password:123456, deviceid:'iPhone121334', devicetype:2};
        postRequest('http://shiphire.com.cn/index.php/Mobile/User/login/', data, function(result){
            alert(result);
            console.log('***********' + result);
        })
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
                            multiline={false}
                            placeholder={'请输入手机号'}
                            password={false}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNum: checkNum(text)
                                })
                            }}
                            value={this.state.phoneNum}
                        />
                        {/* <Text
                            style={styles.sendChk}
                            onPress={this.onSendChkCodeBtnPress}
                        >{this.state.sendChk.length == 5 ? this.state.sendChk : '              ' + this.state.sendChk}</Text> */}
                    </View>
                </View>
                
                <View style={styles.wrapper}>
                    <View style={styles.txtBorder}>

                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={styles.textInput}
                            multiline={false}
                            placeholder={'请输入密码'}
                            secureTextEntry={this.state.ispassword}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text
                                })
                            }}
                            value={this.state.password}
                        />
                        {/* <Text style={styles.sendChk}>眼睛</Text> */}
                        <TouchableOpacity style={styles.eyeImgWrap} onPress={this.onEyeBtnPress}>
                            {
                                this.state.ispassword ?
                                    <Image style={styles.eyeImg} source={require('../images/eye-close.png')} ></Image>
                                    : <Image style={styles.eyeImg} source={require('../images/eye-open.png')} ></Image>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.cfmButton} onPress={this.onLoginBtnPress}>
                    <Text style={styles.btnText}>
                        登录
                    </Text>
                </TouchableOpacity>



                {/* touchable是为了显示更好的点击效果，既然是要支持ios就算了 */}
                {/* <Touchable></Touchable> */}

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
                <Toast ref="toastWithStyle" style={{backgroundColor:'red'}} position={this.state.position}/>
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
        //width: 
        marginTop: Platform.OS === 'ios' ? 260 : 160,
        marginBottom: 0,
        width: 100,
        height: 40,
        alignItems: 'center',
        backgroundColor: "#60BBFE",
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
        color: '#3EA3FC',
    },
    btnText: {
        color: '#FFFFFF',
    },
})

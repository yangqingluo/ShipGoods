import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    Image,
    Button,
    TextInput,
    ScrollView,
    View,
    TouchableOpacity
} from "react-native";
import px2dp from "../util";
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Font = {
    Ionicons,
    FontAwesome
}

export default class SelectPriceVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
        });
    constructor(props) {
        super(props);
        this.state = {
            price: this.props.navigation.state.params.price || '',
            is_bargain: this.props.navigation.state.params.is_bargain || 0,
        }
    }

    textInputChanged(text) {
        this.setState({
            price: text,
        });
    }

    onBargainBtnAction() {
        this.setState({
            is_bargain: (this.state.is_bargain === 0) ? 1 : 0,
        });
    }

    onSubmitBtnAction() {
        if (this.state.price > 0) {
            this.props.navigation.state.params.callBack(this.state.price, this.state.is_bargain);
            this.props.navigation.goBack();
        }
        else {
            PublicAlert("请输入价格");
        }
    }

    render() {
        const Icon = Font["Ionicons"];
        let textColor = (this.state.is_bargain === 1) ? appData.appBlueColor:appData.appThirdTextColor;
        return (
            <View style={appStyles.container}>
                <ScrollView
                    style={styles.scrollView}
                >
                    <View style={{height:px2dp(2)}} />
                    <View style = {styles.cell}>
                        <TextInput underlineColorAndroid="transparent"
                                   keyboardType={"numeric"}
                                   style={styles.textInput}
                                   placeholder={'价格键入'}
                                   placeholderTextColor={appData.appSecondaryTextColor}
                                   onChangeText={this.textInputChanged.bind(this)}
                                   value = {this.state.price}
                        >
                        </TextInput>
                        <Text style={{color:appData.appYellowColor, right:px2dp(30), fontSize:px2dp(18), textAlign: 'right', position: 'absolute',}}>{'¥元 / 吨'}</Text>
                    </View>
                    <View style={{height:px2dp(43), justifyContent: "center", alignItems: "center", backgroundColor: appData.appGrayColor}}>
                        <TouchableOpacity onPress={this.onBargainBtnAction.bind(this)}>
                            <Icon name={'ios-checkmark-circle'} size={px2dp(20)} style={{minWidth:px2dp(120), marginRight:5, textAlign:"center", fontSize: px2dp(14)}} color={textColor}>
                                {' 不议价'}
                            </Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: 240, height:80, marginTop:px2dp(60), alignSelf: "center", flexDirection: 'row',}}>
                        <TouchableOpacity onPress={this.onBargainBtnAction.bind(this)} style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                            <Icon name={'ios-checkmark-circle'} size={px2dp(32)} style={{minWidth:px2dp(32)}} color={textColor}/>
                            <Text style={{color:textColor, fontSize:px2dp(18), textAlign: 'right',}}>{'我开价'}</Text>
                        </TouchableOpacity>
                        <View style={{top:px2dp(26), width: px2dp(86), height:px2dp(6), borderRadius:px2dp(3), backgroundColor:'#ebebeb'}} />
                        <TouchableOpacity onPress={this.onBargainBtnAction.bind(this)} style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                            <Icon name={'ios-checkmark-circle'} size={px2dp(32)} style={{minWidth:px2dp(32)}} color={textColor}/>
                            <Text style={{color:textColor, fontSize:px2dp(18), textAlign: 'right',}}>{'船东开价'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: px2dp(20), justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        // backgroundColor: '#fff',
        minHeight: px2dp(50),
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        minWidth: px2dp(80),
        // paddingVertical: 0,
        height: 30,
        fontSize: px2dp(18),
        // paddingHorizontal: 10,
        color: appData.appTextColor,
        // backgroundColor: '#fff',
    },

});
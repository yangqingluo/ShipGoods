import React, { Component } from 'react';
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View ,
    StyleSheet,
    Image,
} from 'react-native';
import px2dp from "../util";

export default class CustomAlert extends Component {
    constructor(props){
        super(props);
        this.state={
            hide:true,
            clickScreen:true,
            animationType:'fade',
            modalVisible: false,
            transparent: true,
            title:'提示',
            chide:false,
            headStyle:'',
            messText:'',
            innersWidth:null,
            innersHeight:null,
            buttons:[],
            onSureBtnAction: Function,
            showTextInput:false,
            placeholder:'',
            text: '',
        }

    }

    show(options) {
        if(options){
            clickScreen=options.clickScreen===undefined?true:options.clickScreen;
            animationType=options.animationType===undefined?'fade':options.animationType;
            title=options.title===undefined?'提示':options.title;
            thide=options.thide===undefined?false:options.thide;
            headStyle=options.headStyle===undefined?'':options.headStyle;
            messText=options.messText===undefined?'':options.messText;
            innersWidth=options.innersWidth===undefined?null:options.innersWidth;
            innersHeight=options.innersHeight===undefined?null:options.innersHeight;
            buttons=options.buttons===undefined?null:options.buttons;
            onSureBtnAction=options.onSureBtnAction || null;
            showTextInput=options.showTextInput || null;
            placeholder=options.placeholder || "";
            if(!this.state.modalVisible){
                this.setState({
                    title:title,
                    messText:messText,
                    thide:thide,
                    headStyle:headStyle,
                    innersHeight:innersHeight,
                    innersWidth:innersWidth,
                    buttons:buttons,
                    animationType:animationType,
                    clickScreen:clickScreen,
                    onSureBtnAction:onSureBtnAction,
                    showTextInput:showTextInput,
                    placeholder:placeholder,
                    modalVisible: true,
                });
            }
        }else{
            this.setState({modalVisible: true});
        }
    }

    hide(){
        this.setState({
            modalVisible:false
        });
    }

    tapToDismissKeyboard() {
        dismissKeyboard();
    }

    render() {
        let {title, message, placeholder, showTextInput, numeric} = this.props;
        return (<Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={this.hide.bind(this)}
            >
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.tapToDismissKeyboard}>
                    <View style={styles.modalContainer}>
                        <View style={styles.mainContainer}>
                            <View style={{flex: 1, alignItems:'center', justifyContent:'center',}}>
                                {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
                                {message ? <Text style={styles.modalMessage}>{message}</Text> : null}
                                {showTextInput ? <TextInput underlineColorAndroid="transparent"
                                                            keyboardType={numeric ? "numeric" : "default"}
                                                            style={styles.textInput}
                                                            multiline={true}
                                                            placeholder={placeholder}
                                                            onChangeText={(text) => this.setState({text})}
                                                            value={this.state.text}
                                                            /> : null}
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.leftBn} onPress={this.hide.bind(this)}>
                                    <Text style={styles.leftBnText}>取消</Text>
                                </TouchableOpacity>
                                <View style={styles.verticalLine}/>
                                <TouchableOpacity style={styles.rightBn} onPress={this.state.onSureBtnAction}>
                                    <Text style={styles.rightBnText}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Image source={require('../images/icon_de.png')} style={styles.infoImage}/>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        justifyContent:'center',
        alignItems:'center',
    },
    modalContainer: {
        marginTop: -80,
        width: px2dp(260),
        minHeight: 198,
        alignItems:'center',
    },
    mainContainer: {
        marginTop: 27,
        flex: 1,
        borderRadius: 12,
        // minHeight: 171,
        backgroundColor: 'white',
        alignItems:'center',
    },
    modalTitle: {
        color: '#000000',
        fontSize: 16,
        marginTop: 10,
    },
    modalMessage:{
        color: appData.appTextColor,
        fontSize:16,
        margin:10,
        textAlign: 'center',
    },
    row:{
        width: px2dp(260),
        borderTopWidth: 1.0,
        borderTopColor: appData.appSeparatorLightColor,
        flexDirection:'row',
        alignItems:'center',
        height: 45,
    },
    verticalLine:{
        backgroundColor: appData.appSeparatorLightColor,
        width:1,
        alignSelf:'stretch'
    },
    leftBn:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    leftBnText:{
        fontWeight:appData.appFontWeightMedium,
        fontSize: 17,
        color:'#d1d1d1',
    },
    rightBn:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    rightBnText:{
        fontWeight:appData.appFontWeightMedium,
        fontSize:17,
        color:appData.appBlueColor,
    },
    infoImage: {
        top: 0,
        width: 54,
        height: 54,
        resizeMode: 'cover',
        position: 'absolute',
    },
    textInput: {
        width: px2dp(240),
        fontSize: 16,
        minHeight: 40,
        maxHeight: 120,
        color: appData.appTextColor,
    },
});
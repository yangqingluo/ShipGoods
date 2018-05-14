import React, { Component } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
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
            if(!this.state.modalVisible){
                this.setState({
                    title:title,
                    messText:messText,
                    thide:thide,
                    headStyle:headStyle,
                    modalVisible: true,
                    innersHeight:innersHeight,
                    innersWidth:innersWidth,
                    buttons:buttons,
                    animationType:animationType,
                    clickScreen:clickScreen,
                    onSureBtnAction:onSureBtnAction,
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

    render() {
        return (<Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={this.hide.bind(this)}
            >
                <View style={styles.container}>
                    <View style={styles.modalContainer}>
                        <View style={styles.mainContainer}>
                            <View style={{flex: 1, alignItems:'center', justifyContent:'center',}}>
                                {this.props.title ? <Text style={styles.modalTitle}>{this.props.title}</Text> : null}
                                <Text style={styles.modalMessage}>{this.props.message}</Text>
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
                </View>
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
        width: screenWidth * (260 / 375),
        minHeight: 171,
        // backgroundColor: 'white',
        alignItems:'center',
    },
    mainContainer: {
        marginTop: px2dp(27),
        flex: 1,
        borderRadius: 12,
        minHeight: 171,
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
        width: screenWidth * (260 / 375),
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
        width: px2dp(54),
        height: px2dp(54),
        resizeMode: 'cover',
        position: 'absolute',
    }
});
import React, { Component } from 'react';

import {
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import VDashLine from '../../components/VDashLine'

type Props = {
    info: Object,
    onPress: Function,
    onTimePress: Function,
    textInputChanged: Function,
}

export default class OrderTransportEditCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let info = this.props.info.item;
        let {showLast, trans_state} = this.props;
        let passed = (parseInt(info.state) <= parseInt(trans_state));
        let editable = (parseInt(info.state) === parseInt(trans_state) + 1);
        let color = (passed || editable) ? appData.appBlueColor:appData.appGrayColor;
        let textColor = (passed || editable) ? appData.appTextColor : "#8b8b8b";
        let stateText = getArrayTypesText(transportStateTypes, parseInt(info.state) - 1);

        let create_time = parseInt(info.create_time);
        const Icon = appFont["Ionicons"];
        return (
            <View style={[styles.cellContainer, {opacity: (passed || editable) ? 1.0 : 0.5}]}>
                <View style={styles.leftTime}>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={editable ? () => {this.props.onTimePress(this.props.info)} : null}>
                        <Text style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:textColor}}>
                            {createTimeFormat(create_time, "HH:mm")}
                        </Text>
                        <Text style={{marginTop:2, minHeight:17, fontSize:12, fontWeight:appData.appFontWeightMedium, color:textColor}}>
                            {createTimeFormat(create_time, "yyyy-MM-dd")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerLine}>
                    <Icon name={'ios-checkmark-circle'} size={22} color={color} />
                    {/*<Image source={require('../../images/Line.png')} style={{width: 1, height: 72, marginVertical: 2, resizeMode: "stretch"}} />*/}
                    <VDashLine backgroundColor={color} len={72 / appData.appDashWidth}/>
                    {showLast? <Icon name={'ios-checkmark-circle'} size={22} color={color} /> : null}
                </View>
                <View style={styles.rightContainer}>
                    <View style={{top: 5, left: 0, position: 'absolute', minWidth: 90, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", backgroundColor: appData.appBlueColor}}>
                        <Text style={{fontSize: 16, fontWeight: appData.appFontWeightMedium, color: "#fff" }}>
                            {stateText}
                        </Text>
                    </View>
                    <TextInput style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:appData.appLightTextColor}}
                               multiline={true}
                               placeholder={editable ? "请输入货品具体" + stateText + "状态" : null}
                               onChangeText={(text) => {
                                   this.props.textInputChanged(text, this.props.info);
                               }}
                               editable={editable}
                    >
                        {passed ? info.remark : null}
                    </TextInput>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        minHeight:120,
    },
    leftTime: {
        marginLeft:15,
        width: 75,
        justifyContent: "center",
        alignItems: "center",
    },
    centerLine: {
        width:22,
        alignItems: "center",
    },
    rightContainer: {
        flex:1,
        marginLeft:15,
        paddingRight:22,
        justifyContent: "center",
    },
});


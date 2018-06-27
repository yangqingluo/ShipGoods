import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import VDashLine from '../../components/VDashLine'

type Props = {
    info: Object,
    onPress: Function,
}

export default class OrderTransportCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let info = this.props.info.item;
        let {showLast, trans_state} = this.props;
        let passed = shipTransportStateJudge(parseInt(trans_state), parseInt(info.state));
        let color = passed ? appData.appBlueColor:appData.appGrayColor;

        let create_time = info.create_timetext.split(" ");
        const Icon = appFont["Ionicons"];
        return (
            <View style={styles.cellContainer}>
                <View style={styles.leftTime}>
                    <Text style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:'#8b8b8b'}}>
                        {create_time[1]}
                    </Text>
                    <Text style={{marginTop:2, minHeight:17, fontSize:12, fontWeight:appData.appFontWeightMedium, color:'#8b8b8b'}}>
                        {create_time[0]}
                    </Text>
                </View>
                <View style={styles.centerLine}>
                    <Icon name={'ios-checkmark-circle'} size={22} color={color} />
                    {/*<Image source={require('../../images/Line.png')} style={{width: 1, height: 72, marginVertical: 2, resizeMode: "stretch"}} />*/}
                    <VDashLine backgroundColor={color} len={72 / appData.appDashWidth}/>
                    {showLast? <Icon name={'ios-checkmark-circle'} size={22} color={color} /> : null}
                </View>
                <View style={styles.rightContainer}>
                    <Text style={{top: 5, left: 0, position: 'absolute', fontSize: 16, color: appData.appBlueColor, opacity: passed ? 1.0 : 0.5}}>
                        {getArrayTypesText(transportStateTypes, parseInt(info.state) - 1)}
                    </Text>
                    <Text style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:passed ? appData.appLightTextColor : appData.appThirdTextColor}}>
                        {info.remark}
                    </Text>
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


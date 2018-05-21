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
        let {showLast} = this.props;
        let selected = true;
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
                    <Icon name={'ios-checkmark-circle'} size={22} color={selected ? appData.appBlueColor:appData.appGrayColor} />
                    {/*<Image source={require('../../images/Line.png')} style={{width: 1, height: 72, marginVertical: 2, resizeMode: "stretch"}} />*/}
                    <VDashLine backgroundColor={appData.appBlueColor} len={72 / appData.appDashWidth}/>
                    {showLast? <Icon name={'ios-checkmark-circle'} size={22} color={selected ? appData.appBlueColor:appData.appGrayColor} /> : null}
                </View>
                <View style={styles.rightContainer}>
                    <Text style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:appData.appBlueColor}}>
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
        // backgroundColor: 'gray',
    },
    rightContainer: {
        flex:1,
        marginLeft:15,
        paddingRight:22,
        justifyContent: "center",
        // alignItems: "center",
    },
});


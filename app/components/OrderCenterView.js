import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

type Props = {
    info: Object,
}

export default class OrderCenterView extends PureComponent<Props> {

    render() {
        let {info, style} = this.props;
        return <View style={style}>
            <View style={{backgroundColor: '#f2f9ff', height:73}}>
                <View style={{marginTop: 15, height: 20, flexDirection: 'row', alignItems: "center"}}>
                    <Text style={[styles.textContainer, {marginLeft: 34}]}>{info.loading_port_name}</Text>
                    <Image source={require('../images/icon_arrow_right_half.png')} style={styles.arrowContainer}/>
                    <Text style={styles.textContainer}>{info.unloading_port_name}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={[styles.textContainer, {marginLeft: 34}]}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                    <Text style={[styles.textContainer, {marginRight: 27}]}>{'原油 10000+100吨'}</Text>
                </View>
            </View>
            <View style={{backgroundColor: '#81c6ff', height:26, alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize:12, color:'white', fontWeight:'bold'}}>{'¥'+ info.price + ' 元/ 吨'}</Text>
            </View>
        </View>;
    }
}


const styles = StyleSheet.create({
    textContainer: {
        fontSize:14,
        color: appData.appTextColor,
    },
    arrowContainer: {
        width:32,
        height:4,
        marginLeft:20,
        marginRight:20,
        resizeMode: "stretch",
    }
});
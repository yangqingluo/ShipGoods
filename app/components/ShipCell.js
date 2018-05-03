import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import px2dp from "../util";
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Font = {
    Ionicons,
    FontAwesome
}

type Props = {
    info: Object,
    logo: Number,
    onPress: Function,
    onEditPress: Function,
    selected: boolean,
}

export default class ShipCell extends PureComponent<Props> {

    render() {
        let {info, logo, selected} = this.props;
        logo = require('../images/icon_blue.png');
        const Icon = Font["Ionicons"]
        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                    <View style={styles.viewContainer}>
                        {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "cover", overflow:"hidden"}}/>) : null}
                        <Text style={{color:appData.appTextColor, marginLeft:px2dp(6), fontSize:px2dp(16)}}>{info.item.ship_name}</Text>
                        <Text style={{color:appData.appRedColor, right:px2dp(13), fontSize:px2dp(14), textAlign: 'right', position: 'absolute',}}>{info.item.statestr}</Text>
                    </View>
                    <View style={styles.centerViewContainer}>
                        <View style={{backgroundColor: appData.appBlueColor, width:px2dp(9)}}/>
                    </View>
                    <View style={styles.viewContainer}>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:px2dp(16), fontSize:px2dp(12)}}>{'可运柴油 ' + info.item.dieseloil + '吨'}</Text>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:px2dp(7), fontSize:px2dp(12)}}>{'可运汽油 ' + info.item.gasoline + '吨'}</Text>
                        <TouchableOpacity style={{minWidth:px2dp(120), height:px2dp(36), right:px2dp(0), position: 'absolute', justifyContent: "center",}} onPress={() => this.props.onEditPress(info)}>
                            <Icon name={'ios-create-outline'} size={px2dp(17)} style={{right:px2dp(14), position: 'absolute', textAlign:"right", fontSize:px2dp(12)}} color={appData.appSecondaryTextColor}>{' 编辑'}</Icon>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <View style={{height:px2dp(12)}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0,
        borderColor: appData.appBorderColor,
        backgroundColor: 'white',
        minHeight:px2dp(144),
    },
    viewContainer: {
        flexDirection: 'row',
        height:px2dp(36),
        alignItems: "center",
        // justifyContent: "center",
    },
    centerViewContainer: {
        flexDirection: 'row',
        marginLeft:px2dp(16),
        marginRight:px2dp(15),
        // borderRadius: px2dp(4),
        borderWidth: px2dp(0.5),
        borderColor: 'rgba(0,0,0,0.08)',
        // shadowColor: 'rgba(0,0,0,0.08)',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: px2dp(4),
        height:px2dp(72),
        overflow:"hidden",
        // alignItems: "center",
        // justifyContent: "center",
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
})
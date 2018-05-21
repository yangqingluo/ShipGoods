import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

type Props = {
    info: Object,
    logo: Number,
    onPress: Function,
    onEditPress: Function,
    onLicencePress: Function,
    onPricePress: Function,
    selected: boolean,
}

export default class ShipCell extends PureComponent<Props> {

    render() {
        let {info, logo, selected} = this.props;
        logo = require('../images/icon_blue.png');
        const Icon = appFont["Ionicons"];
        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                    <View style={styles.viewContainer}>
                        {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "cover", overflow:"hidden"}}/>) : null}
                        <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:16}}>{info.item.ship_name}</Text>
                        <Text style={{color:appData.appRedColor, right:13, fontSize:14, textAlign: 'right', position: 'absolute',}}>{info.item.statestr}</Text>
                    </View>
                    <View style={styles.centerViewContainer}>
                        <View style={{backgroundColor: appData.appBlueColor, width:9}}/>
                        <View style={{flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',}}>
                            <View style={styles.cellContainer}>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../images/icon_word_hang.png')} style={{width: 19, height: 29, marginLeft:12, resizeMode: "cover"}}/>
                                    <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:14}}>{getShipAreaTypesText(parseInt(info.item.area))}</Text>
                                </View>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Text style={{color:appData.appTextColor, marginLeft:12, fontSize:14}}>{info.item.storage + ' m³ / ' + info.item.tonnage + ' T'}</Text>
                                </View>
                            </View>
                            <View style={styles.cellContainer}>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}} onPress={() => this.props.onLicencePress(info)}>
                                        <Image source={require('../images/icon_clip.png')} style={{width: 18, height: 18, marginLeft:12, resizeMode: "cover"}}/>
                                        <Text style={{color:appData.appBlueColor, marginLeft:6, fontSize:14}}>{'船舶相关证书'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}} onPress={() => this.props.onPricePress(info)}>
                                        <Image source={require('../images/icon_clip.png')} style={{width: 18, height: 18, marginLeft:12, resizeMode: "cover"}}/>
                                        <Text style={{color:appData.appBlueColor, marginLeft:6, fontSize:14}}>{'相关报价'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewContainer}>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:16, fontSize:12}}>{'可运柴油 ' + info.item.dieseloil + '吨'}</Text>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:7, fontSize:12}}>{'可运汽油 ' + info.item.gasoline + '吨'}</Text>
                        <TouchableOpacity style={{minWidth:120, height:36, right:0, position: 'absolute', justifyContent: "center",}} onPress={() => this.props.onEditPress(info)}>
                            <Icon name={'ios-create-outline'} size={17} style={{right:14, position: 'absolute', textAlign:"right", fontSize:12}} color={appData.appSecondaryTextColor}>{' 编辑'}</Icon>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <View style={{height:12}} />
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
        minHeight:144,
    },
    viewContainer: {
        flexDirection: 'row',
        height:36,
        alignItems: "center",
    },
    centerViewContainer: {
        flexDirection: 'row',
        marginLeft:16,
        marginRight:15,
        // borderRadius: 4,
        // borderWidth: 0.5,
        // borderColor: 'rgba(0,0,0,0.08)',
        // shadowColor: 'rgba(0,0,0,0.08)',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 4,
        height:72,
        // overflow:"hidden",
        // alignItems: "center",
        // justifyContent: "center",
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'row',
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
});
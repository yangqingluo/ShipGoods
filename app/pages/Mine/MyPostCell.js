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
    onLicencePress: Function,
    onPricePress: Function,
    selected: boolean,
}

export default class MyPostCell extends PureComponent<Props> {

    render() {
        let {info, logo, selected} = this.props;
        logo = require('../../images/icon_blue.png');
        const Icon = appFont["Ionicons"];
        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                    <View style={styles.viewContainer}>
                        {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "stretch", overflow:"hidden"}}/>) : null}
                        <Text style={{color:"#9a9a9a", marginLeft:5, fontSize:10, fontWeight:appData.appFontWeightMedium}}>{"发单编号" + info.item.billing_sn}</Text>
                        <Text style={{color:appData.appRedColor, right:13, fontSize:14, textAlign: 'right', position: 'absolute',}}>{""}</Text>
                    </View>
                    <View style={styles.centerViewContainer}>
                        <View style={{backgroundColor: appData.appBlueColor, width:9}}/>
                        <View style={{flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',}}>
                            <View style={styles.cellContainer}>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_word_hang.png')} style={{width: 19, height: 29, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:14}}>{""}</Text>
                                </View>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_time.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{color:appData.appTextColor, marginLeft:12, fontSize:14}}>{""}</Text>
                                </View>
                            </View>
                            <View style={styles.cellContainer}>

                            </View>
                        </View>
                    </View>
                    <View style={styles.viewContainer}>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:16, fontSize:12}}>{'可运柴油 ' + info.item.dieseloil + '吨'}</Text>
                        <Text style={{color:appData.appSecondaryTextColor, marginLeft:7, fontSize:12}}>{'可运汽油 ' + info.item.gasoline + '吨'}</Text>
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
        height:72,
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
import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import px2dp from "../../util";

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
        let {item, index} = info;
        switch (index % 4) {
            case 0:
                logo = require('../../images/icon_blue.png');
                break;

            case 1:
                logo = require('../../images/icon_red.png');
                break;

            case 2:
                logo = require('../../images/icon_orange.png');
                break;

            case 3:
                logo = require('../../images/icon_green.png');
                break;

            default:
                break;
        }

        const Icon = appFont["Ionicons"];

        let downloadOilList = [];
        if (objectNotNull(info.item.download_oil_list)) {
            downloadOilList = info.item.download_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
        }
        let uploadOilList = [];
        if (objectNotNull(info.item.upload_oil_list)) {
            uploadOilList = info.item.upload_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
        }

        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                    <View style={styles.viewContainer}>
                        <View style={{flexDirection: 'row'}}>
                            {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "stretch", overflow:"hidden"}}/>) : null}
                            <Text style={{color:"#9a9a9a", marginLeft:5, fontSize:10, fontWeight:appData.appFontWeightMedium}}>{"发单编号" + item.billing_sn}</Text>
                        </View>
                        <Text style={{color:appData.appTextColor, right:13, fontSize:14, fontWeight:appData.appFontWeightMedium, textAlign: 'right',}}>{item.ship_name + " / " + item.tonnage + "吨"}</Text>
                    </View>
                    <View style={styles.centerViewContainer}>
                        <View style={{backgroundColor: appData.appBlueColor, width:9}}/>
                        <View style={{flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',}}>
                            <View style={styles.cellContainer}>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_word_gang.png')} style={{width: 19, height: 29, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:14}}>{item.empty_port_name}</Text>
                                </View>
                                <View style={[styles.cellContainer, {alignItems: "center", minWidth:100}]}>
                                    <Image source={require('../../images/icon_time.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{"空船期 "}</Text>
                                        <Text style={{color:appData.appTextColor}}>{item.empty_time + "±" + item.empty_delay}</Text>
                                    </Text>
                                </View>
                            </View>
                            {downloadOilList.length > 0 ?
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{'下载可运油品 '}</Text>
                                        <Text style={{color:appData.appTextColor}}>{downloadOilList.join(' ')}</Text>
                                    </Text>
                                </View>
                                :null}
                            {uploadOilList.length > 0 ?
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{'上载油品 '}</Text>
                                        <Text style={{color:appData.appTextColor}}>{uploadOilList.join(' ')}</Text>
                                    </Text>
                                </View>
                                :null}
                            <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                <Text style={{marginLeft:6, fontSize:14}}>
                                    <Text style={{color:appData.appSecondaryTextColor}}>{'可运柴油 '}</Text>
                                    <Text style={{color:appData.appTextColor}}>{item.dieseloil + '吨'}</Text>
                                    <Text style={{color:appData.appSecondaryTextColor}}>{' 可运汽油 '}</Text>
                                    <Text style={{color:appData.appTextColor}}>{item.gasoline + '吨'}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color:appData.appSecondaryTextColor, marginLeft:16, fontSize:10}}>{'浏览'+ item.view_num + ' 收藏' + item.collect_num + "  " + item.create_timetext}</Text>
                        </View>
                        <View style={{marginRight:14, justifyContent: "flex-end"}}>
                            <Text style={{fontSize:10, color:appData.appBlueColor}}>{'已有' + item.appoint_num + '人预约'}</Text>
                        </View>
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
        justifyContent: "space-between",
    },
    centerViewContainer: {
        flexDirection: 'row',
        marginLeft:16,
        marginRight:15,
        minHeight:72,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'row',
        minHeight:36,
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
import React, { Component } from 'react';

import {
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    ToastAndroid,
    Button,
    Alert,
    Picker,
    TouchableHighlight,
} from 'react-native'
import px2dp from "../../util";

type Props = {
    info: Object,
    onPress: Function,
}

export default class HomeGoodsCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info} = this.props;
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
        let isOrdered = false;
        return (
            <View style={{opacity: isOrdered ? 0.5 : 1.0, padding: 10}}>
                <TouchableHighlight style={styles.cellContainer} onPress={() => this.props.onPress(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:px2dp(26)}}>
                            <Text style={{fontSize:px2dp(10), color:'white', marginLeft:px2dp(3), marginTop:px2dp(8)}}>{'发票编号：' + info.item.billing_sn}</Text>
                            <Text style={{fontSize:px2dp(10), color:'white', marginRight:px2dp(6), marginTop:px2dp(8)}}>{info.item.create_timetext}</Text>
                        </View>
                        <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(51)}}>
                            <Text style={{fontSize:px2dp(14), color:appData.appTextColor, marginLeft:px2dp(28), fontWeight:'bold'}}>{info.item.empty_port_name + ' / ' + info.item.ship_name}</Text>
                            <Text style={{fontSize:px2dp(14), color:appData.appBlueColor, marginRight:px2dp(18), fontWeight:'bold'}}>{info.item.tonnage + ' T'}</Text>
                        </View>
                        <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(47)}}>
                            <Text style={{fontSize:px2dp(14), color:appData.appSecondaryTextColor, marginLeft:px2dp(28)}}>空船期</Text>
                            <Text style={{fontSize:px2dp(14), color:appData.appLightTextColor, marginRight:px2dp(18)}}>{info.item.empty_timetext}</Text>
                        </View>
                        {downloadOilList.length > 0 ?
                            <View>
                                <View style={{height:px2dp(1), marginLeft:px2dp(3), backgroundColor:appData.appSeparatorLightColor}} />
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(47)}}>
                                    <Text style={{fontSize:px2dp(14), color:appData.appSecondaryTextColor, marginLeft:px2dp(28)}}>下载可运油品</Text>
                                    <Text style={{fontSize:px2dp(14), color:appData.appLightTextColor, marginRight:px2dp(18)}}>{downloadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        {uploadOilList.length > 0 ?
                            <View>
                                <View style={{height:px2dp(1), marginLeft:px2dp(3), backgroundColor:appData.appSeparatorLightColor}} />
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(47)}}>
                                    <Text style={{fontSize:px2dp(14), color:appData.appSecondaryTextColor, marginLeft:px2dp(28)}}>上载油品</Text>
                                    <Text style={{fontSize:px2dp(14), color:appData.appLightTextColor, marginRight:px2dp(18)}}>{uploadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        <View>
                            <View style={{height:px2dp(1), marginLeft:px2dp(3), backgroundColor:appData.appSeparatorLightColor}} />
                            <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(47)}}>
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-start"}}>
                                    <Text style={{fontSize:px2dp(14), color:appData.appSecondaryTextColor, marginLeft:px2dp(28)}}>{'可运柴油 '}</Text>
                                    <Text style={{fontSize:px2dp(14), color:appData.appLightTextColor}}>{info.item.dieseloil + ' T'}</Text>
                                </View>
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                                    <Text style={{fontSize:px2dp(14), color:appData.appSecondaryTextColor}}>{'可运汽油 '}</Text>
                                    <Text style={{fontSize:px2dp(14), color:appData.appLightTextColor, marginRight:px2dp(18)}}>{info.item.gasoline + ' T'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{height:px2dp(30), flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                    <Text style={{fontSize:px2dp(11), color:appData.appSecondaryTextColor}}>{'浏览'+ info.item.view_num + ' 收藏' + info.item.collect_num}</Text>
                </View>
                {isOrdered ? <Image source={require('../../images/icon_ding.png')} style={{width: px2dp(87), height: px2dp(69), top: px2dp(0), right: px2dp(84), resizeMode: "cover", position: 'absolute',}} /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flex: 1,
        // flexDirection: 'column',
        overflow:"hidden",
        backgroundColor: 'white',
        minHeight:172,
        borderRadius: 9,
        borderColor: appData.appBorderColor,
        borderWidth: 0.5,
    },

    // container: {
    //     marginBottom: 10,
    //     flex: 1,
    //     height: 120,
    //     padding: 10,
    //     borderRadius: 10,
    //     backgroundColor: '#D3D3D3',
    // },
});


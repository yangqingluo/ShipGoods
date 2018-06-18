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

export default class HomeOrderShipCell extends Component {
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
            <View style={{opacity: isOrdered ? 0.5 : 1.0}}>
                <TouchableHighlight style={styles.cellContainer} onPress={() => this.props.onPress(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:26}}>
                            <Text style={{fontSize:10, color:'white', marginLeft:3, marginTop:8}}>{'发票编号：' + info.item.goods_sn}</Text>
                            <Text style={{fontSize:10, color:'white', marginRight:6, marginTop:8}}>{info.item.add_timetext}</Text>
                        </View>
                        <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:51}}>
                            <Text style={{fontSize:14, color:appData.appTextColor, marginLeft:28, fontWeight:'bold'}}>{info.item.ship_name}</Text>
                            <Text style={{fontSize:12, color:appData.appRedColor, marginRight:18, fontWeight:'bold'}}>{info.item.offer + ' 元 / 吨'}</Text>
                        </View>
                        <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:47}}>
                            <Text style={{fontSize:14, color:appData.appSecondaryTextColor, marginLeft:28}}>预计到港时间</Text>
                            <Text style={{fontSize:14, color:appData.appLightTextColor, marginRight:18}}>{info.item.arrive_time}</Text>
                        </View>
                        {downloadOilList.length > 0 ?
                            <View>
                                <View style={{height:1, marginLeft:3, backgroundColor:appData.appSeparatorLightColor}} />
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:47}}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor, marginLeft:28}}>{"意向货品"}</Text>
                                    <Text style={{fontSize:14, color:appData.appLightTextColor, marginRight:18}}>{downloadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        {uploadOilList.length > 0 ?
                            <View>
                                <View style={{height:1, marginLeft:3, backgroundColor:appData.appSeparatorLightColor}} />
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:47}}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor, marginLeft:28}}>上载油品</Text>
                                    <Text style={{fontSize:14, color:appData.appLightTextColor, marginRight:18}}>{uploadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        <View>
                            <View style={{height:1, marginLeft:3, backgroundColor:appData.appSeparatorLightColor}} />
                            <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:47}}>
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-start"}}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor, marginLeft:28}}>{'可运柴油 '}</Text>
                                    <Text style={{fontSize:14, color:appData.appLightTextColor}}>{info.item.dieseloil + ' T'}</Text>
                                </View>
                                <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{'可运汽油 '}</Text>
                                    <Text style={{fontSize:14, color:appData.appLightTextColor, marginRight:18}}>{info.item.gasoline + ' T'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{height:10, flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}} />
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
        // marginBottom: 27,
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


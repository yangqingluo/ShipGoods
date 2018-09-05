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

//TODO 使用onPress会被滑动删除功能组件覆盖掉
type Props = {
    info: Object,
    onCellSelected: Function,
}

export default class HomeGoodsCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info} = this.props;
        let {dieseloil, gasoline, ship_type, status} = info.item;
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
        let isOrdered = offerIsOrdered(status);
        return (
            <View style={{opacity: isOrdered ? 0.5 : 1.0, padding: 10, backgroundColor: "#fff"}}>
                <TouchableHighlight style={styles.cellContainer} onPress={isOrdered ? null : () => this.props.onCellSelected(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:26}}>
                            <Text style={{fontSize:10, color:'white', marginLeft:3, marginTop:8}}>{'发票编号：' + info.item.billing_sn}</Text>
                            <Text style={{fontSize:10, color:'white', marginRight:6, marginTop:8}}>{info.item.create_timetext}</Text>
                        </View>
                        <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:51}}>
                            <Text style={{fontSize:14, color:appData.appTextColor, marginLeft:28, fontWeight:'bold'}}>{info.item.empty_port_name + ' / ' + info.item.ship_name}</Text>
                            <Text style={{fontSize:14, color:appData.appBlueColor, marginRight:18, fontWeight:'bold'}}>{info.item.tonnage + ' T'}</Text>
                        </View>
                        <View style={styles.cellItemContainer}>
                            <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{"空船期"}</Text>
                            <Text style={{fontSize:14, color:appData.appLightTextColor}}>{info.item.empty_timetext + "±" + info.item.empty_delay}</Text>
                        </View>
                        {downloadOilList.length > 0 ?
                            <View>
                                <View style={styles.cellSeparator}/>
                                <View style={styles.cellItemContainer}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{"意向货品"}</Text>
                                    <Text style={styles.cellItemRightText}>{downloadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        {uploadOilList.length > 0 ?
                            <View>
                                <View style={styles.cellSeparator}/>
                                <View style={styles.cellItemContainer}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{"上载货品"}</Text>
                                    <Text style={styles.cellItemRightText}>{uploadOilList.join(' ')}</Text>
                                </View>
                            </View>
                            :null}
                        <View>
                            <View style={styles.cellSeparator}/>
                            {shipIsShowType(dieseloil, gasoline, ship_type) ?
                                <View style={styles.cellItemContainer}>
                                    <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{'船舶类型 '}</Text>
                                    <Text style={{fontSize:14, color:appData.appLightTextColor}}>{getArrayTypesText(shipTypes, parseInt(ship_type) - 1)}</Text>
                                </View>
                                :
                                <View style={styles.cellItemContainer}>
                                    <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-start"}}>
                                        <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{'可运柴油 '}</Text>
                                        <Text style={{fontSize:14, color:appData.appLightTextColor}}>{objectIsZero(dieseloil) ? "" : dieseloil + ' T'}</Text>
                                    </View>
                                    {shipIsOilThreeLevel(ship_type) ? null :
                                        <View style={{flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                                            <Text style={{fontSize:14, color:appData.appSecondaryTextColor}}>{'可运汽油 '}</Text>
                                            <Text style={{fontSize:14, color:appData.appLightTextColor, textAlign: "right"}}>{objectIsZero(gasoline) ? "" : gasoline + ' T'}</Text>
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{height:30, flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                    <Text style={{fontSize:11, color:appData.appSecondaryTextColor}}>{'浏览'+ info.item.view_num + ' 收藏' + info.item.collect_num}</Text>
                </View>
                {isOrdered ? <Image source={require('../../images/icon_ding.png')} style={{width: 87, height: 69, top: 0, right: 84, resizeMode: "cover", position: 'absolute',}} /> : null}
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
    cellSeparator: {
        height:1,
        marginLeft:3,
        backgroundColor:appData.appSeparatorLightColor,
    },
    cellItemContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        minHeight:47,
        paddingRight: 18,
        paddingLeft: 28,
        paddingVertical: 5,
    },
    cellItemRightText: {
        flex:1,
        fontSize:14,
        color:appData.appLightTextColor,
        marginLeft:5,
        textAlign: "right",
    },
});


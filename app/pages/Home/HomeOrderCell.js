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
    showCreateTime: boolean,
}

export default class HomeGoodsCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info} = this.props;
        let goodsList = info.item.goodslist.map(
            (info) => {
                return info.goods_name;
            }
        );
        let isOrdered = false;
        return (
            <View style={{opacity: isOrdered ? 0.5 : 1.0}}>
                <TouchableHighlight style={styles.cellContainer} onPress={() => this.props.onPress(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{height:px2dp(47), flexDirection: 'row', alignItems: "center", justifyContent: "space-between",}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../images/icon_blue.png')} style={{width: px2dp(10), height: px2dp(12), resizeMode: "cover"}}/>
                                <Text style={{fontSize:px2dp(10), color:appData.appSecondaryTextColor, marginLeft:px2dp(5)}}>{'货物编号：' + info.item.goods_sn}</Text>
                            </View>
                            <View style={{marginRight:px2dp(16), justifyContent: "flex-end"}}>
                                <Text style={{fontSize:px2dp(12), color:appData.appBlueColor}}>{'已有' + info.item.offer_num + '人报价'}</Text>
                            </View>
                        </View>
                        <View style={styles.centerContainer}>
                            <View style={{backgroundColor: '#f2f9ff', height:px2dp(73)}}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                    <Text style={{marginLeft: px2dp(34), fontSize:px2dp(14), color: appData.appTextColor}}>{info.item.loading_port_name + ' → ' + info.item.unloading_port_name}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                                    <Text style={{marginLeft: px2dp(34), fontSize:px2dp(14), color: appData.appTextColor}}>{info.item.loading_timetext + ' ± ' + info.item.loading_delay + '天'}</Text>
                                    <Text style={{marginRight: px2dp(27), fontSize:px2dp(14), color: appData.appTextColor}}>{'原油 10000+10000吨'}</Text>
                                </View>
                            </View>
                            <View style={{backgroundColor: '#81c6ff', height:px2dp(26), alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontSize:px2dp(12), color:'white', fontWeight:'bold'}}>{'¥'+ info.item.price + ' 元/ 吨'}</Text>
                            </View>
                        </View>
                        <View style={{marginRight:px2dp(16), height:px2dp(30), flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                            <Text style={{fontSize:px2dp(11), color:appData.appSecondaryTextColor}}>{(this.props.showCreateTime ? info.item.create_timetext + ' ' : '') + '浏览'+ info.item.view_num + ' 收藏' + info.item.collect_num}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
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
        minHeight:px2dp(172),
        // borderRadius: px2dp(9),
        // borderColor: appData.appBorderColor,
        // borderWidth: px2dp(0.5),
        marginBottom: px2dp(10),
    },

    centerContainer: {
        marginLeft:px2dp(15),
        marginRight:px2dp(16),
        overflow:"hidden",
        borderRadius: px2dp(4),
        borderColor: appData.appBorderColor,
        borderWidth: px2dp(0.5),
    },

    // container: {
    //     marginBottom: 10,
    //     flex: 1,
    //     height: 120,
    //     padding: 10,
    //     borderRadius: 10,
    //     backgroundColor: '#D3D3D3',
    // },
})


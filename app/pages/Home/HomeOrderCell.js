import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
} from 'react-native'
import OrderCenterView from "../../components/OrderCenterView";

type Props = {
    info: Object,
    onCellSelected: Function,
    showCreateTime: boolean,
}

export default class HomeOrderCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info, is_offer} = this.props;
        let {status} = info.item;
        let isOrdered = false;
        if (objectNotNull(is_offer)) {
            isOrdered = offerIsOrdered(status);
        }
        return (
            <View style={{opacity: isOrdered ? 0.5 : 1.0}}>
                <TouchableHighlight style={styles.cellContainer} onPress={isOrdered ? null : () => this.props.onCellSelected(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{height:47, flexDirection: 'row', alignItems: "center", justifyContent: "space-between",}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../images/icon_blue.png')} style={{width: 10, height: 12, resizeMode: "cover"}}/>
                                <Text style={{fontSize:10, color:appData.appSecondaryTextColor, marginLeft:5}}>{'货物编号：' + info.item.goods_sn}</Text>
                            </View>
                            <View style={{marginRight:16, justifyContent: "flex-end"}}>
                                <Text style={{fontSize:12, color:appData.appBlueColor}}>{'已有' + info.item.offer_num + '人报价'}</Text>
                            </View>
                        </View>
                        <OrderCenterView info={info.item} style={styles.centerContainer}/>
                        <View style={{marginRight:16, height:30, flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                            <Text style={{fontSize:11, color:appData.appSecondaryTextColor}}>{(this.props.showCreateTime ? info.item.create_timetext + ' ' : '') + '浏览'+ info.item.view_num + ' 收藏' + info.item.collect_num}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={{height:12, backgroundColor: appData.appGrayColor}} />
                {isOrdered ? <Image source={require('../../images/icon_ding.png')} style={{width: 87, height: 69, top: 0, right: 84, resizeMode: "cover", position: 'absolute',}} /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flex: 1,
        overflow:"hidden",
        backgroundColor: 'white',
        minHeight:172,
    },

    centerContainer: {
        marginLeft:15,
        marginRight:16,
        overflow:"hidden",
        borderRadius: 4,
        // borderColor: appData.appBorderColor,
        // borderWidth: 0.5,
    },

    textContainer: {
        fontSize:14,
        color: appData.appTextColor
    },
});


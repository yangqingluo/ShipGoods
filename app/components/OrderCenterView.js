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
    renderGoodsName() {
        let {info} = this.props;
        if (objectNotNull(info.goods_name)) {
            return info.goods_name;
        }
        else if (objectNotNull(info.goodslist)) {
            if (info.goodslist.length > 0) {
                let goodsList = info.goodslist.map(
                    (item) => {
                        return item.goods_name;
                    }
                );
                return goodsList.join(",");
            }
        }
        return "";
    }

    render() {
        let {info, style, type} = this.props;
        let priceText = offerIsShipPrice(info.is_shipprice) ? "船东开价" : info.price;
        if (objectNotNull(type)) {
            if (type === OrderCenterEnum.Order) {
                priceText = info.offer;
            }
        } 
        return (
            <View style={style} >
                <View style={{backgroundColor: '#f2f9ff', paddingLeft:34, paddingRight:10, paddingVertical: 10, minHeight:73}}>
                    <View style={{marginTop: 5, flex: 1, flexDirection: 'row', alignItems: "center"}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                            <Text style={styles.textContainer}>{info.loading_port_name}</Text>
                            <Image source={require('../images/icon_arrow_right_half.png')} style={styles.arrowContainer}/>
                        </View>
                        <Text style={styles.textContainer}>{info.unloading_port_name}</Text>
                    </View>
                    <View style={{marginTop: 5, flex: 1, flexDirection: 'row', alignItems: "center"}}>
                        <Text style={styles.textContainer}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                        <Text style={styles.textContainer}>{this.renderGoodsName() + ' ' + info.tonnage  + '吨' + '±' + info.ton_section}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: '#81c6ff', height:26, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize:12, color:'white', fontWeight:'bold'}}>
                        {priceText}
                    </Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        fontSize:14,
        color: appData.appTextColor,
    },
    arrowContainer: {
        width:32,
        height:4,
        marginLeft:20,
        marginRight:35,
        resizeMode: "stretch",
    }
});
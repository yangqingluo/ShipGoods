import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import OrderCenterView from "../../components/OrderCenterView";

type Props = {
    info: Object,
    onPress: Function,
    onBottomBtnPress: Function,
}

export default class HomeOrderCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    _renderBottomButton() {
        let info = this.props.info.item;
        if (objectNotNull(info.iclose)) {
            if (info.iclose === '1') {
                return <View style={styles.bottomContainer}>
                    <TouchableOpacity style={[styles.btnContainer, {borderColor: '#dfdfdf', width: 102}]} onPress={() => this.props.onBottomBtnPress(info, 0)} disabled={true}>
                        <Text style={{fontSize:16, color:'#818181'}}>{"订单已关闭"}</Text>
                    </TouchableOpacity>
                </View>;
            }
        }

        if (info.order_state === '1') {
            return <View style={styles.bottomContainer}>
                <TouchableOpacity style={[styles.btnContainer, {borderColor: appData.appBlueColor}]} onPress={() => this.props.onBottomBtnPress(info, 0)}>
                    <Text style={{fontSize:16, color:appData.appBlueColor}}>{"评价"}</Text>
                </TouchableOpacity>
            </View>
        }

        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={[styles.btnContainer, {borderColor: '#dfdfdf', marginRight:10}]} onPress={() => this.props.onBottomBtnPress(info, 1)}>
                    <Text style={{fontSize:16, color:'#3c3c3c'}}>{"查看货运"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnContainer, {borderColor: appData.appBlueColor}]} onPress={() => this.props.onBottomBtnPress(info, 0)}>
                    <Text style={{fontSize:16, color:appData.appBlueColor}}>{"确认收货"}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        let {info} = this.props;
        let isClosed = false;
        return (
            <View style={{opacity: isClosed ? 0.5 : 1.0}}>
                <TouchableHighlight style={styles.cellContainer} onPress={() => this.props.onPress(info)}>
                    <View style={{flex: 1, backgroundColor:'white'}}>
                        <View style={{height:15}} />
                        <OrderCenterView info={info.item} style={styles.centerContainer}/>
                        {this._renderBottomButton()}
                    </View>
                </TouchableHighlight>
                <View style={{height:12, backgroundColor: appData.appGrayColor}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flex: 1,
        overflow:"hidden",
        backgroundColor: 'white',
        minHeight:177,
    },

    centerContainer: {
        marginLeft:15,
        marginRight:16,
        overflow:"hidden",
        borderRadius: 4,
        borderColor: appData.appBorderColor,
        borderWidth: 0.5,
    },

    textContainer: {
        fontSize:14,
        color: appData.appTextColor
    },
    bottomContainer: {
        marginRight:16,
        height:63,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-end",
    },
    btnContainer:{
        width: 91,
        height: 33,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        borderWidth: 1,
    },
});


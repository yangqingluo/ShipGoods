import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import CustomItem from '../../components/CustomItem'


export const BottomBtnEnum = {
    Default: 0,
    CollectGoods: 1,
    CheckTransport: 2,
    JudgeOrder: 3,

};

type Props = {
    info: Object,
    onPress: Function,
}

export default class HomeOrderCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info} = this.props;
        return (
            <View>
                <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>
                <TouchableOpacity style={styles.cellContainer} onPress={() => this.props.onPress(info)}>
                    <Image source={require("../../images/icon_news.png")} style={styles.newsImage}/>
                    <Text style={styles.textContainer}>{info.item.content}</Text>
                    <Image source={require("../../images/icon_right.png")} style={styles.arrowImage}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: "center",
        minHeight:44,
        paddingLeft:13,
        paddingRight:12,
        paddingVertical:10,
    },
    textContainer: {
        flex:1,
        marginLeft:12,
        marginRight:5,
        fontSize:16,
        color: appData.appTextColor
    },
    newsImage: {
        width:17,
        height:17,
        resizeMode: "stretch",
    },
    arrowImage: {
        width:4,
        height:8,
        resizeMode: "stretch",
    },
});


import React, { Component } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'

type Props = {
    info: Object,
    onCellSelected: Function,
}

export default class MessageCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {info} = this.props;
        let isnew = (info.item.isnew === '1');
        return (
            <View>
                <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>
                <TouchableOpacity style={styles.cellContainer} onPress={() => this.props.onCellSelected(info)}>
                    <Image source={require("../../images/icon_news.png")} style={styles.newsImage}/>
                    <Text style={{flex:1, marginLeft:12, marginRight:5, fontSize:14, color: isnew ? appData.appTextColor : appData.appThirdTextColor}}>{info.item.content}</Text>
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
        fontSize:14,
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


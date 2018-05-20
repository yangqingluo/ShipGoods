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
            <View style={styles.cellContainer}>
                <CustomItem logo={require("../../images/icon_news.png")} name={info.item.content}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flex: 1,
        overflow:"hidden",
        backgroundColor: 'white',
        minHeight:44,
        paddingLeft:13,
        paddingRight:12,
    },
    textContainer: {
        fontSize:14,
        color: appData.appTextColor
    },
});


import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import px2dp from "../util";

type Props = {
    showFooter: number,
}

export default class ListLoadFooter extends PureComponent<Props> {

    render() {
        let {showFooter} = this.props;
        if (showFooter === 1) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.text}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(showFooter === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text style={styles.text}>正在加载更多数据...</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.footer}>
                    <Text style={styles.text}>
                        上拉加载更多
                    </Text>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    footer:{
        flexDirection:'row',
        height: px2dp(36),
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    text: {
        color: appData.appSecondaryTextColor,
        fontSize: px2dp(14),
    }
})
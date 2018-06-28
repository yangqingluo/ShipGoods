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

export const FooterTypeEnum = {
    Default: 0,//默认
    NoMore: 1,//没有更多
    Loading: 2,//正在加载
};

export const canLoad = function(state) : boolean {
    return (state !== FooterTypeEnum.NoMore && state != FooterTypeEnum.Loading);
};

export default class ListLoadFooter extends PureComponent<Props> {

    render() {
        let {showFooter} = this.props;
        switch (showFooter) {
            case FooterTypeEnum.NoMore:
                return (
                    <View style={styles.footer}>
                        <Text style={styles.text}>
                            没有更多数据了
                        </Text>
                    </View>
                );

            case FooterTypeEnum.Loading:
                return (
                    <View style={styles.footer}>
                        <ActivityIndicator />
                        <Text style={styles.text}>正在加载更多数据...</Text>
                    </View>
                );

            default:
                return (
                    <View style={styles.footer}>
                        <Text style={styles.text}>{''}</Text>
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
});
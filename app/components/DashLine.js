import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */
export default class DashLine extends Component {
    render() {
        let len = this.props.len;
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        return <View style={styles.dashLine}>
            {
                arr.map((item, index) => {
                    return <Text style={[styles.dashItem, {backgroundColor: this.props.backgroundColor}]}
                                 key={'dash' + index}> </Text>
                })
            }
        </View>
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
        flex: 1,
        // overflow:"hidden",
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
    }
});
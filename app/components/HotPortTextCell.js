import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class HotPortTextCell extends PureComponent<Props> {
    render() {
        let {info, lines} = this.props;
        let item = info.item;
        return (
            <TouchableOpacity style={[styles.container, {width: (-20 + screenWidth) / lines}]} onPress={() => this.props.onPress(info)}>
                <View style={styles.viewContainer}>
                    <Text style={{fontSize:14, fontWeight: appData.appFontWeightMedium, textAlign: 'center', color: appData.appTextColor}}>{item.port_name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "white",
        minHeight: 27 + 10,
    },
    viewContainer: {
        flex: 1,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
});
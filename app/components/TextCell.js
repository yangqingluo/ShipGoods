import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    TouchableOpacity
} from 'react-native';
import px2dp from "../util";

type Props = {
    info: Object,
    showText: String,
    onPress: Function,
    selected: Boolean,
    lines: number,
}

export default class TextCell extends PureComponent<Props> {
    render() {
        let {info, showText, selected, lines} = this.props;
        return (
            <TouchableOpacity style={[styles.container, {width: (px2dp(-20) + screenWidth * 2 / 3) / lines}]} onPress={() => this.props.onPress(info)}>
                <View style={[styles.viewContainer, {backgroundColor: selected ? appData.appBlueColor : "#f3f6f9"}]}>
                    <Text style={{fontSize:px2dp(14), textAlign: 'center', color:selected ? 'white' : appData.appTextColor}}>{showText}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: px2dp(5),
        paddingHorizontal: px2dp(9),
        backgroundColor: "white",
        minHeight: px2dp(27 + 10),
    },
    viewContainer: {
        flex: 1,
        borderRadius: px2dp(4),
        alignItems: "center",
        justifyContent: "center",
    },
})
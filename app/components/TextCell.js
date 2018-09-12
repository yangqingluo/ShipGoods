import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    TouchableOpacity
} from 'react-native';

type Props = {
    info: Object,
    showText: String,
    onCellSelected: Function,
    selected: Boolean,
    lines: number,
}

export default class TextCell extends PureComponent<Props> {
    render() {
        let {info, showText, selected, lines} = this.props;
        return (
            <TouchableOpacity style={[styles.container, {width: (-20 + appData.rightMenuWidth) / lines}]} onPress={() => this.props.onCellSelected(info)}>
                <View style={[styles.viewContainer, {backgroundColor: selected ? appData.appBlueColor : "#f3f6f9"}]}>
                    <Text style={{fontSize:14, textAlign: 'center', color:selected ? 'white' : appData.appTextColor}}>{showText}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 9,
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
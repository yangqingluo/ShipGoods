import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    TouchableOpacity
} from 'react-native';
import px2dp from "../util";
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Font = {
    Ionicons,
    FontAwesome
}

type Props = {
    info: Object,
    onCellSelected: Function,
    selected: boolean,
    isSecond: boolean,
}

export default class PortFirstCell extends PureComponent<Props> {

    render() {
        let {info, selected, isSecond} = this.props;
        const Icon = Font["Ionicons"]
        return (
            <TouchableOpacity style={[styles.container, {backgroundColor: this.props.isSecond ? appData.appGrayColor : 'white',}]} onPress={() => this.props.onCellSelected(info)}>
                <View style={styles.rightContainer}>
                    <Text style={{color:appData.appTextColor}}>{info.item.port_name}</Text>
                </View>
                {isSecond ? null : <Icon name={'ios-arrow-forward-outline'} size={px2dp(20)} style={{width: 22, marginRight:5, textAlign:"center"}} color={'#bbb'} />}
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0,
        borderColor: appData.appBorderColor,
        minHeight:px2dp(40),
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
})
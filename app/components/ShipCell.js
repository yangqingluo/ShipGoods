import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
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
    onPress: Function,
    selected: boolean,
}

export default class ShipCell extends PureComponent<Props> {

    render() {
        let {info, selected} = this.props
        const Icon = Font["Ionicons"]
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                <View style={styles.rightContainer}>
                    <Text style={{color:appData.appTextColor}}>{info.item.ship_name}</Text>
                </View>
                {/*<Icon name={'ios-checkmark-circle'} size={px2dp(20)} style={{width: 22, marginRight:5, textAlign:"center"}} color={selected?appData.appBlueColor:appData.appGrayColor} />*/}
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
        backgroundColor: 'white',
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
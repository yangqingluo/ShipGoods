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
};

type Props = {
    info: Object,
    onCellSelected: Function,
    selected: boolean,
}

export default class SectionCell extends PureComponent<Props> {

    render() {
        let {info, selected} = this.props;
        const Icon = Font["Ionicons"];
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onCellSelected(info)}>
                <View style={{marginTop:0, height:px2dp(0.5),backgroundColor:appData.appSeparatorColor}}/>
                <View style={{flex:1, flexDirection: 'row', alignItems: "center"}}>
                    <View style={styles.rightContainer}>
                        <Text style={{marginLeft:10, color: appData.appTextColor}}>{info.section.goods_name}</Text>
                    </View>
                    <Icon name={selected ? 'ios-arrow-up' : 'ios-arrow-down'} size={px2dp(20)} style={{width: 22, marginRight:5, textAlign:"center"}} color={appData.appSecondaryTextColor} />
                </View>
                <View style={{marginBottom:0, height:px2dp(0.5),backgroundColor:appData.appSeparatorColor}}/>
            </TouchableOpacity>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 0,
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
        paddingLeft: 5,
        paddingRight: 10,
    },
})
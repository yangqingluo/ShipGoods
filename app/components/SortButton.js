import React, {PureComponent} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
} from 'react-native';
import PropTypes from "prop-types";

export default class SortButton extends PureComponent {
    static Props = {
        sort    : PropTypes.object,
        index: PropTypes.number,
    };

    render() {
        let {sort, index} = this.props;
        let {title, order} = sort;
        let color = "#dddcdc";
        let upColor = order === SortTypeEnum.ASC ? appData.appBlueColor : color;
        let downColor = order === SortTypeEnum.DESC ? appData.appBlueColor : color;
        let arrowSize = 20;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}
                onPress={()=> appHomeVC.onSortItemAction(index)}>
                <View style={styles.sortItem}>
                    <Text style={{color: '#5d5d5d', fontSize: 14}}>{title}</Text>
                </View>
                <View style={{marginLeft: 6}}>
                    <appFont.Ionicons style={{marginBottom: -0.7 * arrowSize}}
                                      name="md-arrow-dropup"
                                      size={arrowSize}
                                      color= {upColor}/>
                    <appFont.Ionicons style={{ marginBottom: -0.1 * arrowSize}}
                                      name="md-arrow-dropdown"
                                      size={arrowSize}
                                      color= {downColor}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    sortItem: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

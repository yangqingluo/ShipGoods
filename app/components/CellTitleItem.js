import React, { Component} from 'react'
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableHighlight,
    TextInput,
} from 'react-native'
import px2dp from "../util";
import Button from './Button';
const itemHeight = px2dp(50);

export default class CellTitleItem extends Component {
    constructor(props){
        super(props)
    }
    static propTypes = {
        name: PropTypes.string.isRequired,
        subName: PropTypes.string,
        color: PropTypes.string,
        first: PropTypes.bool,
        disable: PropTypes.bool,
        onPress: PropTypes.func
    };
    _render(){
        let {name, subName} = this.props;
        return (
            <View style={{flexDirection: "column"}}>
                <View style={styles.listItem} {...this.props}>
                    <Text style={styles.textLabel}>{name}</Text>
                    <View style={{flex: 1}}/>
                    {subName?(<Text style={{flex: 1, minWidth:120, textAlign: 'right', color: "#000", fontSize:12}}>{subName}</Text>):null}
                </View>
                {this.props.children}
            </View>
        )
    }
    render(){
        let {first, onPress, disable } = this.props;
        onPress = onPress || (() => {});
        return disable?
            this._render():
            <Button style={{marginTop: first?10:0}} onPress={onPress}>{this._render()}</Button>
    }
}

const styles = StyleSheet.create({
    listItem: {
        height: itemHeight,
        paddingLeft: 0,
        backgroundColor: "#fff",
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center"
    },
    button:{
        height: itemHeight,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    textLabel: {
        // flex: 1,
        paddingVertical: 0,
        fontSize: 13,
        paddingHorizontal: 10,
        color: appData.appTextColor,
        // backgroundColor: '#fff',
    },
})
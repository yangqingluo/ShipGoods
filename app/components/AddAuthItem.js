/**
 * @author yang
 * @repo
 */
'use strict';

import React, { Component} from 'react'
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableHighlight,
    TextInput,
    TouchableNativeFeedback
} from 'react-native'
import px2dp from '../util'
import Button from './Button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

let {width, height} = Dimensions.get('window')
const itemHeight = px2dp(50)

const Font = {
    Ionicons,
    FontAwesome
}
class ItemButton extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <Button style={{marginTop: this.props.first?10:0}} onPress={this.props.onPress}>
                <View style={styles.button}>
                    <Text style={{color: this.props.color || "#f00"}}>{this.props.name}</Text>
                </View>
            </Button>
        )
    }
}

export default class AddAuthItem extends Component {
    constructor(props){
        super(props)
    }
    static propTypes = {
        idKey: PropTypes.string,
        idValue: PropTypes.string,
        logo: PropTypes.string,
        name: PropTypes.string.isRequired,
        subName: PropTypes.string,
        color: PropTypes.string,
        first: PropTypes.bool,
        avatar: PropTypes.object,
        disable: PropTypes.bool,
        numeric: PropTypes.bool,
        iconSize: PropTypes.number,
        font: PropTypes.string,
        onPress: PropTypes.func
    }
    _render(){
        let {logo, iconSize, name, subName, color, first, avatar, disable, font} = this.props
        font = font||"Ionicons"
        const Icon = Font[font]
        let radius = px2dp(12);
        return (
            <View style={{flexDirection: "column"}}>
                <View style={[styles.listInfo, {height: 1}, {borderTopWidth: !first?1:0}]} />
                <View style={styles.listItem} {...this.props}>
                    {color?(<View style={{width: radius, height:radius, marginRight:5, borderRadius: 0.5 * radius, backgroundColor:color || "#4da6f0"}} />):null}
                    {disable?
                        <TextInput underlineColorAndroid="transparent"
                                   keyboardType={this.props.numeric ? "numeric" : "default"}
                                   style={styles.textInput}
                                   placeholder={name}
                                   placeholderTextColor={"#000"}
                                   editable={disable}
                                   onChangeText={(text) => {
                                       this.props.callback(text, this.props.idKey);
                                   }}
                        >
                        </TextInput>
                    :
                        <Text style={styles.textLabel}
                        >{name}
                        </Text>
                    }
                    {disable?null : <View style={{flex: 1}}/>}
                    {subName?(<Text style={{flex: 1, minWidth:120, textAlign: 'right', color: "#000", fontSize:12}}>{subName}</Text>):null}
                    {avatar?(<Image source={avatar} style={{width: 36, height: 36, resizeMode: "cover", overflow:"hidden", borderRadius: 18}}/>):null}
                    {this.props.children}
                    <Font.Ionicons style={{marginLeft: 10, paddingRight: 16, opacity: disable ? 0.0 : 1.0}} name="ios-arrow-forward-outline" size={px2dp(18)} color="#bbb" />
                </View>
            </View>
        )
    }
    render(){
        let { onPress, first, disable } = this.props
        onPress = onPress || (() => {})
        return disable?
            this._render():
            <Button style={{marginTop: first?10:0}} onPress={onPress}>{this._render()}</Button>
    }
}
AddAuthItem.Button = ItemButton
const styles = StyleSheet.create({
    listItem: {
        height: itemHeight,
        paddingLeft: 16,
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
    listInfo: {
        height: itemHeight,
        flex: 1,
        paddingRight: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopColor: "#f5f5f5"
    },
    listInfoRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    logo: {
        marginRight:5,
        width: px2dp(20),
        height: px2dp(20)
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        height: 30,
        fontSize: 13,
        paddingHorizontal: 10,
        // backgroundColor: '#fff',
    },
    textLabel: {
        // flex: 1,
        paddingVertical: 0,
        fontSize: 13,
        paddingHorizontal: 10,
        // backgroundColor: '#fff',
    },
})

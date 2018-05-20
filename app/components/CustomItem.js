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
    TextInput,
} from 'react-native'
import Button from './Button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const itemHeight = appData.appItemHeight;

const Font = {
    Ionicons,
    FontAwesome
};

export default class CustomItem extends Component {
    constructor(props){
        super(props)
    }
    static propTypes = {
        idKey: PropTypes.string,
        idValue: PropTypes.string,
        logo: PropTypes.number,
        name: PropTypes.string.isRequired,
        subName: PropTypes.string,
        color: PropTypes.string,
        first: PropTypes.bool,
        noSeparator: PropTypes.bool,
        avatar: PropTypes.object,
        disable: PropTypes.bool,
        numeric: PropTypes.bool,
        iconSize: PropTypes.number,
        font: PropTypes.string,
        showArrowForward: PropTypes.bool,
        onPress: PropTypes.func
    };

    static defaultProps = {
        showArrowForward: true,
    };

    _render(){
        let {logo, iconSize, name, subName, color, noSeparator, avatar, disable, font, showArrowForward} = this.props;
        font = font||"Ionicons";
        const Icon = Font[font];
        let radius = 12;
        return (
            <View style={{flexDirection: "column"}}>
                {noSeparator ? null : <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>}
                <View style={styles.listItem} {...this.props}>
                    {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "cover", overflow:"hidden"}}/>) : null}
                    {color?(<View style={{width: radius, height:radius, marginRight:5, borderRadius: 0.5 * radius, backgroundColor:color || "#4da6f0"}} />):null}
                    {disable?
                        <TextInput underlineColorAndroid="transparent"
                                   keyboardType={this.props.numeric ? "numeric" : "default"}
                                   style={styles.textInput}
                                   placeholder={name}
                                   placeholderTextColor={appData.appSecondaryTextColor}
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
                    {subName?(<Text style={{flex: 1, minWidth:120, textAlign: 'right', color: "#000", fontSize:14}}>{subName}</Text>):null}
                    {avatar?(<Image source={avatar} style={{width: 36, height: 36, resizeMode: "cover", overflow:"hidden", borderRadius: 18}}/>):null}
                    {this.props.children}
                    {showArrowForward ? <Font.Ionicons style={{marginLeft: 10, paddingRight: 16, opacity: disable ? 0.0 : 1.0}} name="ios-arrow-forward-outline" size={18} color="#bbb" /> : null}
                </View>
            </View>
        )
    }
    render(){
        let { onPress, first, disable } = this.props;
        onPress = onPress || (() => {});
        return disable?
            this._render():
            <Button style={{marginTop: first?10:0}} onPress={onPress}>{this._render()}</Button>
    }
}
// CustomItem.Button = ItemButton
const styles = StyleSheet.create({
    listItem: {
        height: itemHeight,
        paddingLeft: 0,
        // backgroundColor: "#fff",
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
    listInfoRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    logo: {
        marginRight:5,
        width: 20,
        height: 20,
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        height: 30,
        fontSize: 14,
        paddingHorizontal: 10,
        color: appData.appTextColor,
        // backgroundColor: '#fff',
    },
    textLabel: {
        // flex: 1,
        paddingVertical: 0,
        fontSize: 14,
        paddingHorizontal: 10,
        color: appData.appTextColor,
        // backgroundColor: '#fff',
    },
})

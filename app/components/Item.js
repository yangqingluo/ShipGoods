/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
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
  AlertIOS,
  TouchableNativeFeedback
} from 'react-native'
import Button from './Button'
const itemHeight = 45;

class ItemButton extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <Button style={{marginTop: this.props.first?10:0}} onPress={this.props.onCellSelected}>
        <View style={styles.button}>
          <Text style={{color: this.props.color || "#f00"}}>{this.props.name}</Text>
        </View>
      </Button>
    )
  }
}

export default class Item extends Component {
  constructor(props){
    super(props)
  }
  static propTypes = {
    logo: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    subName: PropTypes.string,
    color: PropTypes.string,
    first: PropTypes.bool,
    avatar: PropTypes.number,
    disable: PropTypes.bool,
    iconSize: PropTypes.number,
    font: PropTypes.string,
      onCellSelected: PropTypes.func
  };
  _render(){
    let {logo, iconSize, name, subName, color, first, avatar, disable, font} = this.props;
    font = font||"Ionicons";
    const Icon = appFont["Ionicons"];
    return (
      <View style={styles.listItem}>
          <Image source={logo} style={styles.logo}/>
        <View style={styles.listInfo}>
            {/*<View style={[styles.listInfo, {borderTopWidth: !first?1:0}]}>*/}
          <View style={{flex: 1}}><Text>{name}</Text></View>
          <View style={styles.listInfoRight}>
            {subName?(<Text style={{color: "#aaa", fontSize:12}}>{subName}</Text>):null}
            {avatar?(<Image source={avatar} style={{width: 36, height: 36, resizeMode: "cover", overflow:"hidden", borderRadius: 18}}/>):null}
            {disable?null:(<Icon style={{marginLeft: 10}} name="ios-arrow-forward-outline" size={18} color="#bbb" />)}
          </View>
        </View>
      </View>
    )
  }
  render(){
    let { onCellSelected, first, disable } = this.props;
      onCellSelected = onCellSelected || (() => {});
    return disable?
      this._render():
      <Button style={{marginTop: first?10:0}} onPress={onCellSelected}>{this._render()}</Button>
  }
}
Item.Button = ItemButton;
const styles = StyleSheet.create({
  listItem: {
    height: itemHeight,
    paddingLeft: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
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
        width: 20,
        height: 20
    },
})

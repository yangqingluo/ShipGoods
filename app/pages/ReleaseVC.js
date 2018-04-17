import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, Image, View, TouchableOpacity, Platform} from 'react-native';
export default class ReleaseVC extends Component {
    static navigationOptions = {
        headerTitle: '发布',
        tabBarLabel: '发布',
        tabBarIcon:({ focused, tintColor }) => {
            let iconPath = require("../images/tabPublish.png");
            return <Image source={iconPath} style={{
                position: 'absolute',
                overflow: 'visible',
                bottom: Platform.OS === 'ios' ? 5 : -3,
                //marginTop: Platform.OS === 'ios' ? 10 : -50,
                //marginBottom: Platform.OS === 'ios'? 10:50,
                width: Platform.OS === 'ios' ? 60 : 40,
                height: Platform.OS === 'ios' ? 60 : 40,  }}>
            </Image>;
        },
    };
    render() {
        const { navigate } = this.props.navigation;
        return ( <View style={styles.container}> </View> );
    }
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5FCFF', }, });

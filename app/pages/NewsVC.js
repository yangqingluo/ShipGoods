import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import {
    StackNavigator,
    TabBarBottom,
    TabNavigator
} from "react-navigation";

export default class NewsVC extends Component {
    static navigationOptions = {
        headerTitle: '消息',
        tabBarLabel: '消息',
        tabBarIcon:
            <View style={{height:30,width:30,backgroundColor:'red'}}>

            </View> };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

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

export default class MineVC extends Component {
    static navigationOptions = {
        headerTitle: '我的',
        tabBarLabel: '我的',
    };
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

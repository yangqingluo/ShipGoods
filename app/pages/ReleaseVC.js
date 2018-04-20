import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
export default class ReleaseVC extends Component {
    static navigationOptions = {
        headerTitle: '发布',
        tabBarLabel: '发布',
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

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class MessageVC extends Component {
    static navigationOptions = {
        headerTitle: '消息',
        tabBarLabel: '消息',
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
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

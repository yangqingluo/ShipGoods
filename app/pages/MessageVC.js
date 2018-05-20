import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity
} from 'react-native';
import MessageListVC from './Message/MessageListVC';

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
                <MessageListVC style={{flex: 1}} />
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

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import MessageListVC from './Message/MessageListVC';

export default class MessageVC extends Component {
    static navigationOptions = {
        headerTitle: '消息',
        tabBarLabel: '消息',
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
    };

    componentDidMount() {
        global.appMessageVC = this;
    }

    reloadSubMessageVC = () => {
        if (objectNotNull(this.subMessageVC)) {
            this.subMessageVC.state.dataList = [];
            this.subMessageVC.requestData();
        }
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <MessageListVC ref={o => this.subMessageVC = o} style={{flex: 1}} />
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

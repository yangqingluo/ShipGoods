import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: "修改密码"
        });
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollContainer}>

                </ScrollView>
            </View> );
    }
}
const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
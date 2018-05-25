import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
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
                {/*<TouchableOpacity style={{ height:40, backgroundColor:'green', justifyContent: 'center'}}*/}
                {/*onPress={() =>{this.backVC()}}>*/}
                {/*<Text>{this.props.navigation.state.params.des}*/}

                {/*</Text>*/}
                {/*</TouchableOpacity>*/}
            </View> );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
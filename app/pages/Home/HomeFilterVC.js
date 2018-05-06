import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class DetailVC extends Component {
    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title
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
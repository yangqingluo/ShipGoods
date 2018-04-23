import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class AddShip extends Component {
    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => (
        {
            title: "添加船舶"
        });
    // 点击返回上一页方法
    backVC=()=>{
        //返回首页方法
        this.props.navigation.goBack();
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ height:40, backgroundColor:'green', justifyContent: 'center'}}
                                  onPress={() =>{this.backVC()}}>

                </TouchableOpacity>
            </View> );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
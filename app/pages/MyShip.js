import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class DetailVC extends Component {
    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => (
        {
            title: '我的船舶',
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight : 12, color: appData.appBlueColor}}>添加船舶</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props){
        super(props)
        this.state = {
        }
    }

    _addBtnAction=()=> {
        const { navigate } = this.props.navigation;
        navigate('AddShip');
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this._addBtnAction});
    }

    // 点击返回上一页方法
    backVC=()=>{
        //返回首页方法
        this.props.navigation.goBack();
    }
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
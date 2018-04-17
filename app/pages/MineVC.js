import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity, Alert
} from 'react-native';

//顶部右边的图标，这段代码不可复用，但是可以复制修改使用。
class RightHeader extends Component {
    constructor(props) {
        super(props)
    }
    onLogoutBtnPress = () => {
        PublicAlert(global.userData.userName);
        // 删除单个数据
        storage.remove({
            key: 'userData'
        });
        global.userData = null;

        this.props.navigation.dispatch(PublicResetAction('Login'));
    };
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={this.onLogoutBtnPress}
                >
                    <Text style={{marginRight : 10}}>登出</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class MineVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '我的',
        tabBarLabel: '我的',
        headerRight: <RightHeader navigation={navigation} />,
    });

    render() {
        return (
            <View style={styles.container}>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

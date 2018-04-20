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
        // PublicAlert(JSON.stringify(global.userData));
        PublicAlert(global.userData.usertype);
        // // 删除单个数据
        // storage.remove({
        //     key: 'userData'
        // });
        // global.userData = null;
        //
        // this.props.navigation.dispatch(PublicResetAction('Login'));
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
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
        headerRight: <RightHeader navigation={navigation} />,
    });

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>


                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    topView: {
        height: 200,
        backgroundColor: '#fff',
    },
});


import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {NavigationActions} from "react-navigation";


export default class WaitVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        header:null,
    });

    componentDidMount() {
        this.checkLogin();    // 比如调用asyncstorage
    }

    checkLogin() {
        //刷新的时候重新获得用户数据
        storage.load({
            key: 'userData',
        }).then(ret => {
            global.userData = ret;
            this.props.navigation.dispatch(PublicResetAction('Main'));
        }).catch(err => {
            global.userData = null;
            this.props.navigation.dispatch(PublicResetAction('Login'));
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={styles.indicator}/>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    indicator: {

    },
});
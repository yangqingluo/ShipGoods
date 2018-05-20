import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import Item from '../../components/CustomItem'

export default class MoreSettingsVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '更多设置',
    });

    constructor(props){
        super(props);
        this.config = [
            {name:"关于我们", onPress:this.cellSelected.bind(this, "AboutUs")},
            {name:"退出登录", onPress:this.cellSelected.bind(this, "LoginOut")},
            {name:"修改密码", onPress:this.cellSelected.bind(this, "ChangePwd")},
            {name:"变更联系人", onPress:this.cellSelected.bind(this, "ChangeContact")},
            {name:"建议与反馈", onPress:this.cellSelected.bind(this, "Suggestion")},
        ];
    }
    cellSelected(key, data = {}) {
        dismissKeyboard();
        if (key === "AboutUs") {
            this.props.navigation.navigate('PublicWeb',
                {
                    title: "关于我们",
                    uri: appUrl + '/shared/help.php?uid=' + userData.uid,
                });
        }
        else {
            PublicAlert("精彩功能，敬请期待" + "(" + key + ")");
        }
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (<Item key={i} {...item}/>)
        })
    }

    render() {
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                    {this._renderListItem()}
                    <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#fff"
    },
});

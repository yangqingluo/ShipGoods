import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import Item from '../../components/CustomItem';
import ActionSheet from 'react-native-actionsheet';

export default class MoreSettingsVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '更多设置',
    });

    constructor(props){
        super(props);
        this.config = [
            {name:"帮助中心", onCellSelected:this.cellSelected.bind(this, "Help")},
            {name:"关于我们", onCellSelected:this.cellSelected.bind(this, "AboutUs")},
            {name:"退出登录", onCellSelected:this.cellSelected.bind(this, "Logout")},
            {name:"修改密码", onCellSelected:this.cellSelected.bind(this, "ChangePwd")},
            {name:"变更联系人", onCellSelected:this.cellSelected.bind(this, "ChangeContact")},
            {name:"建议与反馈", onCellSelected:this.cellSelected.bind(this, "Suggestion")},
        ];
    }

    cellSelected(key, data = {}) {
        dismissKeyboard();
        if (key === "Help") {
            this.props.navigation.navigate('PublicWeb',
                {
                    title: "帮助中心",
                    uri: appUrl + '/shiphire/Help/Index',
                });
        }
        else if (key === "AboutUs") {
            this.props.navigation.navigate('PublicWeb',
                {
                    title: "关于我们",
                    uri: appUrl + '/shiphire/Us/Index',
                });
        }
        else if (key === "ChangePwd" || key === "ChangeContact" || key === "Suggestion") {
            this.props.navigation.navigate(key);
        }
        else if (key === "Logout") {
            this.refLogoutActionSheet.show();
        }
        else {
            PublicAlert("精彩功能，敬请期待" + "(" + key + ")");
        }
    }

    onSelectLogout(index) {
        if (index === 1) {
            appLogout();
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
                <ActionSheet
                    ref={o => this.refLogoutActionSheet = o}
                    title={'您确定退出登录？'}
                    options={["取消", "退出登录"]}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={1}
                    onPress={this.onSelectLogout.bind(this)}
                />
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

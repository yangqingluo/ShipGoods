import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';


export default class OrderJudgementVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "评价订单"
    });

    onSubmitBtnAction() {
        let {info} = this.props.navigation.state.params;
        PublicAlert(JSON.stringify(info));
    }

    render() {
        let {info} = this.props.navigation.state.params;
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
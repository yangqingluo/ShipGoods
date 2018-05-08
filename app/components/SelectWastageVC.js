import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import px2dp from "../util";

export default class SelectWastageVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight : 12, color: appData.appBlueColor}}>确定</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props) {
        super(props);
        this.state={
            key: this.props.navigation.state.params.key,
            wastageTitle: this.props.navigation.state.params.wastageTitle || 0,
            wastageNumber: this.props.navigation.state.params.wastageNumber || 0,
        };
    }

    sureBtnAction=()=> {
        if (this.state.wastageTitle > 0 && this.state.wastageNumber > 0) {
            this.props.navigation.state.params.callBack(this.state.key, this.state.wastageTitle, this.state.wastageNumber);
            this.props.navigation.goBack();
        }
        else {
            PublicAlert("请选择损耗");
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.sureBtnAction});
    }

    showWastagePicker() {
        this.wastageTypeActionSheet.show();
    }

    showWastageNumberPicker() {
        this.wastageNumberTypeActionSheet.show();
    }

    onSelectWastageType(index) {
        if (index > 0) {
            this.setState({
                wastageTitle: index
            });
        }
    }

    onSelectWastageNumberType(index) {
        if (index > 0) {
            this.setState({
                wastageNumber: index
            });
        }
    }

    render() {
        return (
            <View style={appStyles.container}>
                <ActionSheet
                    ref={o => this.wastageTypeActionSheet = o}
                    title={''}
                    options={shipWastageTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectWastageType.bind(this)}
                />
                <ActionSheet
                    ref={o => this.wastageNumberTypeActionSheet = o}
                    title={''}
                    options={shipWastageNumberTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectWastageNumberType.bind(this)}
                />
                <ScrollView
                    style={styles.scrollView}
                >
                    <View style={{height:px2dp(2)}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showWastagePicker()}>
                        <Text style={styles.text}>
                            {this.state.wastageTitle > 0 ? shipWastageTypes[this.state.wastageTitle] : '请选择损耗类型'}
                        </Text>
                    </TouchableOpacity>
                    <View style={{height:px2dp(2)}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showWastageNumberPicker()}>
                        <Text style={styles.text}>
                            {this.state.wastageNumber > 0 ? shipWastageNumberTypes[this.state.wastageNumber] : '请选择损耗千分比'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    cell: {
        flex: 1,
        backgroundColor: '#fff',
        minHeight: px2dp(50),
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: 'center',
        color: appData.appBlueColor,
        fontSize: px2dp(16),
    }
});

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

export default class SelectWastageVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
        });

    constructor(props) {
        super(props);
        this.state={
            key: this.props.navigation.state.params.key,
            wastageTitle: this.props.navigation.state.params.wastageTitle || 0,
            wastageNumber: this.props.navigation.state.params.wastageNumber || 0,
        };
    }

    onSubmitBtnAction = () => {
        if (this.state.wastageTitle > 0 && this.state.wastageNumber > 0) {
            this.props.navigation.state.params.callBack(this.state.key, this.state.wastageTitle, this.state.wastageNumber);
            this.props.navigation.goBack();
        }
        else {
            PublicAlert("请选择损耗");
        }
    };

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
                <ScrollView style={styles.scrollView}>
                    <View style={{height:2}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showWastagePicker()}>
                        <Text style={styles.text}>
                            {this.state.wastageTitle > 0 ? shipWastageTypes[this.state.wastageTitle] : '请选择损耗类型'}
                        </Text>
                    </TouchableOpacity>
                    <View style={{height:2}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showWastageNumberPicker()}>
                        <Text style={styles.text}>
                            {this.state.wastageNumber > 0 ? shipWastageNumberTypes[this.state.wastageNumber] : '请选择损耗千分比'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"确定"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        minHeight: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: 'center',
        color: appData.appBlueColor,
        fontSize: 16,
    }
});

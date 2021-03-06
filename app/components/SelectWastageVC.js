import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionPicker from './ActionPicker';
import ActionSheet from 'react-native-actionsheet';

export default class SelectWastageVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: navigation.state.params.title,
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
        this.wastageNumberTypePicker.show(shipWastageNumberTypes[this.state.wastageNumber],
            (choice, index)=>{
                this.setState({
                    wastageNumber: index
                });
            });
    }

    onSelectWastageType(index) {
        if (index > 0) {
            this.setState({
                wastageTitle: index
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
                            {this.state.wastageTitle > 0 ? shipWastageTypes[this.state.wastageTitle - 1] : '请选择损耗类型'}
                        </Text>
                    </TouchableOpacity>
                    <View style={{height:2}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showWastageNumberPicker()}>
                        <Text style={styles.text}>
                            {this.state.wastageNumber >= 0 ? shipWastageNumberTypes[this.state.wastageNumber] : '请选择损耗千分比'}
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
                    options={addCancelForArray(shipWastageTypes)}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectWastageType.bind(this)}
                />
                <ActionPicker ref={o => this.wastageNumberTypePicker = o}
                              title={''}
                              options={shipWastageNumberTypes}
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

import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    Image,
    Button,
    TextInput,
    ScrollView,
    View,
    TouchableOpacity
} from "react-native";
import ActionSheet from 'react-native-actionsheet';

export default class SelectTonnageVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
        });
    constructor(props) {
        super(props);
        this.state = {
            tonnage: this.props.navigation.state.params.tonnage || '',
            ton_section: this.props.navigation.state.params.ton_section || 0,
        }
    }

    textInputChanged(text) {
        this.setState({
            tonnage: text,
        });
    }

    onSubmitBtnAction() {
        if (this.state.tonnage.length > 0) {
            this.props.navigation.state.params.callBack(this.state.tonnage, this.state.ton_section);
            this.props.navigation.goBack();
        }
        else {
            PublicAlert("请输入货量");
        }
    }

    showTonSectionPicker() {
        this.tonSectionTypeActionSheet.show();
    }

    onSelectTonSectionType(index) {
        if (index > 0) {
            this.setState({
                ton_section: parseInt(tonSectionTypes[index]),
            });
        }
    }

    render() {
        return (
            <View style={appStyles.container}>
                <ScrollView
                    style={styles.scrollView}
                >
                    <View style={{height:2}} />
                    <View style = {styles.cell}>
                        <TextInput underlineColorAndroid="transparent"
                                   keyboardType={"numeric"}
                                   style={styles.textInput}
                                   maxLength={appData.appMaxLengthNumber}
                                   placeholder={'请输入货量'}
                                   placeholderTextColor={appData.appSecondaryTextColor}
                                   onChangeText={this.textInputChanged.bind(this)}
                                   value = {this.state.tonnage}
                        >
                        </TextInput>
                    </View>
                    <View style={{height:2}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showTonSectionPicker()}>
                        <Text style={styles.text}>
                            {this.state.ton_section >= 0 ? '货量区间 ± ' + this.state.ton_section + " 吨" : '请选择货量区间'}
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
                    ref={o => this.tonSectionTypeActionSheet = o}
                    title={'请选择货量区间'}
                    options={tonSectionTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectTonSectionType.bind(this)}
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
    textInput: {
        flex: 1,
        width: screenWidth,
        height: 30,
        fontSize: 16,
        paddingHorizontal: 10,
        color: appData.appBlueColor,
        textAlign: "center",
    },
    text: {
        textAlign: 'center',
        color: appData.appBlueColor,
        fontSize: 16,
    }
});
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
import ActionPicker from './ActionPicker';
import Toast from "react-native-easy-toast";

export default class SelectBookTonnageVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title || '本载可装货量',
        });
    constructor(props) {
        super(props);
        this.state = {
            book_tonnage: this.props.navigation.state.params.book_tonnage || '',
        }
    }

    textInputChanged(text) {
        this.setState({
            book_tonnage: text,
        });
    }

    onSubmitBtnAction() {
        if (this.state.book_tonnage.length > 0) {
            this.props.navigation.state.params.callBack(this.state.book_tonnage);
            this.props.navigation.goBack();
        }
        else {
            this.refToast.show("请输入本载可装货量");
        }
    }

    render() {
        return (
            <View style={appStyles.container}>
                <ScrollView
                    style={styles.scrollView}
                >
                    <View>
                        <View style = {styles.cell}>
                            <Text style={styles.cellText} />
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={'货量吨位键入'}
                                       placeholderTextColor={appData.appSecondaryTextColor}
                                       onChangeText={this.textInputChanged.bind(this)}
                                       value = {this.state.book_tonnage}
                            >
                            </TextInput>
                            <Text style={styles.cellText}>{'吨'}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: 100, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        minHeight: 50,
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    cellText : {
        flex: 1,
        minWidth: 60,
        color:appData.appYellowColor,
        fontSize:16,
    },
    textInput: {
        flex: 1,
        marginHorizontal: 5,
        minWidth: 60,
        fontSize: 16,
        color: appData.appTextColor,
        textAlign: "center",
    },
    text: {
        textAlign: 'center',
        color: appData.appBlueColor,
        fontSize: 16,
    }
});
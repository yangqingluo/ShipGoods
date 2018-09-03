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
            this.refToast.show("请输入货量吨位");
        }
    }

    showTonSectionPicker() {
        this.refTonSectionPicker.show(this.state.ton_section,
            (choice, index)=>{
                this.setState({
                    ton_section: tonSectionTypes[index],
                });
            });
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
                                       value = {this.state.tonnage}
                            >
                            </TextInput>
                            <Text style={styles.cellText}>{'吨'}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>this.showTonSectionPicker()}>
                            <View style={{height:43, justifyContent: "center", alignItems: "center", backgroundColor: appData.appGrayColor}}>
                                <Text style={styles.text}>
                                    {objectNotNull(this.state.ton_section) ? '增减范围 ± ' + this.state.ton_section : '请选择增减范围'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ActionPicker ref={o => this.refTonSectionPicker = o}
                              title={'请选择增减范围'}
                              options={tonSectionTypes}
                />
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
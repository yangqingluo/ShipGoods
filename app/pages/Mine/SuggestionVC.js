import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Toast from "react-native-easy-toast";

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: "建议反馈"
        });

    constructor(props){
        super(props);
        this.state = {
            content: '',
        }
    };

    goBack() {
        this.props.navigation.goBack();
    }

    onSubmitBtnAction() {
        let {content} = this.state;
        if (content.length <= 0) {
            this.refToast.show("请输入内容");
        }
        else {
            let data = {
                content: content,
            };

            NetUtil.post(appUrl + 'index.php/Mobile/User/add_feedback/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            PublicAlert(result.message,'',
                                [{text:"确定", onPress:this.goBack.bind(this)}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
    };

    textInputChanged(text){
        this.setState({
            content: text,
        })
    };

    render() {
        let {content} = this.state;
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={{height:5, backgroundColor:appData.appGrayColor}} />
                    <View style={{paddingHorizontal: 7, paddingVertical:15}}>
                        <Image source={require('../../images/icon_yijian.png')} style={{width: 61, height: 32, resizeMode: "cover"}}/>
                        <TextInput underlineColorAndroid="transparent"
                                   style={styles.textInput}
                                   multiline={true}
                                   placeholder={"我有话想说..."}
                                   placeholderTextColor={appData.appSecondaryTextColor}
                                   onChangeText={(text) => {
                                       this.textInputChanged(text);
                                   }}
                                   value={content}
                        >
                        </TextInput>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
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
    textInput: {
        marginLeft:7,
        marginRight:7,
        marginTop: 10,
        minHeight: 120,
        borderRadius: 6,
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 15,
        color: appData.appTextColor,
        backgroundColor: appData.appGrayColor,
    },
});
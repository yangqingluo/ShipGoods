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
import StarScore from '../../components/StarScore';
import Toast from "react-native-easy-toast";

export default class OrderJudgementVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "评价订单"
    });

    constructor(props){
        super(props);
        this.state = {
            mission_star: 0,//执行力评分(1-5)
            clean_star: 0,//交货结算评分(1-5)
            togeth_start: 0,//综合能力评分(1-5)
            content: '',
        }
    };

    goBack() {
        this.props.navigation.goBack();
    }

    onSubmitBtnAction() {
        let {info} = this.props.navigation.state.params;
        let {mission_star, clean_star, togeth_start, content} = this.state;
        if (mission_star <= 0) {
            this.refToast.show("请选择执行力评分");
        }
        else if (clean_star <= 0) {
            this.refToast.show("交货结算评分");
        }
        else if (togeth_start <= 0) {
            this.refToast.show("请选择综合能力评分");
        }
        else {
            let data = {
                or_id: info.or_id,
                mission_star: mission_star,
                clean_star: clean_star,
                togeth_start: togeth_start,
            };
            if (content.length > 0) data.content = content;

            NetUtil.post(appUrl + 'Mobile/Order/comment_order/', data)
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

    starScoreSelectIndex(key, score) {
        if (key === "mission") {
            this.setState({
                mission_star: score,
            })
        }
        else if (key === "clean") {
            this.setState({
                clean_star: score,
            })
        }
        else if (key === "togeth") {
            this.setState({
                togeth_start: score,
            })
        }
    };

    render() {
        let {info} = this.props.navigation.state.params;
        let {mission_star, clean_star, togeth_start} = this.state;
        let shipOwner = isShipOwner();
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={{height:165, paddingTop: 15}}>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {shipOwner ? "货主执行能力" : "船主执行能力"}
                            </Text>
                            <StarScore style={{marginLeft:20}}
                                       itemEdge={8}
                                       currentScore={mission_star}
                                       radius={22}
                                       enabled={true}
                                       tag={"mission"}
                                       selectIndex={this.starScoreSelectIndex.bind(this)}/>
                        </View>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {"交货结算评分"}
                            </Text>
                            <StarScore style={{marginLeft:20}}
                                       itemEdge={8}
                                       currentScore={clean_star}
                                       radius={22}
                                       enabled={true}
                                       tag={"clean"}
                                       selectIndex={this.starScoreSelectIndex.bind(this)}/>
                        </View>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {"综合能力评分"}
                            </Text>
                            <StarScore style={{marginLeft:20}}
                                       itemEdge={8}
                                       currentScore={togeth_start}
                                       radius={22}
                                       enabled={true}
                                       tag={"togeth"}
                                       selectIndex={this.starScoreSelectIndex.bind(this)}/>
                        </View>
                    </View>
                    <View style={{height:5, backgroundColor:appData.appGrayColor}} />
                    <View style={{paddingHorizontal: 7, paddingVertical:15}}>
                        <Image source={require('../../images/icon_yijian.png')} style={{width: 61, height: 32, resizeMode: "cover"}}/>
                        <TextInput underlineColorAndroid="transparent"
                                   style={styles.textInput}
                                   multiline={true}
                                   placeholder={shipOwner ? "我还想对货主说" : "我还想对船主说"}
                                   placeholderTextColor={appData.appSecondaryTextColor}
                                   onChangeText={(text) => {
                                       this.textInputChanged(text);
                                   }}
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
        color: '#535353',
        backgroundColor: appData.appGrayColor,
    },
    starView: {
        height: 45,
        paddingHorizontal: 21,
        flexDirection: 'row',
        alignItems: "center"
    },
    starText: {
        fontSize:18,
        color:appData.appTextColor,
    }
});
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
            refreshing: false,
            evaluationInfo: null,
        }
    };

    componentDidMount() {
        let {info, tag} = this.props.navigation.state.params;
        if (commentIscomment(info.iscomment) || tag === OrderBtnEnum.JudgeCheck) {
            this.requestData();
        }
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    requestRecommend = async (isReset) => {
        let {info} = this.props.navigation.state.params;
        let data = {order_id: info.or_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Order/get_evaluation/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        let evaluationInfo = result.data;
                        this.setState({
                            evaluationInfo: evaluationInfo,
                            refreshing: false,
                            mission_star: parseInt(evaluationInfo.mission_star),
                            clean_star: parseInt(evaluationInfo.clean_star),
                            togeth_start: parseInt(evaluationInfo.togeth_start),
                            content: evaluationInfo.content,
                        });
                    }
                    else {
                        this.setState({
                            refreshing: false,
                        })
                    }
                },(error)=>{
                    this.setState({
                        refreshing: false,
                    })
                });
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
        let {info, tag} = this.props.navigation.state.params;
        let {mission_star, clean_star, togeth_start, content, evaluationInfo} = this.state;
        let shipOwner = isShipOwner();
        let iscomment = (commentIscomment(info.iscomment) || tag === OrderBtnEnum.JudgeCheck);
        let showStar = ((iscomment && objectNotNull(evaluationInfo)) || !iscomment);
        let placeholder = shipOwner ? "我还想对货主说" : "我还想对船主说";
        if (iscomment) {
            if (content.length === 0) {
                placeholder = "此评价没有内容";
            }
        }
        return (
            <View style={appStyles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={{height:165, paddingTop: 15}}>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {shipOwner ? "货主执行能力" : "船主执行能力"}
                            </Text>
                            {showStar ? <StarScore style={{marginLeft:20}}
                                                   itemEdge={8}
                                                   currentScore={mission_star}
                                                   radius={22}
                                                   enabled={!iscomment}
                                                   tag={"mission"}
                                                   selectIndex={this.starScoreSelectIndex.bind(this)}/> : null}
                        </View>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {"交货结算评分"}
                            </Text>
                            {showStar? <StarScore style={{marginLeft:20}}
                                                  itemEdge={8}
                                                  currentScore={clean_star}
                                                  radius={22}
                                                  enabled={!iscomment}
                                                  tag={"clean"}
                                                  selectIndex={this.starScoreSelectIndex.bind(this)}/> : null}
                        </View>
                        <View style={styles.starView}>
                            <Text style={styles.starText}>
                                {"综合能力评分"}
                            </Text>
                            {showStar ? <StarScore style={{marginLeft:20}}
                                                   itemEdge={8}
                                                   currentScore={togeth_start}
                                                   radius={22}
                                                   enabled={!iscomment}
                                                   tag={"togeth"}
                                                   selectIndex={this.starScoreSelectIndex.bind(this)}/> : null}
                        </View>
                    </View>
                    <View style={{height:5, backgroundColor:appData.appGrayColor}} />
                    <View style={{paddingHorizontal: 7, paddingVertical:15}}>
                        <Image source={require('../../images/icon_yijian.png')} style={{width: 61, height: 32, resizeMode: "cover"}}/>
                        <TextInput underlineColorAndroid="transparent"
                                   style={styles.textInput}
                                   multiline={true}
                                   placeholder={placeholder}
                                   placeholderTextColor={appData.appSecondaryTextColor}
                                   onChangeText={(text) => {
                                       this.textInputChanged(text);
                                   }}
                                   editable={!iscomment}
                                   value={content}
                        >
                        </TextInput>
                    </View>
                </ScrollView>
                {iscomment ? null :
                    <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                        <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                            <View style={appStyles.sureBtnContainer}>
                                <Text style={{color: "#fff"}}>{"提交"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
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
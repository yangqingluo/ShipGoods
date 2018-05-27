import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import CustomItem from '../../components/CustomItem';
import StarScore from '../../components/StarScore';
import Communications from '../../util/AKCommunications';
import CustomAlert from '../../components/CustomAlert';
import Toast from "react-native-easy-toast";
import px2dp from "../../util";


export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '报价船详情',
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
        };

        this.config = [
            {idKey:"arrive_time",name:"预计到港时间"},
            {idKey:"download_oil_list", name:"可运油品"},
            {idKey:"storage", name:"仓容"},
            {idKey:"course", name:"航行区域"},
            {idKey:"upload_oil_list", name:"上载货品"},
            {idKey:"credit", name:"船主信用"},
            {idKey:"phone", name:"联系方式", onPress:this.cellSelected.bind(this, "SelectPhone")},
        ];
    }

    componentDidMount() {
        this.requestData();
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    requestRecommend = async (isReset) => {
        let data = {book_id: this.state.info.book_id, type: 2};

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_offer_detail/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.setState({
                            detailInfo: result.data,
                            refreshing: false,
                        })
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

    goBackToMain = () => {
        this.props.navigation.goBack('Main');
    };

    onAgreeBtnAction = () => {
        // PublicAlert("uid =" + userData.uid + ", book_id =" + this.state.info.book_id);
        this.refSelectAlert.show({onSureBtnAction:this.toAgreeBookShip.bind(this)});
    };

    onReplyBtnAction = () => {
        this.refReplyAlert.show({text:'', onSureBtnAction:this.toReplyShip.bind(this)});
    };

    toAgreeBookShip() {
        this.refSelectAlert.hide();
        let data = {
            // task_id: this.state.info.good_task_id,
            book_id: this.state.info.book_id,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/agree_ship_offer/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        PublicAlert('订单已生成', '',
                            [{text:"确定", onPress:this.goBackToMain.bind(this)}]
                        );
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refToast.show(error);
                });
    }

    toReplyShip() {
        let message = this.refReplyAlert.state.text;
        this.refReplyAlert.hide();

        if (message.length > 0) {
            let data = {
                reply_content: message,
                book_id: this.state.info.book_id,
            };

            NetUtil.post(appUrl + 'index.php/Mobile/Goods/goods_reply/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            this.refToast.show("回复成功");
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
        else {
            this.refToast.show("回复内容不能为空.");
        }
    }

    cellSelected = (key, data = {}) =>{
        let info = this.state.detailInfo;
        if (key === "SelectPhone") {
            if (objectNotNull(info.goods_owner)) {
                let phone = info.goods_owner.phone;
                if (phone !== null && phone.length > 0) {
                    Communications.phonecall(phone, true);
                    return;
                }
            }
            PublicAlert("联系电话不存在");
        }
        else {
            PublicAlert(key);
        }
    };

    remarkForInfo() {
        let info = this.state.detailInfo;
        if (objectNotNull(info.remark)) {
            if (info.remark.length > 0) {
                return info.remark;
            }
        }
        return '此油品暂无备注';
    }

    renderSubNameForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'arrive_time') {
            return info.arrive_timetext;
        }
        else if (item.idKey === 'download_oil_list') {
            let oilList = [];
            if (objectNotNull(info.download_oil_list)) {
                oilList = info.download_oil_list.map(
                    (info) => {
                        return info.goods_name;
                    }
                );
            }
            return oilList.join(" ");
        }
        else if (item.idKey === 'upload_oil_list') {
            let oilList = [];
            if (objectNotNull(info.upload_oil_list)) {
                oilList = info.upload_oil_list.map(
                    (info) => {
                        return info.goods_name;
                    }
                );
            }
            return oilList.join(" ");
        }
        else if (item.idKey === 'storage') {
            return info.storage + " m³";
        }
        else if (item.idKey === 'course') {
            let course = parseInt(info.course);
            if (course > 0 && course < shipAreaTypes.length) {
                return shipAreaTypes[course];
            }
        }

        return '';
    }

    renderSubViewForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'credit') {
            return <StarScore style={{marginLeft:5}} itemEdge={5} currentScore={info.credit}/>;
        }
        else if (item.idKey === 'phone') {
            if (objectNotNull(info.goods_owner)) {
                return <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                    {info.goods_owner.phone}
                </Text>
            }
        }

        return null;
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={'cell' + i} style={{paddingLeft: 10, paddingRight: 20}}>
                    <CustomItem key={i} {...item}
                                showArrowForward={false}
                                subName={this.renderSubNameForIndex(item, i)}
                                noSeparator={true}>
                        {this.renderSubViewForIndex(item, i)}
                    </CustomItem>
                    <View style={{height: 1, marginLeft: 10}}>
                        <DashLine backgroundColor={appData.appSeparatorLightColor} len={(screenWidth - 40)/ appData.appDashWidth}/>
                    </View>
                </View>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        let info = this.state.detailInfo;
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
                    <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:26}}>
                        <Text style={{fontSize:10, color:'white', marginLeft:10, marginTop:8}}>{'发票编号：' + info.goods_sn}</Text>
                        <Text style={{fontSize:10, color:'white', marginRight:10, marginTop:8}}>{info.add_timetext}</Text>
                    </View>
                    <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:51}}>
                        <Text style={{fontSize:14, color:appData.appTextColor, marginLeft:18, fontWeight:'bold'}}>{info.ship_name}</Text>
                        <Text style={{fontSize:12, color:appData.appRedColor, marginRight:18, fontWeight:'bold'}}>{info.offer + ' 元 / 吨'}</Text>
                    </View>
                    {this._renderListItem()}
                    <View style={{height: 10}} />
                    <View style={{paddingHorizontal:18}}>
                        <Image source={require('../../images/icon_beizhu.png')} style={{width: 57, height: 21, resizeMode: "cover"}}/>
                        <Text underlineColorAndroid="transparent"
                              style={styles.textInput}
                              multiline={true}
                              editable={false}
                        >
                            {this.remarkForInfo()}
                        </Text>
                    </View>
                    <View style={{height: 60}} />
                </ScrollView>
                <View style={{position: "absolute", bottom: 0, width: screenWidth, height: 45, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this.onAgreeBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(221), backgroundColor: appData.appBlueColor, justifyContent: "center", alignItems: "center"}}>
                        <Text style={styles.btnText}>{"同意报价"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onReplyBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(154), backgroundColor: appData.appLightBlueColor, justifyContent: "center", alignItems: "center"}}>
                        <Text style={styles.btnText}>{"回复船东"}</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <CustomAlert ref={o => this.refSelectAlert = o} message={"同意该船东报价，\n该货盘将进入订单页！"} />
                <CustomAlert ref={o => this.refReplyAlert = o} showTextInput={true} placeholder={"回复船东："}/>
            </View> );
    }
}
const styles = StyleSheet.create({
    textInput: {
        marginTop: 10,
        minHeight: 46,
        borderRadius: 6,
        fontSize: 16,
        paddingHorizontal: 28,
        paddingVertical: 15,
        color: '#535353',
        backgroundColor: appData.appGrayColor,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
    },
});
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    RefreshControl,
    FlatList,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import CustomItem from '../../components/CustomItem';
import StarScore from '../../components/StarScore';
import ReplyCell from './HomeReplyCell';
import Communications from '../../util/AKCommunications';
import CustomAlert from '../../components/CustomAlert';
import IndicatorModal from '../../components/IndicatorModal';
import Toast from "react-native-easy-toast";
import px2dp from "../../util";


export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '报价船详情',
    });

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.navigation.state.params.info,
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
        };

        this.config = [
            {idKey:"book_tonnage",name:"本载可装货量"},
            {idKey:"arrive_time",name:"预计到港时间"},
            // {idKey:"goods", name:"意向货品"},
            {idKey:"storage", name:"仓容"},
            {idKey:"area", name:"航行区域"},
            {idKey:"last_goods", name:"上载货品"},
            {idKey:"credit", name:"船主信用"},
            {idKey:"phone", name:"联系方式", onCellSelected:this.cellSelected.bind(this, "SelectPhone")},
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

    goBackToMain = () => {
        if (objectNotNull(appOrderVC)) {
            appOrderVC.reloadSubOrderingVC(false);
        }
        backAndGoToOrder();
    };

    onAgreeBtnAction = () => {
        this.refSelectAlert.show({onSureBtnAction:this.toAgreeBookShip.bind(this)});
    };

    onReplyBtnAction = () => {
        this.refReplyAlert.show({text:'', onSureBtnAction:this.doReplyFunction.bind(this)});
    };

    toAgreeBookShip() {
        this.refSelectAlert.hide();
        let data = {
            book_id: this.state.info.book_id,
        };

        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Goods/agree_ship_offer/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        PublicAlert('订单已生成', '',
                            [{text:"确定", onPress:this.goBackToMain.bind(this)}]
                        );
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
                });
    }

    doReplyFunction() {
        let message = this.refReplyAlert.state.text;
        this.refReplyAlert.hide();

        if (message.length > 0) {
            let data = {
                reply_type: userData.usertype,
                reply_content: message,
                book_id: this.state.info.book_id,
            };

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/goods_reply/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            this.refToast.show("回复成功");
                            this.requestData();
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
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
            if (objectNotNull(info.contact)) {
                let phone = info.contact;
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
        return '此货品暂无备注';
    }

    renderSubNameForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'arrive_time') {
            return info.arrive_time + "±" + info.arrive_delay + "天";
        }
        else if (item.idKey === "goods") {
            let oilList = [];
            if (arrayNotEmpty(info.goods)) {
                oilList = info.goods.map(
                    (info) => {
                        return info.goods_name;
                    }
                );
            }
            return oilList.join(",");
        }
        else if (item.idKey === "last_goods") {
            if (objectNotNull(info.last_goods_name)) {
                return info.last_goods_name.goods_name;
            }
        }
        else if (item.idKey === 'storage') {
            return info.storage + " m³";
        }
        else if (item.idKey === "area") {
            return getArrayTypesText(shipAreaTypes, parseInt(info.area) - 1);
        }
        else if (item.idKey === "book_tonnage") {
            if (!stringIsEmpty(info.book_tonnage)) {
                return info.book_tonnage + "吨";
            }
        }

        return '';
    }

    renderSubViewForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'credit') {
            if (objectNotNull(info.credit)) {
                return <StarScore style={{marginLeft:5}} itemEdge={5} currentScore={info.credit}/>;
            }
        }
        else if (item.idKey === 'phone') {
            if (objectNotNull(info.contact)) {
                return <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                    {info.contact}
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

    renderCell = (info: Object) => {
        return <ReplyCell info={info}/>;
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    _renderReplyList() {
        let info = this.state.detailInfo;
        if (objectNotNull(info.replylist)) {
            return <FlatList
                style={{flex:1}}
                data={info.replylist}
                renderItem={this.renderCell}
                keyExtractor={this.keyExtractor}
            />;
            // return info.replylist.map((item, i) => {
            //     return (
            //         <View key={"" + i}>
            //             <View style={{minHeight:20, borderRadius:4, paddingHorizontal:5, backgroundColor:'#5cb8ff33', flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
            //                 <Text style={{flex:1, fontSize:14}}>
            //                     <Text style={{color:"#ff5700a6"}}>{"我的回复："}</Text>
            //                     <Text style={{color:"#ff9d69"}}>{item.content}</Text>
            //                 </Text>
            //                 <Text style={{width:110, fontSize:12, color:"#a5a5a5", textAlign:"right"}}>{createTimeFormat(item.reply_time, "yyyy-MM-dd HH:mm")}</Text>
            //             </View>
            //             <View style={{height: 4}}/>
            //         </View>
            //     );
            // })
        }
        return null;
    }

    render() {
        const { navigate } = this.props.navigation;
        let info = this.state.detailInfo;
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={this.requestData.bind(this)}
                                    refreshing={this.state.refreshing}
                                />}
                >
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
                    <View style={{marginTop:12, paddingHorizontal:18}}>
                        {this._renderReplyList()}
                    </View>
                    <View style={{height: 60}} />
                </ScrollView>
                <View style={{width: screenWidth, height: 45, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this.onAgreeBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(221), backgroundColor: appData.appBlueColor, justifyContent: "center", alignItems: "center"}}>
                        <Text style={styles.btnText}>{"同意报价"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onReplyBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(154), backgroundColor: appData.appLightBlueColor, justifyContent: "center", alignItems: "center"}}>
                        <Text style={styles.btnText}>{"回复船东"}</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
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
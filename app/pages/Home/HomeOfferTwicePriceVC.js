import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import CustomItem from '../../components/CustomItem';
import StarScore from '../../components/StarScore';
import ReplyCell from './HomeReplyCell';
import Communications from '../../util/AKCommunications';
import CustomAlert from '../../components/CustomAlert';
import Toast from "react-native-easy-toast";
import px2dp from "../../util";


export default class HomeOfferTwicePriceVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '报价详情',
    });

    constructor(props) {
        super(props);
        this.state={
            info: appSecondPriceParams.info,
            detailInfo: appSecondPriceParams.info,
            refreshing: false,
            showRenderList: false,
        };

        this.config = [
            {idKey:"wastage",name:"损耗"},
            {idKey:"demurrage", name:"滞期费"},
            {idKey:"clean_deley", name:"结算时间"},
            {idKey:"corporation", name:"公司名称"},
            {idKey:"credit", name:"货主信用"},
            {idKey:"remark", name:"备注"},
        ];

        this.goodsConfig = [
            {idKey:"ship_name",name:"报价船"},
            {idKey:"book_tonnage",name:"本载可装货量"},
            {idKey:"offer", name:"我的报价"},
            {idKey:"arrive_time", name:"到港时间"},
            {idKey:"phone", name:"联系方式", onCellSelected:this.cellSelected.bind(this, "SelectPhone")},
            {idKey:"last_goods", name:"上载货品"},
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
        let data = {
            task_id: this.state.info.task_id
        };
        if (objectNotNull(this.state.info.book_id)) {
            data.book_id = this.state.info.book_id;
        }

        NetUtil.post(appUrl + 'index.php/Mobile/Ship/goods_task_detail/', data)
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
                        });
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.setState({
                        refreshing: false,
                    });
                    this.refToast.show(error);
                });
    };

    toChangePrice() {
        let message = this.refChangePriceAlert.state.text;
        this.refChangePriceAlert.hide();
        if (message.length > 0) {
            let price = parseFloat(message);
            let data = {
                book_id: this.state.info.book_id,
                offer: price.Format(2),
            };

            NetUtil.post(appUrl + 'index.php/Mobile/Task/update_book_good/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            this.refToast.show('修改报价完成');
                            this.requestData();
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }
        else {
            this.refToast.show("报价不能为空.");
        }
    }

    doReplyFunction() {
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
                            this.requestData();
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

    // onFavorBtnAction = () => {
    //     this.props.navigation.setParams({
    //         favor: true,
    //     });
    // };

    onSubmitBtnAction = () => {
        //修改报价
        if (objectNotNull(this.state.detailInfo.book)) {
            let book_num = parseInt(this.state.detailInfo.book.book_num);
            if (book_num <= 2) {
                this.refChangePriceAlert.show({text:'', onSureBtnAction:this.toChangePrice.bind(this)});
                return;
            }
        }
        this.refToast.show('修改次数受限，不能修改');
    };

    onReplyBtnAction = () => {
        this.refReplyAlert.show({text:'', onSureBtnAction:this.doReplyFunction.bind(this)});
    };

    cellSelected = (key, data = {}) =>{
        let info = this.state.detailInfo;
        if (key === "SelectPhone") {
            if (objectNotNull(info.goods_owner)) {
                let phone = info.goods_owner.contact;
                if (!stringIsEmpty(phone)) {
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

    renderSubNameForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'wastage') {
            return info.wastage;
        }
        else if (item.idKey === 'demurrage' && info.demurrage > 0) {
            return info.demurrage + ' 元/天'
        }
        else if (item.idKey === 'clean_deley' && info.clean_deley > 0) {
            return '完货' + info.clean_deley + '天内';
        }
        else if (item.idKey === 'corporation') {
            if (objectNotNull(info.goods_owner)) {
                return info.goods_owner.corporation;
            }
        }
        else if (item.idKey === 'remark') {
            return stringIsEmpty(info.remark) ? "暂无" : info.remark;
        }
        else if (item.idKey === 'ship_name') {
            if (objectNotNull(info.book)) {
                return info.book.ship_name;
            }
        }
        // else if (item.idKey === "offer") {
        //     if (objectNotNull(info.book)) {
        //         return info.book.offer;
        //     }
        // }
        else if (item.idKey === 'arrive_time') {
            if (objectNotNull(info.book)) {
                return info.book.arrive_time + " ± " + info.book.arrive_delay + "天";
            }
        }
        else if (item.idKey === "last_goods") {
            if (objectNotNull(info.book)) {
                if (objectNotNull(info.book.last_goods_name)) {
                    return info.book.last_goods_name.goods_name;
                }
            }
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
            if (objectNotNull(info.goods_owner)) {
                let credit = parseInt(info.goods_owner.credit);
                return <StarScore style={{marginLeft:5}} itemEdge={5} currentScore={credit}/>;
            }
        }
        else if (item.idKey === 'phone') {
            if (objectNotNull(info.goods_owner)) {
                return <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                    {info.goods_owner.contact}
                </Text>
            }
        }
        else if (item.idKey === "offer") {
            if (objectNotNull(info.book)) {
                return <Text style={{color: appData.appRedColor, fontSize: 14, fontWeight: appData.fontWeightBold}}>
                    {info.book.offer}
                </Text>
            }
        }

        return null;
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={'cell' + i} style={{paddingLeft: 10, paddingRight: 20, backgroundColor: '#f2f9ff'}}>
                    <CustomItem key={i} {...item}
                                showArrowForward={false}
                                subName={this.renderSubNameForIndex(item, i)}
                                noSeparator={true}>
                        {this.renderSubViewForIndex(item, i)}
                    </CustomItem>
                    {i === this.config.length - 1 ? null :
                        <View style={{height: 1, marginLeft: 10}}>
                            <DashLine backgroundColor={appData.appSeparatorLightColor} len={(screenWidth - 40)/ appData.appDashWidth}/>
                        </View>}
                </View>);
        })
    }

    _renderGoodsListItem() {
        return this.goodsConfig.map((item, i) => {
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
        }
        return null;
    }

    render() {
        const { navigate } = this.props.navigation;
        let {showRenderList} = this.state;
        let info = this.state.detailInfo;
        let price = parseInt(info.price);
        let isBargain = offerIsBargain(info.is_bargain);
        let isShipPrice = offerIsShipPrice(info.is_shipprice);

        let canChange = isShipPrice || isBargain;
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={this.requestData.bind(this)}
                                    refreshing={this.state.refreshing}
                                />}
                >
                    <View style={{height: 47, flexDirection: 'row', alignItems: "center", justifyContent: "space-between",}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={require('../../images/icon_blue.png')} style={{width: 10, height: 12, resizeMode: "cover"}}/>
                            <Text style={{fontSize: 10, color:appData.appSecondaryTextColor, marginLeft: 5}}>{'货物编号：' + info.goods_sn}</Text>
                        </View>
                        <View style={{marginRight: 6, justifyContent: "flex-end"}}>
                            <Text style={{fontSize: 12, color:appData.appBlueColor}}>{'已有' + info.offer_num + '人报价'}</Text>
                        </View>
                    </View>
                    <View style={styles.centerContainer}>
                        <View style={{backgroundColor: '#f2f9ff', paddingLeft:34, paddingRight:10, paddingVertical: 10, minHeight:73}}>
                            <View style={{marginTop: 5, flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                    <Text style={styles.textContainer}>{info.loading_port_name}</Text>
                                    <Image source={require('../../images/icon_arrow_right_half.png')} style={styles.arrowContainer}/>
                                </View>
                                <Text style={styles.textContainer}>{info.unloading_port_name}</Text>
                            </View>
                            <View style={{marginTop: 5, flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                <Text style={styles.textContainer}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                                <Text style={styles.textContainer}>{createGoodsName(info) + ' ' + info.tonnage + '吨'+ '±' + info.ton_section}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {this.setState({
                            showRenderList: !this.state.showRenderList,
                        })}}>
                            <View style={{backgroundColor: '#81c6ff', height: 26, flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontSize: 12, color:'white', fontWeight:'bold'}}>{offerIsShipPrice(info.is_shipprice) ? "船东开价" : info.price}</Text>
                                <Image source={showRenderList ? require('../../images/icon_rectangle_up.png') : require('../../images/icon_rectangle_down.png')} style={{marginLeft:5, width: 17, height: 11, resizeMode: "cover"}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {showRenderList ?
                        <View>
                            {this._renderListItem()}
                            <View style={{height: 12, backgroundColor: appData.appGrayColor}}/>
                        </View>
                        : null}
                    {this._renderGoodsListItem()}
                    <View style={{marginTop:12, paddingHorizontal:18}}>
                        {this._renderReplyList()}
                    </View>
                    {canChange ? null :
                        <View style={{alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{marginTop: 40, fontSize:20, color:appData.appBlueColor, fontWeight: appData.fontWeightMedium}}>{isShipOwner() ? "报价已推送至货主" : "货盘已推送至船东"}</Text>
                        </View>
                    }
                    <View style={{height: 80}}/>
                </ScrollView>
                {canChange ?
                    /*
                    * <View style={{position: "absolute", bottom: 5, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                        <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                            <View style={appStyles.sureBtnContainer}>
                                <Text style={{color: "#fff"}}>{"修改报价"}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{marginTop:12, color: "#4a4a4aad", fontSize: 13}}>{"报价最多可修改2次"}</Text>
                    </View>
                    *
                    * */
                    <View style={{width: screenWidth, height: 45, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(221), backgroundColor: appData.appBlueColor, justifyContent: "center", alignItems: "center"}}>
                            <Text style={styles.btnText}>{"修改报价"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onReplyBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(154), backgroundColor: appData.appLightBlueColor, justifyContent: "center", alignItems: "center"}}>
                            <Text style={styles.btnText}>{"回复货主"}</Text>
                        </TouchableOpacity>
                    </View>
                : null}
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <CustomAlert ref={o => this.refChangePriceAlert = o} showTextInput={true} numeric={true} placeholder={"修改报价："}/>
                <CustomAlert ref={o => this.refReplyAlert = o} showTextInput={true} placeholder={"回复货主："}/>
            </View> );
    }
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        fontSize:14,
        color: appData.appTextColor,
    },
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
    arrowContainer: {
        width:32,
        height:4,
        marginLeft:20,
        marginRight:45,
        resizeMode: "stretch",
    }
});

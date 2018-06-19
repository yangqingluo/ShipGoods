import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ScrollView,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import CustomItem from '../../components/CustomItem';
import StarScore from '../../components/StarScore';
import ReplyCell from './HomeReplyCell';
import Communications from '../../util/AKCommunications';
import CustomAlert from '../../components/CustomAlert';
import Toast from "react-native-easy-toast";


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
            {idKey:"offer", name:"报价"},
            {idKey:"arrive_time", name:"到港时间"},
            {idKey:"phone", name:"联系方式", onPress:this.cellSelected.bind(this, "SelectPhone")},
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
                    }
                },(error)=>{
                    this.setState({
                        refreshing: false,
                    });
                });
    };

    toChangePrice() {
        let message = this.refChangePriceAlert.state.text;
        this.refChangePriceAlert.hide();
        if (message.length > 0) {
            let price = parseFloat(message);
            let data = {
                book_id: this.state.info.book_id,
                offer: price,
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
            return info.remark.length === 0 ? "暂无" : info.remark;
        }
        else if (item.idKey === 'ship_name') {
            if (objectNotNull(info.ship)) {
                return info.ship.ship_name;
            }
        }
        else if (item.idKey === "offer") {
            if (objectNotNull(info.book)) {
                return info.book.offer;
            }
        }
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
        let isBargain = offerIsBargain(this.state.detailInfo.is_bargain);
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
                        <View style={{backgroundColor: '#f2f9ff', paddingLeft:34, paddingRight:10, minHeight:73}}>
                            <View style={{marginTop: 15, height: 20, flexDirection: 'row', alignItems: "center"}}>
                                <Text style={styles.textContainer}>{info.loading_port_name}</Text>
                                <Image source={require('../../images/icon_arrow_right_half.png')} style={styles.arrowContainer}/>
                                <Text style={styles.textContainer}>{info.unloading_port_name}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={styles.textContainer}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                                <Text style={[styles.textContainer, {flex: 1, marginLeft:20}]}>{this.state.info.goods_name + ' ' + this.state.info.tonnage + '+' + this.state.info.ton_section + '吨'}</Text>
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
                    <View style={{height: 80}}/>
                </ScrollView>
                <View style={{position: "absolute", bottom: 5, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"修改报价"}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginTop:12, color: "#4a4a4aad", fontSize: 13}}>{"报价最多可修改2次"}</Text>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <CustomAlert ref={o => this.refChangePriceAlert = o} showTextInput={true} numeric={true} placeholder={"修改报价："}/>
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
    arrowContainer: {
        width:32,
        height:4,
        marginLeft:20,
        marginRight:20,
        resizeMode: "stretch",
    }
});


// {"code":0,"message":"",
//     "data":{"task_id":"94",
//     "goods_sn":"GYY180619004",
//     "tonnage":"3568",
//     "ton_section":"500",
//     "price":"\u00a53568.00 \u5143\/\u5428",
//     "loading_port":"225",
//     "loading_port_name":"\u77f3\u5c9b\u6e2f",
//     "unloading_port":"129",
//     "unloading_port_name":"\u91cd\u5e86\u6e2f",
//     "create_time":"1529419412",
//     "loading_time":"2018-06-19",
//     "loading_delay":"0",
//     "clean_time":null,
//     "uid":"74",
//     "remark":null,
//     "status":"0",
//     "wastage":"\u8239\u68c0\u91cf -> \u8239\u68c0\u91cf 2.0\u2030",
//     "clean_deley":"15",
//     "demurrage":"1000",
//     "collect_num":"0",
//     "view_num":"9",
//     "is_delete":"0",
//     "is_bargain":"1",
//     "area":"0",
//     "offer_num":"1",
//     "is_shipprice":"0",
//     "goodslist":[{"transport_id":"17","goods_id":"75","task_id":"94","goods_name":"\u539f\u6cb9"}],
//     "goods_owner":{"uid":"74","username":"chuanyun_74","mobile":"17681981616","email":null,"password":"f63d4b2d7d6e1b332b265b85d3f8c5f0","usertype":"1","state":"0","create_time":"1522732798","authstate":"1","sex":"1","sign":"\u4e2a\u4eba\u7b7e\u540d","credit":"5","bz_licence":"68","card_front":"","card_con":"","idcard_front":"Uploads\/corporation\/2018-06-08\/5b19d90761db8.png","idcard_con":"Uploads\/corporation\/2018-06-08\/5b19d90e2cdaa.png","invoice_type":"1","invoice_remark":"\u662f","corporation":"68","phone":"","name":"\u6768","contact":"17681981616"},
//     "book":{
//         "uid":"78",
//             "sex":"1",
//             "sign":null,
//             "credit":"4",
//             "bz_licence":"",
//             "card_front":"",
//             "card_con":"",
//             "idcard_front":"",
//             "idcard_con":"",
//             "invoice_type":"1",
//             "invoice_remark":null,
//             "corporation":null,
//             "phone":null,
//             "remark":null,
//             "auth_time":"0",
//             "checker":"0",
//             "check_time":"0",
//             "name":"\u8d27",
//             "contact":"13758727770",
//             "ship_id":"1",
//             "ship_name":"\u6768\u8239\u4e00",
//             "ship_lience":"Uploads\/ship\/2018-06-06\/5b173d483d971.png",
//             "projects":"",
//             "tonnage":"666",
//             "storage":"665",
//             "state":"0",
//             "dieseloil":"2000",
//             "gasoline":"1000",
//             "longitude":null,
//             "latitude":null,
//             "area":"3",
//             "income_qua":"0",
//             "usestate":"0",
//             "create_time":"1528249673",
//             "ship_type":"0",
//             "good_task_id":"94",
//             "qid":"74",
//             "book_id":"10",
//             "offer":"0.00",
//             "arrive_time":"2018-06-24",
//             "arrive_delay":"4",
//             "last_goods_id":"75",
//             "add_time":"1529419452",
//             "book_num":"1",
//             "goods_sn":"GYY180619004",
//             "last_goods_name":{"goods_id":"75","goods_name":"\u539f\u6cb9","iclose":"0","pid":"24","deep":"1"}},
//     "ship":{"ship_id":"2",
//         "ship_name":"\u91d1\u822a\u6cb9",
//         "ship_lience":"Uploads\/ship\/2018-06-06\/5b1798120f354.png",
//         "projects":"",
//         "tonnage":"5000",
//         "storage":"6000",
//         "uid":"95",
//         "state":"0",
//         "dieseloil":"5000",
//         "gasoline":"4000",
//         "longitude":null,
//         "latitude":null,
//         "area":"2",
//         "income_qua":"0",
//         "usestate":"0",
//         "create_time":"1528272919",
//         "ship_type":"0"},
//     "iscollect":0,
//         "create_timetext":"2018-06-19",
//         "loading_timetext":"2018-06-19",
//         "clean_timetext":" ",
//         "replylist":[]}}
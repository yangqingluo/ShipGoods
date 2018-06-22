import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import CustomItem from '../../components/CustomItem';
import Communications from "../../util/AKCommunications";
import DashLine from '../../components/DashLine';
import CustomAlert from '../../components/CustomAlert';
import Toast from 'react-native-easy-toast';
import ActionSheet from 'react-native-actionsheet';

const Icon = appFont["Ionicons"];

export default class OrderJudgementVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "订单详情",
        headerRight: (!isShipOwner() && navigation.state.params.order_state === '0') ?
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity onPress={navigation.state.params.clickMoreBtn} style={{minWidth:40}}>
                    <Icon name={'ios-more'} size={30} color={appData.appLightTextColor}/>
                </TouchableOpacity>
            </View>
            : null
    });

    constructor(props){
        super(props);
        this.state = {
            detailInfo: this.props.navigation.state.params.info,
            transportInfo: null,
            refreshing: false,
            refreshingTransport: false,
        };
        this.config = [
            {idKey:"ship_name",name:"船名"},
            {idKey:"goods_list", name:"货品名称"},
            {idKey:"price", name:"货品运价"},
        ];

        this.config2 = [
            {idKey:"wastage",name:"损耗"},
            {idKey:"demurrage", name:"滞期费"},
        ];

        this.config3 = [
            {idKey:"contact",name: isShipOwner() ? "货主联系方式" : "船东联系方式", onPress:this.cellSelected.bind(this, "SelectContact")},
            {idKey:"invoice_type", name:"发票"},
        ];
    };

    componentDidMount() {
        this.requestData();
        this.props.navigation.setParams({clickMoreBtn:this.moreBtnClick});
    }

    requestData = () => {
        this.setState({
            refreshing: true,
            refreshingTransport: true,
        });
        this.requestRecommend(true);
        this.requestTransport();
    };

    requestRecommend = async (isReset) => {
        let {info} = this.props.navigation.state.params;
        let data = {or_id: info.or_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Order/order_detail/', data)
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

    requestTransport = () => {
        let data = {or_id: this.props.navigation.state.params.info.or_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Order/get_transport_detail/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.setState({
                            transportInfo: result.data,
                            refreshingTransport: false,
                        })
                    }
                    else {
                        this.setState({
                            refreshingTransport: false,
                        })
                    }
                },(error)=>{
                    this.setState({
                        refreshingTransport: false,
                    })
                });
    };

    toCollectGoods(info) {
        this.refSelectAlert.hide();
        let data = {
            or_id: info.or_id,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Order/change_order_state/', data)
            .then(
                (result)=>{
                    this.refToast.show(result.message);
                    if (result.code === 0) {
                        this.props.navigation.setParams({
                            order_state: '1',
                        });
                        this.requestData();
                    }
                    // else {
                    //     this.refToast.show(result.message);
                    // }
                },(error)=>{
                    this.refToast.show(error);
                });
    };

    toCloseOrder() {
        this.refCloseOrderAlert.hide();
        let data = {
            or_id: this.state.detailInfo.or_id,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Order/close_order/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        PublicAlert(result.message, '订单已关闭',
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

    goBack() {
        this.props.navigation.goBack();
    }

    moreBtnClick=()=> {
        this.refActionSheet.show();
    };

    onSelectCloseOrderType(index) {
        if (index === 1) {
            this.refCloseOrderAlert.show({onSureBtnAction:this.toCloseOrder.bind(this)});
        }
    }

    cellSelected = (key, data = {}) =>{
        let {detailInfo} = this.state;
        if (key === "SelectContact") {
            if (objectNotNull(detailInfo.contact)) {
                let phone = detailInfo.contact;
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

    onCellBottomBtnAction = (tag: number) => {
        let {detailInfo, transportInfo} = this.state;
        switch (tag){
            case OrderBtnEnum.JudgeOrder:
            case OrderBtnEnum.JudgeCheck:
                this.props.navigation.navigate('OrderJudgement',
                    {
                        info: detailInfo,
                        tag: tag,
                    });
                break;

            case OrderBtnEnum.EditTransport:
                this.props.navigation.navigate('OrderTransportEdit',
                    {
                        info: detailInfo,
                        tag: tag,
                    });
                break;

            case OrderBtnEnum.CheckTransport:
                this.props.navigation.navigate('OrderTransport',
                    {
                        info: detailInfo,
                        tag: tag,
                    });
                break;

            case OrderBtnEnum.CollectGoods:
                this.refSelectAlert.show({onSureBtnAction:this.toCollectGoods.bind(this, detailInfo)});
                break;

            default:
                break;
        }

    };

    onTransportTextAction = () => {
        this.requestData();
    };

    _renderTransport() {
        let {detailInfo, transportInfo, refreshingTransport} = this.state;
        if (refreshingTransport) {
            return (
                <View>
                    <View style={styles.transportTop} />
                    <View style={styles.noTransportContainer}>
                        <ActivityIndicator />
                    </View>
                </View>
            );
        }

        if (objectNotNull(transportInfo)) {
            let radius = 16;
            let len = (screenWidth - 26 * 2 - radius * 4) / 3 /appData.appDashWidth;
            let state = parseInt(transportInfo.trans_state);
            let color1 = state >= 1 ? appData.appBlueColor : appData.appDeepGrayColor;
            let color5 = state >= 5 ? appData.appBlueColor : appData.appDeepGrayColor;
            let color6 = state >= 6 ? appData.appBlueColor : appData.appDeepGrayColor;
            let color10 = state >= 10 ? appData.appBlueColor : appData.appDeepGrayColor;
            let remark = transportInfo.trans_remark;
            if (objectNotNull(transportInfo.translist)) {
                if (state > 0 && state <= transportInfo.translist.length) {
                    let trans = transportInfo.translist[state];
                    if (objectNotNull(trans)) {
                        remark = trans.remark;
                    }
                }
            }

            return (
                <View>
                    <View style={styles.transportTop} />
                    <View style={styles.transportContainer}>
                        <View style={{marginTop:11, flexDirection: 'row'}}>
                            <Text style={{flex:1, fontSize:12, textAlign:'center', color:color5}}>{"灌溉发货"}</Text>
                            <Text style={{flex:1, fontSize:12, textAlign:'center', color:color6}}>{"出海运输"}</Text>
                            <Text style={{flex:1, fontSize:12, textAlign:'center', color:color10}}>{"交货完成"}</Text>
                        </View>
                        <View style={{width:screenWidth - 26 * 2, height:radius, flexDirection: 'row', alignItems: "center",}}>
                            <Icon name={'ios-checkmark-circle'} size={radius} color={color1} />
                            <DashLine backgroundColor={color5} len={len}/>
                            <Icon name={'ios-checkmark-circle'} size={radius} color={color5} />
                            <DashLine backgroundColor={color6} len={len}/>
                            <Icon name={'ios-checkmark-circle'} size={radius} color={color6} />
                            <DashLine backgroundColor={color10} len={len}/>
                            <Icon name={'ios-checkmark-circle'} size={radius} color={color10} />
                        </View>
                        <View style={{flex:1, alignItems: "center", justifyContent: "center",}}>
                            <Text style={{fontSize:10, textAlign:'center', color:'#838383'}}>{transportInfo.trans_remark}</Text>
                        </View>
                    </View>
                    <View style={styles.transportBottom}>
                        <Image source={require('../../images/icon_word_hang.png')} style={{width: 19, height: 29, resizeMode: "stretch"}} />
                        <Text style={{margin:15, fontSize:13, color:'#3f3f3f'}}>{transportInfo.trans_remark}</Text>
                    </View>
                </View>
            );
        }
        return (
            <View>
                <View style={styles.transportTop} />
                <View style={styles.noTransportContainer}>
                    <Image source={require('../../images/icon_zanwu.png')} style={{width: 44, height: 44, resizeMode: "stretch"}} />
                    <Text style={{fontSize:13, marginLeft:15}}>
                        <Text style={{color:"#3f3f3f"}}>{"暂无货运详情，"}</Text>
                        <Text style={{color:appData.appRedColor}} onPress={this.onTransportTextAction.bind(this)}>{"请选择"}</Text>
                    </Text>
                </View>
            </View>
        );
    };

    renderHeader() {
        let {detailInfo} = this.state;
        return (
            <View style={{paddingHorizontal: 10}}>
                {this._renderTransport()}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {detailInfo.loading_port_name}
                    </Text>
                    <View style={{width:111}}>
                        <Image source={require('../../images/icon_time_and_arrow.png')} style={{width: 111, height: 15, resizeMode: "cover"}} />
                        <Text style={styles.headerTimeText}>
                            {detailInfo.loading_time}
                        </Text>
                    </View>
                    <Text style={styles.headerText}>
                        {detailInfo.unloading_port_name}
                    </Text>
                </View>
                <View style={{height: 22}} />
            </View>
        );
    };

    renderFooter() {
        let {detailInfo} = this.state;
        if (objectNotNull(detailInfo.iclose)) {
            if (detailInfo.iclose === '1') {
                return <View style={styles.footerContainer}>
                    <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: '#dfdfdf', width: 102}]} onPress={() => this.onCellBottomBtnAction.bind(this, OrderBtnEnum.Default)} disabled={true}>
                        <Text style={{fontSize:16, color:'#818181'}}>{"订单已关闭"}</Text>
                    </TouchableOpacity>
                </View>;
            }
        }

        if (detailInfo.order_state === '0') {
            if (isShipOwner()) {
                return (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: '#dfdfdf', marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.EditTransport)}>
                            <Text style={{fontSize:16, color:'#3c3c3c'}}>{"编辑货运"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: appData.appClearColor, marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.Transporting)}>
                            <Text style={{fontSize:16, color:appData.appBlueColor}}>{"正在运输"}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            else {
                return (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: '#dfdfdf', marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.CheckTransport)}>
                            <Text style={{fontSize:16, color:'#3c3c3c'}}>{"查看货运"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: appData.appBlueColor}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.CollectGoods)}>
                            <Text style={{fontSize:16, color:appData.appBlueColor}}>{"确认收货"}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
        else {
            return (
                <View style={styles.footerContainer}>
                    {commentIscomment(detailInfo.iscomment)
                        ?
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: appData.appBlueColor, marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.JudgeCheck)}>
                            <Text style={{fontSize:16, color:appData.appBlueColor}}>{"对方对我的评价"}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: appData.appBlueColor, marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.JudgeOrder)}>
                            <Text style={{fontSize:16, color:appData.appBlueColor}}>{"评价"}</Text>
                        </TouchableOpacity>}
                </View>
            );
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
        else if (item.idKey === 'ship_name') {
            return info.ship_name;
        }
        else if (item.idKey === 'price') {
            return offerIsShipPrice(info.is_shipprice) ? "船东开价" : info.price;
        }
        else if (item.idKey === 'loading_time') {
            return info.loading_timetext;
        }
        else if (item.idKey === 'invoice_type') {
            if (objectNotNull(info.invoice_remark)) {
                if (info.invoice_remark.length > 0) {
                    return info.invoice_remark;
                }
            }
            return info.invoice_type;
        }
        else if (item.idKey === 'goods_list') {
            if (objectNotNull(info.goodslist)) {
                let list = info.goodslist.map(
                    (info) => {
                        return info.goods_name;
                    }
                );
                return list.join(" ");
            }
        }

        return '';
    }

    renderSubViewForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'contact') {
            if (objectNotNull(info.contact)) {
                return <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                    {info.contact}
                </Text>
            }
        }
        return null;
    }

    _renderListItem(list) {
        return list.map((item, i) => {
            return (
                <View key={'cell' + i} style={{paddingLeft: 10, paddingRight: 10, backgroundColor: '#fff'}}>
                    <CustomItem key={i} {...item}
                                showArrowForward={false}
                                subName={this.renderSubNameForIndex(item, i)}
                                noSeparator={true}>
                        {this.renderSubViewForIndex(item, i)}
                    </CustomItem>
                    {i === list.length - 1 ? null : <View style={{height: appData.appSeparatorHeight, backgroundColor: appData.appSeparatorLightColor}}/>}
                </View>);
        })
    }

    render() {
        let {detailInfo} = this.state;
        let shipOwner = isShipOwner();
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1}}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={this.requestData.bind(this)}
                                    refreshing={this.state.refreshing}
                                />
                            }
                >
                    {this.renderHeader()}
                    {this._renderListItem(this.config)}
                    <View style={{height: 10, backgroundColor: appData.appGrayColor}}/>
                    {this._renderListItem(this.config2)}
                    <View style={{height: 10, backgroundColor: appData.appGrayColor}}/>
                    {this._renderListItem(this.config3)}
                    <Text style={[styles.snText, {marginTop:8}]}>
                        {"货物编号：" + detailInfo.goods_sn}
                    </Text>
                    <Text style={[styles.snText, {marginTop:2}]}>
                        {"订单编号：" + detailInfo.or_sn}
                    </Text>
                    <Text style={[styles.snText, {marginTop:2}]}>
                        {"成交时间：" + detailInfo.confirm_time}
                    </Text>
                    <View style={{height: 80}}/>
                </ScrollView>
                {this.renderFooter()}
                <ActionSheet
                    ref={o => this.refActionSheet = o}
                    title={'关闭订单'}
                    options={['取消', '关闭订单']}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={1}
                    onPress={this.onSelectCloseOrderType.bind(this)}
                />
                <CustomAlert ref={o => this.refSelectAlert = o} title={"确认收货"} message={"请收到货确认无误以后确认收货"} />
                <CustomAlert ref={o => this.refCloseOrderAlert = o} title={"关闭订单"} message={"请确认关闭订单"} />
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    headerContainer: {
        marginTop:3,
        minHeight:77,
        borderWidth:0.5,
        borderColor:appData.appBorderColor,
        flexDirection: 'row',
        paddingTop:20,
        backgroundColor: 'white',
    },
    footerContainer: {
        position: "absolute",
        bottom: 0,
        width: screenWidth,
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth:1,
        borderTopColor:appData.appSeparatorColor,
        paddingRight: 10,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    headerText: {
        flex:1,
        fontSize:16,
        color:appData.appTextColor,
        fontWeight:appData.appFontWeightSemibold,
        textAlign:'center',
    },
    headerTimeText: {
        marginTop:5,
        fontSize:12,
        color:appData.appTextColor,
        fontWeight:appData.appFontWeightSemibold,
        textAlign:'center',
    },
    transportTop: {
        marginTop:14,
        height: 10,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:appData.appBlueColor,
    },
    transportContainer: {
        paddingHorizontal:16,
        minHeight:74,
        borderWidth:0.5,
        borderColor:appData.appBorderColor,
        backgroundColor: 'white',
    },
    transportBottom: {
        marginTop:3,
        paddingHorizontal:16,
        minHeight: 61,
        borderWidth:0.5,
        borderColor:appData.appBorderColor,
        backgroundColor: 'white',
        alignItems: "center",
        flexDirection: 'row',
    },
    noTransportContainer: {
        minHeight:74,
        borderWidth:0.5,
        borderColor:appData.appBorderColor,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
    },
    snText: {
        fontSize:12,
        color:'#7d7d7d',
        marginLeft:12,
    },
});
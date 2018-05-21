import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import CustomItem from '../../components/CustomItem';
import Communications from "../../util/AKCommunications";

export default class OrderJudgementVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "订单详情"
    });

    constructor(props){
        super(props);
        this.state = {
            detailInfo: this.props.navigation.state.params.info,
            transportInfo: null,
            refreshing: false,
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
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
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
                            // refreshing: false,
                        })
                    }
                    else {
                        // this.setState({
                        //     refreshing: false,
                        // })
                    }
                },(error)=>{
                    // this.setState({
                    //     refreshing: false,
                    // })
                });
    };

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

            default:
                PublicAlert(tag + JSON.stringify(info));
                break;
        }

    };

    onTransportTextAction = () => {
        PublicAlert("请选择");
    };

    _renderTransport() {
        let {detailInfo, transportInfo} = this.state;
        return (
            <View>
                <View style={styles.transportTop} />
                <View style={styles.transportContainer}>
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
        if (isShipOwner()) {
            return (
                <View style={styles.footerContainer}>

                </View>
            );
        }
        else {
            return (
                <View style={styles.footerContainer}>
                    {commentIscomment(detailInfo.iscomment)
                        ?
                        <TouchableOpacity style={[appStyles.orderBtnContainer, {borderColor: appData.appBlueColor, marginRight:10}]} onPress={this.onCellBottomBtnAction.bind(this, OrderBtnEnum.JudgeCheck)}>
                            <Text style={{fontSize:16, color:appData.appBlueColor}}>{"查看评价"}</Text>
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
            return '¥'+ info.price + ' 元/ 吨'
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
        paddingRight:0,
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
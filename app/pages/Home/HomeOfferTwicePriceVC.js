import React, { Component } from 'react';
import PropTypes from 'prop-types';
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


export default class HomeOfferTwicePriceVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '货品详情',
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
            {idKey:"price", name:"报价"},
            {idKey:"loading_time", name:"到港时间"},
            {idKey:"phone", name:"联系方式", onPress:this.cellSelected.bind(this, "SelectPhone")},
            {idKey:"goodslist", name:"上载货品"},
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
        let data = {task_id: this.state.info.task_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Ship/goods_task_detail/', data)
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

    // onFavorBtnAction = () => {
    //     this.props.navigation.setParams({
    //         favor: true,
    //     });
    // };

    onSubmitBtnAction = () => {
        // //修改报价
        // this.props.navigation.navigate('HomeOfferPrice',
        //     {
        //         title: "报价",
        //         info: this.state.detailInfo,
        //     });
    };

    cellSelected = (key, data = {}) =>{
        let info = this.state.detailInfo;
        if (key === "SelectPhone") {
            if (goodsOwnerNotNull(info)) {
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
            if (goodsOwnerNotNull(info)) {
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
            // PublicAlert(JSON.stringify(info.ship));
        }
        else if (item.idKey === 'price') {
            return '¥'+ info.price + ' 元/ 吨'
        }
        else if (item.idKey === 'loading_time') {
            return info.loading_timetext;
        }
        // else if (item.idKey === 'phone') {
        //     if (goodsOwnerNotNull(info)) {
        //         return info.goods_owner.phone;
        //     }
        // }
        else if (item.idKey === 'goodslist') {
            let list = info.goodslist.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return list.join(" ");
        }

        return '';
    }

    renderSubViewForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'credit') {
            if (goodsOwnerNotNull(info)) {
                let credit = parseInt(info.goods_owner.credit);
                return <StarScore style={{marginLeft:5}} itemEdge={5} currentScore={credit}/>;
            }
        }
        else if (item.idKey === 'phone') {
            if (goodsOwnerNotNull(info)) {
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

    render() {
        const { navigate } = this.props.navigation;
        let {showRenderList} = this.state;
        let info = this.state.detailInfo;
        let price = parseInt(info.price);
        let isBargain = offerIsBargain(this.state.detailInfo);
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}
                            onRefresh={this.requestData}
                            refreshing={this.state.refreshing}
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
                        <View style={{backgroundColor: '#f2f9ff', height: 73}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                <Text style={{marginLeft: 34, fontSize: 14, color: appData.appTextColor}}>{info.loading_port_name + ' → ' + info.unloading_port_name}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{marginLeft: 34, fontSize: 14, color: appData.appTextColor}}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                                <Text style={{marginRight: 27, fontSize: 14, color: appData.appTextColor}}>{'原油 10000+10000吨'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {this.setState({
                            showRenderList: !this.state.showRenderList,
                        })}}>
                            <View style={{backgroundColor: '#81c6ff', height: 26, flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontSize: 12, color:'white', fontWeight:'bold'}}>{'¥'+ info.price + ' 元/ 吨'}</Text>
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
    }
});
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Button,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import CustomItem from '../../components/CustomItem';
import ShareUtil from "../../share/ShareUtil";
import SharePlatform from "../../share/SharePlatform";
import Toast from "react-native-easy-toast";
import IndicatorModal from '../../components/IndicatorModal';

export default class HomeOrderDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '货品详情',
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
        };

        this.config = [
            {idKey:"wastage",name:"损耗"},
            {idKey:"demurrage", name:"滞期费"},
            {idKey:"clean_deley", name:"结算时间"},
            {idKey:"remark", name:"备注"},
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

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_goods_detail/', data)
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
        appHomeVC.reloadSubListOrderVC();
        this.props.navigation.goBack('Main');
    };

    onFavorBtnAction = () => {
        this.props.navigation.setParams({
            favor: true,
        });
    };

    onShareBtnAction = () => {
        //分享
        ShareUtil.shareboard('分享的内容',
            'http://dev.umeng.com/images/tab2_1.png',
            'http://baidu.com',
            '我在友船友货发现了好东西',
            [SharePlatform.WECHAT, SharePlatform.WECHATMOMENT, SharePlatform.QQ],
            (code, message) =>{
                // this.refToast.show(code + '  ' + message);
            });
    };

    onEditBtnAction = () => {
        //编辑

    };

    onDeleteBtnAction = () => {
        //删除
        PublicAlert("确定删除？", "",
            [{text:"取消"},
                {text:"删除", onPress:this.deleteMyPost.bind(this)}]
        );
    };

    deleteMyPost = () => {
        let data = {task_id: this.state.info.task_id};
        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Goods/del_good_post/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        this.goBackToMain();
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
                });
    };

    cellSelected = (key, data = {}) =>{
        let info = this.state.detailInfo;
        if (key === "SelectOffer") {
            let offer_num = parseInt(info.offer_num);
            if (offer_num > 0) {
                appHomeVC.props.navigation.navigate('HomeOrderShipList',
                    {
                        info: this.state.detailInfo,
                    });
            }
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
        else if (item.idKey === 'remark') {
            return stringIsEmpty(info.remark) ? '船主很懒没有留下备注' : info.remark;
        }
        return '';
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={'cell' + i} style={{paddingLeft: 10, paddingRight: 20}}>
                    <CustomItem key={i} {...item}
                                showArrowForward={false}
                                subName={this.renderSubNameForIndex(item, i)}
                                noSeparator={true}>
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
        let price = parseInt(info.price);
        let isBargain = offerIsBargain(this.state.detailInfo.is_bargain);
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
                        <View style={{backgroundColor: '#81c6ff', height: 26, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{fontSize: 12, color:'white', fontWeight:'bold'}}>{offerIsShipPrice(info.is_shipprice) ? "船东开价" : info.price}</Text>
                        </View>
                    </View>
                    {this._renderListItem()}
                    <View style={{paddingLeft: 10, paddingRight: 20}}>
                        <TouchableOpacity onPress={this.cellSelected.bind(this, "SelectOffer")}>
                            <View style={styles.offerContainer}>
                                <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                                    {"已有" + info.offer_num + "艘船报价"}
                                </Text>
                                <appFont.Ionicons style={{position: "absolute", right: 0, opacity: 1.0}} name="ios-arrow-forward-outline" size={18} color="#bbb" />
                            </View>
                        </TouchableOpacity>
                        <View style={{height: 1, marginLeft: 10}}>
                            <DashLine backgroundColor={appData.appSeparatorLightColor} len={(screenWidth - 40)/ appData.appDashWidth}/>
                        </View>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: 0, width: screenWidth, height: 54, flexDirection: 'row', justifyContent: "space-between", borderTopColor: appData.appSeparatorColor, borderTopWidth:1}}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.onShareBtnAction.bind(this)} style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                            <Image source={require('../../images/icon_share_h.png')} style={{marginLeft: 16, width: 16, height: 18, resizeMode: "cover"}}/>
                            <Text style={styles.btnText}>{"分享"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.onEditBtnAction.bind(this)} style={{flexDirection: 'row', justifyContent: "flex-end", alignItems: "center"}}>
                            <Image source={require('../../images/icon_bianj.png')} style={{width: 15, height: 12, resizeMode: "cover"}}/>
                            <Text style={[styles.btnText, {marginRight: 27}]}>{"编辑"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onDeleteBtnAction.bind(this)} style={{flexDirection: 'row', justifyContent: "flex-end", alignItems: "center"}}>
                            <Image source={require('../../images/icon_dele.png')} style={{width: 13, height: 17, resizeMode: "cover"}}/>
                            <Text style={[styles.btnText, {marginRight: 21}]}>{"删除"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View> );
    }
}
const styles = StyleSheet.create({
    centerContainer: {
        marginLeft:15,
        marginRight:16,
        overflow:"hidden",
        borderRadius: 4,
        borderColor: appData.appBorderColor,
        borderWidth: 0.5,
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
    offerContainer: {
        height: appData.appItemHeight,
        paddingLeft: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    btnText: {
        marginLeft: 5,
        color: "#666666",
        fontSize: 12,
    }
});
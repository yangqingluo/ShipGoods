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
import AddAuthItem from '../../components/AddAuthItem';
import StarScore from '../../components/StarScore';
import px2dp from "../../util";

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

    onFavorBtnAction = () => {
        this.props.navigation.setParams({
            favor: true,
        });
    };

    onSubmitBtnAction = () => {
        // //报价
        // this.props.navigation.navigate('HomeOfferPrice',
        //     {
        //         title: "报价",
        //         info: this.state.detailInfo,
        //     });
    };

    cellSelected = (key, data = {}) =>{
        if (key === "Select") {

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
            return info.remark.length === 0 ? '船主很懒没有留下备注' : info.remark;
        }
        return '';
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={'cell' + i} style={{paddingLeft: 10, paddingRight: 20}}>
                    <AddAuthItem key={i} {...item}
                                 showArrowForward={false}
                                 subName={this.renderSubNameForIndex(item, i)}
                                 noSeparator={true}>
                    </AddAuthItem>
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
                            <Text style={{fontSize: 12, color:'white', fontWeight:'bold'}}>{'¥'+ info.price + ' 元/ 吨'}</Text>
                        </View>
                    </View>
                    {this._renderListItem()}
                </ScrollView>
                <View style={{position: "absolute", bottom: 0, width: screenWidth, height: 54, flexDirection: 'row', borderTopColor: appData.appSeparatorColor, borderTopWidth:1}}>
                    {/*<TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(221), backgroundColor: appData.appBlueColor, justifyContent: "center", alignItems: "center"}}>*/}
                        {/*<Text style={styles.btnText}>{"认同报价"}</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*{isBargain ? <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(154), backgroundColor: appData.appLightBlueColor, justifyContent: "center", alignItems: "center"}}>*/}
                        {/*<Text style={styles.btnText}>{"议价"}</Text>*/}
                    {/*</TouchableOpacity> : null}*/}
                </View>
            </View> );
    }
}
const styles = StyleSheet.create({
    centerContainer: {
        marginLeft:px2dp(15),
        marginRight:px2dp(16),
        overflow:"hidden",
        borderRadius: px2dp(4),
        borderColor: appData.appBorderColor,
        borderWidth: px2dp(0.5),
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
    }
});
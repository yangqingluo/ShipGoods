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
import Toast from 'react-native-easy-toast';
import px2dp from "../../util";


class RightHeader extends Component {
    // static props = {
    //     favor: PropTypes.BOOL,
    // };
    //
    // static defaultProps = {
    //     favor: false,
    // };
    //
    // constructor(props) {
    //     super(props)
    // }

    onFavorBtnPress = () => {
        this.props.navigation.state.params.clickParams();
    };

    render() {
        let {favor} = this.props.navigation.state.params;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity onPress={this.onFavorBtnPress.bind(this)} style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                    <Image source={favor ? require('../../images/navbar_icon_like_selected.png') : require('../../images/navbar_icon_like.png')} style={{width: 22, height: 19, marginRight : 10, marginLeft : 10, resizeMode: "cover"}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeOfferDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '货品详情',
        headerRight: <RightHeader navigation={navigation}/>,
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
            {idKey:"corporation", name:"公司名称"},
            {idKey:"credit", name:"货主信用"},
        ];
    }

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.onFavorBtnAction});
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
                        });
                        this.refreshFavor();
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

    refreshFavor() {
        this.props.navigation.setParams({
            favor: itemIsFavor(this.state.detailInfo.iscollect),
        });
    }

    onFavorBtnAction = () => {
        let data = {task_id: this.state.info.task_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Task/change_collection/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.refToast.show(result.message);
                        this.requestData();
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refToast.show(error);
                });
    };

    onSubmitBtnAction = () => {
        //报价
        this.goToOfferVC(0);
    };

    onAcceptBtnAction = () => {
        //认同报价
        this.goToOfferVC(1);
    };

    onBargainBtnAction = () => {
        //议价
        this.goToOfferVC(2);
    };

    goToOfferVC(type) {
        if (isAuthed()) {
            let title = null;
            switch (type) {
                case 0:
                    title = "报价";
                    break;

                case 1:
                    title = "认同报价";
                    break;

                case 2:
                    title = "议价";
                    break;
            }

            this.props.navigation.navigate('HomeOfferPrice',
                {
                    title: title,
                    info: this.state.detailInfo,
                });
        }
        else {
            PublicAlert('请先认证才能发布，前去认证？','',
                [{text:"取消"},
                    {text:"去认证", onPress:this.goToAuth.bind(this)}]
            );
        }
    }

    goToAuth() {
        this.props.navigation.goBack('AddAuth');
        appMainTab.props.navigation.navigate('MineVC');
        appMainTab.props.navigation.navigate('AddAuth');
    }

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
        else if (item.idKey === 'corporation') {
            if (objectNotNull(info.goods_owner)) {
                return info.goods_owner.corporation;
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
        let price = parseInt(info.price);
        let isBargain = offerIsBargain(this.state.detailInfo);
        let {remark} = this.state.detailInfo;
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
                        <View style={{backgroundColor: '#81c6ff', height: 26, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{fontSize: 12, color:'white', fontWeight:'bold'}}>{'¥'+ info.price + ' 元/ 吨'}</Text>
                        </View>
                    </View>
                    {this._renderListItem()}
                    <View style={{marginRight: 18, height: 30, flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                        <Text style={{fontSize: 11, color:appData.appSecondaryTextColor}}>{info.create_timetext + ' ' + '浏览'+ info.view_num + ' 收藏' + info.collect_num}</Text>
                    </View>
                    <View style={{paddingHorizontal: 18}}>
                        <Image source={require('../../images/icon_beizhu.png')} style={{width: 57, height: 21, resizeMode: "cover"}}/>
                        <Text underlineColorAndroid="transparent"
                              style={styles.textInput}
                              multiline={true}
                              editable={false}
                        >
                            {objectNotNull(remark) ? remark : '此油品暂无备注'}
                        </Text>
                    </View>
                </ScrollView>
                {price === 0 ?
                    <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                        <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                            <View style={appStyles.sureBtnContainer}>
                                <Text style={{color: "#fff"}}>{"报价"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{position: "absolute", bottom: 0, width: screenWidth, height: 45, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.onAcceptBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(221), backgroundColor: appData.appBlueColor, justifyContent: "center", alignItems: "center"}}>
                            <Text style={styles.btnText}>{"认同报价"}</Text>
                        </TouchableOpacity>
                        {isBargain ? <TouchableOpacity onPress={this.onBargainBtnAction.bind(this)} style={{flex:1, minWidth: px2dp(154), backgroundColor: appData.appLightBlueColor, justifyContent: "center", alignItems: "center"}}>
                            <Text style={styles.btnText}>{"议价"}</Text>
                        </TouchableOpacity> : null}
                    </View>
                }
                <Toast ref={o => this.refToast = o} position={'center'}/>
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
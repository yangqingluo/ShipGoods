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


class RightHeader extends Component {
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

export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '船舶详情',
        headerRight: <RightHeader navigation={navigation}/>,
    });

    constructor(props) {
        super(props);
        this.state={
            notBook: this.props.navigation.state.params.notBook || false,
            info: this.props.navigation.state.params.info,
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
        };

        this.config = [
            {idKey:"empty_time",name:"空船期"},
            {idKey:"download_oil_list", name:"意向货品"},
            {idKey:"storage", name:"仓容"},
            {idKey:"course", name:"航行区域"},
            {idKey:"upload_oil_list", name:"上载货品"},
            {idKey:"credit", name:"船主信用"},
            {idKey:"phone", name:"联系方式", onPress:this.cellSelected.bind(this, "SelectPhone")},
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

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/ship_task_detail/', data)
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

    isOrdered = function() : boolean {
        return (this.state.detailInfo.state === '1') || this.state.notBook;
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
        if (isAuthed()) {
            appHomeVC.props.navigation.navigate('HomeOrderSelect',
                {
                    info: this.state.detailInfo,
                });
        }
        else {
            PublicAlert('请先认证才能预约，前去认证？','',
                [{text:"取消"},
                    {text:"去认证", onPress:backAndGoToAuth}]
            );
        }
    };

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

    renderSubNameForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'empty_time') {
            return info.empty_timetext;
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
        else if (item.idKey === 'phone' && this.isOrdered()) {
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
            if (item.idKey === 'phone' && !this.isOrdered()) {
                return null;
            }
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
        let ordered = this.isOrdered();
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
                    <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:26}}>
                        <Text style={{fontSize:10, color:'white', marginLeft:10, marginTop:8}}>{'发票编号：' + info.billing_sn}</Text>
                        <Text style={{fontSize:10, color:'white', marginRight:10, marginTop:8}}>{info.create_timetext}</Text>
                    </View>
                    <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:51}}>
                        <Text style={{fontSize:14, color:appData.appTextColor, marginLeft:18, fontWeight:'bold'}}>{info.empty_port_name + ' / ' + info.ship_name}</Text>
                        <Text style={{fontSize:14, color:appData.appBlueColor, marginRight:18, fontWeight:'bold'}}>{info.tonnage + ' T'}</Text>
                    </View>
                    {this._renderListItem()}
                    <View style={{paddingRight:18, height:30, flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                        <Text style={{fontSize:11, color:appData.appSecondaryTextColor}}>{'浏览'+ info.view_num + ' 收藏' + info.collect_num}</Text>
                    </View>
                    <View style={{paddingHorizontal:18}}>
                        <Image source={require('../../images/icon_beizhu.png')} style={{width: 57, height: 21, resizeMode: "cover"}}/>
                        <Text underlineColorAndroid="transparent"
                                   style={styles.textInput}
                                   multiline={true}
                                   editable={false}
                        >
                            {info.remark.length === 0 ? '此油品暂无备注' : info.remark}
                        </Text>
                    </View>
                    {ordered ?
                        <View style={{alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{marginTop: 10, fontSize:20, color:appData.appBlueColor, fontWeight: appData.appFontWeightMedium}}>{"预约中"}</Text>
                            <Text style={{marginTop: 10, fontSize:12, color:appData.appSecondaryTextColor, fontWeight: appData.appFontWeightLight}}>{"货盘已推送至船东，请等待船东报价或者直接联系船东！"}</Text>
                        </View>
                        : null}
                    <View style={{height: 60}} />
                </ScrollView>
                {ordered ? null : <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"约船"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
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
});
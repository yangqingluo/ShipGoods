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
import Communications from '../../util/AKCommunications';
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
                    <Image source={require('../../images/navbar_icon_like.png')} style={{tintColor: favor ? 'red' : null, width: 22, height: 19, marginRight : 10, marginLeft : 10, resizeMode: "cover"}}/>
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
            info: this.props.navigation.state.params.info,
        };

        this.config = [
            {idKey:"empty_time",name:"空船期"},
            {idKey:"download_oil_list", name:"下载可运货品"},
            {idKey:"storage", name:"仓容"},
            {idKey:"course", name:"航行区域"},
            {idKey:"upload_oil_list", name:"上载货品"},
            {idKey:"credit", name:"船主信用"},
            {idKey:"phone", name:"联系方式", onPress:this.cellSelected.bind(this, "SelectPhone")},
        ];
    }

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.onFavorBtnAction});
    }

    isOrdered = function() : boolean {
        return (this.state.info.state === '1');
    };

    onFavorBtnAction = () => {
        this.props.navigation.setParams({
            favor: true,
        });
    };

    onSubmitBtnAction = () => {
        appHomeVC.props.navigation.navigate('HomeOrderSelect',
            {
                info: this.state.info,
            });
    };

    cellSelected = (key, data = {}) =>{
        let {info} = this.state;
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
        let {info} = this.state;
        if (item.idKey === 'empty_time') {
            return info.empty_timetext;
        }
        else if (item.idKey === 'download_oil_list') {
            let oilList = info.download_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
            return oilList.join(" ");
        }
        else if (item.idKey === 'upload_oil_list') {
            let oilList = info.upload_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
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
        let {info} = this.state;
        if (item.idKey === 'credit') {
            return <StarScore style={{marginLeft:px2dp(5)}} itemEdge={px2dp(5)} currentScore={info.credit}/>;
        }
        else if (item.idKey === 'phone' && this.isOrdered()) {
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
                <View key={'cell' + i} style={{paddingLeft: px2dp(10), paddingRight: px2dp(20)}}>
                    <AddAuthItem key={i} {...item}
                                 showArrowForward={false}
                                 subName={this.renderSubNameForIndex(item, i)}
                                 noSeparator={true}>
                        {this.renderSubViewForIndex(item, i)}
                    </AddAuthItem>
                    <View style={{height: px2dp(1), marginLeft: px2dp(10)}}>
                        <DashLine backgroundColor={appData.appSeparatorLightColor} len={(screenWidth - 40)/ appData.appDashWidth}/>
                    </View>
                </View>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        let {info} = this.state;
        let ordered = this.isOrdered();
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
                    <View style={{backgroundColor:'#81c6ff', flexDirection: 'row', justifyContent: "space-between", height:px2dp(26)}}>
                        <Text style={{fontSize:px2dp(10), color:'white', marginLeft:px2dp(10), marginTop:px2dp(8)}}>{'发票编号：' + info.billing_sn}</Text>
                        <Text style={{fontSize:px2dp(10), color:'white', marginRight:px2dp(10), marginTop:px2dp(8)}}>{info.create_timetext}</Text>
                    </View>
                    <View style={{backgroundColor:'#f2f9ff', flexDirection: 'row',  alignItems: "center", justifyContent: "space-between", height:px2dp(51)}}>
                        <Text style={{fontSize:px2dp(14), color:appData.appTextColor, marginLeft:px2dp(18), fontWeight:'bold'}}>{info.empty_port_name + ' / ' + info.ship_name}</Text>
                        <Text style={{fontSize:px2dp(14), color:appData.appBlueColor, marginRight:px2dp(18), fontWeight:'bold'}}>{info.tonnage + ' T'}</Text>
                    </View>
                    {this._renderListItem()}
                    <View style={{paddingRight:px2dp(18), height:px2dp(30), flexDirection: 'row',  alignItems: "center", justifyContent: "flex-end"}}>
                        <Text style={{fontSize:px2dp(11), color:appData.appSecondaryTextColor}}>{'浏览'+ info.view_num + ' 收藏' + info.collect_num}</Text>
                    </View>
                    <View style={{paddingHorizontal:px2dp(18)}}>
                        <Image source={require('../../images/icon_beizhu.png')} style={{width: px2dp(57), height: px2dp(21), resizeMode: "cover"}}/>
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
                            <Text style={{marginTop: px2dp(10), fontSize:px2dp(20), color:appData.appBlueColor, fontWeight: appData.appFontWeightMedium}}>{"预约中"}</Text>
                            <Text style={{marginTop: px2dp(10), fontSize:px2dp(12), color:appData.appSecondaryTextColor, fontWeight: appData.appFontWeightLight}}>{"货盘已推送至船东，请等待船东报价或者直接联系船东！"}</Text>
                        </View>
                        : null}
                    <View style={{height: px2dp(60)}} />
                </ScrollView>
                {ordered ? null : <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"约船"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
            </View> );
    }
}
const styles = StyleSheet.create({
    textInput: {
        marginTop: px2dp(10),
        minHeight: px2dp(46),
        borderRadius: px2dp(6),
        fontSize: px2dp(16),
        paddingHorizontal: px2dp(28),
        paddingVertical: px2dp(15),
        color: '#535353',
        backgroundColor: appData.appGrayColor,
    },
});
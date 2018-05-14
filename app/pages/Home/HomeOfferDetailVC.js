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

export default class HomeOfferDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '货品详情',
        headerRight: <RightHeader navigation={navigation}/>,
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
        };

        this.config = [
            {idKey:"wastage",name:"损耗"},
            {idKey:"demurrage", name:"滞期费"},
        ];
    }

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.onFavorBtnAction});
    }

    isOrdered = function() : boolean {
        return (this.state.info.status === '1');
    };

    onFavorBtnAction = () => {
        this.props.navigation.setParams({
            favor: true,
        });
    };

    onSubmitBtnAction = () => {

    };

    cellSelected = (key, data = {}) =>{
        if (key === "SelectPhone") {
            let phone = this.state.info.phone;
            if (phone === null) {
                PublicAlert("联系电话不存在");
            }
            else {
                Communications.phonecall(phone, true);
            }
        }
        else {
            PublicAlert(key);
        }
    };

    renderSubNameForIndex(item, index) {
        let {info} = this.state;
        if (item.idKey === 'wastage') {
            return this.state.wastage;
        }
        else if (item.idKey === 'demurrage' && this.state.demurrage > 0) {
            return demurrageTypes[this.state.demurrage] + ' 元/天'
        }

        return '';
    }

    renderSubViewForIndex(item, index) {
        let {info} = this.state;
        if (item.idKey === 'credit') {
            return <StarScore style={{marginLeft:px2dp(5)}} itemEdge={px2dp(5)} currentScore={info.credit}/>;
        }

        return null;
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            if (item.idKey === 'phone' && !this.isOrdered()) {
                return null;
            }
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
                    <View style={{height:px2dp(47), flexDirection: 'row', alignItems: "center", justifyContent: "space-between",}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={require('../../images/icon_blue.png')} style={{width: px2dp(10), height: px2dp(12), resizeMode: "cover"}}/>
                            <Text style={{fontSize:px2dp(10), color:appData.appSecondaryTextColor, marginLeft:px2dp(5)}}>{'货物编号：' + info.goods_sn}</Text>
                        </View>
                        <View style={{marginRight:px2dp(16), justifyContent: "flex-end"}}>
                            <Text style={{fontSize:px2dp(12), color:appData.appBlueColor}}>{'已有' + info.offer_num + '人报价'}</Text>
                        </View>
                    </View>
                    <View style={styles.centerContainer}>
                        <View style={{backgroundColor: '#f2f9ff', height:px2dp(73)}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                                <Text style={{marginLeft: px2dp(34), fontSize:px2dp(14), color: appData.appTextColor}}>{info.loading_port_name + ' → ' + info.unloading_port_name}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{marginLeft: px2dp(34), fontSize:px2dp(14), color: appData.appTextColor}}>{info.loading_timetext + ' ± ' + info.loading_delay + '天'}</Text>
                                <Text style={{marginRight: px2dp(27), fontSize:px2dp(14), color: appData.appTextColor}}>{'原油 10000+10000吨'}</Text>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#81c6ff', height:px2dp(26), alignItems: "center", justifyContent: "center"}}>
                            <Text style={{fontSize:px2dp(12), color:'white', fontWeight:'bold'}}>{'¥'+ info.price + ' 元/ 吨'}</Text>
                        </View>
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
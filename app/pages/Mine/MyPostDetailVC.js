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

export default class MyPostDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '发布详情',
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
        };

        this.config = [
            {idKey:"storage", name:"仓容"},
            {idKey:"area", name:"航行区域"},
            {idKey:"course", name:"可运航向"},
            {idKey:"upload_oil_list", name:"上载货品"},
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

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/ship_task_detail/', data)
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

    onShareBtnAction = () => {
        //分享

    };

    onEditBtnAction = () => {
        //编辑

    };

    onDeleteBtnAction = () => {
        //删除

    };

    cellSelected = (key, data = {}) =>{
        let info = this.state.detailInfo;
        if (key === "SelectOffer") {
            let offer_num = parseInt(info.appoint_num);
            // if (offer_num > 0) {
                this.props.navigation.navigate('MyPostOrder',
                    {
                        info: info,
                        title: "已有" + offer_num + "人预约",
                        is_offer: "0",
                    });
            // }
        }
        else {
            PublicAlert(key);
        }
    };

    renderSubNameForIndex(item, index) {
        let info = this.state.detailInfo;
        if (item.idKey === 'download_oil_list') {
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
        else if (item.idKey === 'area') {
            let course = parseInt(info.area);
            if (course > 0 && course < shipAreaTypes.length) {
                return shipAreaTypes[course];
            }
        }
        else if (item.idKey === 'course') {
            let course = parseInt(info.course);
            if (course > 0 && course < shipCourseTypes.length) {
                return shipCourseTypes[course];
            }
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
        let logo = require('../../images/icon_blue.png');
        let downloadOilList = [];
        if (objectNotNull(info.download_oil_list)) {
            downloadOilList = info.download_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
        }
        let uploadOilList = [];
        if (objectNotNull(info.upload_oil_list)) {
            uploadOilList = info.upload_oil_list.map(
                (info) => {
                    return info.goods_name;
                }
            );
        }

        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}
                            onRefresh={this.requestData}
                            refreshing={this.state.refreshing}
                >
                    <View style={styles.viewContainer}>
                        <View style={{flexDirection: 'row'}}>
                            {logo? (<Image source={logo} style={{width: 10, height: 12, resizeMode: "stretch", overflow:"hidden"}}/>) : null}
                            <Text style={{color:"#9a9a9a", marginLeft:5, fontSize:10, fontWeight:appData.appFontWeightMedium}}>{"发单编号" + info.billing_sn}</Text>
                        </View>
                        <Text style={{color:appData.appTextColor, right:13, fontSize:14, fontWeight:appData.appFontWeightMedium, textAlign: 'right',}}>{info.ship_name + " / " + info.tonnage + "吨"}</Text>
                    </View>
                    <View style={styles.centerViewContainer}>
                        <View style={{backgroundColor: appData.appBlueColor, width:9}}/>
                        <View style={{flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',}}>
                            <View style={styles.cellContainer}>
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_word_gang.png')} style={{width: 19, height: 29, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:14}}>{info.empty_port_name}</Text>
                                </View>
                                <View style={[styles.cellContainer, {alignItems: "center", minWidth:100}]}>
                                    <Image source={require('../../images/icon_time.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{"空船期 "}</Text>
                                        <Text style={{color:appData.appTextColor}}>{info.empty_time + "±" + info.empty_delay}</Text>
                                    </Text>
                                </View>
                            </View>
                            {downloadOilList.length > 0 ?
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{'下载可运油品 '}</Text>
                                        <Text style={{color:appData.appTextColor}}>{downloadOilList.join(' ')}</Text>
                                    </Text>
                                </View>
                                :null}
                            {uploadOilList.length > 0 ?
                                <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                    <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                    <Text style={{marginLeft:6, fontSize:14}}>
                                        <Text style={{color:appData.appSecondaryTextColor}}>{'上载油品 '}</Text>
                                        <Text style={{color:appData.appTextColor}}>{uploadOilList.join(' ')}</Text>
                                    </Text>
                                </View>
                                :null}
                            <View style={[styles.cellContainer, {alignItems: "center"}]}>
                                <Image source={require('../../images/icon_clip.png')} style={{width: 16, height: 16, marginLeft:12, resizeMode: "stretch"}}/>
                                <Text style={{marginLeft:6, fontSize:14}}>
                                    <Text style={{color:appData.appSecondaryTextColor}}>{'可运柴油 '}</Text>
                                    <Text style={{color:appData.appTextColor}}>{info.dieseloil + '吨'}</Text>
                                    <Text style={{color:appData.appSecondaryTextColor}}>{' 可运汽油 '}</Text>
                                    <Text style={{color:appData.appTextColor}}>{info.gasoline + '吨'}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{height:20}} />
                    {this._renderListItem()}
                    <View style={{paddingLeft: 10, paddingRight: 20}}>
                        <TouchableOpacity onPress={this.cellSelected.bind(this, "SelectOffer")}>
                            <View style={styles.offerContainer}>
                                <Text style={{color: appData.appBlueColor, fontSize: 14}}>
                                    {"已有" + info.appoint_num + "人预约"}
                                </Text>
                                {/*<appFont.Ionicons style={{position: "absolute", right: 0, opacity: 1.0}} name="ios-arrow-forward-outline" size={18} color="#bbb" />*/}
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
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0,
        borderColor: appData.appBorderColor,
        backgroundColor: 'white',
        minHeight:144,
    },
    viewContainer: {
        flexDirection: 'row',
        height:36,
        alignItems: "center",
        justifyContent: "space-between",
    },
    centerViewContainer: {
        flexDirection: 'row',
        marginLeft:16,
        marginRight:15,
        minHeight:72,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'row',
        minHeight:36,
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
});
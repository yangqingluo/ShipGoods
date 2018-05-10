import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine';
import AddAuthItem from '../../components/AddAuthItem';
import StarScore from '../../components/StarScore';
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
        ];
    }

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.onFavorBtnPress});
    }

    onFavorBtnPress = () => {
        // 组件渲染之后重设props
        this.props.navigation.setParams({
            headerTitle: '本王收藏了',
            favor: true,
        });
    };

    cellSelected = (key, data = {}) =>{
        PublicAlert(key);
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
                    <View style={{height: 40}}/>
                    <View style={{backgroundColor: 'white', height: 1, marginLeft:20, marginRight:20}}>
                        <DashLine backgroundColor={'red'} len={(screenWidth - 40)/ appData.appDashWidth}/>
                    </View>
                </ScrollView>
            </View> );
    }
}
const styles = StyleSheet.create({

});
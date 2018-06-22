import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import Release from "../ReleaseVC";

export default class EditGoodsReleaseVC extends Release {
    static navigationOptions = ({ navigation }) => (
        {
            title: "编辑",
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickSureBtn}
                >
                    <Text style={{marginRight: 10, color: appData.appBlueColor}}>{'  提交  '}</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props){
        super(props);

        let info = this.props.navigation.state.params.info;
        this.state = {
            remark: info.remark,//备注
            tonnage: info.tonnage,//否 装载吨位
            ton_section: info.ton_section, //否 吨位区间值
            price: offerIsShipPrice(info.is_shipprice) ? 0 : info.price,//否 单价
            loading_port: {
                port_id: info.loading_port,
                port_name: info.loading_port_name,
            },//否 装货港
            unloading_port: {
                port_id: info.unloading_port,
                port_name: info.unloading_port_name,
            }, //否 卸货港
            loading_time: new Date(info.loading_time), //否 发货时间
            loading_delay: parseInt(info.loading_delay), //否 发货延迟
            is_bargain: info.is_bargain, //否 是否接收议价 0：是（默认） 1：否
            is_shipprice: info.is_shipprice, //是 是否船东开价 0：否 1：是
            clean_deley: parseInt(info.clean_deley), //否 完货后多少天结算 15/30/45/60
            wastage: info.wastage, //否 损耗
            goods: info.goodslist, //货品
            demurrage: parseInt(info.demurrage), //否 滞期费

            wastageTitle: 0,
            wastageNumber: 0,
        };
    }

    refreshDefaultState() {

    }

    goBack() {
        if (objectNotNull(this.props.navigation.state.params.callBack)) {
            this.props.navigation.state.params.callBack("EditShip");
        }
        this.props.navigation.goBack();
    }

    sureBtnClick = () => {
        let {goods, tonnage, ton_section, price, is_shipprice, is_bargain, loading_port, unloading_port, loading_time, loading_delay, wastage, demurrage, clean_deley, remark} = this.state;
        if (goods.length === 0) {
            this.refToast.show("请选择货品");
        }
        else if (tonnage.length === 0) {
            this.refToast.show("请设置货量");
        }
        else if (price.length === 0) {
            this.refToast.show("请设置运价");
        }
        else if (loading_port === null) {
            this.refToast.show("请选择装船港");
        }
        else if (unloading_port === null) {
            this.refToast.show("请选择卸船港");
        }
        else if (loading_time === null) {
            this.refToast.show("请选择发货时间");
        }
        else if (wastage.length === 0) {
            this.refToast.show("请设置损耗");
        }
        else if (stringIsEmpty(demurrage)) {
            this.refToast.show("请选择滞期费");
        }
        else if (stringIsEmpty(clean_deley)) {
            this.refToast.show("请选择结算时间");
        }
        // else if (remark.length === 0) {
        //     this.refToast.show("请输入您的备注");
        // }
        else {
            let goodsList = goods.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                task_id: this.props.navigation.state.params.info.task_id,
                goods: goodsList,
                tonnage: tonnage,
                ton_section: ton_section,
                price: price,
                is_shipprice: is_shipprice,
                is_bargain: is_bargain,
                loading_port: loading_port.port_id,
                loading_port_name: loading_port.port_name,
                unloading_port: unloading_port.port_id,
                unloading_port_name: unloading_port.port_name,
                loading_time: createRequestTime(loading_time),
                loading_delay: loading_delay,
                wastage: wastage,
                demurrage: demurrage,
                clean_deley: clean_deley,
            };

            if (!stringIsEmpty(remark)) {
                data.remark = remark;
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/edit_good_post/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            PublicAlert('编辑完成','',
                                [{text:"确定", onPress:this.goBack.bind(this)}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    };
}
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

export default class AddGoodsReleaseVC extends Release {
    goBack() {
        if (objectNotNull(this.props.navigation.state.params.callBack)) {
            this.props.navigation.state.params.callBack("AddGoods");
        }
        this.props.navigation.goBack();
    }

    doReleaseForGoodsOwner(data) {
        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Goods/add_goods_task/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        PublicAlert('添加完成','',
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
}
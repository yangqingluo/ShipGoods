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

export default class EditShipReleaseVC extends Release {
    static navigationOptions = ({ navigation }) => (
        {
            title: "编辑发布",
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
            ship: info,//船
            upload_oil_list: info.upload_oil_list,//上载油品
            download_oil_list: info.download_oil_list,//意向油品
            empty_port: {
                port_id: info.empty_port,
                port_name: info.empty_port_name,
            },//空船港
            empty_time: new Date(info.empty_time),//空船期
            empty_delay: parseInt(info.empty_delay),//空船延迟
            course: info.course,//运输航向 1：南上 2：北下 3：上江 4：下江 5：运河（多选，用“##”隔开）
            remark: info.remark,//备注

            courseList: [],
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
        let {ship, download_oil_list, empty_port, empty_time, empty_delay, course, upload_oil_list, remark} = this.state;
        if (ship === null) {
            this.refToast.show("请选择船舶");
        }
        else if (!arrayNotEmpty(download_oil_list)) {
            this.refToast.show("请选择意向货品");
        }
        else if (empty_port === null) {
            this.refToast.show("请选择空船港");
        }
        else if (empty_time === null) {
            this.refToast.show("请选择空船期");
        }
        else if (course.length === 0) {
            this.refToast.show("请选择可运航向");
        }
        else if (!arrayNotEmpty(upload_oil_list)) {
            this.refToast.show("请选择上载货品");
        }
        // else if (remark.length === 0) {
        //     this.refToast.show("请输入您的备注");
        // }
        else {
            let downloadList = download_oil_list.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let uploadList = upload_oil_list.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                task_id: this.props.navigation.state.params.info.task_id,
                ship_id: ship.ship_id,
                upload_oil_list: uploadList,
                download_oil_list: downloadList,
                empty_port: empty_port.port_id,
                empty_port_name: empty_port.port_name,
                empty_time: empty_time.Format("yyyy-MM-dd"),
                empty_delay: empty_delay,
                course: course,
            };

            if (!stringIsEmpty(remark)) {
                data.remark = remark;
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/edit_ship_post/', data)
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
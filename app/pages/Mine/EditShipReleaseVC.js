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
    // static navigationOptions = ({ navigation }) => (
    //     {
    //         title: "编辑发布",
    //         headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
    //             <TouchableOpacity
    //                 onCellSelected={navigation.state.params.clickSureBtn}
    //             >
    //                 <Text style={{marginRight: 10, color: appData.appBlueColor}}>{'  提交  '}</Text>
    //             </TouchableOpacity>
    //         </View>,
    //     });

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
            course: info.course,//运输航向 1：南下 2：北上 3：上江 4：下江 5：运河（多选，用“##”隔开）
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

    doReleaseForShipOwner(data) {
        data.task_id = this.props.navigation.state.params.info.task_id;
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
}
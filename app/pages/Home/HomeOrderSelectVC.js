import React, { Component } from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import HomeOrder from './HomeOrderVC';

export default class HomeOrderSelectVC extends HomeOrder {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '选择货品',
        headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
            <TouchableOpacity
                onPress={navigation.state.params.clickParams}
            >
                <Text style={{marginRight: 10, color: appData.appBlueColor}}>{"添加货品"}</Text>
            </TouchableOpacity>
        </View>,
    });

    componentDidMount() {
        super.componentDidMount();
        this.props.navigation.setParams({clickParams:this.addBtnAction});
    }

    addBtnAction =()=> {
        this.props.navigation.navigate('AddGoodsRelease',
            {
                headerTitle: "添加货品",
                callBack: this.callBackFromAddVC.bind(this),
            });
    };

    callBackFromAddVC() {
        this.requestData();
    }

    onCellSelected = (info: Object) => {
        this.refSelectAlert.show({onSureBtnAction:this.toAddBookShip.bind(this, info.item)});
    };

    goBackToMain = () => {
        this.props.navigation.goBack('Main');
    };

    toAddBookShip(item) {
        this.refSelectAlert.hide();
        let data = {
            task_id: item.task_id,
            ship_task_id: this.props.navigation.state.params.info.task_id,
            is_check: 0,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Task/add_book_ship/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        PublicAlert('约船完成', '',
                            [{text:"确定", onPress:this.goBackToMain.bind(this)}]
                        );
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refToast.show(error);
                });
    }
}
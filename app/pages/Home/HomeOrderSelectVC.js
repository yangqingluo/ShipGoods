import React, { Component } from 'react';


import HomeOrder from './HomeOrderVC'


export default class HomeOrderSelectVC extends HomeOrder {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '选择货品',
    });

    onCellSelected = (info: Object) => {
        PublicAlert('您确定选择该货品？', '',
            [{text:"取消"},
                {text:"确定", onPress:this.toAddBookShip.bind(this, info.item)}]
        );
    };

    goBackToMain = () => {
        this.props.navigation.goBack('Main');
    };

    toAddBookShip(item) {
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
import React, { Component } from 'react';
import HomeOrderVC from "../Home/HomeOrderVC"
import OrderCell from '../Home/HomeOrderCell';

export default class MyShipPriceVC extends HomeOrderVC {
    static navigationOptions = ({ navigation }) => (
        {
            title: '相关报价',
        });

    requestRecommend = async (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {page: this.state.page, ship_id: this.props.navigation.state.params.ship_id};

        NetUtil.post(appUrl + 'index.php/Mobile/ship/get_my_offer', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        let list = [];
                        if (!isReset) {
                            list = list.concat(this.state.dataList);
                        }
                        list = list.concat(result.data);
                        let footer = 0;
                        if (result.data.length === 0) {
                            footer = 1;
                        }

                        this.setState({
                            page: this.state.page + 1,
                            dataList: list,
                            refreshing: false,
                            showFooter: footer,
                        })
                    }
                    else {
                        this.setState({
                            refreshing: false,
                            showFooter: 0,
                        })
                    }
                },(error)=>{
                    this.setState({
                        refreshing: false,
                        showFooter: 0,
                    })
                });
    };

    onCellSelected = (info: Object) => {

    };

    renderCell = (info: Object) => {
        return (
            <OrderCell
                info={info}
                onPress={this.onCellSelected}
                showCreateTime={true}
            />
        )
    };
}
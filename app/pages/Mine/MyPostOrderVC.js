import React, { Component } from 'react';
import HomeOrderVC from "../Home/HomeOrderVC";
import OrderCell from '../Home/HomeOrderCell';

export default class MyPostOrderVC extends HomeOrderVC {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
    });



    requestRecommend = async (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {
            page: this.state.page,
            type: 1,
            ship_task_id: this.props.navigation.state.params.info.task_id,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Task/get_book_list/', data)
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
        let {is_offer} = this.props.navigation.state.params;
        if (offerIsOffer(is_offer)) {
            appSecondPriceParams = {info : info.item};
            this.props.navigation.navigate('HomeOfferTwicePrice',
                {
                    info: info.item,
                    is_offer: is_offer,
                });
        }
        else {
            this.props.navigation.navigate('HomeOfferDetail',
                {
                    info: info.item,
                    is_offer: is_offer,
                    type: OfferOrderEnum.GoodsOrder,
                });
        }
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
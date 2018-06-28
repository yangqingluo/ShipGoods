import React, { Component } from 'react';
import HomeOrderVC from "./HomeOrderVC"
import OrderCell from './HomeOrderCell';
import {FooterTypeEnum} from "../../components/ListLoadFooter";

type Props = {
    is_offer: "0",
}

export default class HomeOfferVC extends HomeOrderVC {
    requestRecommend = async (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {page: this.state.page, is_offer: this.props.is_offer};
        if (appHomeCondition.loading_port !== null) data.loading_port = appHomeCondition.loading_port.port_id;
        if (appHomeCondition.unloading_port !== null) data.unloading_port = appHomeCondition.unloading_port.port_id;
        if (appHomeCondition.loading_time !== null) data.loading_time = createRequestTime(appHomeCondition.loading_time);
        if (appHomeCondition.loading_delay > 0) data.loading_delay = appHomeCondition.loading_delay;
        if (appHomeCondition.min_ton > 0) data.min_ton = appHomeCondition.min_ton;
        if (appHomeCondition.max_ton > 0) data.max_ton = appHomeCondition.max_ton;
        if (appHomeCondition.goods !== null) data.goods_id = appHomeCondition.goods.goods_id;
        if (appHomeCondition.area.length > 0) {
            data.area = appHomeCondition.area.map(
                (info) => {
                    return info.key;
                }
            );
        }

        if (objectNotNull(appHomeCondition.loadorder)) data.loadorder = appHomeCondition.loadorder;
        if (objectNotNull(appHomeCondition.tonnageorder)) data.tonnageorder = appHomeCondition.tonnageorder;
        if (objectNotNull(appHomeCondition.cleanorder)) data.loadorder = appHomeCondition.cleanorder;
        if (objectNotNull(appHomeCondition.creditorder)) data.creditorder = appHomeCondition.creditorder;
        if (objectNotNull(appHomeCondition.timeorder)) data.timeorder = appHomeCondition.timeorder;

        NetUtil.post(appUrl + 'index.php/Mobile/Ship/ship_index/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        let list = [];
                        if (!isReset) {
                            list = list.concat(this.state.dataList);
                        }
                        list = list.concat(result.data);
                        let footer = FooterTypeEnum.default;
                        if (result.data.length < appPageSize) {
                            footer = FooterTypeEnum.NoMore;
                        }

                        this.setState({
                            page: this.state.page + 1,
                            dataList: list,
                            refreshing: isReset ? false : this.state.refreshing,
                            showFooter: footer,
                        })
                    }
                    else {
                        this.setState({
                            refreshing: isReset ? false : this.state.refreshing,
                            showFooter: FooterTypeEnum.default,
                        })
                    }
                },(error)=>{
                    this.setState({
                        refreshing: isReset ? false : this.state.refreshing,
                        showFooter: FooterTypeEnum.default,
                    })
                });
    };

    onCellSelected = (info: Object) => {
        if (offerIsOffer(this.props.is_offer)) {
            appSecondPriceParams = {info : info.item};
            appHomeVC.props.navigation.navigate('HomeOfferTwicePrice',
                {
                    info: info.item,
                    is_offer: this.props.is_offer,
                });
        }
        else {
            appHomeVC.props.navigation.navigate('HomeOfferDetail',
                {
                    info: info.item,
                    is_offer: this.props.is_offer,
                });
        }
    };

    renderCell = (info: Object) => {
        return (
            <OrderCell
                info={info}
                onPress={this.onCellSelected}
                showCreateTime={true}
                is_offer={this.props.is_offer}
            />
        )
    };
}
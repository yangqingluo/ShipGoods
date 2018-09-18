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

        if (sortNotNull(appHomeCondition.loadorder)) data.loadorder = createSortString(appHomeCondition.loadorder);
        if (sortNotNull(appHomeCondition.tonnageorder)) data.tonnageorder = createSortString(appHomeCondition.tonnageorder);
        if (sortNotNull(appHomeCondition.cleanorder)) data.cleanorder = createSortString(appHomeCondition.cleanorder);
        if (sortNotNull(appHomeCondition.creditorder)) data.creditorder = createSortString(appHomeCondition.creditorder);
        if (sortNotNull(appHomeCondition.timeorder)) data.timeorder = createSortString(appHomeCondition.timeorder);

        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/ship_index/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
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
                    this.refIndicator.hide();
                    this.setState({
                        refreshing: isReset ? false : this.state.refreshing,
                        showFooter: FooterTypeEnum.default,
                    })
                });
    };

    doDeleteBookFunction = async (info) => {
        let data = {uid: userData.uid, book_id: info.item.book_id};

        this.refIndicator.show();
        NetUtil.post(appUrl + '/index.php/Mobile/Task/del_book/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        this.state.dataList.splice(info.index, 1);
                        this.forceUpdate();
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
                });
    };

    onOrderedCellSelected = (info: Object) => {
        if (offerIsOffer(this.props.is_offer)) {
            PublicAlert("删除预约", "该预约已经订掉了，是否删除？", [
                {
                    text:'取消',
                },
                {
                    text:'删除',
                    onPress:()=>{
                        this.doDeleteBookFunction(info);
                    }
                }
            ]);
        }
    };

    onCellSelected = (info: Object) => {
        if (offerIsOffer(this.props.is_offer)) {
            global.appSecondPriceParams = {info : info.item};
            appMainTab.props.navigation.navigate('HomeOfferTwicePrice',
                {
                    info: info.item,
                    is_offer: this.props.is_offer,
                });
        }
        else {
            appMainTab.props.navigation.navigate('HomeOfferDetail',
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
                onCellSelected={this.onCellSelected}
                onOrderedCellSelected={this.onOrderedCellSelected}
                showCreateTime={true}
                is_offer={this.props.is_offer}
            />
        )
    };
}
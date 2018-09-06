import React, { Component } from 'react';

import AddShip from "./AddShip";

export default class EditShip extends AddShip {
    static navigationOptions = ({ navigation }) => (
        {
            title: "编辑船舶"
        });

    constructor(props){
        super(props);
    }

    componentDidMount() {
        // this.requestData();

        let ship = this.props.navigation.state.params.ship;
        this.setState({
            detailInfo: null,

            ship_name: ship.ship_name,//船名
            ship_lience: ship.ship_lience,//船舶国际证书
            tonnage: ship.tonnage,//吨位
            storage: ship.storage,//仓容
            dieseloil: ship.dieseloil,//可载柴油吨位
            gasoline: ship.gasoline,//可载汽油吨位
            area: ship.area,//航行区域 1：沿海 2：长江（可进川） 3：长江（不可进川)
            ship_type: stringIsEmpty(ship.ship_type) ? 0 : parseInt(ship.ship_type),
            goods: ship.goods,//意向货品
            projects: stringIsEmpty(ship.projects) ? [] : ship.projects.split(","),//主要项目证书

            ship_lience_source: null,
        });
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    requestRecommend = async (isReset) => {
        let data = {ship_id: this.props.navigation.state.params.ship.ship_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_ship_detail/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.setState({
                            detailInfo: result.data,
                            refreshing: false,
                        })
                    }
                    else {
                        this.setState({
                            refreshing: false,
                        })
                    }
                },(error)=>{
                    this.setState({
                        refreshing: false,
                    })
                });
    };

    goBack() {
        if (objectNotNull(this.props.navigation.state.params.callBack)) {
            this.props.navigation.state.params.callBack("EditShip");
        }
        this.props.navigation.goBack();
    }

    submit() {
        if (this.state.ship_name.length === 0) {
            this.refToast.show("请输入船名");
        }
        else if (this.state.tonnage.length === 0) {
            this.refToast.show("请输入参考载重量");
        }
        else if (this.state.storage.length === 0) {
            this.refToast.show("请输入仓容");
        }
        else if (this.state.ship_type === 0) {
            this.refToast.show("请选择船舶类型");
        }
        // else if (this.state.goods.length === 0) {
        //     this.refToast.show("请选择意向货品");
        // }
        else if (this.state.area === 0) {
            this.refToast.show("请选择航行区域");
        }
        else if (this.state.ship_lience.length === 0) {
            this.refToast.show("请上传船舶国际证书");
        }

        else {
            let dataList = this.state.goods.map(
                (info) => {
                    return {goods_id: info.goods_id};
                }
            );

            let data = {
                ship_id: this.props.navigation.state.params.ship.ship_id,
                ship_name:this.state.ship_name,
                tonnage:this.state.tonnage,
                storage:this.state.storage,
                goods:null,
                ship_type:this.state.ship_type,
                area:'' + this.state.area,
                ship_lience:this.state.ship_lience
            };
            if (!stringIsEmpty(this.state.gasoline)) {
                data.gasoline = this.state.gasoline;
            }
            else {
                data.gasoline = '0';
            }

            if (!stringIsEmpty(this.state.dieseloil)) {
                data.dieseloil = this.state.dieseloil;
            }
            else {
                data.dieseloil = '0';
            }

            if (this.state.projects.length > 0) {
                data.projects = this.state.projects.join(",");
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/update_ship/', data)
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

    renderEditValueForIndex(item, index) {
        if (item.idKey === 'ship_name' && !stringIsEmpty(this.state.ship_name)) {
            return this.state.ship_name;
        }
        else if (item.idKey === 'tonnage' && !stringIsEmpty(this.state.tonnage)) {
            return this.state.tonnage;
        }
        else if (item.idKey === 'storage' && !stringIsEmpty(this.state.storage)) {
            return this.state.storage;
        }
        else if (item.idKey === 'dieseloil' && !stringIsEmpty(this.state.dieseloil)) {
            return this.state.dieseloil;
        }
        else if (item.idKey === 'gasoline' && !stringIsEmpty(this.state.gasoline)) {
            return this.state.gasoline;
        }
        return '';
    }
}
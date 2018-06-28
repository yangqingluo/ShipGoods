import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import OrderCell from './OrderCell';
import ListLoadFooter, {canLoad, FooterTypeEnum} from '../../components/ListLoadFooter';
import CustomAlert from '../../components/CustomAlert';
import Toast from 'react-native-easy-toast';

type Props = {
    order_state: "0",
}

export default class OrderListVC extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataList: [],
            refreshing: false,
            showFooter:0,
            page: 1,
        };
    };

    componentDidMount() {
        this.requestData();
    };

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    loadMoreData() {
        if (!this.state.refreshing && canLoad(this.state.showFooter)) {
            if (this.state.dataList.length === 0) {
                return;
            }
            if (this.state.page === 1) {
                return;
            }
            this.setState({showFooter: FooterTypeEnum.Loading});
            this.requestRecommend(false);
        }
    };

    requestRecommend = async (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {page: this.state.page, state: this.props.order_state};

        NetUtil.post(appUrl + 'index.php/Mobile/Order/get_my_order/', data)
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

    toCollectGoods(info) {
        this.refSelectAlert.hide();
        let data = {
            or_id: info.or_id,
        };

        NetUtil.post(appUrl + 'index.php/Mobile/Order/change_order_state/', data)
            .then(
                (result)=>{
                    this.refToast.show(result.message);
                    if (result.code === 0) {
                        this.requestData();
                        appOrderVC.reloadSubOrderedVC(true);
                    }
                    // else {
                    //     this.refToast.show(result.message);
                    // }
                },(error)=>{
                    this.refToast.show(error);
                });
    };

    onCellSelected = (info: Object) => {
        this.props.navigation.navigate('OrderDetail',
            {
                info: info.item,
                order_state: this.props.order_state,
            });
    };

    callBackFromEditVC(key) {
        this.requestData();
    }

    onCellBottomBtnAction = (info: Object, tag: number) => {
        switch (tag){
            case OrderBtnEnum.CollectGoods:
                this.refSelectAlert.show({onSureBtnAction:this.toCollectGoods.bind(this, info)});
                break;

            case OrderBtnEnum.JudgeOrder:
            case OrderBtnEnum.JudgeCheck:
                this.props.navigation.navigate('OrderJudgement',
                    {
                        info: info,
                    });
                break;

            case OrderBtnEnum.EditTransport:
                this.props.navigation.navigate('OrderTransportEdit',
                    {
                        info: info,
                        // callBack: this.callBackFromEditVC.bind(this)//直接调用appOrderVC.reload
                    });
                break;

            case OrderBtnEnum.CheckTransport:
                this.props.navigation.navigate('OrderTransport',
                    {
                        info: info,
                    });
                break;

            default:
                PublicAlert("精彩功能，敬请期待");
                break;
        }

    };

    renderCell = (info: Object) => {
        return (
            <OrderCell
                info={info}
                onPress={this.onCellSelected}
                onBottomBtnPress={this.onCellBottomBtnAction}
            />
        )
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    renderFooter(){
        return <ListLoadFooter showFooter={this.state.showFooter}/>;
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    // ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                    onRefresh={this.requestData.bind(this)}/>}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={appData.appOnEndReachedThreshold}
                />
                <CustomAlert ref={o => this.refSelectAlert = o} title={"确认收货"} message={"请收到货确认无误以后确认收货"} />
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
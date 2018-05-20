import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import OrderCell, {BottomBtnEnum} from './OrderCell';
import ListLoadFooter from '../../components/ListLoadFooter';
import CustomAlert from '../../components/CustomAlert';

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
        if (!this.state.refreshing && this.state.showFooter === 0) {
            if (this.state.dataList.length === 0) {
                return;
            }
            if (this.state.page === 1) {
                return;
            }
            this.setState({showFooter:2});
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
                    }
                    // else {
                    //     this.refToast.show(result.message);
                    // }
                },(error)=>{
                    this.refToast.show(error);
                });
    };

    onCellSelected = (info: Object) => {

    };

    onCellBottomBtnAction = (info: Object, tag: number) => {
        switch (tag){
            case BottomBtnEnum.CollectGoods:
                this.refSelectAlert.show({onSureBtnAction:this.toCollectGoods.bind(this, info)});
                break;

            case BottomBtnEnum.JudgeOrder:
                this.props.navigation.navigate('OrderJudgement',
                    {
                        info: info,
                    });
                break;

            default:
                PublicAlert(tag + JSON.stringify(info));
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

                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={0}
                />
                <CustomAlert ref={o => this.refSelectAlert = o} title={"确认收货"} message={"请收到货确认无误以后确认收货"} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import GoodsCell from './HomeGoodsCell';
import ListLoadFooter from '../../components/ListLoadFooter';

export default class HomeGoodsVC extends Component {
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
        let data = {page: this.state.page};
        if (appHomeCondition.empty_port !== null) data.empty_port = appHomeCondition.empty_port.port_id;
        if (appHomeCondition.empty_time !== null) data.empty_time = createRequestTime(appHomeCondition.empty_time);
        if (appHomeCondition.empty_delay > 0) data.empty_delay = appHomeCondition.empty_delay;
        if (appHomeCondition.min_ton > 0) data.min_ton = appHomeCondition.min_ton;
        if (appHomeCondition.max_ton > 0) data.max_ton = appHomeCondition.max_ton;
        if (appHomeCondition.goods !== null) data.goods_id = appHomeCondition.goods.goods_id;
        if (objectNotNull(appHomeCondition.ship_type)) data.ship_type = appHomeCondition.ship_type.key;
        if (appHomeCondition.area.length > 0) {
            data.area = appHomeCondition.area.map(
                (info) => {
                    return info.key;
                }
            );
        }

        if (objectNotNull(appHomeCondition.emptyorder)) data.emptyorder = appHomeCondition.emptyorder;
        if (objectNotNull(appHomeCondition.tonnageorder)) data.tonnageorder = appHomeCondition.tonnageorder;
        if (objectNotNull(appHomeCondition.creditorder)) data.creditorder = appHomeCondition.creditorder;

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/goods_index/', data)
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
        appHomeVC.props.navigation.navigate('HomeShipDetail',
            {
                info: info.item,
            });
    };


    renderCell = (info: Object) => {
        return (
            <GoodsCell
                info={info}
                onPress={this.onCellSelected}
            />
        )
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

                    keyExtractor={(item: Object, index: number) => {
                        return '' + index;
                    }}
                    // ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}

                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={0}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
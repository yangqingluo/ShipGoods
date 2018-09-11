import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import GoodsCell from '../Home/HomeGoodsCell';
import OrderCell from '../Home/HomeOrderCell';
import ListLoadFooter, {canLoad, FooterTypeEnum} from '../../components/ListLoadFooter';
import { SwipeListView, SwipeRow } from '../../components/SwipeList';
import Toast from "react-native-easy-toast";
import IndicatorModal from "../../components/IndicatorModal";

export default class MyFavorsVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '我的收藏',
    });

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
        let data = {page: this.state.page};

        NetUtil.post(appUrl + 'index.php/Mobile/User/get_my_collection/', data)
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

    closeRow(rowMap, index) {
        if (rowMap[index]) {
            rowMap[index].closeRow();
        }
    }

    deleteRow(rowMap, index) {
        this.closeRow(rowMap, index);

    }

    onCellSelected = (info: Object) => {
        if (isShipOwner()) {
            if (offerIsOffer(info.item.is_offer)) {
                appSecondPriceParams = {info : info.item};
                this.props.navigation.navigate('HomeOfferTwicePrice',
                    {
                        info: info.item,
                        is_offer: '1',
                    });
            }
            else {
                this.props.navigation.navigate('HomeOfferDetail',
                    {
                        info: info.item,
                        is_offer: '0',
                    });
            }
        }
        else {
            this.props.navigation.navigate('HomeShipDetail',
                {
                    info: info.item,
                });
        }
    };

    renderCell = (info: Object) => {
        if (isShipOwner()) {
            return (
                <OrderCell
                    info={info}
                    onCellSelected={this.onCellSelected}
                    showCreateTime={true}
                />
            )
        }
        return (
            <GoodsCell
                info={info}
                onCellSelected={this.onCellSelected}
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
            <View style={appStyles.container}>
                <SwipeListView
                    useFlatList
                    renderHiddenItem={(data, rowMap) => (
                        <View style={appStyles.rowBack}>
                            <TouchableOpacity style={[appStyles.backRightBtn, appStyles.backRightBtnRight]} onPress={ _ => this.deleteRow(rowMap, data.index) }>
                                <Text style={appStyles.backTextWhite}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    disableRightSwipe={true}
                    rightOpenValue={-1 * appData.DefaultOpenValue}
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
                <Toast ref={o => this.refToast = o} position={'top'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appData.appGrayColor,
    },
});
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import OrderCell from './HomeOrderCell';
import ListLoadFooter, {FooterTypeEnum, canLoad} from '../../components/ListLoadFooter';
import CustomAlert from '../../components/CustomAlert';
import Toast from "react-native-easy-toast";
import IndicatorModal from '../../components/IndicatorModal';

export default class HomeOrderVC extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataList: [],
            refreshing: false,
            showFooter:0,
            page: 1,
            toastPosition: "top",
        };
        this.showNoDataNote = false;
    };

    componentDidMount() {
        //TODO 延时执行解决下拉转圈动画不显示bug
        let that = this;
        setTimeout(function () {
            that.requestData();
        }, 100);
    };

    scrollAndRequestData = () => {
        if (objectNotNull(this.refList)) {
            if (!this.refList.scrollsToTop) {
                this.refList.scrollToOffset({animated: true, offset: 0});
            }
        }
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

        NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_my_goods/', data)
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
                        });

                        if (this.showNoDataNote && this.state.dataList.length === 0) {
                            this.refToast.show("您目前没有可用的货品，请添加货品");
                            this.showNoDataNote = false;
                        }
                    }
                    else {
                        this.setState({
                            refreshing: isReset ? false : this.state.refreshing,
                            showFooter: FooterTypeEnum.default,
                        });
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.setState({
                        refreshing: isReset ? false : this.state.refreshing,
                        showFooter: FooterTypeEnum.default,
                    });
                    this.refToast.show(error);
                });
    };

    onCellSelected = (info: Object, isOrdered) => {
        if (isOrdered) {
            return;
        }

        appMainTab.props.navigation.navigate('HomeOrderDetail',
            {
                info: info.item,
            });
    };

    renderCell = (info: Object) => {
        return (
            <OrderCell
                info={info}
                showCreateTime={true}
                onCellSelected={this.onCellSelected}
            />
        )
    };

    renderFooter(){
        return <ListLoadFooter showFooter={this.state.showFooter}/>;
    }

    onScroll(event) {
        appHomeVC.onScroll(event);
    }

    onScrollBeginDrag(event) {
        appHomeVC.onScrollBeginDrag(event);
    }

    onScrollEndDrag(event) {
        appHomeVC.onScrollEndDrag(event);
    }

    onMomentumScrollEnd(event) {
        appHomeVC.onMomentumScrollEnd(event);
    }

    onRefreshControl() {
        appHomeVC.onRefreshControl();
        this.requestData();
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ref={o => this.refList = o}
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}
                    onScroll={this.onScroll.bind(this)}
                    onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
                    onScrollEndDrag={this.onScrollEndDrag.bind(this)}
                    onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
                    scrollEventThrottle={10}
                    keyExtractor={(item: Object, index: number) => {
                        return '' + index;
                    }}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                        onRefresh={this.onRefreshControl.bind(this)}/>}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={appData.appOnEndReachedThreshold}
                />
                <Toast ref={o => this.refToast = o} position={this.state.toastPosition}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
                <CustomAlert ref={o => this.refSelectAlert = o} message={"您确定选择该货品？"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
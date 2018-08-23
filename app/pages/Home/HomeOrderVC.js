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

export default class HomeOrderVC extends Component {
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
        this.requestRecommend(true);
        // this.requestData();
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
        appMainTab.props.navigation.navigate('HomeOrderDetail',
            {
                info: info.item,
            });
    };

    onAlertSureBtnAction = () => {

    };

    renderCell = (info: Object) => {
        return (
            <OrderCell
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
                    ref={o => this.refList = o}
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={(item: Object, index: number) => {
                        return '' + index;
                    }}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                        onRefresh={this.requestData.bind(this)}/>}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={appData.appOnEndReachedThreshold}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
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
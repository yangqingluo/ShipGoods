import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import MessageCell from './MessageCell';
import ListLoadFooter, {canLoad, FooterTypeEnum} from '../../components/ListLoadFooter';
import Toast from 'react-native-easy-toast';
import px2dp from "../../util";

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
        let data = {page: this.state.page};

        NetUtil.post(appUrl + 'index.php/Mobile/Notification/get_notification/', data)
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
        let {item} = info;
        let {isnew, nid, content, redirect_type, param_value} = item;
        if (valueIsTrue(isnew)) {
            let data = {nid: nid};

            NetUtil.post(appUrl + 'index.php/Mobile/Notification/change_notification_state/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            info.item.isnew = "0";
                            this.forceUpdate();
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
            global.appReadOneMessage();
        }
        PublicAlert(JSON.stringify(info));
        appMainTab.doAnalyzeMessage(content, redirect_type, param_value);
    };

    renderCell = (info: Object) => {
        return (
            <MessageCell
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

    renderEmptyComponent = () => {
        return <TouchableOpacity style={{flex:1, alignItems: "center", backgroundColor:'white'}} onPress={this.requestData.bind(this)}>
            <Image source={require("../../images/icon_no_message.png")} style={styles.noMsgImage}/>
            <Text style={{marginTop:14, fontSize:14, color:'#494949'}}>{"啊哦，还没有消息哦..."}</Text>
        </TouchableOpacity>;
    };

    render() {
        if (this.state.dataList.length === 0) {
            return <TouchableOpacity style={{flex:1, alignItems: "center", backgroundColor:'white'}} onPress={this.requestData.bind(this)}>
                <Image source={require("../../images/icon_no_message.png")} style={styles.noMsgImage}/>
                <Text style={{marginTop:14, fontSize:14, color:'#494949'}}>{"啊哦，还没有消息哦..."}</Text>
            </TouchableOpacity>;
        }
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

                    // ListEmptyComponent={this.renderEmptyComponent}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    noMsgImage: {
        marginTop: 24,
        width:px2dp(140),
        height:px2dp(140),
        resizeMode: "stretch",
    },
});
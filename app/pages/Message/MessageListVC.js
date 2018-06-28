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
import ListLoadFooter from '../../components/ListLoadFooter';
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

        NetUtil.post(appUrl + 'index.php/Mobile/Notification/get_notification/', data)
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
        let {item} = info;
        if (item.isnew === '0') {
            let data = {nid: item.nid};

            NetUtil.post(appUrl + 'index.php/Mobile/Notification/change_notification_state/', data)
                .then(
                    (result)=>{
                        this.refToast.show(result.message);
                        if (result.code === 0) {

                        }
                        else {

                        }
                    },(error)=>{
                        this.refToast.show(error);
                    });
        }

    };

    renderCell = (info: Object) => {
        return (
            <MessageCell
                info={info}
                onPress={this.onCellSelected}
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
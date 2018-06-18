import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import GoodsCell from '../Home/HomeGoodsCell';
import ListLoadFooter from '../../components/ListLoadFooter';

export default class MyBookVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "我的预约",
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
        let data = {page: this.state.page, type: isShipOwner() ? 2 : 1};

        NetUtil.post(appUrl + 'index.php/Mobile/Task/get_book_list/', data)
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
        this.props.navigation.navigate('HomeShipDetail',
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
                    style={{flex:1, backgroundColor:"#fff"}}
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
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
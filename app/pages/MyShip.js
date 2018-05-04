import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import ShipCell from '../components/ShipCell';
import ListLoadFooter from '../components/ListLoadFooter';

export default class DetailVC extends Component {
    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => (
        {
            title: '我的船队',
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight: 10, color: appData.appBlueColor}}>添加船舶</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props){
        super(props)
        this.state = {
            dataList: [],
            refreshing: false,
            showFooter:0,
            page: 1,
        }
    }

    addBtnAction=()=> {
        const { navigate } = this.props.navigation;
        navigate('AddShip');
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.addBtnAction});
        this.requestData();
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    }

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
    }

    requestRecommend = (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {page: this.state.page, state:2};
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_my_ship/', data)
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
                        // PublicAlert(this.state.showFooter + '');
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
    }

    onCellSelected = (info: Object) => {
        if (this.props.navigation.state.params.callBack !== null) {
            this.props.navigation.state.params.callBack(info.item);
            this.props.navigation.goBack();
        }
    }

    onCellEditBtnAction = (info: Object) => {
        PublicAlert(JSON.stringify(info));
    }

    onCellLicenceBtnAction = (info: Object) => {
        PublicAlert(JSON.stringify(info));
    }

    onCellPriceBtnAction = (info: Object) => {
        PublicAlert(JSON.stringify(info));
    }

    renderCell = (info: Object) => {
        return (
            <ShipCell
                info={info}
                onPress={this.onCellSelected}
                onEditPress={this.onCellEditBtnAction}
                onLicencePress={this.onCellLicenceBtnAction}
                onPricePress={this.onCellPriceBtnAction}
                selected={false}
            />
        )
    }

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    }

    renderFooter(){
        return <ListLoadFooter showFooter={this.state.showFooter}/>;
    }

    render() {
        return (
            <View style={appStyles.container}>
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
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
        backgroundColor: '#F5FCFF',
    },
});
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import ShipCell from './ShipCell';
import ListLoadFooter, {canLoad, FooterTypeEnum} from '../../components/ListLoadFooter';

export default class DetailVC extends Component {
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
        super(props);
        this.state = {
            dataList: [],
            refreshing: false,
            showFooter:0,
            page: 1,
        }
    }

    addBtnAction =()=> {
        this.props.navigation.navigate('AddShip',
            {callBack: this.callBackFromShipVC.bind(this)
            });
    };

    callBackFromShipVC(key) {
        // this.setState({
        //     dataList: [],
        // });
        this.requestData();
    }

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.addBtnAction});
        this.requestData();
    }

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
        if (this.props.navigation.state.params.callBack !== null) {
            this.props.navigation.state.params.callBack(info.item);
            this.props.navigation.goBack();
        }
    };

    onCellEditBtnAction = (info: Object) => {
        this.props.navigation.navigate('EditShip',
            {
                ship:info.item,
                callBack: this.callBackFromShipVC.bind(this),
            });
    };

    onCellLicenceBtnAction = (info: Object) => {
        if (objectNotNull(info.item.ship_lience)) {
            this.props.navigation.navigate('PublicImageShow',
                {
                    images: [{url: appUrl + info.item.ship_lience}],
                    index: 0,
                })
        }

    };

    onCellPriceBtnAction = (info: Object) => {
        this.props.navigation.navigate('MyShipPrice',
            {
                ship_id: info.item.ship_id,
            })
    };

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
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}

                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                    onRefresh={this.requestData.bind(this)}/>}

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={this.loadMoreData.bind(this)}
                    onEndReachedThreshold={appData.appOnEndReachedThreshold}
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
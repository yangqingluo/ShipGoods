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
import IndicatorModal from "../../components/IndicatorModal";
import Toast from "react-native-easy-toast";

export default class DetailVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: '我的船队',
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
        if (objectNotNull(userData) && userData.authstate) {
            let state = parseInt(userData.authstate);
            switch (state) {
                case AuthStateEnum.Authing:
                    this.refToast.show("您的资质认证正在审核，不能添加更多船舶");
                    break;

                case AuthStateEnum.Authed:
                    this.props.navigation.navigate('AddShip',
                        {callBack: this.callBackFromShipVC.bind(this)
                        });
                    break;

                default:
                    this.requestShipsNumber();
                    break;
            }
        }
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

    refreshRequestData(isReset, result) {
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

    requestRecommend = async (isReset) => {
        if (isReset) {
            this.state.page = 1;
        }
        let data = {page: this.state.page, state:2};
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_my_ship/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.refreshRequestData(isReset, result);
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

    requestShipsNumber = async () => {
        let data = {page: this.state.page, state:2};

        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_my_ship/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        if (result.data.length === 0) {
                            this.props.navigation.navigate('AddShip',
                                {callBack: this.callBackFromShipVC.bind(this)
                                });
                        }
                        else {
                            if (this.state.dataList.length === 0) {
                                this.refreshRequestData(true, result);
                            }
                            this.refToast.show("未认证不能添加更多船舶");
                        }
                    }
                    else {
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.refToast.show(error);
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
                onCellSelected={this.onCellSelected}
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
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
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
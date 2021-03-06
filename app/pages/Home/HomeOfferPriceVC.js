import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import CustomItem from '../../components/CustomItem';
import Toast from "react-native-easy-toast";
import IndicatorModal from '../../components/IndicatorModal';

export default class HomeOfferPriceVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.title || '报价',
    });

    constructor(props) {
        super(props);
        this.state={
            refreshing: false,

            info: this.props.navigation.state.params.info,
            type: this.props.navigation.state.params.type || OfferOrderEnum.ShipOrder,
            priceType: this.props.navigation.state.params.priceType || OfferPriceEnum.BargainPrice,
            ship: this.props.navigation.state.params.ship || null,//船
            book: this.props.navigation.state.params.book || null,
            offer: '',
            arrive_time: null,//预计到港时间
            arrive_delay: 0,//到港延迟
            last_goods: '',//上载货品
            book_tonnage: '',//本载可装货量

            lastGoodsSelectedList: [],
        };

        if (this.isAgreePrice()) {
            if (this.isFirstPrice()) {
                this.config = [
                    {idKey:"ship_name", name:"船舶信息", logo:require('../../images/icon_blue.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectShip")},
                    {idKey:"offer", name:"运价（到船）", logo:require('../../images/icon_red.png'), disable:false, hideArrowForward:true},
                    {idKey:"arrive_time", name:"到港时间", logo:require('../../images/icon_orange.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectArriveTime")},
                    {idKey:"last_goods",name:"上载货品", logo:require('../../images/icon_green.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectLastGoods")},
                    {idKey:"book_tonnage",name:"本载可装货量", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectBookTonnage")},
                ];
            }
            else {
                this.config = [
                    {idKey:"ship_name", name:"船舶信息", logo:require('../../images/icon_blue.png'), disable:false, hideArrowForward:true},
                    {idKey:"offer", name:"运价（到船）", logo:require('../../images/icon_red.png'), disable:false, hideArrowForward:true},
                    {idKey:"arrive_time", name:"到港时间", logo:require('../../images/icon_orange.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectArriveTime")},
                    {idKey:"last_goods",name:"上载货品", logo:require('../../images/icon_green.png'), disable:false, hideArrowForward:true},
                    {idKey:"book_tonnage",name:"本载可装货量", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectBookTonnage")},
                ];
            }
        }
        else {
            this.config = this.isGoodsOrder() ?
                [
                    {idKey:"ship_name", name:"船舶信息", logo:require('../../images/icon_blue.png'), disable:false, hideArrowForward:true},
                    {idKey:"offer", name:"运价（到船）", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectOffer")},
                    {idKey:"arrive_time", name:"到港时间", logo:require('../../images/icon_orange.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectArriveTime")},
                    {idKey:"last_goods",name:"上载货品", logo:require('../../images/icon_green.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectLastGoods")},
                    {idKey:"book_tonnage",name:"本载可装货量", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectBookTonnage")},
                ]
                :
                [
                    {idKey:"ship_name", name:"选择船只", logo:require('../../images/icon_blue.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectShip")},
                    {idKey:"offer", name:"运价（到船）", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectOffer")},
                    {idKey:"arrive_time", name:"到港时间", logo:require('../../images/icon_orange.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectArriveTime")},
                    {idKey:"last_goods",name:"上载货品", logo:require('../../images/icon_green.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectLastGoods")},
                    {idKey:"book_tonnage",name:"本载可装货量", logo:require('../../images/icon_red.png'), disable:false, onCellSelected:this.cellSelected.bind(this, "SelectBookTonnage")},
                ];
        }
    }

    componentDidMount() {
        if (objectNotNull(this.state.book)) {
            this.requestData();
        }
        else if (this.isAgreePrice() || this.isGoodsOrder()) {
            if (this.isFirstPrice()) {
                this.setState({
                    offer: this.state.info.prices,
                })
            }
            else {
                this.requestData();
            }
        }
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    requestRecommend = async (isReset) => {
        let {info, book} = this.state;
        let {book_id} = info;
        if (stringIsEmpty(book_id)) {
            if (!stringIsEmpty(book.book_id)) {
                book_id = book.book_id;
            }
        }

        if (stringIsEmpty(book_id)) {
            this.setState({
                refreshing: false,
            });
            this.refToast.show("book_id为空，不能查询默认数据");
            return;
        }

        this.refIndicator.show();
        let data = {book_id: book_id};
        NetUtil.post(appUrl + 'index.php/Mobile/ship/get_default_ship', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        let data = result.data;

                        if (this.isAgreePrice() || objectNotNull(this.state.book)) {
                            if (objectNotNull(data.last_goods_name)) {
                                let lastGoodsSelectedList = [data.last_goods_name];
                                let list = lastGoodsSelectedList.map(
                                    (info) => {
                                        return info.goods_name;
                                    }
                                );

                                // if (objectNotNull(this.state.book)) {
                                //     this.setState({
                                //         ship: data,
                                //         offer: data.price,
                                //         last_goods: list.join(','),
                                //         lastGoodsSelectedList: lastGoodsSelectedList,
                                //         arrive_time: data.arrive_time && new Date(parseInt(data.arrive_time) * 1000),
                                //         arrive_delay: data.arrive_delay && parseInt(data.arrive_delay),
                                //         refreshing: false,
                                //     });
                                // }
                                // else {
                                    this.setState({
                                        ship: data,
                                        offer: data.price,
                                        last_goods: list.join(','),
                                        lastGoodsSelectedList: lastGoodsSelectedList,
                                        refreshing: false,
                                    });
                                // }
                            }
                            else {
                                this.setState({
                                    refreshing: false,
                                });
                                this.refToast.show("数据出错");
                            }
                        }
                        else if (this.isGoodsOrder()) {
                            this.setState({
                                ship: data,
                                refreshing: false,
                            });
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            });
                        }
                    }
                    else {
                        this.setState({
                            refreshing: false,
                        });
                        this.refToast.show(result.message);
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.setState({
                        refreshing: false,
                    });
                    this.refToast.show(error);
                });
    };

    isAgreePrice() {
        return this.state.priceType === OfferPriceEnum.AgreePrice;
    }

    isFirstPrice() {
        return stringIsEmpty(this.state.info.book_id);
    }

    isGoodsOrder() {
        return this.state.type === OfferOrderEnum.GoodsOrder;
    }

    toGotoTwicePriceVC = (data) =>{
        //to fix 报价后book_id和info.book_id不一致
        if (stringIsEmpty(this.state.info.book_id)) {
            this.state.info.book_id = data.book_id;
        }
        // this.refToast.show(this.state.info.book_id + "****" + data.book_id);
        global.appSecondPriceParams = {headerTitle: "二次报价", info: this.state.info};
        this.props.navigation.goBack('HomeOfferTwicePrice');
    };

    onSubmitBtnAction = () => {
        let {info, offer, type, ship, lastGoodsSelectedList, arrive_time, arrive_delay, book_tonnage} = this.state;
        if (ship === null) {
            this.refToast.show("请选择船舶");
        }
        else if (arrive_time === null) {
            this.refToast.show("请选择到港时间");
        }
        else if (lastGoodsSelectedList.length === 0) {
            this.refToast.show("请选择上载货品");
        }
        else if (book_tonnage.length === 0) {
            this.refToast.show("请设置本载可运货量");
        }
        else {
            let price = parseFloat(offer);
            if (offerIsBargain(info.is_bargain)) {
                if (price < 0.000001) {
                    this.refToast.show("请输入运价");
                    return;
                }
            }

            let data = {
                ship_id: ship.ship_id,
                last_goods_id: lastGoodsSelectedList[0].goods_id,
                arrive_time: arrive_time.Format("yyyy-MM-dd"),
                arrive_delay: arrive_delay,
                book_tonnage: book_tonnage,
                type: type,
                offer: price.Format(2),
                task_id: info.task_id,
            };

            if (type === OfferOrderEnum.GoodsOrder) {
                if (objectNotNull(info.book_id)) {
                    data.book_id = info.book_id;
                }
            }

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Task/add_book_good/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            PublicAlert(result.message, "",
                                [{text:"确定", onPress:this.toGotoTwicePriceVC.bind(this, result.data)}]
                            );
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    };

    textInputChanged(text, key){
        if (key === 'offer') {
            this.setState({
                offer: text,
            });
        }
    }

    cellSelected = (key, data = {}) =>{
        const { navigate } = this.props.navigation;
        if (key === "SelectShip") {
            navigate(
                "MyShip",
                {
                    callBack:this.callBackFromShipVC.bind(this)
                });
        }
        else if (key === "SelectArriveTime") {
            navigate(
                "SelectEmptyTimeVC",
                {
                    title: '到港时间',
                    key: key,
                    date: this.state.arrive_time,
                    delay: this.state.arrive_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else if (key === "SelectLastGoods") {
            this.toGoToGoodsVC();
        }
        else if (key === "SelectBookTonnage") {
            navigate(
                "SelectBookTonnage",
                {
                    book_tonnage: this.state.book_tonnage,
                    callBack:this.callBackFromBookTonnageVC.bind(this)
                });
        }
        else if (key === "SelectOffer") {
            navigate(
                "SelectPrice",
                {
                    title: '运价（到船）',
                    price: this.state.offer,
                    onlyPrice: true,
                    callBack:this.callBackFromPriceVC.bind(this)
                });
        }
    };

    callBackFromShipVC(backData) {
        this.setState({
            ship: backData,
        })
    }

    callBackFromTimeVC(key, backDate, backDelay) {
        if (key === "SelectArriveTime") {
            this.setState({
                arrive_time: backDate,
                arrive_delay: backDelay,
            })
        }
    }

    callBackFromBookTonnageVC(book_tonnage) {
        this.setState({
            book_tonnage: book_tonnage,
        })
    }

    callBackFromPriceVC(price, is_bargain, is_shipprice) {
        this.setState({
            offer: price,
        })
    }

    toGoToGoodsVC() {
        if (appAllGoods.length > 0) {
            this.props.navigation.navigate(
                'CustomSectionSelect',
                {
                    title: '上载货品',
                    dataList: appAllGoods,
                    selectedList:this.state.lastGoodsSelectedList,
                    maxSelectCount: 1,
                    callBack:this.callBackFromGoodsVC.bind(this)
                }
            );
        }
        else {
            let data = {pid:'0', deep:1};
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            global.appAllGoods = result.data;
                            this.toGoToGoodsVC();
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromGoodsVC(backData) {
        let dataList = backData.map(
            (info) => {
                return info.goods_name;
            }
        );
        this.setState({
            last_goods: dataList.join(','),
            lastGoodsSelectedList: backData
        });
    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'ship_name' && this.state.ship !== null) {
            return this.state.ship.ship_name;
        }
        else if (item.idKey === 'offer' && !stringIsEmpty(this.state.offer)) {
            return this.state.offer + " 元/吨";
        }
        else if (item.idKey === 'last_goods' && this.state.last_goods.length > 0) {
            return this.state.last_goods;
        }
        else if (item.idKey === 'arrive_time' && this.state.arrive_time !== null) {
            return this.state.arrive_time.Format("yyyy.MM.dd") + '±' + this.state.arrive_delay + '天';
        }
        else if (item.idKey === 'book_tonnage' && this.state.book_tonnage.length > 0) {
            return this.state.book_tonnage + "吨";
        }
        return '';
    }

    _renderShipCell() {
        let {ship} = this.state;
        let {dieseloil, gasoline, ship_type} = ship;
        return (<View>
            <View style={shipStyles.centerViewContainer}>
                <View style={{backgroundColor: appData.appBlueColor, width:9}}/>
                <View style={{flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.04)',}}>
                    <View style={shipStyles.cellContainer}>
                        <View style={[shipStyles.cellContainer, {alignItems: "center"}]}>
                            <Image source={require('../../images/icon_word_hang.png')} style={{width:19, height: 29, marginLeft:12, resizeMode: "cover"}}/>
                            <Text style={{color:appData.appTextColor, marginLeft:6, fontSize:14}}>{getArrayTypesText(shipAreaTypes, parseInt(ship.area) - 1)}</Text>
                        </View>
                        <View style={[shipStyles.cellContainer, {alignItems: "center"}]}>
                            <Text style={{color:appData.appTextColor, marginLeft:12, fontSize:14}}>{ship.storage + ' m³ / ' + ship.tonnage + ' T'}</Text>
                        </View>
                    </View>
                    <View style={shipStyles.cellContainer}>
                        <View style={[shipStyles.cellContainer, {alignItems: "center"}]}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}}>
                                <Image source={require('../../images/icon_clip.png')} style={{width: 18, height: 18, marginLeft:12, resizeMode: "cover"}}/>
                                <Text style={{color:appData.appBlueColor, marginLeft:6, fontSize:14}}>{'船舶相关证书'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[shipStyles.cellContainer, {alignItems: "center"}]}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}}>
                                <Image source={require('../../images/icon_clip.png')} style={{width: 18, height: 18, marginLeft:12, resizeMode: "cover"}}/>
                                <Text style={{color:appData.appBlueColor, marginLeft:6, fontSize:14}}>{'相关报价'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            {shipIsShowType(dieseloil, gasoline, ship_type) ?
                <View style={shipStyles.viewContainer}>
                    <Text style={{color:appData.appSecondaryTextColor, marginRight:7, fontSize:12}}>{'船舶类型 '}</Text>
                    <Text style={{color:appData.appSecondaryTextColor, marginRight:15, fontSize:12}}>{getArrayTypesText(shipTypes, parseInt(ship_type) - 1)}</Text>
                </View>
                :
                <View style={shipStyles.viewContainer}>
                    <Text style={{color:appData.appSecondaryTextColor, marginRight:7, fontSize:12}}>{'可运柴油 ' + (objectIsZero(dieseloil) ? "" : dieseloil + '吨')}</Text>
                    {shipIsOilThreeLevel(ship_type) ? null : <Text style={{color:appData.appSecondaryTextColor, marginRight:15, fontSize:12}}>{'可运汽油 ' + (objectIsZero(gasoline) ? "" : gasoline + '吨')}</Text>}
                </View>
            }
            <View style={{height:12, backgroundColor: appData.appGrayColor}} />
        </View>);
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            // if (item.idKey === "offer" && !offerIsBargain(this.state.info.is_bargain)) {
            //     return null;
            // }
            return (<View key={'cell' + i} >
                <CustomItem key={i} {...item}
                            subName = {this.renderSubNameForIndex(item, i)}
                            callback={this.textInputChanged.bind(this)}>
                </CustomItem>
                {(item.idKey === 'ship_name' && this.state.ship !== null) ?
                this._renderShipCell()
                :null}
            </View>);
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        let {info} = this.state;
        let price = parseInt(info.price);
        return (
            <View style={appStyles.container}>
                <ScrollView style={{flex: 1, backgroundColor:'#fff'}}
                            refreshControl={(this.isAgreePrice() || this.isGoodsOrder()) && !this.isFirstPrice() ?
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.requestData.bind(this)}
                                />
                            :null}
                >
                    {this._renderListItem()}
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View> );
    }
}
const styles = StyleSheet.create({
    textInput: {
        marginTop: 10,
        minHeight: 46,
        borderRadius: 6,
        fontSize: 16,
        paddingHorizontal: 28,
        paddingVertical: 15,
        color: '#535353',
        backgroundColor: appData.appGrayColor,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
    }
});

const shipStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0,
        borderColor: appData.appBorderColor,
        backgroundColor: 'white',
        minHeight:144,
    },
    viewContainer: {
        justifyContent: "flex-end",
        flexDirection: 'row',
        height:36,
        alignItems: "center",
    },
    centerViewContainer: {
        flexDirection: 'row',
        marginLeft:16,
        marginRight:15,
        height:72,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
});

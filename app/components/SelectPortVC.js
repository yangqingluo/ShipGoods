import React, { Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    ScrollView,
} from 'react-native';

import CellTitleItem from './CellTitleItem';
import HotCell from './HotPortTextCell';
import PortFirstCell from './PortFirstCell';
import CustomInput from '../components/CustomInput';
import Toast from "react-native-easy-toast";
import IndicatorModal from './IndicatorModal';

export default class SelectPortVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            // title: navigation.state.params.title,
            headerTitle: (
                <View style={styles.inputBack}>
                    <Image source={require('../images/icon_search.png')} style={{width: 20, height: 20, marginLeft:10, resizeMode: "cover"}}/>
                    <CustomInput underlineColorAndroid="transparent"
                                 style={styles.textInput}
                                 returnKeyType={"search"}
                                 maxLength={appData.appMaxLengthName}
                                 placeholder={"港口"}
                                 placeholderTextColor={appData.appSecondaryTextColor}
                                 onSubmitEditing={() => {
                                     navigation.state.params.clickParams();
                                 }}
                                 onChangeText={(text) => {
                                     navigation.state.params.onChangeText(text, "search");
                                 }}
                    />
                </View>
            ),
        });

    constructor(props){
        super(props);
        this.state = {
            selectedList: this.props.navigation.state.params.selectedList || [],
            dataList: this.props.navigation.state.params.dataList,
            hotList: [],
            maxSelectCount:this.props.navigation.state.params.maxSelectCount,
            refreshing: false,
            search: "",
        }
    }

    _btnClick =()=> {
        if (!stringIsEmpty(this.state.search)) {
            this.toGoToSearchPortsVC(null, this.state.search);
        }
    };

    textInputChanged(text, key){
        if (key === "search") {
            this.setState({
                search: text,
            });
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clickParams:this._btnClick.bind(this),
            onChangeText:this.textInputChanged.bind(this),
        });
        this.requestData();
    }

    requestData = () => {
        // this.setState({refreshing: true});
        // this.requestRecommend();
        this.requestHotPort();
    };

    requestRecommend = async () => {
        let data = {pid:'0', deep:1};
        NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.setState({
                            dataList: result.data,
                            refreshing: false,
                        })
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
    };

    requestHotPort = async () => {
        if (appHotPorts.length > 0) {
            this.setState({
                hotList: appHotPorts,
            })
        }
        else {
            let data = {};
            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_hot_port', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            appHotPorts = result.data;
                            this.setState({
                                hotList: result.data,
                            })
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                        this.refIndicator.hide();
                    });
        }
    };

    onCellSelected = (info: Object) => {
        let port = info.item;
        this.toGoToPortsVC([], port);
    };

    toGoToPortsVC(list, port) {
        if (arrayNotEmpty(list)) {
            this.props.navigation.navigate(
                "SelectPortSecond",
                {
                    title: this.props.navigation.state.params.title,
                    dataList: list,
                    key: this.props.navigation.state.params.key,
                    // selectedList:this.state.downloadOilSelectedList,
                    callBack:this.props.navigation.state.params.callBack
                });
        }
        else {
            let data = {pid:port.port_id, deep:1};
            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_all_port/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            this.toGoToPortsVC(result.data, port);
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                        this.refIndicator.hide();
                    });
        }
    }

    toGoToSearchPortsVC(list, key) {
        if (arrayNotEmpty(list)) {
            this.props.navigation.navigate(
                "SelectPortSearch",
                {
                    title: this.props.navigation.state.params.title,
                    dataList: list,
                    key: this.props.navigation.state.params.key,
                    // selectedList:this.state.downloadOilSelectedList,
                    callBack:this.props.navigation.state.params.callBack
                });
        }
        else {
            let data = {port_name:key, pid:'0', deep:0};
            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_all_port/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        if (result.code === 0) {
                            let list = result.data;
                            if (arrayNotEmpty(list)) {
                                this.toGoToSearchPortsVC(result.data, key);
                            }
                            else {
                                this.refToast.show("没有搜索到结果");
                            }
                        }
                        else {
                            this.refToast.show(result.message);
                        }
                    },(error)=>{
                        this.refToast.show(error);
                        this.refIndicator.hide();
                    });
        }
    }

    renderCell = (info: Object) => {
        return (
            <PortFirstCell
                info={info}
                onPress={this.onCellSelected}
                isSecond={false}
                selected={this.state.selectedList.indexOf(info.item) !== -1}
            />
        )
    };

    onHotCellSelected = (info: Object) => {
        this.props.navigation.state.params.callBack(this.props.navigation.state.params.key, info.item);
        this.props.navigation.goBack();
    };

    renderHotCell = (info: Object) => {
        return (
            <HotCell
                info={info}
                onPress={this.onHotCellSelected}
                lines={3}
            />
        )
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    render() {
        let {hotList, dataList} = this.state;
        return (
            <View style={appStyles.container}>
                {hotList.length > 0 ?
                    <View style={{backgroundColor: '#fff'}}>
                        <CellTitleItem name={'热门港口'}
                                       disable={true}
                                       subName={''}
                        >
                            <FlatList
                                numColumns ={3}
                                data={hotList}
                                renderItem={this.renderHotCell}
                                keyExtractor={this.keyExtractor}
                                style={{margin: 0}}
                            />
                        </CellTitleItem>
                        <View style={{height: 5, backgroundColor: '#f3f6f9'}}/>
                    </View>
                : null}
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                />
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    inputBack: {
        width: 0.8 * screenWidth,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#e5e5e5",
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        // marginTop: 10,
        // minHeight: 120,
        flex: 1,
        fontSize: 13,
        paddingHorizontal: 10,
        // paddingVertical: 15,
        color: appData.appTextColor,
    },
});

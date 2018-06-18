import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomItem from '../../components/CustomItem'
import CellTitleItem from '../../components/CellTitleItem'
import TextCell from '../../components/TextCell'

export default class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            empty_port: null,//空船港
            empty_time: null,//空船期
            empty_delay: 0,//空船延迟
            goods: null,//可运货品
            ship_type: null,//船舶类型
            area: [],//航行区域
            min_ton: 0,//货量区间 最小吨位
            max_ton: 0,//货量区间 最大吨位
            loading_port: null,//装货港
            loading_time: null,//发货时间
            loading_delay: 0,//发货延迟
            unloading_port: null,//卸货港
        };
        this.config = isShipOwner() ?
            [
                {idKey:"loading_port", name:"装货港", disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingPort")},
                {idKey:"loading_time",name:"发货时间", disable:false, onPress:this.cellSelected.bind(this, "SelectLoadingTime")},
                {idKey:"unloading_port", name:"卸货港", disable:false, onPress:this.cellSelected.bind(this, "SelectUnloadingPort")},
            ]
            :
            [
                {idKey:"empty_port", name:"空船港", disable:false, onPress:this.cellSelected.bind(this, "SelectEmptyPort")},
                {idKey:"empty_time",name:"承运时间", disable:false, onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
            ];
    }

    componentDidMount() {
        if (appAllGoods.length === 0) {
            let data = {pid:'0', deep:1};
            NetUtil.post(appUrl + 'index.php/Mobile/Goods/get_all_goods/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllGoods = result.data;
                            this.forceUpdate();
                        }
                    },(error)=>{

                    });
        }
    }

    refreshDatasource() {
        let area = appHomeCondition.area.map(
            (info) => {
                return info;
            }
        );

        this.setState({
            empty_port: appHomeCondition.empty_port,
            empty_time: appHomeCondition.empty_time,
            empty_delay: appHomeCondition.empty_delay,
            goods: appHomeCondition.goods,
            ship_type: appHomeCondition.ship_type,
            area: area,
            min_ton: appHomeCondition.min_ton,
            max_ton: appHomeCondition.max_ton,
            loading_port: appHomeCondition.loading_port,
            loading_time: appHomeCondition.loading_time,
            loading_delay: appHomeCondition.loading_delay,
            unloading_port: appHomeCondition.unloading_port,
        });
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectEmptyPort"|| key === "SelectLoadingPort" || key === "SelectUnloadingPort") {
            this.toGoToPortsVC(key);
        }
        else if (key === "SelectEmptyTime") {
            this.props.navigation.navigate(
                "SelectEmptyTimeVC",
                {
                    title: '承运时间',
                    key: key,
                    date: this.state.empty_time,
                    delay: this.state.empty_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else if (key === "SelectLoadingTime") {
            this.props.navigation.navigate(
                "SelectEmptyTimeVC",
                {
                    title: '发货时间',
                    key: key,
                    date: this.state.loading_time,
                    delay: this.state.loading_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else {
            PublicAlert(key);
        }
    }

    toGoToPortsVC(key) {
        if (appAllPortsFirst.length > 0) {
            this.props.navigation.navigate(
                "SelectPort",
                {
                    title: '选择港口',
                    dataList: appAllPortsFirst,
                    key: key,
                    // selectedList:this.state.downloadOilSelectedList,
                    callBack:this.callBackFromPortVC.bind(this)
                });
        }
        else {
            let data = {pid:'0', deep:0};
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_all_port/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllPortsFirst = result.data;
                            this.toGoToPortsVC(key);
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

    callBackFromPortVC(key, backData) {
        if (key === "SelectEmptyPort") {
            this.setState({
                empty_port: backData,
            })
        }
        else if (key === "SelectLoadingPort") {
            this.setState({
                loading_port: backData,
            })
        }
        else if (key === "SelectUnloadingPort") {
            this.setState({
                unloading_port: backData,
            })
        }
    }

    callBackFromTimeVC(key, backDate, backDelay) {
        if (key === "SelectEmptyTime") {
            this.setState({
                empty_time: backDate,
                empty_delay: backDelay,
            })
        }
        else if (key === "SelectLoadingTime") {
            this.setState({
                loading_time: backDate,
                loading_delay: backDelay,
            })
        }

    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'empty_port' && this.state.empty_port !== null) {
            return this.state.empty_port.port_name;
        }
        else if (item.idKey === 'loading_port' && this.state.loading_port !== null) {
            return this.state.loading_port.port_name;
        }
        else if (item.idKey === 'unloading_port' && this.state.unloading_port !== null) {
            return this.state.unloading_port.port_name;
        }
        else if (item.idKey === 'empty_time' && this.state.empty_time !== null) {
            return this.state.empty_time.Format("yyyy.MM.dd") + '±' + this.state.empty_delay + '天';
        }
        else if (item.idKey === 'loading_time' && this.state.loading_time !== null) {
            return this.state.loading_time.Format("yyyy.MM.dd") + '±' + this.state.loading_delay + '天';
        }

        return '';
    }

    textInputChanged(text, key){
        let m_text = text.length > 0 ? text : '0';
        if (key === "min") {
            this.setState({
                min_ton: parseInt(m_text),
            });
        }
        else if (key === "max") {
            this.setState({
                max_ton: parseInt(m_text),
            });
        }
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={'cell' + i}>
                    <CustomItem key={i} {...item}
                                subName = {this.renderSubNameForIndex(item, i)}
                                noSeparator={true}
                                callback={this.textInputChanged.bind(this)}>
                    </CustomItem>
                    <View style={{marginLeft:2, height: 5, backgroundColor: '#f3f6f9'}}/>
                </View>);
        })
    }

    onGoodsCellSelected = (info: Object) => {
        this.setState({
           goods: info.item,
        });
    };

    renderGoodsCell = (info: Object) => {
        return (
            <TextCell
                info={info}
                showText={info.item.goods_name}
                onPress={this.onGoodsCellSelected}
                selected={info.item === this.state.goods}
                lines={3}
            />
        )
    };

    onShipTypeCellSelected = (info: Object) => {
        this.setState({
            ship_type: info.item,
        });
    };

    renderShipTypeCell = (info: Object) => {
        return (
            <TextCell
                info={info}
                showText={info.item.name}
                onPress={this.onShipTypeCellSelected}
                selected={info.item === this.state.ship_type}
                lines={3}
            />
        )
    };

    onAreaCellSelected = (info: Object) => {
        let index = this.state.area.indexOf(info.item);
        if (index === -1) {
            this.state.area.push(info.item);
        }
        else {
            this.state.area.splice(index, 1);
        }
        this.forceUpdate();
    };

    renderAreaCell = (info: Object) => {
        return (
            <TextCell
                info={info}
                showText={info.item.name}
                onPress={this.onAreaCellSelected}
                selected={this.state.area.indexOf(info.item) !== -1}
                lines={2}
            />
        )
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    render() {
        const {onItemSelected} = this.props;
        return (
            <View style={{flex: 1, borderLeftWidth: 0.5, borderLeftColor: appData.appBorderColor}}>
                <ScrollView scrollsToTop={false} style={styles.menu}>
                    {this._renderListItem()}
                    {isShipOwner() ?
                        <CellTitleItem name={isShipOwner() ? '货品种类' : '可运货品'} disable={true} subName={''}>
                            <FlatList
                                numColumns ={3}
                                data={appAllGoods}
                                renderItem={this.renderGoodsCell}
                                keyExtractor={this.keyExtractor}
                                style={{marginLeft: 10, marginRight: 10}}
                            >
                            </FlatList>
                        </CellTitleItem>
                    :
                        <CellTitleItem name={"船舶类型"} disable={true} subName={''}>
                            <FlatList
                                numColumns ={3}
                                data={shipTypeObjects}
                                renderItem={this.renderShipTypeCell}
                                keyExtractor={this.keyExtractor}
                                style={{marginLeft: 10, marginRight: 10}}
                            >
                            </FlatList>
                        </CellTitleItem>}
                    <View style={{marginLeft:2, height: 5, backgroundColor: '#f3f6f9'}}/>
                    <CellTitleItem name={'货量区间'} disable={true} subName={''}>
                        <View style={{marginLeft: 10, marginRight: 10, height: 50, flexDirection: 'row', alignItems: "center"}}>
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={"请输入数字"}
                                       placeholderTextColor={'#5d5d5d'}
                                       onChangeText={(text) => {
                                           this.textInputChanged(text, "min");
                                       }}
                                       value={this.state.min_ton > 0 ? this.state.min_ton + '' : ''}
                            />
                            <View style={{width: 40, height: 50, alignItems: "center", justifyContent: "center",}}>
                                <Text style={{fontSize:16, textAlign: 'center', color: '#5d5d5d'}}>{"~"}</Text>
                            </View>
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={"请输入数字"}
                                       placeholderTextColor={'#5d5d5d'}
                                       onChangeText={(text) => {
                                           this.textInputChanged(text, "max");
                                       }}
                                       value={this.state.max_ton > 0 ? this.state.max_ton + '' : ''}
                            />
                        </View>
                    </CellTitleItem>
                    <View style={{marginLeft:2, height: 5, backgroundColor: '#f3f6f9'}}/>
                    <CellTitleItem name={'航行区域'} disable={true} subName={''}>
                        <FlatList
                            numColumns ={2}
                            data={shipAreaObjects}
                            renderItem={this.renderAreaCell}
                            keyExtractor={this.keyExtractor}
                            style={{marginLeft: 10, marginRight: 10}}
                        >
                        </FlatList>
                    </CellTitleItem>
                    <View style={{height: 120}}/>
                </ScrollView>
                <View style={{height:46, flexDirection: 'row', alignItems: "center"}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => onItemSelected('Cancel')}>
                        <View style={[styles.bottomButton, {backgroundColor: '#d8d8d8'}]}>
                            <Text style={[styles.bottomButtonText, {color: "#a9a9a9"}]}>{"取消"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => onItemSelected('OK')}>
                        <View style={[styles.bottomButton, {backgroundColor: appData.appBlueColor}]}>
                            <Text style={[styles.bottomButtonText, {color: "#fff"}]}>{"确定"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

Menu.propTypes = {
    onItemSelected: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor: 'white',
    },
    bottomButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomButtonText: {
        fontSize: 18,
        fontWeight: '900',
    },
    textInput: {
        height: 27,
        flex: 1,
        textAlign: "center",
        backgroundColor: '#f3f6f9',
        borderRadius: 4,
    },
});
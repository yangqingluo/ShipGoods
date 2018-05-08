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
import px2dp from "../../util";
import AddAuthItem from '../../components/AddAuthItem'
import CellTitleItem from '../../components/CellTitleItem'
import TextCell from '../../components/TextCell'

export default class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            empty_port: null,//空船港
            empty_time: null,//空船期
            empty_delay: 0,//空船延迟
        };
        this.config = (userData.usertype === '1') ?
            [
                {idKey:"empty_port", name:"空船港", disable:false, onPress:this.cellSelected.bind(this, "SelectEmptyPort")},
                {idKey:"empty_time",name:"承运时间", disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
            ]
            :
            [

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

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectEmptyPort") {
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
        else if (item.idKey === 'empty_time' && this.state.empty_time !== null) {
            return this.state.empty_time.Format("yyyy.MM.dd") + '±' + this.state.empty_delay + '天';
        }

        return '';
    }

    textInputChanged(text, key){

    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View>
                    <AddAuthItem key={i} {...item}
                                 subName = {this.renderSubNameForIndex(item, i)}
                                 noSeparator={true}
                                 callback={this.textInputChanged.bind(this)}>
                    </AddAuthItem>
                    <View style={{marginLeft:px2dp(2), height: px2dp(5), backgroundColor: '#f3f6f9'}}/>
                </View>);
        })
    }

    onGoodsCellSelected = (info: Object) => {
        let goods = info.item;
        PublicAlert(JSON.stringify(goods));
    };

    renderGoodsCell = (info: Object) => {
        return (
            <TextCell
                info={info}
                showText={info.item.goods_name}
                onPress={this.onGoodsCellSelected}
                selected={false}
                lines={3}
            />
        )
    };

    onAreaCellSelected = (info: Object) => {
        let area = info.item;
        PublicAlert(JSON.stringify(area));
    };

    renderAreaCell = (info: Object) => {
        return (
            <TextCell
                info={info}
                showText={info.item.name}
                onPress={this.onAreaCellSelected}
                selected={false}
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
            <View style={{flex: 1, borderLeftWidth: px2dp(0.5), borderLeftColor: appData.appBorderColor}}>
                <ScrollView scrollsToTop={false} style={styles.menu}>
                    {this._renderListItem()}
                    <CellTitleItem name={'可运货品'} disable={true} subName={''}>
                        <FlatList
                            numColumns ={3}
                            data={appAllGoods}
                            renderItem={this.renderGoodsCell}
                            keyExtractor={this.keyExtractor}
                            style={{marginLeft: px2dp(10), marginRight: px2dp(10)}}
                        >
                        </FlatList>
                    </CellTitleItem>
                    <View style={{marginLeft:px2dp(2), height: px2dp(5), backgroundColor: '#f3f6f9'}}/>
                    <CellTitleItem name={'货量区间'} disable={true} subName={''}>
                        <View style={{marginLeft: px2dp(10), marginRight: px2dp(10), height: px2dp(50), flexDirection: 'row', alignItems: "center"}}>
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={"请输入数字"}
                                       placeholderTextColor={'#5d5d5d'}
                                       onChangeText={(text) => {
                                           this.textInputChanged(text, "");
                                       }}
                            />
                            <View style={{width: px2dp(40), height: px2dp(50), alignItems: "center", justifyContent: "center",}}>
                                <Text style={{fontSize:px2dp(16), textAlign: 'center', color: '#5d5d5d'}}>{"~"}</Text>
                            </View>
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={"请输入数字"}
                                       placeholderTextColor={'#5d5d5d'}
                                       onChangeText={(text) => {
                                           this.textInputChanged(text, "");
                                       }}
                            />
                        </View>
                    </CellTitleItem>
                    <View style={{marginLeft:px2dp(2), height: px2dp(5), backgroundColor: '#f3f6f9'}}/>
                    <CellTitleItem name={'航行区域'} disable={true} subName={''}>
                        <FlatList
                            numColumns ={2}
                            data={shipAreaObjects}
                            renderItem={this.renderAreaCell}
                            keyExtractor={this.keyExtractor}
                            style={{marginLeft: px2dp(10), marginRight: px2dp(10)}}
                        >
                        </FlatList>
                    </CellTitleItem>
                    <View style={{height: px2dp(120)}}/>
                </ScrollView>
                <View style={{height:px2dp(46), flexDirection: 'row', alignItems: "center"}}>
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
        fontSize: px2dp(18),
        fontWeight: '900',
    },
    textInput: {
        height: px2dp(27),
        flex: 1,
        textAlign: "center",
        backgroundColor: '#f3f6f9',
        borderRadius: px2dp(4),
    },
});
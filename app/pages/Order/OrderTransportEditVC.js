import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import OrderTransportCell from './OrderTransportEditCell'
import DateTimePicker from '../../components/DateTime';
import Toast from 'react-native-easy-toast';
import IndicatorModal from '../../components/IndicatorModal';

export default class OrderTransportEditVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "货运详情",
    });

    constructor(props){
        super(props);
        this.state = {
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
            trans_index: -1,
            trans_remark: '',
        }
    };

    componentDidMount() {
        this.requestData();
    }

    requestData = () => {
        this.setState({refreshing: true});
        this.requestRecommend(true);
    };

    requestRecommend = async (isReset) => {
        let {info} = this.props.navigation.state.params;
        let data = {or_id: info.or_id};

        NetUtil.post(appUrl + 'index.php/Mobile/Order/get_transport_detail/', data)
            .then(
                (result)=>{
                    if (result.code === 0) {
                        this.setState({
                            detailInfo: result.data,
                            refreshing: false,
                        });
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

    submitInfoFunction = (info) => {
        let {item ,index} = info;
        if (!objectNotNull(item.update_time)) {
            this.refToast.show("请设置状态对应的时间");
        }
        else if (stringIsEmpty(item.remark)) {
            this.refToast.show("请输入货品状态描述");
        }
        else {
            let data = {
                or_id: item.or_id,
                t_id: item.t_id,
                state: item.state,
                remark: item.remark,
                update_time: item.update_time,
            };

            this.refIndicator.show();
            NetUtil.post(appUrl + 'index.php/Mobile/Order/change_transport_state/', data)
                .then(
                    (result)=>{
                        this.refIndicator.hide();
                        this.refToast.show(result.message);
                        if (result.code === 0) {
                            this.requestRecommend(true);
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    };

    onCellSelected = (info: Object) => {

    };

    onCellTimeSelected = (info: Object) => {
        this.refTimePicker.showDateTimePicker(null, (d)=>{
            info.item.update_time = Date.parse(d) * 0.001;
            this.setState({
                trans_index: info.index,
            });
        });
    };

    onCellSubmitSelected = (info: Object) => {
        let translist = this.state.detailInfo.translist;
        if (translist.indexOf(info.item) === (translist.length - 1)) {

        }
        this.submitInfoFunction(info);
    };

    cellTextInputChanged = (text, info) => {
        info.item.remark = text;
        this.setState({
            trans_remark: text,
        });
    };

    renderCell = (info: Object) => {
        let translist = this.state.detailInfo.translist;
        return (
            <OrderTransportCell
                info={info}
                onPress={this.onCellSelected}
                onTimePress={this.onCellTimeSelected}
                onSubmitPress={this.onCellSubmitSelected}
                textInputChanged={this.cellTextInputChanged}
                trans_state={this.state.detailInfo.trans_state}
                showLast={translist.indexOf(info.item) === (translist.length - 1)}
            />
        )
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    renderHeader() {
        let {detailInfo} = this.state;
        return (
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {detailInfo.loading_port_name}
                    </Text>
                    <View style={{width:111}}>
                        <Image source={require('../../images/icon_time_and_arrow.png')} style={{width: 111, height: 15, resizeMode: "cover"}} />
                        <Text style={styles.headerTimeText}>
                            {detailInfo.loading_time}
                        </Text>
                    </View>
                    <Text style={styles.headerText}>
                        {detailInfo.unloading_port_name}
                    </Text>
                </View>
                <View style={{height: 22}} />
            </View>
        );
    };

    render() {
        let {detailInfo} = this.state;
        let shipOwner = isShipOwner();
        return (
            <View style={styles.container}>
                <FlatList
                    style={{flex:1}}
                    data={detailInfo.translist}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    // ItemSeparatorComponent={global.renderSeparator}
                    ListHeaderComponent={this.renderHeader.bind(this)}

                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                    onRefresh={this.requestData.bind(this)}/>}
                />
                <DateTimePicker title="请选择时间" ref={o => this.refTimePicker = o} />
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    headerContainer: {
        marginHorizontal:10,
        marginTop:3,
        minHeight:77,
        borderWidth:0.5,
        borderColor:appData.appBorderColor,
        flexDirection: 'row',
        paddingTop:20,
        // alignItems: "center",
    },
    headerText: {
        flex:1,
        fontSize:16,
        color:appData.appTextColor,
        fontWeight:appData.appFontWeightSemibold,
        textAlign:'center',
    },
    headerTimeText: {
        marginTop:5,
        fontSize:12,
        color:appData.appTextColor,
        fontWeight:appData.appFontWeightSemibold,
        textAlign:'center',
    }
});
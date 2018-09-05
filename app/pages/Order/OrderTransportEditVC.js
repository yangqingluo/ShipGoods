import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    RefreshControl,
    FlatList,
    TouchableOpacity
} from 'react-native';
import OrderTransportCell from './OrderTransportEditCell'
import DateTimePicker from '../../components/DateTime';
import CustomAlert from '../../components/CustomAlert';
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
            key: "Detail",
        }
    };

    componentDidMount() {
        this.requestData();
    }

    goBack() {
        if (objectNotNull(appOrderVC)) {
            appOrderVC.reloadSubOrderingVC(false);
        }
        if (objectNotNull(this.props.navigation.state.params.callBack)) {
            this.props.navigation.state.params.callBack(this.state.key);
        }
        this.props.navigation.goBack('Main');
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
        this.refEditLastAlert.hide();
        let {item ,index} = info;
        if (!objectNotNull(item.update_time)) {
            this.refToast.show("请设置状态对应的时间");
        }
        else if (stringIsEmpty(item.remark)) {
            this.refToast.show("请输入货品状态描述");
        }
        else {
            let translist = this.state.detailInfo.translist;
            let last = translist.indexOf(info.item) === (translist.length - 1);

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
                            if (last) {
                                PublicAlert('本航次已结束', '',
                                    [{text:"确定", onPress:this.goBack.bind(this)}]
                                );
                            }
                            else {
                                this.requestRecommend(true);
                            }
                        }
                    },(error)=>{
                        this.refIndicator.hide();
                        this.refToast.show(error);
                    });
        }
    };

    onCellSelected = (info: Object) => {

    };

    onCellSubmitSelected = (info: Object) => {
        let translist = this.state.detailInfo.translist;
        if (translist.indexOf(info.item) === (translist.length - 1)) {
            this.refEditLastAlert.show({onSureBtnAction:this.submitInfoFunction.bind(this, info)});
        }
        else {
            this.submitInfoFunction(info);
        }
    };

    renderCell = (info: Object) => {
        let translist = this.state.detailInfo.translist;
        return (
            <OrderTransportCell
                info={info}
                onCellSelected={this.onCellSelected}
                onSubmitPress={this.onCellSubmitSelected}
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
                <CustomAlert ref={o => this.refEditLastAlert = o} title={"提交"} message={"请确认"} />
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
        fontWeight:appData.fontWeightSemiBold,
        textAlign:'center',
    },
    headerTimeText: {
        marginTop:5,
        fontSize:12,
        color:appData.appTextColor,
        fontWeight:appData.fontWeightSemiBold,
        textAlign:'center',
    }
});
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
import OrderTransportCell from './OrderTransportCell'

export default class OrderTransportVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "货运详情"
    });

    constructor(props){
        super(props);
        this.state = {
            detailInfo: this.props.navigation.state.params.info,
            refreshing: false,
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

    onCellSelected = (info: Object) => {

    };

    renderCell = (info: Object) => {
        let translist = this.state.detailInfo.translist;
        return (
            <OrderTransportCell
                info={info}
                onCellSelected={this.onCellSelected}
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
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import ShipCell from '../components/ShipCell'

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
        this.requestRecommend();
    }

    requestRecommend = async () => {
        let data = {page:0, state:2};
        NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_my_ship/', data)
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
    }

    onCellSelected = (info: Object) => {
        if (this.props.navigation.state.params.callBack !== null) {
            this.props.navigation.state.params.callBack(info.item);
        }
        this.props.navigation.goBack();
    }

    renderCell = (info: Object) => {
        return (
            <ShipCell
                info={info}
                onPress={this.onCellSelected}
                selected={false}
            />
        )
    }

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    }

    render() {
        return (
            <View style={appStyles.container}>
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataList}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
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
import React, { Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import SelectCell from './SelectCell'

export default class CustomSelect extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight : 10}}>确定</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props){
        super(props)
        this.state = {
            selectedList: this.props.navigation.state.params.selectedList,
            dataList: this.props.navigation.state.params.dataList,
            maxSelectCount:this.props.navigation.state.params.maxSelectCount,
            refreshing: false,
        }
    }

    _btnClick=()=> {
        if (this.state.selectedList.length === 0) {
            PublicAlert('请至少选择一项');
        }
        else {
            this.props.navigation.state.params.callBack(this.state.selectedList);
            this.props.navigation.goBack();
        }
    };
    componentDidMount() {
        this.props.navigation.setParams({clickParams:this._btnClick})
    }

    requestData = () => {
        this.setState({refreshing: true})
        this.requestRecommend()
    }

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
    }

    onCellSelected = (info: Object) => {
        if (this.state.maxSelectCount === 1) {
            this.state.selectedList = [info.item];
        }
        else {
            let index = this.state.selectedList.indexOf(info.item);
            if (index === -1) {
                if (this.state.selectedList.length >= this.state.maxSelectCount) {
                    PublicAlert('最多只能选择' + this.state.maxSelectCount + '项');
                }
                else {
                    this.state.selectedList.push(info.item);
                }
            }
            else {
                this.state.selectedList.splice(index, 1);
            }
        }
        this.forceUpdate();
    }


    renderCell = (info: Object) => {
        return (
            <SelectCell
                info={info}
                onPress={this.onCellSelected}
                selected={this.state.selectedList.indexOf(info.item) !== -1}
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
                    // onRefresh={this.requestData}
                    // refreshing={this.state.refreshing}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({

});


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
import {DURATION} from "react-native-easy-toast";
import px2dp from "../util";

export default class CustomSelect extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title
        });

    constructor(props){
        super(props)
        this.state = {
            selectedList: [2,3],
            dataList: [],
            refreshing: false,
        }
    }

    back =(state,goBack)=>{ //把属性传递过来，然后进行使用
        state.params.callBack('this is back data ') //回调传值
        goBack() //点击POP上一个页面得方法
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

    renderCell = (info: Object) => {
        return (
            <SelectCell
                info={info}
                onPress={this.onCellSelected}
                selected={this.state.selectedList.indexOf(info.item) !== -1}
            />
        )
    }

    onCellSelected = (info: Object) => {
        let index = this.state.selectedList.indexOf(info.item);
        if (index === -1) {
            this.state.selectedList.push(info.item);
        }
        else {
            this.state.selectedList.splice(index, 1);
        }
        this.forceUpdate();
    }

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    }

    render() {
        const {navigate,state,goBack,} = this.props.navigation;

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

});


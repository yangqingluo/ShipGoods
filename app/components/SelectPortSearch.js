import React, { Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    SectionList,
    Dimensions,
} from 'react-native';
import PortSectionCell from './PortSectionCell'
import PortFirstCell from './PortFirstCell'


export default class SelectPortSecond extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: navigation.state.params.title,
        });

    constructor(props){
        super(props);
        this.state = {
            key: this.props.navigation.state.params.key,
            selectedList: this.props.navigation.state.params.selectedList || [],
            dataList: this.props.navigation.state.params.dataList,
            maxSelectCount:this.props.navigation.state.params.maxSelectCount,
            refreshing: false,
            selectedSection: -1,
        }
    }

    _btnClick=()=> {

    };

    componentDidMount() {
        // this.props.navigation.setParams({clickParams:this._btnClick});
    }

    onCellSelected = (info: Object) => {
        this.props.navigation.state.params.callBack(this.state.key, info.item);
        this.props.navigation.goBack('GoBackSkip');

        // if (this.state.maxSelectCount === 1) {
        //     this.state.selectedList = [info.item];
        // }
        // else {
        //     let index = this.state.selectedList.indexOf(info.item);
        //     if (index === -1) {
        //         if (this.state.selectedList.length >= this.state.maxSelectCount) {
        //             PublicAlert('最多只能选择' + this.state.maxSelectCount + '项');
        //         }
        //         else {
        //             this.state.selectedList.push(info.item);
        //         }
        //     }
        //     else {
        //         this.state.selectedList.splice(index, 1);
        //     }
        // }
        // this.forceUpdate();

    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    renderCell = (info) => {
        return (
            <PortFirstCell
                info={info}
                onCellSelected={this.onCellSelected}
                isSecond={true}
                selected={(this.state.selectedList.indexOf(info.item) !== -1)}
            />
        )
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    renderItem={this.renderCell}
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录</Text></View>}
                    // ListFooterComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录尾部</Text></View>}
                />
            </View>
        );
    }
}
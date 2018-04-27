import React, { Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    FlatList,
    SectionList,
    Dimensions,
} from 'react-native';
import SelectCell from './SelectCell'


export default class CustomSectionSelect extends Component {
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
        this.props.navigation.goBack();
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this._btnClick})
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

    _renderItem = (info) => {
        let txt = '  ' + info.item.title;
        return <Text
            style={{ height: 60, textAlignVertical: 'center', backgroundColor: "#ffffff", color: '#5C5C5C', fontSize: 15 }}>{txt}</Text>
    }

    _sectionComp = (info) => {
        let txt = info.section.key;
        return <Text
            style={{ height: 50, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#9CEBBC', color: 'white', fontSize: 30 }}>{txt}</Text>
    }

    render() {
        let sections = [
            {key: "A", data: [{title: "阿童木"}, {title: "阿玛尼"}, {title: "爱多多"}]},
            {key: "B", data: [{title: "表哥"}, {title: "贝贝"}, {title: "表弟"}, {title: "表姐"}, {title: "表叔"}]},
            {key: "C", data: []},
            {key: "W", data: [{title: "王磊"}, {title: "王者荣耀"}, {title: "往事不能回味"}, {title: "王小磊"}, {title: "王中磊"}, {title: "王大磊"}]
            },
        ];

        return (
            <View style={{flex: 1}}>
                <SectionList
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    sections={sections}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录</Text></View>}
                    // ListFooterComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录尾部</Text></View>}
                />
            </View>
        );
    }
}
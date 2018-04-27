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

        }
    }

    _btnClick=()=> {
        this.props.navigation.goBack();
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this._btnClick})
    }

    _renderItem = (info) => {
        var txt = '  ' + info.item.title;
        return <Text
            style={{ height: 60, textAlignVertical: 'center', backgroundColor: "#ffffff", color: '#5C5C5C', fontSize: 15 }}>{txt}</Text>
    }

    _sectionComp = (info) => {
        var txt = info.section.key;
        return <Text
            style={{ height: 50, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#9CEBBC', color: 'white', fontSize: 30 }}>{txt}</Text>
    }

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    }

    render() {
        var sections = [
            { key: "A", data: [{ title: "阿童木" }, { title: "阿玛尼" }, { title: "爱多多" }] },
            { key: "B", data: [{ title: "表哥" }, { title: "贝贝" }, { title: "表弟" }, { title: "表姐" }, { title: "表叔" }] },
            { key: "C", data: [{ title: "成吉思汗" }, { title: "超市快递" }] },
            { key: "W", data: [{ title: "王磊" }, { title: "王者荣耀" }, { title: "往事不能回味" },{ title: "王小磊" }, { title: "王中磊" }, { title: "王大磊" }] },
        ];

        return (
            <View style={{ flex: 1 }}>
                <SectionList
                    keyExtractor={this.keyExtractor}
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    sections={sections}
                    ItemSeparatorComponent={() => <View><Text/></View>}
                    ListHeaderComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录</Text></View>}
                    ListFooterComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录尾部</Text></View>}
                />
            </View>
        );
    }
}
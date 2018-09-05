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
import SectionCell from './SectionCell'
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
            selectedSection: -1,
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
        this.props.navigation.setParams({clickParams:this._btnClick});
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

    onSectionSelected = (info: Object) => {
        if (this.state.selectedSection === info.section.sectionIndex) {
            this.setState({
                selectedSection : -1,
            })
        }
        else {
            this.setState({
                selectedSection : info.section.sectionIndex,
            })
        }
    }

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    }

    renderCell = (info) => {
        return (
            <SelectCell
                info={info}
                onCellSelected={this.onCellSelected}
                selected={(this.state.selectedList.indexOf(info.item) !== -1)}
            />
        )
    }

    renderSectionHeader = (info) => {
        return (
            <SectionCell
                info={info}
                onCellSelected={this.onSectionSelected}
                selected={info.section.sectionIndex === this.state.selectedSection}
            />
        )
    }
    // _sectionComp = (info) => {
    //     let txt = info.section.goods_name;
    //     return <Text
    //         style={{ height: 50, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#9CEBBC', color: 'white', fontSize: 30 }}>{txt}</Text>
    // }

    render() {
        let sectionData = this.state.dataList.map(
            (info, index) => {
                return {
                    goods_id: info.goods_id,
                    goods_name: info.goods_name,
                    sectionIndex: index,
                    data: (this.state.selectedSection === index ?
                        (info.child.length ? info.child[0] : []) :
                        []),
                };
            }
        );

        return (
            <View style={{flex: 1}}>
                <SectionList
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderCell}
                    sections={sectionData}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={global.renderSeparator}
                    // ListHeaderComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录</Text></View>}
                    // ListFooterComponent={() => <View style={{ backgroundColor: '#25B960', alignItems: 'center', height: 30 }}><Text style={{ fontSize: 18, color: '#ffffff' }}>通讯录尾部</Text></View>}
                />
            </View>
        );
    }
}
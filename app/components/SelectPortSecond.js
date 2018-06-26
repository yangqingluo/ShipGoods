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
import PortSectionCell from './PortSectionCell'
import PortFirstCell from './PortFirstCell'


export default class SelectPortSecond extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
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

    onSectionSelected = (info: Object) => {
        // if (this.state.selectedSection === info.section.sectionIndex) {
        //     this.setState({
        //         selectedSection : -1,
        //     })
        // }
        // else {
        //     this.setState({
        //         selectedSection : info.section.sectionIndex,
        //     })
        // }
    };

    keyExtractor = (item: Object, index: number) => {
        return '' + index;
    };

    renderCell = (info) => {
        return (
            <PortFirstCell
                info={info}
                onPress={this.onCellSelected}
                isSecond={true}
                selected={(this.state.selectedList.indexOf(info.item) !== -1)}
            />
        )
    };

    renderSectionHeader = (info) => {
        return (
            <PortSectionCell
                info={info}
                onPress={this.onSectionSelected}
                selected={info.section.sectionIndex === this.state.selectedSection}
            />
        )
    };
    // _sectionComp = (info) => {
    //     let txt = info.section.goods_name;
    //     return <Text
    //         style={{ height: 50, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#9CEBBC', color: 'white', fontSize: 30 }}>{txt}</Text>
    // }

    render() {
        let sectionData = this.state.dataList.map(
            (info, index) => {
                return {
                    port_id: info.port_id,
                    port_name: info.port_name,
                    sectionIndex: index,
                    data: (info.child.length ? info.child[0] : []),
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
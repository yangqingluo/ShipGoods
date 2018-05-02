import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from './DateTime/index';
import px2dp from "../util";

export default class SelectEmptyTimeVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight : 12, color: appData.appBlueColor}}>确定</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props) {
        super(props);
        this.state={
            date: new Date(),
            delay: 0,
        };
        this.picker = null;

        this.delayTypes = ['取消', '1', '2', '3', '4', '5'];
    }

    sureBtnAction=()=> {

    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this.sureBtnAction});
    }

    showDatePicker() {
        let date = this.state.date;
        this.picker.showDatePicker(date, (d)=>{
            this.setState({date: d});
        });
    }

    showTimePicker() {
        let date = this.state.date;
        this.picker.showTimePicker(date, (d)=>{
            this.setState({date: d});
        });
    }

    showDateTimePicker() {
        let date = this.state.date;
        this.picker.showDateTimePicker(date, (d)=>{
            this.setState({date: d});
        });
    }

    showDelayPicker() {
        this.delayTypeActionSheet.show();
    }

    onSelectDelayType(index) {
        if (index > 0) {
            this.setState({
                delay: index
            });
        }
    }

    render() {
        let date = this.state.date;
        return (
            <View style={appStyles.container}>
                <ActionSheet
                    ref={o => this.delayTypeActionSheet = o}
                    title={'请选择延迟天数'}
                    options={this.delayTypes}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={1}
                    onPress={this.onSelectDelayType.bind(this)}
                />
                <ScrollView
                    style={styles.scrollView}
                >
                    <View style={{height:px2dp(2)}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showDatePicker()}>
                        <Text style={styles.text}>
                            {date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay()}
                        </Text>
                    </TouchableOpacity>
                    <View style={{height:px2dp(2)}} />
                    <TouchableOpacity
                        style = {styles.cell}
                        onPress={()=>this.showDelayPicker()}>
                        <Text style={styles.text}>
                            {'船期前后延迟 + ' + this.state.delay + ' 天'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePicker title="请选择时间" ref={(picker)=>{this.picker=picker}} />
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    cell: {
        flex: 1,
        backgroundColor: '#fff',
        minHeight: px2dp(50),
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: 'center',
        color: appData.appBlueColor,
        fontSize: px2dp(16),
    }
});

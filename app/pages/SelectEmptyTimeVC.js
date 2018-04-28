import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from '../components/DateTime';

export default class MessageVC extends Component {
    static navigationOptions = {
        headerTitle: '选择时间',
    };
    constructor(props) {
        super(props);
        this.state={
            date: new Date()
        };
        this.picker = null;
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
    render() {
        return (
            <View style={appStyles.container}>
                <Text style={{textAlign: 'center'}}>
                    {this.state.date.toString()}
                </Text>
                <View style={{height:40}} />
                <TouchableOpacity
                    onPress={()=>this.showDatePicker()}>
                    <Text>Show Date</Text>
                </TouchableOpacity>
                <View style={{height:40}} />
                <TouchableOpacity
                    onPress={()=>this.showTimePicker()}>
                    <Text>Show Time</Text>
                </TouchableOpacity>
                <View style={{height:40}} />
                <TouchableOpacity
                    onPress={()=>this.showDateTimePicker()}>
                    <Text>Show DateTime</Text>
                </TouchableOpacity>
                <DateTimePicker title="请选择时间" ref={(picker)=>{this.picker=picker}} />
            </View>
        );
    }
}
const styles = StyleSheet.create({

});

'use strict'

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import px2dp from "../util";

let radius = px2dp(20);
export default class StarScore extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            totalScore: 5, // 总分值
            currentScore: this.props.currentScore > 5 ? 5 : this.props.currentScore, // 分值
            itemEdge: this.props.itemEdge
        };
    }

    render() {
        return (
            <View style={[this.props.style, {flexDirection: 'row', height: radius}]}>
                {this._renderBody()}
            </View>
        );
    }

    _renderBody() {
        let images = [];
        for (let i = 1; i <= this.state.totalScore; i++) {
            let currentCount = i;
            images.push(
                <View key={"i" + i}>
                    <TouchableOpacity onPress={(i) => {this._score(currentCount)}}>
                        <Image source={require('../images/icon_star_h.png')} style={{width: radius, height: radius, marginLeft:this.state.itemEdge}}/>
                        {this._renderYellowStart(i)}
                    </TouchableOpacity>
                </View>
            );
        }
        return images;
    }

    _renderYellowStart(count) {
        if (count <= this.state.currentScore) {
            return (
                <Image source={require('../images/icon_star.png')} style={{width: radius, height: radius, marginLeft:this.state.itemEdge, position: 'absolute'}}/>
            );
        }

        let scale = count - this.state.currentScore;
        if (scale > 0 && scale < 1) {
            return (
                <View style={{width: (1 - scale) * radius, height: radius, position:"absolute", marginLeft:this.state.itemEdge, top:0, overflow:"hidden"}}>
                    <Image source={require('../images/icon_star.png')} style={{height: radius, width: radius}}/>
                </View>
            );
        }
    }

    _score(i) {
        // this.setState({
        //     currentScore: i
        // });
        // this.props.selectIndex(i);
    }

}
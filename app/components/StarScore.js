'use strict'

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

//TODO 在某个组件内显示时currentScore只能初始化一次，多次的话无效
export default class StarScore extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            radius : this.props.radius || 20,
            totalScore: 5, // 总分值
            currentScore: objectNotNull(this.props.currentScore) ? Math.min(5, Math.max(0, this.props.currentScore)) : 5, // 分值
            itemEdge: this.props.itemEdge
        };
    }

    render() {
        let {radius} = this.state;
        return (
            <View style={[this.props.style, {flexDirection: 'row', height: radius}]}>
                {this._renderBody()}
            </View>
        );
    }

    _renderBody() {
        let {radius} = this.state;
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
        let {radius} = this.state;
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
        if (this.props.enabled) {
            this.setState({
                currentScore: i,
            });
            this.props.selectIndex(this.props.tag, i);
        }
    }

}
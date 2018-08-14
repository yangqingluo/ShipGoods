import React,{Component} from 'react';
import {Image, Platform} from 'react-native';

export default class TabBarItem extends Component {
    render() {
        let radius = 25;
        if (this.props.isRelease) {
            radius = Platform.OS === 'ios' ? 60 : 40;
        }
        return(
            <Image source={ this.props.normalImage }
                   style={ this.props.isRelease ?
                       {
                           position: 'absolute',
                           overflow: 'visible',
                           bottom: Platform.OS === 'ios' ? 5 : -3,
                           width: radius,
                           height:radius,
                           shadowColor: '#000',
                           shadowOffset: {
                               width: 0,
                               height: -1
                           },
                           // shadowRadius: 10,
                           shadowOpacity: 0.1,
                           elevation: 4,
                       }
                   :
                       { tintColor:this.props.tintColor, width:radius, height:radius}}
            />
        )
    }
}
import React,{Component} from 'react';
import {Image, Platform} from 'react-native';

export default class TabBarItem extends Component {
    render() {
        let radius = 25;
        if (this.props.isRelease) {
            radius = Platform.OS === 'ios' ? 60 : 40;
        }
        return(
            <Image source={ this.props.focused ? (this.props.selectedImage || this.props.normalImage) : this.props.normalImage }
                   style={ this.props.isRelease ?
                       { tintColor:this.props.tintColor,
                           position: 'absolute',
                           overflow: 'visible',
                           bottom: Platform.OS === 'ios' ? 5 : -3,
                           width: radius,
                           height:radius,
                       }
                   :
                       { tintColor:this.props.tintColor, width:radius,height:radius}}
            />
        )
    }
}
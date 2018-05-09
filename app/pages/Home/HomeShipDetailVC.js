import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';
import DashLine from '../../components/DashLine'


class RightHeader extends Component {
    static props = {
        favor: PropTypes.BOOL,
    };

    // static defaultProps = {
    //     favor: false,
    // };

    constructor(props) {
        super(props)
    }

    onFavorBtnPress = () => {

    };

    render() {
        let {favor} = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity onPress={this.onFavorBtnPress} style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                    <Image source={require('../../images/navbar_icon_like.png')} style={{tintColor: favor ? 'red' : null, width: 22, height: 19, marginRight : 10, marginLeft : 10, resizeMode: "cover"}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '船舶详情',
        headerRight: <RightHeader navigation={navigation} favor={navigation.state.params.favor}/>,
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
        };
    }

    componentDidMount() {

    }

    testBtnAction() {
        // 组件渲染之后重设props
        this.props.navigation.setParams({
            headerTitle: '自定义Header',
            favor: true,
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                <TouchableOpacity style={{ height:40, backgroundColor:'green', justifyContent: 'center'}}
                                  onPress={this.testBtnAction.bind(this)}>
                    <Text>{"我是按钮"}</Text>
                </TouchableOpacity>
                <View style={{height: 40}}/>
                <View style={{backgroundColor: 'yellow', height: 20, borderStyle: 'dashed', borderColor: 'red', borderBottomWidth: 1,
                    // textDecorationLine:'underline',//underline 文字的下划线 line-through 中间横穿的线
                    // textDecorationStyle:'dashed', //double 双实线 solid 实线 dotted 点线 dashed 虚线
                    }}>
                </View>
                <View style={{height: 40}}/>
                <View style={{backgroundColor: 'white', height: 1, marginLeft:20, marginRight:20}}>
                    <DashLine backgroundColor={'red'} len={(screenWidth - 40)/ 4}/>
                </View>
            </View> );
    }
}
const styles = StyleSheet.create({

});
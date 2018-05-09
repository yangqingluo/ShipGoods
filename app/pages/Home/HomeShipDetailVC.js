import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';

class RightHeader extends Component {
    static propTypes = {
        isFavor: Boolean,
    };

    constructor(props) {
        super(props)
    }

    onFavorBtnPress = () => {

    };

    render() {
        let {isFavor} = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity onPress={this.onFavorBtnPress} style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                    <Image source={require('../../images/navbar_icon_like.png')} style={{tintColor: isFavor ? 'red' : null, width: 22, height: 19, marginRight : 10, marginLeft : 10, resizeMode: "cover"}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '船舶详情',
        headerRight: <RightHeader navigation={navigation} isFavor={navigation.state.params.isFavor}/>,
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
            isFavor: true,
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
            </View> );
    }
}
const styles = StyleSheet.create({

});
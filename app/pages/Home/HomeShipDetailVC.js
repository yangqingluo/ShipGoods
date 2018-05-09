import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

class RightHeader extends Component {
    static propTypes = {
        title: String,
    };

    constructor(props) {
        super(props)
    }

    onFavorBtnPress = () => {

    };

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity onPress={this.onFavorBtnPress} >
                    <Text style={{marginRight : 10}}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class HomeShipDetailVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle,
        headerRight: <RightHeader navigation={navigation} title={navigation.state.params.rightTitle}/>,
    });

    constructor(props) {
        super(props);
        this.state={
            info: this.props.navigation.state.params.info,
        };
    }

    componentDidMount() {
        // 组件渲染之后重设props
        this.props.navigation.setParams({
            headerTitle: '船舶详情',
        });
        PublicAlert(JSON.stringify(this.props.navigation));
    }

    testBtnAction() {
        // 组件渲染之后重设props
        this.props.navigation.setParams({
            headerTitle: '自定义Header',
            rightTitle: '收藏',
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
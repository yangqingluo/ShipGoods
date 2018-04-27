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
import SelectCell from './SelectCell'


export default class CustomSectionSelect extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: navigation.state.params.title,
            headerRight: <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={navigation.state.params.clickParams}
                >
                    <Text style={{marginRight : 10}}>确定</Text>
                </TouchableOpacity>
            </View>,
        });

    constructor(props){
        super(props)
        this.state = {

        }
    }

    _btnClick=()=> {
        this.props.navigation.goBack();
    };

    componentDidMount() {
        this.props.navigation.setParams({clickParams:this._btnClick})
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>

            </View>
        );
    }
}
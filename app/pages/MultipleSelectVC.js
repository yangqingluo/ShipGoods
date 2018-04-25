import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
// import CheckboxList from '../components/checkboxlist/CheckBoxListVC';

export default class MultipleSelectVC extends Component {
    static navigationOptions = {
        headerTitle: '请选择',
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={appStyles.container}>
                {/*<CheckboxList*/}
                    {/*options={[*/}
                        {/*{label:'Lorem ipsum dolor sit',value:'A'},*/}
                        {/*{label:'Lorem ipsum',value:'B'},*/}
                        {/*{label:'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',value:'C'},*/}
                        {/*{label:'Lorem ipsum dolor sit amet, consetetur',value:'D'}*/}
                    {/*]}*/}
                    {/*maxSelectedOptions={1}*/}
                    {/*selectedOptions={['A','C']}*/}
                    {/*onSelection={(option)=>alert(option + ' was selected!')}*/}
                {/*/>*/}
            </View>
        );
    }
}
const styles = StyleSheet.create({

});
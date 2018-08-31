'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {
    PickerIOS,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-root-modal';
import PickerAndroid from './PickerAndroid';
let Picker = isIOS() ? PickerIOS : PickerAndroid;

export default class ActionPicker extends Component {
    static propTypes = {
        cancelText: PropTypes.string,
        okText:  PropTypes.string,
        title: PropTypes.string,
    };

    static defaultProps = {
        cancelText: '取消',
        okText: '确定'
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            choice: null,
        };
        this.callback = ()=>{};
        this.options = this.props.options;
    }

    show(choice, callback) {
        this.callback = callback;

        this.setState({
            visible: true,
            choice: choice,
        });
    }

    onClose() {
        this.setState({
            visible: false
        });
    }

    onComplete() {
        this.setState({
            visible: false
        });
        this.callback(this.state.choice, this.options.indexOf(this.state.choice));
    }

    onValueChange(choice) {
        this.setState({choice: choice});
    }

    render() {
        const styles = { ..._styles, ...this.props.styles};
        return this.state.visible &&
            (
                <Modal
                    style={styles.container}
                    animationType={"slide"}
                    visible={this.state.visible}
                    transparent={true}
                    onRequestClose={() =>{}}>
                    <View style={styles.modalContainer}>
                        {/*<TouchableOpacity*/}
                        {/*style={{flex: 1}}*/}
                        {/*activeOpacity={1}*/}
                        {/*onPress={()=>this.onClose()} />*/}
                        <View style={styles.modal}>
                            <View style={{height:0.5, backgroundColor: appData.appSeparatorColor}}/>
                            <View style={styles.modalTitleContainer}>
                                <TouchableOpacity onPress={()=>this.onClose()} style={[styles.modalTitleTouch, {left: 5}]}>
                                    <Text style={styles.modalButtonTitle}>{this.props.cancelText}</Text>
                                </TouchableOpacity>
                                {this.props.title.length ? <Text style={styles.modalTitle}>{this.props.title}</Text> : null}
                                <TouchableOpacity style={[styles.modalTitleTouch, {right: 5}]} onPress={()=>this.onComplete()}>
                                    <Text style={styles.modalButtonTitle}>{this.props.okText}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height:0.5, backgroundColor: appData.appSeparatorColor}}/>
                            <Picker
                                style={styles.picker}
                                itemStyle={isIOS() ? styles.itemPicker : {}}
                                selectedValue={this.state.choice}
                                onValueChange={this.onValueChange.bind(this)}>
                                {this.options.map((aOption) =>
                                    <Picker.Item label={aOption}
                                                 value={aOption}
                                                 key={aOption}
                                    /> )}
                            </Picker>
                        </View>
                    </View>
                </Modal>
            );
    }
}

const _styles = StyleSheet.create({
    container:{
        width:screenWidth,
        height:screenHeight,
        backgroundColor:'rgba(0, 0, 0, 0.1)',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
    modal: {
        position:'absolute',
        width: screenWidth,
        bottom: 0,
        borderRadius: 3,
        backgroundColor: 'white',
    },
    modalTitleContainer: {
        height: 44,
        justifyContent: 'center',
    },
    modalTitleTouch: {
        position: 'absolute',
        minWidth: 60,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonTitle: {
        fontSize: 16,
        color: appData.appBlueColor,
        // alignSelf:'center',
    },
    modalTitle: {
        fontSize:14,
        alignSelf:'center',
        color: appData.appLightGrayColor,
    },
    picker:{
        width: screenWidth,
        minHeight: 200,
    },
    itemPicker:{
        fontSize: 24,
        color: appData.appTextColor,
    }
});
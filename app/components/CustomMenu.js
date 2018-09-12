'use strict';

import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-root-modal';
import Menu from '../pages/Home/HomeMenu';

export default class CustomMenu extends PureComponent {
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

    show(callback) {
        if (objectNotNull(callback)) {
            this.callback = callback;
        }

        this.setState({
            visible: true,
        });
    }

    hide() {
        this.setState({
            visible:false
        });
    }

    onMenuItemSelected(item) {
        appHomeVC.onMenuItemSelected(item);
    }

    render() {
        const styles = { ..._styles, ...this.props.styles};
        return this.state.visible &&
            (
                <View
                    style={styles.container}
                    animationType={"slide"}
                    visible={this.state.visible}
                    transparent={true}
                    >
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={()=>this.hide()} />
                    <View style={styles.modal}>
                        <Menu ref={o => this.rightMenu = o} onItemSelected={this.onMenuItemSelected}/>
                    </View>
                </View>
            );
    }
}

const _styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:screenWidth,
        height:screenHeight - appTop,
        marginTop: appTop,
        backgroundColor:'rgba(0, 0, 0, 0.2)',
    },
    modalContainer: {
        flex: 1,
    },
    modal: {
        position:'absolute',
        width: 0.6 * screenWidth,
        height: screenHeight - appTop,
        top: 0,
        right: 0,
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
        minHeight: 220,
    },
    itemPicker:{
        fontSize: 24,
        fontWeight: appData.fontWeightLight,
        color: appData.appTextColor,
    }
});
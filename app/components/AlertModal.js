import React,{Component} from 'react'
import PropTypes from 'prop-types';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    TextInput,
    InteractionManager
} from 'react-native';
import Modal from 'react-native-root-modal';


export default class AlertModal extends Component{

    constructor(props){
        super(props);
        this.state = { visible: this.props.visible };
    }

    componentWillReceiveProps(props) {
        this.setState({ visible: props.visible });
    }

    close=()=>{
        requestAnimationFrame(()=>{
            if(this.props.close) {
                this.props.close();
            }
            else {
                this.setState({ visible: false });
            }
        })
    };

    renderContent=()=>{
        return (this.props.contentView);
    };

    render(){
        return(
            <Modal
                animationType={this.props.animation?this.props.animation:'slide'}//进场动画 fade
                onRequestClose={() => this.close()}
                visible={this.state.visible}//是否可见
                transparent={true} //背景透明
            >
                <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={this.close}//点击灰色区域消失
                >
                    <View style={[styles.container,this.props.customerlayout]}>
                        {this.renderContent()}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent:'center',
        alignItems:'center'
    },
    background: {
        backgroundColor: appData.appGrayColor,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
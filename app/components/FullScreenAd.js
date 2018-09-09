import React, {PureComponent} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-root-modal';

export default class FullScreenAd extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            animationType:'fade',
            modalVisible: false,
            transparent: true,
            title:'提示',
            message: '',
            source: null,
        }
    }

    show(options) {
        if(options) {
            let animationType=options.animationType===undefined?'fade':options.animationType;
            let title=options.title===undefined?'提示':options.title;
            let message=options.message===undefined?'':options.message;
            let source = options.source===undefined ? null : options.source;
            if(!this.state.modalVisible){
                this.setState({
                    title:title,
                    message:message,
                    animationType:animationType,
                    source: source,
                    modalVisible: true,
                });
            }
        }
        else {
            this.setState({
                modalVisible: true
            });
        }
    }

    hide() {
        this.setState({
            modalVisible:false
        });
    }

    onRequestClose() {

    }

    render() {
        let {message, source} = this.state;
        return(
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                style={styles.modal}
                // onRequestClose={this.onRequestClose.bind(this)}
            >
                <View style={styles.centerContainer}>
                    <Image source={source} style={styles.image} />
                </View>
                <appFont.Ionicons style={{marginTop: 40}} name="ios-close-circle" size={36}
                                  color= {appData.appGrayColor}
                onPress={() =>{
                    this.hide();
                }}/>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    centerContainer: {
        marginTop: -40,
        borderRadius:10,
        alignItems:'center',
        overflow: "hidden",
    },
    image: {
        width: 0.7 * screenWidth,
        height: 0.7 * screenWidth * (636.0 / 479.0),
        resizeMode: "cover",
    },
});
import React,{Component} from 'react'
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';

export default class MyBottomSheet extends Component{
    static propTypes={
        items:PropTypes.array,
        itemStyle:PropTypes.object,
        actionTitleStyle:PropTypes.object,
        itemTitleStyle:PropTypes.object,
        modalTitle:PropTypes.string,
    };
    static defaultProps={
        items:[],
        itemStyle:{},
        actionTitleStyle:{},
        itemTitleStyle:{},
        modalTitle:''
    };

    constructor(props){
        super(props);
        this.state = {
            modalVisible:false,
        }
    }

    showModal(){
        this.setState({modalVisible:true})
    }

    cancelModal(){
        this.setState({modalVisible:false})
    }

    render(){
        let actionSheets = this.props.items.map((item,i)=>{
            return(
                <TouchableOpacity
                    key={i}
                    style={[styles.actionItem,this.props.itemStyle]}
                    onPress={item.click}>
                    <Text style={[styles.actionItemTitle,this.props.itemTitleStyle]}
                    >{item.title}</Text>
                </TouchableOpacity>
            )
        });


        return <Modal animationType="slide"
                      visible={this.state.modalVisible}
                      transparent={true}
                      onRequestClose={()=>this.setState({modalVisible:false})}
        >
            <View style={styles.modalStyle}>
                <View style={styles.subView}>
                    <View style={styles.itemContainer}>
                        <Text style={[styles.actionTitle,this.props.actionTitleStyle]}
                        >{this.props.modalTitle}</Text>
                        {actionSheets}
                    </View>
                    <View style={[styles.itemContainer]}>
                        <TouchableOpacity
                            style={[styles.actionItem,this.props.itemStyle,{borderTopWidth:0}]}
                            onPress={()=>this.setState({modalVisible:false})}>
                            <Text style={[styles.actionItemTitle,this.props.itemTitleStyle]}>取消</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    }
}
const styles = StyleSheet.create({
    modalStyle:{
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent:'flex-end',
        alignItems:'center',
        flex:1
    },
    subView:{
        justifyContent:'flex-end',
        alignItems:'center',
        alignSelf:'stretch',
        width:screenWidth,
    },
    itemContainer:{
        marginLeft:15,
        marginRight:15,
        marginBottom:15,
        borderRadius:6,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
    },
    actionItem:{
        width:screenWidth-30,
        height:45,
        alignItems:'center',
        justifyContent:'center',
        borderTopColor:'#cccccc',
        borderTopWidth:0.5,
    },
    actionTitle:{
        fontSize:13,
        color:'#808080',
        textAlign:'center',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
    },
    actionItemTitle:{
        fontSize:16,
        color:'#444444',
        textAlign:'center',
    },
});
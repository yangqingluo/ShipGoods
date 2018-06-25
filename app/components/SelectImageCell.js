import React, {PureComponent} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

// type Props = {
//     info: Object,
//     onPress: Function,
//     onDelPress: Function,
//     last: Boolean,
// };

export default class SelectImageCell extends PureComponent<Props> {
    constructor(props){
        super(props)
    };

    render() {
        let {info, last} = this.props;
        return (
            <TouchableOpacity onPress={() => this.props.onPress(info)}>
                <View style={styles.container}>
                    <Image source={last ? require("../images/add_picture.png") : ({uri:appUrl + info.item})} style={styles.image}/>
                    {last ? null : <TouchableOpacity style={styles.delContainer} onPress={() => this.props.onDelPress(info)}>
                        <Image source={require("../images/cell_delete.png")} style={styles.imageDel}/>
                    </TouchableOpacity>}
                </View>
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 5,
        // paddingHorizontal: 5,
        height: 70,
        width: 70,
    },
    image: {
        // flex: 1,
        margin:10,
        borderRadius: 4,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "stretch",
    },
    delContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 0,
        right: 0,
    },
    imageDel: {
        flex:1,
        width: 20,
        height: 20,
        resizeMode: "stretch",
    },
});
import React, {PureComponent } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'

type Props = {
    info: Object,
    onCellSelected: Function,
}

export default class HomeReplyCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let item = this.props.info.item;
        let {reply_type} = item;
        let replyTitle = "我的回复：";
        if (userData.usertype !== reply_type) {
            replyTitle = isShipOwner() ? "货主回复：" : "船东回复：";
        }
        return (
            <View>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={{flex:1, fontSize:14}}>
                        <Text style={{color:"#ff5700a6"}}>{replyTitle}</Text>
                        <Text style={{color:"#ff9d69"}}>{item.content}</Text>
                    </Text>
                    <Text style={styles.rightTextContainer}>{createTimeFormat(item.reply_time, "yyyy-MM-dd HH:mm")}</Text>
                </TouchableOpacity>
                <View style={{height: 4}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        minHeight:20,
        borderRadius:4,
        paddingHorizontal:5,
        backgroundColor:'#5cb8ff33',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },
    rightTextContainer: {
        width:110,
        fontSize:12,
        color:"#a5a5a5",
        textAlign:"right"
    },
});


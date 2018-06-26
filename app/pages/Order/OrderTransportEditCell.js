import React, { Component } from 'react';

import {
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native'
import VDashLine from '../../components/VDashLine'
import CustomInput from '../../components/CustomInput'
import DateTimePicker from '../../components/DateTime';

type Props = {
    info: Object,
    onPress: Function,
    onTimePress: Function,
    textInputChanged: Function,
}

export default class OrderTransportEditCell extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    textInputChanged = (text) => {
        // this.props.textInputChanged(text, this.props.info);
        this.props.info.item.remark = text;
    };

    onSubmitBtnAction () {
        this.props.onSubmitPress(this.props.info);
    }

    onTimeBtnAction() {
        // let date = new Date(parseInt(this.props.info.item.update_time) * 1000);
        this.refTimePicker.showDateTimePicker(null, (d)=>{
            this.props.info.item.update_time = Date.parse(d) * 0.001;
            this.forceUpdate();
        });
    }

    render() {
        let info = this.props.info.item;
        let {showLast, trans_state} = this.props;
        let passed = (parseInt(info.state) <= parseInt(trans_state));
        let editable = (parseInt(info.state) === parseInt(trans_state) + 1) || (parseInt(info.state) === parseInt(trans_state));
        let color = (passed || editable) ? appData.appBlueColor:appData.appGrayColor;
        let textColor = passed ? appData.appTextColor : "#8b8b8b";
        let stateText = getArrayTypesText(transportStateTypes, parseInt(info.state) - 1);

        let time = objectNotNull(info.update_time) ? info.update_time : info.create_time;
        // let timeText = objectNotNull(info.update_time) ? info.update_time : info.create_timetext;
        // let timeArray = timeText.split(" ");
        // if (timeArray.length === 2) {
        //     let dateString = timeArray[0].replace(/-/g, '/');
        //     time = new Date(dateString + " " + timeArray[1]).getTime() * 0.001;
        // }
        if (objectNotNull(info.update_time)) {
            time = info.update_time;
            textColor = appData.appTextColor;
        }
        else {
            textColor = "#8b8b8b";
        }

        const Icon = appFont["Ionicons"];
        return (
            <View style={[styles.cellContainer, {opacity: (passed || editable) ? 1.0 : 0.5}]}>
                <View style={styles.leftTime}>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={editable ? this.onTimeBtnAction.bind(this) : null}>
                        <Text style={{minHeight:22, fontSize:16, fontWeight:appData.appFontWeightMedium, color:textColor}}>
                            {createTimeFormat(time, "HH:mm")}
                        </Text>
                        <Text style={{marginTop:2, minHeight:17, fontSize:12, fontWeight:appData.appFontWeightMedium, color:textColor}}>
                            {createTimeFormat(time, "yyyy-MM-dd")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerLine}>
                    <Icon name={'ios-checkmark-circle'} size={22} color={color} />
                    {/*<Image source={require('../../images/Line.png')} style={{width: 1, height: 72, marginVertical: 2, resizeMode: "stretch"}} />*/}
                    <VDashLine backgroundColor={color} len={72 / appData.appDashWidth}/>
                    {showLast? <Icon name={'ios-checkmark-circle'} size={22} color={color} /> : null}
                </View>
                <View style={styles.rightContainer}>
                    <View style={{top: 5, left: 0, position: 'absolute', minWidth: 90, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", backgroundColor: appData.appBlueColor}}>
                        <Text style={{fontSize: 16, fontWeight: appData.appFontWeightMedium, color: "#fff" }}>
                            {stateText}
                        </Text>
                    </View>
                    {editable ?
                        <CustomInput style={styles.textContainer}
                                     multiline={true}
                                     placeholder={"请输入货品具体" + stateText + "状态"}
                                     onChangeText={this.textInputChanged.bind(this)}
                                     editable={editable}
                                     value={passed ? info.remark : null}
                        >
                        </CustomInput>
                    :
                        <Text style={styles.textContainer}>
                            {passed ? info.remark : null}
                        </Text>}
                </View>
                {editable ?
                    <TouchableOpacity style={styles.rightBtn} onPress={this.onSubmitBtnAction.bind(this)}>
                        <Text style={{fontSize:14, fontWeight:appData.appFontWeightMedium, color:appData.appBlueColor}}>
                            {passed ? "修改" : "提交"}
                        </Text>
                    </TouchableOpacity>
                : null}
                <DateTimePicker title="请选择时间" ref={o => this.refTimePicker = o} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        minHeight:120,
    },
    leftTime: {
        marginLeft:15,
        width: 75,
        justifyContent: "center",
        alignItems: "center",
    },
    centerLine: {
        width:22,
        alignItems: "center",
    },
    rightContainer: {
        flex:1,
        marginLeft:15,
        paddingRight:5,
        justifyContent: "center",
    },
    textContainer: {
        // minHeight:22,
        minWidth: 80,
        fontSize:16,
        fontWeight:appData.appFontWeightMedium,
        color:appData.appLightTextColor,
        justifyContent: "center",
        alignItems: "center",
    },
    rightBtn: {
        marginRight: 10,
        minHeight:30,
        justifyContent: "center",
    }
});


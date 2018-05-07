import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import px2dp from "../../util";
import AddAuthItem from '../../components/AddAuthItem'

export default class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            empty_port: null,//空船港
            empty_time: new Date(),//空船期
            empty_delay: 0,//空船延迟
        };
        this.config = (userData.usertype === '1') ?
            [
                {idKey:"empty_port", name:"空船港", disable:false, onPress:this.cellSelected.bind(this, "SelectEmptyPort")},
                {idKey:"empty_time",name:"承运时间", disable:false, subName:"324", onPress:this.cellSelected.bind(this, "SelectEmptyTime")},
            ]
            :
            [

            ];
    }

    cellSelected(key, data = {}){
        dismissKeyboard();
        if (key === "SelectEmptyPort") {
            this.toGoToPortsVC(key);
        }
        else if (key === "SelectEmptyTime") {
            this.props.navigation.navigate(
                "SelectEmptyTimeVC",
                {
                    title: '承运时间',
                    key: key,
                    date: this.state.empty_time,
                    delay: this.state.empty_delay,
                    callBack:this.callBackFromTimeVC.bind(this)
                });
        }
        else {
            PublicAlert(key);
        }
    }

    toGoToPortsVC(key) {
        if (appAllPortsFirst.length > 0) {
            this.props.navigation.navigate(
                "SelectPort",
                {
                    title: '选择港口',
                    dataList: appAllPortsFirst,
                    key: key,
                    // selectedList:this.state.downloadOilSelectedList,
                    callBack:this.callBackFromPortVC.bind(this)
                });
        }
        else {
            let data = {pid:'0', deep:0};
            NetUtil.post(appUrl + 'index.php/Mobile/Ship/get_all_port/', data)
                .then(
                    (result)=>{
                        if (result.code === 0) {
                            appAllPortsFirst = result.data;
                            this.toGoToPortsVC(key);
                        }
                        else {
                            this.setState({
                                refreshing: false,
                            })
                        }
                    },(error)=>{
                        this.setState({
                            refreshing: false,
                        })
                    });
        }
    }

    callBackFromPortVC(key, backData) {
        if (key === "SelectEmptyPort") {
            this.setState({
                empty_port: backData,
            })
        }
    }

    callBackFromTimeVC(key, backDate, backDelay) {
        if (key === "SelectEmptyTime") {
            this.setState({
                empty_time: backDate,
                empty_delay: backDelay,
            })
        }
        else if (key === "SelectLoadingTime") {
            this.setState({
                loading_time: backDate,
                loading_delay: backDelay,
            })
        }

    }

    renderSubNameForIndex(item, index) {
        if (item.idKey === 'empty_port' && this.state.empty_port !== null) {
            return this.state.empty_port.port_name;
        }
        else if (item.idKey === 'empty_time' && this.state.empty_time !== null) {
            return this.state.empty_time.Format("yyyy.MM.dd") + '±' + this.state.empty_delay + '天';
        }

        return '';
    }

    textInputChanged(text, key){

    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View>
                    <AddAuthItem key={i} {...item}
                                 subName = {this.renderSubNameForIndex(item, i)}
                                 noSeparator={true}
                                 callback={this.textInputChanged.bind(this)}>
                    </AddAuthItem>
                    <View style={{height: px2dp(5), backgroundColor: '#f3f6f9'}}/>
                </View>);
        })
    }

    render() {
        const {onItemSelected} = this.props;
        return (
            <View style={{flex: 1, borderLeftWidth: px2dp(0.5), borderLeftColor: appData.appBorderColor}}>
                <ScrollView scrollsToTop={false} style={styles.menu}>
                    {this._renderListItem()}
                </ScrollView>
                <View style={{height:px2dp(46), flexDirection: 'row', alignItems: "center"}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => onItemSelected('Cancel')}>
                        <View style={[styles.bottomButton, {backgroundColor: '#d8d8d8'}]}>
                            <Text style={[styles.bottomButtonText, {color: "#a9a9a9"}]}>{"取消"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => onItemSelected('Sure')}>
                        <View style={[styles.bottomButton, {backgroundColor: appData.appBlueColor}]}>
                            <Text style={[styles.bottomButtonText, {color: "#fff"}]}>{"确定"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

Menu.propTypes = {
    onItemSelected: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor: 'white',
    },
    bottomButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomButtonText: {
        fontSize: px2dp(18),
        fontWeight: '900',
    }
});
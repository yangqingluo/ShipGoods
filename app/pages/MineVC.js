import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import Item from '../components/Item'
import px2dp from '../util';
import Icon from 'react-native-vector-icons/Ionicons'

let {width, height} = Dimensions.get('window')


//顶部右边的图标，这段代码不可复用，但是可以复制修改使用。
class RightHeader extends Component {
    constructor(props) {
        super(props)
    }
    onLogoutBtnPress = () => {
        // PublicAlert(JSON.stringify(global.userData));
        // PublicAlert(global.userData.usertype);
        // 删除单个数据
        storage.remove({
            key: 'userData'
        });
        global.userData = null;

        this.props.navigation.dispatch(PublicResetAction('Login'));
    };
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={this.onLogoutBtnPress}
                >
                    <Text style={{marginRight : 10}}>登出</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class MineVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '我的',
        tabBarLabel: '我的',
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
        headerRight: <RightHeader navigation={navigation} />,
    });

    constructor(props){
        super(props)
        this.state = {
            isRefreshing: false
        }
        this.config = [
            {logo:require('../images/icon_back.png'), name:"我的发布", onPress:this.goPage.bind(this, "Detail")},
            {logo:require('../images/icon_chuand.png'), name:"我的船队", color:"#fc7b53", onPress:this.goPage.bind(this, "Detail")},
            {logo:require('../images/icon_colle.png'), name:"我的收藏", onPress:this.goPage.bind(this, "Detail")},
            {logo:require('../images/icon_share.png'), name:"分享到好友", subName:"", color:"#fc7b53", onPress:this.goPage.bind(this, "Detail")},
            {logo:require('../images/icon_share.png'), name:"一键客服", subName:"", color:"#94d94a", onPress:this.goPage.bind(this, "Detail")},
            {logo:require('../images/icon_s.png'), name:"更多设置", subName:"", color:"#ffc636", onPress:this.goPage.bind(this, "Detail")},
        ]
    }
    goPage(key, data = {}){
        const { navigate } = this.props.navigation;
        navigate('DetailVC', { title: '详情',des:'我是返回点击我' });
    }
    leftPress(){

    }
    rightPress(){

    }
    goProfile(){

    }
    componentDidMount(){
        // this._onRefresh()
    }
    _onRefresh(){
        // this.setState({isRefreshing: true});
        // setTimeout(() => {
        //     this.setState({isRefreshing: false});
        // }, 1500)
    }
    _renderListItem(){
        return this.config.map((item, i) => {
            // if(i%3==0){
            //     item.first = true
            // }
            return (<Item key={i} {...item}/>)
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#fff"
                            colors={['#ddd', '#0398ff']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <View style={{minHeight: height - 64 - px2dp(46), paddingBottom: 100, backgroundColor: "#f3f3f3"}}>
                        <TouchableWithoutFeedback onPress={this.goProfile.bind(this)}>
                            <View style={styles.userHead}>
                                <View style={{flex: 1,flexDirection: "row"}}>
                                    <Image source={require('../images/role.png')} style={{width: px2dp(60), height: px2dp(60), borderRadius: px2dp(30)}}/>
                                    <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                                        <Text style={{color: "#000", fontSize: px2dp(18)}}>{global.userData.username}</Text>
                                        <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                            <Icon name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff" />
                                            <Text style={{color: "#000", fontSize: 13, paddingLeft: 5}}>{global.userData.mobile}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Icon name="ios-arrow-forward-outline" size={px2dp(22)} color="#fff" />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.numbers}>
                            {/*<TouchableWithoutFeedback>*/}
                                {/*<View style={styles.numItem}>*/}
                                    {/*<Text style={{color: "#f90", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"999999.0元"}</Text>*/}
                                    {/*<Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"余额"}</Text>*/}
                                {/*</View>*/}
                            {/*</TouchableWithoutFeedback>*/}
                            {/*<TouchableWithoutFeedback>*/}
                                {/*<View style={[styles.numItem,{borderLeftWidth: 1, borderLeftColor: "#f5f5f5",borderRightWidth: 1, borderRightColor: "#f5f5f5"}]}>*/}
                                    {/*<Text style={{color: "#ff5f3e", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"1940个"}</Text>*/}
                                    {/*<Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"优惠"}</Text>*/}
                                {/*</View>*/}
                            {/*</TouchableWithoutFeedback>*/}
                            {/*<TouchableWithoutFeedback>*/}
                                {/*<View style={styles.numItem}>*/}
                                    {/*<Text style={{color: "#6ac20b", fontSize: 18, textAlign: "center", fontWeight: "bold"}}>{"999999分"}</Text>*/}
                                    {/*<Text style={{color: "#333", fontSize: 12, textAlign: "center", paddingTop: 5}}>{"积分"}</Text>*/}
                                {/*</View>*/}
                            {/*</TouchableWithoutFeedback>*/}
                        </View>
                        <View>
                            {this._renderListItem()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    scrollView: {
        marginBottom: px2dp(0),
        backgroundColor: "#fff"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff"
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 20
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    }
});

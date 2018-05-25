import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ImageBackground,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Item from '../components/Item'
import StarScore from '../components/StarScore'
import Communications from '../util/AKCommunications';

class RightHeader extends Component {
    constructor(props) {
        super(props)
    }
    onLogoutBtnPress = () => {
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
        // headerRight: <RightHeader navigation={navigation} />,
    });

    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false
        };
        this.config = (global.userData.usertype === '1') ?
            [
                {logo:require('../images/icon_yuyue.png'), name:"我的预约", onPress:this.goPage.bind(this, "我的预约")},
                {logo:require('../images/icon_colle.png'), name:"我的收藏", onPress:this.goPage.bind(this, "MyFavors")},
                {logo:require('../images/icon_share.png'), name:"分享到好友", subName:"", onPress:this.goPage.bind(this, "分享到好友")},
                {logo:require('../images/icon_share.png'), name:"一键客服", subName:"", onPress:this.goPage.bind(this, "Call")},
                {logo:require('../images/icon_s.png'), name:"更多设置", subName:"", onPress:this.goPage.bind(this, "MoreSettings")},
            ]
                :
            [
                {logo:require('../images/icon_back.png'), name:"我的发布", onPress:this.goPage.bind(this, "我的发布")},
                {logo:require('../images/icon_chuand.png'), name:"我的船队", onPress:this.goPage.bind(this, "MyShip")},
                {logo:require('../images/icon_colle.png'), name:"我的收藏", onPress:this.goPage.bind(this, "MyFavors")},
                {logo:require('../images/icon_share.png'), name:"分享到好友", subName:"", onPress:this.goPage.bind(this, "分享到好友")},
                {logo:require('../images/icon_share.png'), name:"一键客服", subName:"", onPress:this.goPage.bind(this, "Call")},
                {logo:require('../images/icon_s.png'), name:"更多设置", subName:"", onPress:this.goPage.bind(this, "MoreSettings")},
            ];
    }
    goPage(key, data = {}){
        const { navigate } = this.props.navigation;
        if (key === 'Call') {
            Communications.phonecall(appData.appCustomerServicePhone, true);
        }
        else if (key === 'MyShip') {
            navigate(key, { title: '我的船队', callBack: null});
        }
        else if (key === 'MoreSettings') {
            navigate(key);
        }
        else if (key === 'MyFavors') {
            navigate(key);
        }
        else {
            navigate('DetailVC', { title: key, des:'我是返回点击我' });
        }
    }
    leftPress(){

    }
    rightPress(){

    }
    goProfile(){

    }

    onAuthTextPress = () =>  {
        if (global.userData.authstate === '1') {
            //审核通过
        }
        else {
            //未审核/审核不通过
            this.props.navigation.navigate('AddAuth');
        }
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

    _renderHeader() {
        let authed = (global.userData.authstate === '1');
        return <View style={{minHeight: screenHeight - 64 - 46, paddingBottom: 100, backgroundColor: "#fff"}}>
            <TouchableWithoutFeedback onPress={this.goProfile.bind(this)}>
                <View style={styles.userHead}>
                    <View style={{flex: 1,flexDirection: "row"}}>
                        <ImageBackground source={require('../images/icon_back.png')} style={styles.imageBack}>
                            <Text style={{color: "#fff", fontSize: 20, textAlign:'center', alignItems: "center"}}>{global.userData.username.length ? global.userData.username.substr(0, 1) : ''}</Text>
                        </ImageBackground>
                        <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{color: "#000", fontSize: 18}}>{global.userData.username}</Text>
                                <Image source={authed ? require('../images/vip_selected.png') : require('../images/vip.png')} style={{marginLeft: 5, width: 13, height: 13,  resizeMode:'contain'}} />
                                <Text style={{color: (authed ? appData.appLightBlueColor : appData.appSecondaryTextColor), marginLeft: 5, fontSize: 12}}>{authed ? "已认证" : "未认证"}</Text>
                            </View>
                            <View style={{marginTop: 10, flexDirection: "row", alignItems: "center"}}>
                                <ImageBackground source={require('../images/icon_back.png')} style={{width: 19, height: 19, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{ color: "#fff", fontSize: 10, textAlign:'center'}}>{'账'}</Text>
                                </ImageBackground>
                                <Image source={require('../images/icon_account.png')} style={{marginLeft: 5, width: 22, height: 16,  resizeMode:'contain'}} />
                                <Text style={{color: "#000", fontSize: 13, paddingLeft: 5}}>{global.userData.mobile}</Text>
                            </View>
                            <View style={{marginTop: 10, flexDirection: "row"}}>
                                <Image source={require('../images/icon_xinyong.png')} style={{width: 35, height: 18}} />
                                <StarScore style={{marginLeft: 5}} itemEdge={ 5} currentScore={userData.credit}/>
                            </View>
                        </View>
                    </View>
                    <Icon name="ios-arrow-forward-outline" size={ 22} color="#fff" />
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.authShow}>
                <Text style={{color: appData.appSecondaryTextColor, fontSize: 12, marginLeft: 40}}>{"资质认证"}</Text>
                <Text style={{color: appData.appBlueColor, fontSize: 12, marginLeft: 10}} onPress={this.onAuthTextPress}>{(authed ? "已认证" : "去认证")}</Text>
            </View>
            <View>
                {this._renderListItem()}
            </View>
        </View>
    }

    _renderListItem() {
        return this.config.map((item, i) => {
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
                    {this._renderHeader()}
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
        marginBottom: 0,
        backgroundColor: "#fff"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff'
    },
    authShow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#f3f3f3',
        height: 30
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    },
    imageBack: {
        width: 65,
        height: 65,
        borderRadius: 0.5 * 65,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: '#f3f',
    }
});

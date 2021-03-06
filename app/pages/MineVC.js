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
import Toast from "react-native-easy-toast";
import IndicatorModal from '../components/IndicatorModal';
import SharePlatform from "../share/SharePlatform";
import ShareUtil from "../share/ShareUtil";

export default class MineVC extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: '我的',
        tabBarLabel: '我的',
        headerLeft: <Text style={{marginLeft: 10}}>友船友货</Text>,
    });

    constructor(props){
        super(props);
        this.state = {
            refreshing: false
        };
        this.config = (global.userData.usertype === '1') ?
            [
                {logo:require('../images/icon_yuyue.png'), name:"我的预约", onCellSelected:this.goPage.bind(this, "MyBook")},
                {logo:require('../images/icon_colle.png'), name:"我的收藏", onCellSelected:this.goPage.bind(this, "MyFavors")},
                {logo:require('../images/icon_share.png'), name:"分享到好友", subName:"", onCellSelected:this.goPage.bind(this, "Share")},
                {logo:require('../images/icon_share.png'), name:"一键客服", subName:"", onCellSelected:this.goPage.bind(this, "Call")},
                {logo:require('../images/icon_s.png'), name:"更多设置", subName:"", onCellSelected:this.goPage.bind(this, "MoreSettings")},
            ]
                :
            [
                {logo:require('../images/icon_post.png'), name:"我的发布", onCellSelected:this.goPage.bind(this, "MyPost")},
                {logo:require('../images/icon_chuand.png'), name:"我的船队", onCellSelected:this.goPage.bind(this, "MyShip")},
                {logo:require('../images/icon_colle.png'), name:"我的收藏", onCellSelected:this.goPage.bind(this, "MyFavors")},
                {logo:require('../images/icon_share.png'), name:"分享到好友", subName:"", onCellSelected:this.goPage.bind(this, "Share")},
                {logo:require('../images/icon_share.png'), name:"一键客服", subName:"", onCellSelected:this.goPage.bind(this, "Call")},
                {logo:require('../images/icon_s.png'), name:"更多设置", subName:"", onCellSelected:this.goPage.bind(this, "MoreSettings")},
            ];
    }

    componentDidMount() {
        global.appMineVC = this;
        this._onRefresh();
    }

    goPage(key, data = {}){
        const { navigate } = appMainTab.props.navigation;
        if (key === 'Call') {
            Communications.phonecall(appData.appCustomerServicePhone, true);
        }
        else if (key === 'MyShip') {
            if (objectNotNull(userData) && userData.authstate) {
                let state = parseInt(userData.authstate);
                switch (state) {
                    case AuthStateEnum.Authing:
                        PublicAlert('您的资质认证正在审核，请耐心等待','',
                            [{text:"确定"}]
                        );
                        break;

                    case AuthStateEnum.Authed:
                        navigate(key, { title: '我的船队', callBack: null});
                        break;

                    default:
                        PublicAlert('未认证，请前去认证！','',
                            [{text:"取消"},
                                {text:"去认证", onPress:backAndGoToAuth}]
                        );
                        break;
                }
            }
        }
        else if (key === 'MoreSettings') {
            navigate(key);
        }
        else if (key === 'MyFavors' || key === 'MyBook' || key === 'MyPost') {
            navigate(key, {});
        }
        else if (key === 'Share') {
            //分享
            ShareUtil.shareboard('友船友货',
                appShareImage,
                appShareUrl,
                '找船寻货，就上友船友货！',
                [SharePlatform.WECHAT, SharePlatform.WECHATMOMENT, SharePlatform.QQ],
                (code, message) =>{
                    // this.refToast.show(code + '  ' + message);
                });
        }
        else {

        }
    }

    goProfile() {

    }

    onAuthTextPress = () =>  {
        if (isAuthed()) {
            //审核通过

        }
        else {
            //未审核/审核不通过
            this.requestRecommend(true);
        }
    };

    goToAddAuth() {
        if (objectNotNull(userData) && userData.authstate) {
            let state = parseInt(userData.authstate);
            switch (state) {
                case AuthStateEnum.Authing:
                    this.refToast.show("您的资质认证正在审核，请耐心等待");
                    break;

                case AuthStateEnum.Authed:
                    this.refToast.show("已审核通过");
                    break;

                default:
                    appMainTab.props.navigation.navigate('AddAuth',
                        {
                            callBack:this.callBackFromAddAuthVC.bind(this)
                        });
                    break;
            }
        }
    }

    callBackFromAddAuthVC(authstate) {
        userData.authstate = authstate;
        saveUserData(userData);

        this.forceUpdate();
        this.refToast.show("认证中，请耐心等待");
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.requestRecommend(false);
    }

    requestRecommend = async (isGoToAddAuth) => {
        let data = {suid: userData.uid};

        this.refIndicator.show();
        NetUtil.post(appUrl + 'index.php/Mobile/User/get_user_info/', data)
            .then(
                (result)=>{
                    this.refIndicator.hide();
                    if (result.code === 0) {
                        saveUserData(result.data);
                        this.setState({
                            refreshing: false,
                        });
                        if (isGoToAddAuth) {
                            this.goToAddAuth();
                        }
                    }
                    else {
                        this.setState({
                            refreshing: false,
                        })
                    }
                },(error)=>{
                    this.refIndicator.hide();
                    this.setState({
                        refreshing: false,
                    })
                });
    };

    _renderHeader() {
        let authed = isAuthed();
        return <View style={{minHeight: screenHeight - 64 - 46, paddingBottom: 100, backgroundColor: "#fff"}}>
            <TouchableWithoutFeedback onPress={this.goProfile.bind(this)}>
                <View style={styles.userHead}>
                    <View style={{flex: 1,flexDirection: "row"}}>
                        <ImageBackground source={require('../images/icon_back.png')} style={styles.imageBack}>
                            <Text style={{color: "#fff", fontSize: 20, textAlign:'center', alignItems: "center"}}>{global.userData.username.length ? global.userData.username.substr(0, 1) : ''}</Text>
                        </ImageBackground>
                        <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{color: appData.appTextColor, fontSize: 18}}>{global.userData.username}</Text>
                                <Image source={authed ? require('../images/vip_selected.png') : require('../images/vip.png')} style={{marginLeft: 5, width: 13, height: 13,  resizeMode:'contain'}} />
                                <Text style={{color: (authed ? appData.appLightBlueColor : appData.appSecondaryTextColor), marginLeft: 5, fontSize: 12}}>{getAuthStateText(userData.authstate)}</Text>
                            </View>
                            <View style={{marginTop: 10, flexDirection: "row", alignItems: "center"}}>
                                <ImageBackground source={require('../images/icon_back.png')} style={{width: 19, height: 19, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{ color: "#fff", fontSize: 10, textAlign:'center'}}>{'账'}</Text>
                                </ImageBackground>
                                <Image source={require('../images/icon_account.png')} style={{marginLeft: 5, width: 22, height: 16,  resizeMode:'contain'}} />
                                <Text style={{color: appData.appTextColor, fontSize: 13, paddingLeft: 5}}>{global.userData.mobile}</Text>
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
            <View style={styles.authBack}>
                <TouchableWithoutFeedback onPress={this.onAuthTextPress.bind(this)}>
                    <View style={styles.authShow}>
                        <Text style={{color: appData.appSecondaryTextColor, fontSize: 12}}>{"资质认证"}</Text>
                        <Text style={{color: appData.appBlueColor, fontSize: 12, marginLeft: 10}} >{getAuthStateText(userData.authstate)}</Text>
                    </View>
                </TouchableWithoutFeedback>
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
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {this._renderHeader()}
                </ScrollView>
                <Toast ref={o => this.refToast = o} position={'center'}/>
                <IndicatorModal ref={o => this.refIndicator = o}/>
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
    authBack: {
        backgroundColor: '#f3f3f3',
        width: screenWidth,
        height: 30,
        flexDirection: "row",
    },
    authShow: {
        flexDirection: "row",
        alignItems: "center",
        height: 30,
        marginLeft: 20,
        paddingHorizontal: 20,
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

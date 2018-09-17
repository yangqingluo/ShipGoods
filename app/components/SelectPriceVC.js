import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    Image,
    Button,
    TextInput,
    ScrollView,
    View,
    TouchableOpacity
} from "react-native";
import Toast from "react-native-easy-toast";

export default class SelectPriceVC extends Component {
    static navigationOptions = ({ navigation }) => (
        {
            headerTitle: navigation.state.params.title,
        });
    constructor(props) {
        super(props);
        this.state = {
            onlyPrice: this.props.navigation.state.params.onlyPrice || false,
            price: this.props.navigation.state.params.price || '',
            is_bargain: this.props.navigation.state.params.is_bargain || 0,
            is_shipprice: this.props.navigation.state.params.is_shipprice || 0,
        }
    }

    textInputChanged(text) {
        this.setState({
            price: text,
        });
    }

    onBargainBtnAction() {
        this.setState({
            is_bargain: (this.state.is_bargain === 0) ? 1 : 0,
        });
    }

    onPriceBtnAction(is_shipprice) {
        this.setState({
            is_shipprice: is_shipprice,
        });
    }

    onSubmitBtnAction() {
        let isShipPrice = offerIsShipPrice(this.state.is_shipprice);
        if (isShipPrice) {
            this.props.navigation.state.params.callBack(0, 0, this.state.is_shipprice);
            this.props.navigation.goBack();
        }
        else {
            if (this.state.price > 0) {
                this.props.navigation.state.params.callBack(this.state.price, this.state.is_bargain, this.state.is_shipprice);
                this.props.navigation.goBack();
            }
            else {
                this.refToast.show("请输入价格");
            }
        }
    }

    render() {
        const Icon = appFont["Ionicons"];
        let isBargain = offerIsBargain(this.state.is_bargain);
        let isShipPrice = offerIsShipPrice(this.state.is_shipprice);
        let bargainTextColor = isBargain ? appData.appThirdTextColor : appData.appBlueColor;
        let shipPriceTextColor = isShipPrice ? appData.appBlueColor : appData.appThirdTextColor;
        let notShipPriceTextColor = isShipPrice ? appData.appThirdTextColor : appData.appBlueColor;

        return (
            <View style={appStyles.container}>
                <ScrollView
                    style={styles.scrollView}
                >
                    <View style={{height:2}} />
                    {this.state.onlyPrice ?
                        <View style={[styles.priceCell, {marginTop: 40}]}>
                            <Text style={styles.priceText}/>
                            <TextInput underlineColorAndroid="transparent"
                                       keyboardType={"numeric"}
                                       style={styles.textInput}
                                       placeholder={'价格键入'}
                                       placeholderTextColor={appData.appSecondaryTextColor}
                                       onChangeText={this.textInputChanged.bind(this)}
                                       value={this.state.price}
                            >
                            </TextInput>
                            <Text style={styles.priceText}>{'¥元/吨'}</Text>
                        </View>

                        :
                        (<View>
                            {isShipPrice ? <View>
                                    <View style={styles.cell}>
                                        <Text style={styles.text}>{"船东开价"}</Text>
                                    </View>
                                    <View style={{
                                        height: 43,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: appData.appGrayColor
                                    }}>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={styles.priceCell}>
                                        <Text style={styles.priceText}/>
                                        <TextInput underlineColorAndroid="transparent"
                                                   keyboardType={"numeric"}
                                                   style={styles.textInput}
                                                   placeholder={'价格键入'}
                                                   placeholderTextColor={appData.appSecondaryTextColor}
                                                   onChangeText={this.textInputChanged.bind(this)}
                                                   value={this.state.price}
                                        >
                                        </TextInput>
                                        <Text style={styles.priceText}>{'¥元/吨(不含港建)'}</Text>
                                    </View>
                                    <TouchableOpacity onPress={this.onBargainBtnAction.bind(this)}>
                                        <View style={{
                                            height: 43,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: appData.appGrayColor
                                        }}>
                                            <Icon name={'ios-checkmark-circle'} size={20}
                                                  style={{minWidth: 120, marginRight: 5, textAlign: "center", fontSize: 14}}
                                                  color={bargainTextColor}>
                                                {' 不议价'}
                                            </Icon>
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                            <View style={{width: 240, height:80, marginTop:60, alignSelf: "center", flexDirection: 'row',}}>
                                <TouchableOpacity onPress={this.onPriceBtnAction.bind(this, 0)} style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                                    <Icon name={'ios-checkmark-circle'} size={32} style={{minWidth:32}} color={notShipPriceTextColor}/>
                                    <Text style={{color:notShipPriceTextColor, fontSize:16, textAlign: 'right',}}>{'我开价'}</Text>
                                </TouchableOpacity>
                                <View style={{top:26, width: 86, height:6, borderRadius:3, backgroundColor:'#ebebeb'}} />
                                <TouchableOpacity onPress={this.onPriceBtnAction.bind(this, 1)} style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                                    <Icon name={'ios-checkmark-circle'} size={32} style={{minWidth:32}} color={shipPriceTextColor}/>
                                    <Text style={{color:shipPriceTextColor, fontSize:16, textAlign: 'right',}}>{'船东开价'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>)
                    }
                </ScrollView>
                <View style={{position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <TouchableOpacity onPress={this.onSubmitBtnAction.bind(this)}>
                        <View style={appStyles.sureBtnContainer}>
                            <Text style={{color: "#fff"}}>{"提交"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Toast ref={o => this.refToast = o} position={'center'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        minHeight: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    priceCell : {
        flex: 1,
        minHeight: 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    priceText : {
        flex: 1,
        minWidth: 80,
        color:appData.appYellowColor,
        fontSize:16,
    },
    textInput: {
        flex: 1,
        marginHorizontal: 5,
        minWidth: 60,
        fontSize: 16,
        color: appData.appTextColor,
        textAlign: "center",
    },
    text: {
        fontSize: 16,
        color: appData.appTextColor,
        textAlign: "center",
    },
});
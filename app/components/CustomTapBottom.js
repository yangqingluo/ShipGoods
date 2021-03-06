import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    View, Platform
}
    from
        'react-native';
import PropTypes from 'prop-types';
import {BoxShadow, BorderShadow} from 'react-native-shadow';

export default class TabBottom extends Component {

    static propType = {
        goToPage    : PropTypes.func,
        activeTab   : PropTypes.number,
        tabs        : PropTypes.array,

        tabNames    : PropTypes.array,
        tabIconNames: PropTypes.array,
        selectedTabIconNames: PropTypes.array
    };

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({value}) {
        console.log(value);
    }


    onPressTabItemForIndex(i) {
        appMainTab.onPressTabItemForIndex(i);
    }

    renderTabItemForIndex(tab, i) {
        let radius = 25;
        let color = this.props.activeTab === i ? '#2D9BFD' : '#6A6A6A';
        let icon = this.props.tabIconNames[i];
        return (
            <View style={styles.tabItem} key={i}>
                {i === 2 ? <TouchableOpacity style={{
                        position: 'absolute',
                        bottom: 18,
                    }} onPress={this.onPressTabItemForIndex.bind(this, i)}>
                    <Image style={{width: 60,
                        height: 60,}} source={icon}/>
                </TouchableOpacity>: null}
                <TouchableOpacity activeOpacity={0.8}
                style={styles.tab}
                onPress={this.onPressTabItemForIndex.bind(this, i)}>
                    {i === 2 ? <View style={{
                            width:radius,
                            height:radius}}/>
                        :
                        <Image style={{
                            tintColor: color,
                            width:radius,
                            height:radius}}
                               source={icon}/>}
                    <Text style={{color: color, fontSize:appFontFit(10), fontWeight: appData.fontWeightMedium, marginTop: 5}}>
                        {this.props.tabNames[i]}
                    </Text>
                    {(i === 3 && appMsgCount > 0) ?
                        <View style={styles.redPoint} /> : null}
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const shadowOpt = {
            width: screenWidth,
            height: 0,
            color:"#000",
            border: 3,
            // radius: 10,
            opacity: 0.05,
            x: 0,
            y: 0,
            side: "top",
            style:{position: 'absolute',}
        };
        return (
            <View style={{height: appData.tabBarHeight}}>
                {isIOS() ?
                    <View style={styles.tabShadow}/>
                    :
                    <BorderShadow setting={shadowOpt}>
                        <View style={styles.tabShadow}/>
                    </BorderShadow>
                }
                <View style={styles.tabs}>
                    {this.props.tabs.map((tab, i) => {
                        return this.renderTabItemForIndex(tab, i);
                    })}
                </View>
            </View>
        );
    }
}

let redRadius = 4;
const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        flex: 1,
    },
    tabShadow: {
        width: screenWidth,
        height: appData.tabBarHeight + iPhoneBottom,
        position: 'absolute',
        borderTopWidth: 0.5,
        borderTopColor: "#00000006",
        backgroundColor: "#fff",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -1,
        },
        // shadowRadius: 10,
        shadowOpacity: 0.1,
        // elevation: 4,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: screenWidth / 5.0,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    redPoint: {
        width: 2 * redRadius,
        height: 2 * redRadius,
        borderRadius: redRadius,
        backgroundColor: "#f00",
        position: 'absolute',
        top: 3,
        right: 20,
    },
});
import React, {Component} from 'react';
import {
    Platform,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View
}
from
'react-native';
import PropTypes from 'prop-types';

export default class TabTop extends Component {

    static Props = {
        goToPage    : PropTypes.func,
        activeTab   : PropTypes.number,
        tabs        : PropTypes.array,

        tabNames    : PropTypes.array,
        tabIconNames: PropTypes.array,
        selectedTabIconNames: PropTypes.array,
        tabItemFlex: Number,
    };

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({value}) {
        console.log(value);
    }

    render() {
        return (
            <View style={styles.tabs}>
                {this.props.tabs.map((tab, i) => {
                    let color = this.props.activeTab === i ? '#2D9BFD' : '#6A6A6A';
                    let _tabName = this.props.activeTab === i ? <View style={styles._under} /> : null;
                    //let icon = this.props.activeTab == i ? this.props.selectedTabIconNames[i] : this.props.tabIconNames[i];
                    return (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.8}
                            style={{flex: this.props.tabItemFlex, justifyContent: 'center', alignItems: 'center',}}
                            onPress={()=>this.props.goToPage(i)}>
                            <View style={styles.tabItem}>
                                {/* <Image
                                    style={styles.icon}
                                    source={icon}/> */}
                                <Text style={{color: color, fontSize: 16, fontWeight: '700' }}>
                                    {this.props.tabNames[i]}
                                </Text>
                                {_tabName}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
    },
    tab: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // marginLeft: 20,
    },
    tabItem: {
        minWidth: 80,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _under: {
        width: 27,
        height: 4,
        borderRadius: 2,
        backgroundColor: appData.appBlueColor,
        bottom: 0,
        position: 'absolute',
    },
});
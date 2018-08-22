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

    renderTabItemForIndex(tab, i) {
        let radius = 25;
        let color = this.props.activeTab === i ? '#2D9BFD' : '#6A6A6A';
        let icon = this.props.tabIconNames[i];
        return (
            <View style={styles.tabItem} key={i}>
                {i === 2 ? <TouchableOpacity style={{
                        position: 'absolute',
                        bottom: 18,
                    }} onPress={()=>this.props.goToPage(i)}>
                    <Image style={{width: 60,
                        height: 60,}} source={icon}/>
                </TouchableOpacity>: null}
                <TouchableOpacity activeOpacity={0.8}
                style={styles.tab}
                onPress={()=>this.props.goToPage(i)}>
                    {i === 2 ? <View style={{
                            width:radius,
                            height:radius}}/>
                        :
                        <Image style={{
                            tintColor: color,
                            width:radius,
                            height:radius}}
                               source={icon}/>}
                    <Text style={{color: color, fontSize: 10, marginTop: 5}}>
                        {this.props.tabNames[i]}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{height: 50}}>
                <View style={styles.tabShadow}/>
                <View style={styles.tabs}>
                    {this.props.tabs.map((tab, i) => {
                        return this.renderTabItemForIndex(tab, i);
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        flex: 1,
    },
    tabShadow: {
        height: 1,
        backgroundColor: "#00000010",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -1,
        },
        // shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: -4,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
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

export default class HomeTabTop extends Component {

    static Props = {
        goToPage    : PropTypes.func,
        activeTab   : PropTypes.number,
        tabs        : PropTypes.array,

        tabNames    : PropTypes.array,
        tabIconNames: PropTypes.array,
        selectedTabIconNames: PropTypes.array,
        tabItemFlex: Number,

        sortNames        : PropTypes.array,
        isSort: PropTypes.boolean,
    };

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({value}) {
        console.log(value);
    }

    render() {
        let arrowSize = 16;
        return (
            <View >
                <View style={styles.tabs}>
                    {this.props.tabs.map((tab, i) => {
                        let color = this.props.activeTab === i ? '#2D9BFD' : '#6A6A6A';
                        let _tabName = this.props.activeTab === i ? <View style={styles._under} /> : null;
                        return (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={0.8}
                                style={{flex: this.props.tabItemFlex, justifyContent: 'center', alignItems: 'center',}}
                                onPress={()=>this.props.goToPage(i)}>
                                <View style={styles.tabItem}>
                                    <Text style={{color: color, fontSize: 16, fontWeight: '700' }}>
                                        {this.props.tabNames[i]}
                                    </Text>
                                    {_tabName}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {this.props.isSort ?
                    <View style={styles.tabs}>
                        {this.props.sortNames.map((sort, i) => {
                            let color = '#5d5d5d';
                            return (
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.8}
                                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}
                                    onPress={()=> {}}>
                                    <View style={styles.sortItem}>
                                        <Text style={{color: color, fontSize: 14}}>
                                            {this.props.sortNames[i]}
                                        </Text>
                                    </View>
                                    <View style={{backgroundColor: "red", height: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 6}}>
                                        <appFont.Ionicons style={{backgroundColor: "green", width: arrowSize, height: 0.8 * arrowSize}} name="md-arrow-dropup" size={arrowSize}
                                                          color= {"#dddcdc"}
                                                          onPress={() =>{

                                                          }}/>
                                        <appFont.Ionicons style={{backgroundColor: "blue", width: arrowSize, height: 0.8 * arrowSize}} name="md-arrow-dropdown" size={arrowSize}
                                                          color= {"#dddcdc"}
                                                          onPress={() =>{

                                                          }}/>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
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
    sortItem: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sort: {
        height: 45,
        backgroundColor: appData.appRedColor,
    },
});
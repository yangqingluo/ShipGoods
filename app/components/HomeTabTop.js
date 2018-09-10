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
import SortButton from "./SortButton";

export default class HomeTabTop extends Component {

    static Props = {
        goToPage    : PropTypes.func,
        activeTab   : PropTypes.number,
        tabs        : PropTypes.array,

        tabNames    : PropTypes.array,
        tabIconNames: PropTypes.array,
        selectedTabIconNames: PropTypes.array,
        tabItemFlex: Number,

        sorts        : PropTypes.array,
        isSort: PropTypes.boolean,
    };

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({value}) {
        console.log(value);
    }

    render() {
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
                    <View style={styles.sorts}>
                        {this.props.sorts.map((sort, i) => {
                            return (
                                <SortButton
                                    key={i}
                                    sort={sort}
                                    index={i}
                                    >
                                </SortButton>
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
    sorts: {
        marginTop: 2,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#00000006",
    },
});
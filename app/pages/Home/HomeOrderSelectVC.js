import React, { Component } from 'react';


import HomeOrder from './HomeOrderVC'


export default class HomeOrderSelectVC extends HomeOrder {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.headerTitle || '选择货品',
    });

    onCellSelected = (info: Object) => {

    };
}
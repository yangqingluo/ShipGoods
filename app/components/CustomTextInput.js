import React, { Component } from 'react';

import {
    TextInput,
} from 'react-native'

export default class CustomTextInput extends TextInput {
    constructor(props){
        super(props)
    }
}

CustomTextInput.defaultProps = {
    placeholderTextColor:appData.appLightGrayColor,
    textColor:appData.appTextColor,
};

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    TouchableOpacity } from 'react-native';

let WEBVIEW_REF = 'webview';

export default class PublicWebVC extends Component {
    static navigationOptions = ({ navigation }) => ({
            title: navigation.state.params.title
        });

    state = {
        status: 'No Page Loaded',
        backButtonEnabled: false,
        forwardButtonEnabled: false,
        loading: true,
        scalesPageToFit: true,
    };

    goBack = () => {
        this.refs[WEBVIEW_REF].goBack();
    };

    goForward = () => {
        this.refs[WEBVIEW_REF].goForward();
    };

    reload = () => {
        this.refs[WEBVIEW_REF].reload();
    };

    onShouldStartLoadWithRequest = (event) => {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    };

    onNavigationStateChange = (navState) => {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });
    };

    render() {
        let {uri} = this.props.navigation.state.params;
        let {scalesPageToFit} = this.state;
        return (
            <View style={appStyles.container}>
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={{flex: 1}}
                    source={{uri:uri, method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={scalesPageToFit}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({

});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Alert} from "react-native";
import {checkFirstTime} from "./src/utils/Functions";
import {AppSwitchNavigator} from "./src/navigation/Switch";
import SplashScreen from "react-native-splash-screen";

export default class App extends Component {

    state = {
        check: null
    };

    componentWillMount(){
        checkFirstTime()
            .then(response => this.setState({ check: response }))
            .catch(error => Alert.alert("Device Error", "Oops! Something broke."));
    }


    render() {
        const { check } = this.state;
        const AppComponent = AppSwitchNavigator(check);
        if(check !== null){
            return(
                <AppComponent />
            );
        }else{
            return null;
        }
    }
}

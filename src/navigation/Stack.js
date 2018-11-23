import {createStackNavigator} from "react-navigation";
import Articles from "../screens/Articles";
import Events from "../screens/Events";
import React from 'react';
import {
    View,
    Image
} from 'react-native';
import SingleArticle from "../screens/SingleArticle";


export const ArticleStackNavigator = createStackNavigator({
    Home: {
        screen: Articles,
        navigationOptions: ({navigation}) => ({
            headerTintColor: 'black',
            headerStyle: {
                backgroundColor: '#C92627'
            },
            headerLeft: (
                <View style={{padding: 10}}>
                    <Image source={{uri: "https://guindytimes.com/static/mainsite/images/favicon.png"}} style={{height:35, width:35, marginLeft:5}}/>
                </View>
            ),

        }),
    },
    SingleArticle:{
        screen: SingleArticle
    }
},{
    initialRouteName: "Home",
    headerMode: 'screen'
});

export const EventStackNavigator = createStackNavigator({
    Home: {
        screen: Events,
        navigationOptions: ({navigation}) => ({
            headerTintColor: 'black',
            headerStyle: {
                backgroundColor: '#C92627'
            },
            headerLeft: (
                <View style={{padding: 10}}>
                    <Image source={{uri: "https://guindytimes.com/static/mainsite/images/favicon.png"}} style={{height:35, width:35, marginLeft:5}}/>
                </View>
            ),

        }),
    }},
   {
    initialRouteName: "Home",
    headerMode: 'screen'
});

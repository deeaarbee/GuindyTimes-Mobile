import {createBottomTabNavigator, createStackNavigator} from "react-navigation";
import Articles from "../screens/Articles"
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from "react";
import {ArticleStackNavigator, EventStackNavigator} from "./Stack";
import Events from "../screens/Events";
import News from "../screens/News";
import {View, Image} from "react-native";





export const AppTabNavigator = createBottomTabNavigator({
        Articles: {
            screen: ArticleStackNavigator,
            navigationOptions: {
                tabBarLabel: 'Articles',
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="md-paper" size={35} color={tintColor}/>
                )
            }
        },
        Events: {
            screen: EventStackNavigator,
            navigationOptions: {
                tabBarLabel: 'Events',
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name="md-calendar" size={35} color={tintColor} />
                ),

            }
        },
        Announcements: {
            screen: News,
            navigationOptions: {
                tabBarLabel: 'News',
                tabBarIcon: ({tintColor}) => (
                    <Ionicons name="md-megaphone" size={35} color={tintColor}/>
                )
            }
        }
    },
    {   initialRouteName:"Events",
        swipeEnabled: true,
        animationEnabled: true,
        tabBarPosition: "bottom",
        tabBarOptions: {
            activeTintColor: '#C92627',
            inactiveTintColor: 'black',
            showLabel: false,
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: 'white',
            },
        },
    }
);


// const AppContainer = createAppContainer(AppTabNavigator);
// export default AppContainer;

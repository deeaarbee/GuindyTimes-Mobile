import {createSwitchNavigator} from "react-navigation";
import {AppTabNavigator} from "./Tab";
import IntroScreen from "../components/AppIntro"

export const AppSwitchNavigator = (check = false) => createSwitchNavigator({
        FirstTime: {
            screen: IntroScreen
        },
        Normal: {
            screen: AppTabNavigator
        }
    },
    {
        initialRouteName: check ? 'FirstTime' : 'Normal'
    });

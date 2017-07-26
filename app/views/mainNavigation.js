import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  Text,
  Dimensions
} from 'react-native';

/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation'
import SailingTrips from 'friedensflotte/app/views/sailingTrips'
import NewSailingTrip from 'friedensflotte/app/views/newSailingTrip'
import DetailView from 'friedensflotte/app/views/detailView';
import Profile from 'friedensflotte/app/views/profile';
import Config from 'friedensflotte/app/config/config';
import NewBooking from 'friedensflotte/app/views/newBooking';
import EditBooking from 'friedensflotte/app/views/editBooking';
import SailingNavigation from 'friedensflotte/app/views/sailingNavigation';
/* ------------ External Components --------- */
import FacebookTabBar from 'friedensflotte/app/components/tabbar/fbtabbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import { NavigationComponent } from 'react-native-material-bottom-navigation'

var width = Dimensions.get('window').width;

let tabbarbottom = TabBarBottom;
if (Platform.OS === 'android') {
  tabbarbottom=NavigationComponent
}

const MainNavigator = TabNavigator({
    SailingNavigation: { screen: SailingNavigation },
    NewSailingTrip: { screen: NewSailingTrip },
    Profile: { screen: Profile },
  },
  { mode: 'card',
    initialRouteName: 'SailingNavigation',
    tabBarPosition: 'bottom',
    navigationOptions:{ header:{visible:false}},
    swipeEnabled: false,
    tabBarComponent: tabbarbottom,
    animationEnabled: true,
    tabBarOptions: {
       bottomNavigationOptions: {
         activeLabelColor: Config.colors.thirdColorText,
         //showIcon: false,
         //showLabel: false,
         backgroundColor: Config.colors.secondaryColor,
         icon:{
           color: Config.colors.primaryColorText,
           height: 40,
           width: 100,
         },
         showLabel: false,
         style:{
           width: width,
         },
         tabs: {
           SailingNavigation: {
             labelColor: Config.colors.secondaryColor,
             activeLabelColor: Config.colors.secondaryColor,
             showLabel: false,
           },
           NewSailingTrip: {
             labelColor: Config.colors.secondaryColor,
             activeLabelColor: Config.colors.secondaryColor,
             // https://github.com/react-community/react-navigation/issues/859
           },
           Profile: {
             labelColor: Config.colors.secondaryColor,
             activeLabelColor: Config.colors.secondaryColor,
           },
        }
       },
     activeTintColor: Config.colors.buttonColorDark,
     inactiveTintColor: Config.colors.primaryColorText,
     showIcon: true,
     showLabel: false,
     iconStyle:{
       tintColor: Config.colors.primaryColorText,
     },
     labelStyle:{
       display: 'none',
     },
     style:{
       backgroundColor: Config.colors.secondaryColor,
     }
   }
  },
);

export default class MainNavigation extends Component {
    render() {
        return (
          <View style={styles.containerMain}>
            <MainNavigator testID="MainNavi"/>
          </View>
        );
    }
}

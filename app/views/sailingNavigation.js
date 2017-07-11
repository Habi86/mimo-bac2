import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Firebase from 'friedensflotte/app/components/firebase';
import Config from 'friedensflotte/app/config/config';
import DetailView from 'friedensflotte/app/views/detailView';
import EditTrip from 'friedensflotte/app/views/editTrip';
import BookingImageDetailView from 'friedensflotte/app/views/bookingImageDetailView';
import NewBooking from 'friedensflotte/app/views/newBooking';
import EditBooking from 'friedensflotte/app/views/editBooking';
import SailingTrips from 'friedensflotte/app/views/sailingTrips';
import Icon from 'react-native-vector-icons/FontAwesome';
//import EditBooking from 'friedensflotte/app/views/editBooking';

/* ------------ External Components --------- */
import { StackNavigator } from 'react-navigation';

const SailingNavigation = StackNavigator({
    SailingTrips: { screen: SailingTrips },
    DetailView: { screen: DetailView },
    EditTrip: { screen: EditTrip },
    NewBooking: {
      screen: NewBooking,
      navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      }),
     },
    EditBooking: { screen: EditBooking },
    BookingImageDetailView: { screen: BookingImageDetailView },
  },
  {
    mode: 'card',
    headerMode: 'none',
    initialRouteName: 'SailingTrips'
  }
);

export default SailingNavigation;

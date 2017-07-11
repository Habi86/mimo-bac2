import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  StatusBar
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Login from 'friedensflotte/app/views/login';
import Registration from 'friedensflotte/app/views/registration';
import MainNavigation from 'friedensflotte/app/views/mainNavigation'
import Firebase from 'friedensflotte/app/components/firebase';
import Config from 'friedensflotte/app/config/config';
//import DetailView from 'friedensflotte/app/views/detailview';

/* ------------ External Components --------- */
import { StackNavigator } from 'react-navigation';

export default class Index extends Component {

  constructor(){
    super();
    this.state = {
      unsubscribe: null,
    }
  }

  //check if user is logged when app starts
  componentDidMount() {
    const { navigate, goBack } = this.props.navigation;
    this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigate('MainNavigation');
      }
      else {
        navigate('Login');
      }
    });
  }

  componentWillUnmount() {
    if (this.state.unsubscribe) {
      this.unsubscribe();
    }
  }

  render () {
    return (
      null
    );
  }
}
const LoginNavigator = StackNavigator({
    IndexScreen: { screen: Index },
    MainNavigation: { screen: MainNavigation },
    Login: { screen: Login },
    Registration: { screen: Registration },
  },
  { mode: 'card',
    headerMode: 'none',
    navigationOptions:{ header:{visible:false}}
  });

AppRegistry.registerComponent("friedensflotte", () => LoginNavigator);

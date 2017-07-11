'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import Config from 'friedensflotte/app/config/config';
import CircleSnail from 'react-native-progress/CircleSnail';


export default class LoadingSpinner extends Component {

  render() {
    return (
      <View style={styles.container}>
				<CircleSnail
          indeterminate={true}
					size={40}
					thickness={1.5}
					color={Config.colors.primaryColor}/>
          {/*<Text style={styles.subSpinnerText}>Loading</Text>*/}
				</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  subSpinnerText: {
    color: 'red',
    margin: 10,
  }
});
